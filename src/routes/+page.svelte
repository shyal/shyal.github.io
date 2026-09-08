<script>
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { site } from '$lib/site.js';

	const elsewhere = [
		{ label: 'LinkedIn', href: 'https://uk.linkedin.com/in/shyal' },
		{ label: 'GitHub', href: 'https://github.com/shyal' }
	];
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content="{site.name} — {site.tagline}" />
	<link rel="canonical" href={site.url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={site.name} />
	<meta property="og:description" content={site.tagline} />
	<meta property="og:url" content={site.url} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<div class="relative overflow-hidden">
	<!-- Soft backdrop wash behind the hero -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-accent/60 to-transparent"
	></div>

	<main class="relative mx-auto max-w-2xl px-6 py-16 sm:py-24">
		<div class="mb-14 flex justify-end">
			<ThemeToggle />
		</div>

		<header class="mb-16">
			<h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">{site.name}</h1>
		</header>

		<section class="mb-16">
			<h2 class="mb-5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
				Elsewhere
			</h2>
			<ul class="grid gap-1">
				{#each elsewhere as link}
					<li>
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="group -mx-3 flex items-center gap-2 rounded-md px-3 py-2 text-[15px] transition-colors hover:bg-accent"
						>
							{link.label}
							<svg class="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<section class="mb-16">
			<h2 class="mb-5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
				Archive
			</h2>
			<a
				href="/archive"
				rel="nofollow"
				class="group -mx-3 flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
			>
				<div>
					<span class="text-[15px]">Older writing, 2019–2022</span>
					<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
						Notes from teaching myself competitive programming.
					</p>
				</div>
				<svg class="mt-1.5 ml-auto shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
			</a>
		</section>

		<footer class="border-t border-border pt-6 text-sm text-muted-foreground">
			&copy; {new Date().getFullYear()} Shyal Beardsley
		</footer>
	</main>
</div>
