<script>
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data } = $props();

	let query = $state('');

	const filtered = $derived(
		query.trim()
			? data.entries.filter((e) => e.title.toLowerCase().includes(query.trim().toLowerCase()))
			: data.entries
	);

	const posts = $derived(filtered.filter((e) => e.section === 'blog'));
	const notes = $derived(filtered.filter((e) => e.section === 'notes'));
</script>

<svelte:head>
	<title>Archive — Shyal Beardsley</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-16">
	<header class="mb-10">
		<div class="mb-8 flex items-center justify-between">
			<a
				href="/"
				class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
				Back
			</a>
			<ThemeToggle />
		</div>

		<h1 class="text-3xl font-semibold tracking-tight">Archive</h1>
		<p class="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
			Notes and write-ups from 2019–2022, mostly from when I was teaching myself
			competitive programming.
		</p>
	</header>

	<div class="relative mb-8">
		<svg
			class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
			xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
		<input
			type="search"
			bind:value={query}
			placeholder="Filter {data.entries.length} entries…"
			aria-label="Filter archive entries"
			class="w-full rounded-lg border border-border bg-card py-2 pr-3 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
		/>
	</div>

	{#if filtered.length === 0}
		<p class="py-12 text-center text-sm text-muted-foreground">
			Nothing matches “{query}”.
		</p>
	{/if}

	{#if posts.length}
		<section class="mb-10">
			<h2 class="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
				Blog posts
			</h2>
			<ul class="grid gap-px">
				{#each posts as entry (entry.slug)}
					<li>
						<a
							href="/archive/{entry.slug}"
							rel="nofollow"
							class="group flex items-center gap-3 rounded-md px-3 py-2 text-[15px] transition-colors hover:bg-accent"
						>
							<span>{entry.title}</span>
							<svg class="ml-auto shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if notes.length}
		<section>
			<h2 class="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
				Notes <span class="ml-1 normal-case opacity-60">({notes.length})</span>
			</h2>
			<ul class="grid gap-px">
				{#each notes as entry (entry.slug)}
					<li>
						<a
							href="/archive/{entry.slug}"
							rel="nofollow"
							class="group flex items-center gap-3 rounded-md px-3 py-2 text-[15px] transition-colors hover:bg-accent"
						>
							<span>{entry.title}</span>
							<svg class="ml-auto shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
