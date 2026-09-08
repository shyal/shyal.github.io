import { error } from '@sveltejs/kit';
import { getMetadata, getPage } from '$lib/server/content.js';

export function load({ params }) {
	const page = getPage(params.slug);
	if (!page) error(404, 'Page not found');
	return page;
}

export function entries() {
	return Object.keys(getMetadata()).map((slug) => ({ slug }));
}
