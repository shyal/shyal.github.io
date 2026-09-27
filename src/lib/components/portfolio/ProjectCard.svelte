<script>
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { title, href = '', description, dates, tags = [], image = '', links = [] } = $props();

	const external = (u) => u.startsWith('http');
</script>

<div
	class="flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-300 ease-out hover:shadow-lg"
>
	{#if image}
		<a
			href={href || '#'}
			class="block cursor-pointer"
			target={href && external(href) ? '_blank' : undefined}
			rel={href && external(href) ? 'noopener noreferrer' : undefined}
		>
			<img class="h-40 w-full overflow-hidden object-cover object-top" src={image} alt={title} loading="lazy" />
		</a>
	{/if}
	<div class="flex flex-col px-2">
		<div class="space-y-1">
			<div class="mt-1 text-base">{title}</div>
			<time class="font-sans text-xs">{dates}</time>
			<p class="font-sans text-xs text-pretty text-muted-foreground">{description}</p>
		</div>
	</div>
	<div class="mt-auto flex flex-col px-2 font-sans text-sm text-pretty text-muted-foreground">
		{#if tags.length > 0}
			<div class="mt-2 flex flex-wrap gap-1">
				{#each tags as tag}
					<Badge class="rounded-[4px] px-1 py-0 text-[10px]" variant="secondary">{tag}</Badge>
				{/each}
			</div>
		{/if}
	</div>
	<div class="flex items-center px-2 pt-2 pb-2">
		{#if links.length > 0}
			<div class="flex flex-row flex-wrap items-start gap-1">
				{#each links as link}
					<a
						href={link.href}
						target={external(link.href) ? '_blank' : undefined}
						rel={external(link.href) ? 'noopener noreferrer' : undefined}
					>
						<Badge class="flex items-center justify-center gap-1 px-2 py-1 text-[10px]">
							{#if link.type === 'Source'}
								<svg class="mb-px size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>
							{:else if link.type === 'Video'}
								<svg class="mb-px size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
							{:else}
								<svg class="mb-px size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
							{/if}
							{link.type}
						</Badge>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
