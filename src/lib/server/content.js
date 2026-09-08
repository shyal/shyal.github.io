import { readFileSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = 'src/content';

let cachedMetadata;

export function getMetadata() {
	if (!cachedMetadata) {
		cachedMetadata = JSON.parse(readFileSync(join(CONTENT_DIR, 'metadata.json'), 'utf-8'));
	}
	return cachedMetadata;
}

/**
 * The archived notes cross-link each other using the root-absolute paths they
 * had on the old site (`/two-sum`, `/blog/links`). Now that the content is
 * served under /archive, rewrite those to point inside the archive so the
 * links still resolve. Anything that isn't a known slug is left untouched.
 */
export function rewriteInternalLinks(html) {
	const metadata = getMetadata();

	return html.replace(/href="\/([^"#?]*)([^"]*)"/g, (match, path, suffix) => {
		const slug = decodeURIComponent(path).replace(/\/$/, '');
		if (Object.prototype.hasOwnProperty.call(metadata, slug)) {
			return `href="/archive/${path.replace(/\/$/, '')}${suffix}"`;
		}
		return match;
	});
}

export function getPage(slug) {
	const metadata = getMetadata();
	if (!Object.prototype.hasOwnProperty.call(metadata, slug)) return null;

	const content = readFileSync(join(CONTENT_DIR, `${slug}.html`), 'utf-8');
	return {
		title: metadata[slug].title || slug,
		slug,
		content: rewriteInternalLinks(content)
	};
}
