#!/usr/bin/env node
// Migration script: extract content from static HTML pages into src/content/

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const STATIC_DIR = 'static';
const CONTENT_DIR = 'src/content';

// Recursively find all index.html files in static/
function findPages(dir, base = '') {
	const pages = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			// Skip non-content directories
			if (base === '' && ['assets', '.nojekyll'].includes(entry)) continue;
			const sub = base ? `${base}/${entry}` : entry;
			const indexPath = join(full, 'index.html');
			if (existsSync(indexPath)) {
				pages.push({ slug: sub, file: indexPath });
			}
			// Also recurse for nested dirs (blog/*)
			pages.push(...findPages(full, sub));
		}
	}
	return pages;
}

// Extract title and content from an HTML file
function extractContent(html) {
	// Extract title from <h1 class="main-title">
	const titleMatch = html.match(/<h1 class="main-title">(.*?)<\/h1>/);
	const title = titleMatch ? titleMatch[1] : 'Untitled';

	// Find content start: after the home link line
	// Pattern: after `<a href="/">🏠</a>` and before `</main>`
	const navEnd = html.indexOf('🏠</a>');
	if (navEnd === -1) {
		// Try alternate pattern
		const mainStart = html.indexOf('<main>');
		const mainEnd = html.indexOf('</main>');
		if (mainStart === -1 || mainEnd === -1) return { title, content: '' };
		// Skip the title and nav
		const afterMain = html.substring(mainStart + 6, mainEnd);
		return { title, content: afterMain.trim() };
	}

	// Find the end of that line
	let contentStart = navEnd + '🏠</a>'.length;
	// Skip whitespace/newlines
	while (contentStart < html.length && (html[contentStart] === '\n' || html[contentStart] === '\r')) {
		contentStart++;
	}

	const mainEnd = html.indexOf('</main>');
	if (mainEnd === -1) return { title, content: '' };

	let content = html.substring(contentStart, mainEnd).trim();

	// Remove the trailing mermaid init script if present (we'll handle it globally)
	content = content.replace(/<script>mermaid\.initialize\(\{startOnLoad:true\}\);<\/script>\s*$/, '').trim();

	return { title, content };
}

// Deduplicate: some pages appear as both top-level and nested finds
const seen = new Set();
const pages = findPages(STATIC_DIR).filter(p => {
	if (seen.has(p.slug)) return false;
	seen.add(p.slug);
	return true;
});

console.log(`Found ${pages.length} pages to migrate`);

const metadata = {};

for (const { slug, file } of pages) {
	const html = readFileSync(file, 'utf-8');
	const { title, content } = extractContent(html);

	if (!content) {
		console.warn(`  WARN: No content extracted for ${slug}`);
		continue;
	}

	// Write content HTML
	const outDir = join(CONTENT_DIR, dirname(slug));
	mkdirSync(outDir, { recursive: true });
	const outFile = join(CONTENT_DIR, `${slug}.html`);
	writeFileSync(outFile, content);

	metadata[slug] = { title };
	console.log(`  OK: ${slug} (${title})`);
}

// Write metadata
writeFileSync(join(CONTENT_DIR, 'metadata.json'), JSON.stringify(metadata, null, 2));
console.log(`\nWrote metadata for ${Object.keys(metadata).length} pages`);
