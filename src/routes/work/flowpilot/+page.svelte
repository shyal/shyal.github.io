<script>
	import BlurFade from '$lib/components/portfolio/BlurFade.svelte';
	import Dock from '$lib/components/portfolio/Dock.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { site } from '$lib/site.js';
	import { navbar, social } from '$lib/cv.js';

	const title = 'FlowPilot Studio';
	const description =
		'A SaaS for VFX and animation studios, co-founded and co-built with Kevin Sallée.';

	// The demo is embedded from the FlowPilot Studio YouTube channel, never
	// copied here.
	const videoId = 'llOhpZAvuEc';

	const tags = ['SvelteKit', 'Supabase', 'FastAPI', 'Rust', 'Redis Streams', 'AWS', 'Claude API'];

	const contributions = [
		'SOC2 Type 2 and MPAA compliance: the policies, the controls and the evidence.',
		'Security: tenant isolation through row-level security and a red-team test of it, encryption keys in AWS KMS, secrets in Secrets Manager, named IAM in place of the root account, centralised logging with a tamper-evident archive, and automated vulnerability scanning in CI.',
		'Infrastructure: the AWS service that receives FPT webhooks and runs studio automations (EC2, NGINX, FastAPI), with CloudTrail and logs shipped to Grafana Loki and archived to S3 under Object Lock.',
		'Automation workers: architected and co-designed the Rust worker that runs every studio\'s automations in one process on a single t3.medium, with a Redis stream per org so each studio\'s events stay in order. The Python/Celery runner it replaced needed about 300 MB per customer org; the Rust worker serves all of them in 30 to 50 MB.',
		'CI: self-hosted GitHub Actions runners, a Supabase instance per run, Playwright end-to-end tests, and coverage and type-coverage thresholds.',
		'Live exports.',
		'Assistant UIs.',
		'CRM.'
	];
</script>

<svelte:head>
	<title>{title} — {site.name}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{site.url}/work/flowpilot" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{title} — {site.name}" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{site.url}/work/flowpilot" />
	<meta name="twitter:card" content="summary" />
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
				<p class="text-sm text-muted-foreground">Co-founder, Senior Developer · 2025 - 2026</p>
				<h1 class="text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h1>
			</BlurFade>
			<BlurFade delay={0.08}>
				<p class="max-w-[600px] text-muted-foreground md:text-xl">
					A SaaS for VFX and animation studios, co-founded and co-built with Kevin Sallée. It
					connects to a studio's Flow Production Tracking (ShotGrid) database, builds charts and
					tables from plain-English requests, and runs automations triggered by FPT webhooks.
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
				<div class="aspect-video w-full overflow-hidden rounded-lg border bg-black">
					<iframe
						class="h-full w-full"
						src="https://www.youtube-nocookie.com/embed/{videoId}"
						title="FlowPilot Beta Demo"
						loading="lazy"
						allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				</div>
				<figcaption class="mt-3 text-sm text-muted-foreground">
					The beta demo, from the
					<a href="https://www.youtube.com/watch?v={videoId}" target="_blank" rel="noopener noreferrer" class="underline decoration-border underline-offset-4 hover:decoration-foreground">FlowPilot Studio channel on YouTube</a>.
				</figcaption>
			</figure>
		</BlurFade>

		<section class="space-y-3">
			<BlurFade delay={0.04}><h2 class="text-xl font-bold">My part</h2></BlurFade>
			<BlurFade delay={0.08}>
				<ul class="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
					{#each contributions as item}
						<li>{item}</li>
					{/each}
				</ul>
			</BlurFade>
		</section>
	</main>

	<Dock items={navbar} {social} />
</div>
