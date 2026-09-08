import { getMetadata } from '$lib/server/content.js';

export function load() {
	const entries = Object.entries(getMetadata())
		.map(([slug, meta]) => ({
			slug,
			title: meta.title || slug,
			section: slug.startsWith('blog/') ? 'blog' : 'notes'
		}))
		.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));

	return { entries };
}
