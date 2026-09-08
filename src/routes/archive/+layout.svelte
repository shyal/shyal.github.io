<script>
	let { children } = $props();
</script>

<!--
	Every page under /archive is excluded from search engines here.

	This uses a robots *meta tag* rather than a robots.txt Disallow on purpose:
	a Disallow rule blocks crawling, which would stop crawlers from ever reading
	this noindex — leaving already-indexed URLs in the index as bare links.
	Allowing the crawl and serving noindex is what actually removes them.
-->
<svelte:head>
	<meta name="robots" content="noindex, nofollow, noarchive, noimageindex" />
	<meta name="googlebot" content="noindex, nofollow, noarchive, noimageindex" />
</svelte:head>

{@render children()}
