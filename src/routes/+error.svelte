<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Not found' : 'Something went wrong'} — Shyal Beardsley</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
	<p class="font-mono text-sm text-muted-foreground">{page.status}</p>
	<h1 class="mt-3 text-3xl font-semibold tracking-tight">
		{page.status === 404 ? 'This page has moved or gone' : 'Something went wrong'}
	</h1>

	{#if page.status === 404}
		<p class="mt-4 max-w-md leading-relaxed text-muted-foreground">
			Older notes from this site now live in the archive. The rest of it has been retired.
		</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a
				href="/"
				class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
				>Go home</a
			>
			<a
				href="/archive"
				rel="nofollow"
				class="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
				>Browse the archive</a
			>
		</div>
	{:else}
		<p class="mt-4 text-muted-foreground">{page.error?.message ?? ''}</p>
		<div class="mt-8">
			<a
				href="/"
				class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
				>Go home</a
			>
		</div>
	{/if}
</div>
