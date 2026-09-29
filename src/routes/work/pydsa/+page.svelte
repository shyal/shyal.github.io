<script>
	// The pydsa tutorial, as a full-page app. Everything is in MuTutorial;
	// the lessons are in src/lib/tutorial/mu-lessons.js.
	import MuTutorial from '$lib/components/portfolio/MuTutorial.svelte';
	import { site } from '$lib/site.js';

	let { data } = $props();
	const title = 'pydsa';
	const description = 'Learn pydsa, a Python dialect for data structures and algorithms, one snippet at a time. Type the pydsa, run it in the browser, earn XP.';
</script>

<svelte:head>
	<title>{title} — {site.name}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{site.url}/work/pydsa" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{title} — {site.name}" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{site.url}/work/pydsa" />
	<meta property="og:image" content="{site.url}/work/pydsa.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<MuTutorial levels={data.levels} />
