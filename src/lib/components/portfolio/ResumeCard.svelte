<script>
	import { slide } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	let {
		company,
		title = '',
		href = '',
		start,
		end = '',
		description = '',
		initials = '',
		logo = '',
		// 'cover' for square app-icon style logos, 'contain' for marks on a transparent background
		fit = 'contain'
	} = $props();

	let expanded = $state(false);

	const external = $derived(href.startsWith('http'));

	function onclick(e) {
		if (description) {
			e.preventDefault();
			expanded = !expanded;
		}
	}
</script>

<a
	href={href || '#'}
	{onclick}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="block"
>
	<div class="flex py-1">
		<div class="flex-none">
			{#if logo}
				<span class="m-auto flex size-12 items-center justify-center overflow-hidden rounded-full border bg-white">
					<img
						src={logo}
						alt=""
						width="48"
						height="48"
						loading="lazy"
						class={fit === 'cover' ? 'size-full object-cover' : 'size-8 object-contain'}
					/>
				</span>
			{:else}
				<span
					class="m-auto flex size-12 items-center justify-center rounded-full border bg-muted text-sm font-semibold text-muted-foreground"
				>
					{initials || company[0]}
				</span>
			{/if}
		</div>
		<div class="group ml-4 flex-grow flex-col items-center">
			<div class="flex flex-col">
				<div class="flex items-center justify-between gap-x-2 text-base">
					<h3 class="inline-flex items-center justify-center text-xs leading-none font-semibold sm:text-sm">
						{company}
						<svg
							class="size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 {expanded ? 'rotate-90' : 'rotate-0'}"
							xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
					</h3>
					<div class="text-right text-xs text-muted-foreground tabular-nums sm:text-sm">
						{#if end === start}{start}{:else}{start} - {end || 'Present'}{/if}
					</div>
				</div>
				{#if title}
					<div class="font-sans text-xs">{title}</div>
				{/if}
			</div>
			{#if description && expanded}
				<div class="mt-2 text-xs sm:text-sm" transition:slide={{ duration: 500, easing: quartOut }}>
					{description}
				</div>
			{/if}
		</div>
	</div>
</a>
