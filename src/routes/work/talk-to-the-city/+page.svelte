<script>
	import BlurFade from '$lib/components/portfolio/BlurFade.svelte';
	import Dock from '$lib/components/portfolio/Dock.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { site } from '$lib/site.js';
	import { video, navbar, social } from '$lib/cv.js';

	const title = 'Talk to the City';
	const description =
		'An LLM interface for collective decision-making, built at the AI Objectives Institute.';

	const tags = ['Svelte', 'Firebase', 'Python', 'UMAP', 'HDBSCAN', 'BERTopic'];

	const highlights = [
		'Redesigned the React prototype as a Svelte and Firebase app, with LLMs processing topics and subtopics in real time.',
		'Built a dependency graph of 50 processing nodes, so each dataset gets its own pipeline topology.',
		'Took over the Python backend for argument and topic extraction: UMAP, HDBSCAN and BERTopic.',
		'Wrote 200+ automated tests for the app and its pipelines.',
		'Built synthetic datasets as reference pipelines, then refined them against real data.'
	];

	const sources = [
		{ label: 'Source on GitHub', href: 'https://github.com/AIObjectives/talk-to-the-city-reports' },
		{ label: 'AI Objectives Institute', href: 'https://ai.objectives.institute/talk-to-the-city' }
	];
</script>

<svelte:head>
	<title>{title} — {site.name}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{site.url}/work/talk-to-the-city" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{title} — {site.name}" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{site.url}/work/talk-to-the-city" />
	<meta property="og:image" content="{site.url}{video.poster}" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="relative mx-auto min-h-screen max-w-2xl px-6 py-12 sm:py-24">
	<main class="flex flex-col space-y-10 pb-24">
		<BlurFade delay={0.04}>
			<a href="/" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
				Back
			</a>
		</BlurFade>

		<header class="space-y-3">
			<BlurFade delay={0.04}>
				<p class="text-sm text-muted-foreground">AI Objectives Institute · 2023 - 2024</p>
				<h1 class="text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h1>
			</BlurFade>
			<BlurFade delay={0.08}>
				<p class="max-w-[600px] text-muted-foreground md:text-xl">
					I built Talk to the City, an LLM interface for collective decision-making, and onboarded
					Taiwan's Ministry of Digital Affairs.
				</p>
			</BlurFade>
			<BlurFade delay={0.1}>
				<div class="flex flex-wrap gap-1">
					{#each tags as tag}
						<Badge class="rounded-[4px] px-1 py-0 text-[10px]" variant="secondary">{tag}</Badge>
					{/each}
				</div>
			</BlurFade>
		</header>

		<BlurFade delay={0.12}>
			<figure>
				<!-- svelte-ignore a11y_media_has_caption -->
				<video
					class="aspect-[4/3] w-full rounded-lg border bg-black"
					src={video.src}
					poster={video.poster}
					controls
					playsinline
					preload="metadata"
				></video>
				<figcaption class="mt-3 text-sm text-muted-foreground">
					A pipeline in Talk to the City Turbo processing a survey on same-sex marriage, in
					Traditional Chinese. {video.duration}.
				</figcaption>
			</figure>
		</BlurFade>

		<section class="space-y-3">
			<BlurFade delay={0.04}><h2 class="text-xl font-bold">What I did</h2></BlurFade>
			<BlurFade delay={0.08}>
				<ul class="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
					{#each highlights as item}
						<li>{item}</li>
					{/each}
				</ul>
			</BlurFade>
		</section>

		<section class="space-y-3">
			<BlurFade delay={0.04}><h2 class="text-xl font-bold">Links</h2></BlurFade>
			<BlurFade delay={0.08}>
				<div class="flex flex-wrap gap-1">
					{#each sources as link}
						<a href={link.href} target="_blank" rel="noopener noreferrer">
							<Badge class="flex items-center justify-center gap-1 px-2 py-1 text-[10px]">{link.label}</Badge>
						</a>
					{/each}
				</div>
			</BlurFade>
		</section>
	</main>

	<Dock items={navbar} {social} />
</div>
