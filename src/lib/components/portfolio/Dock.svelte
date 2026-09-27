<script>
	// Floating bottom navigation with macOS-style magnification. The template
	// drove this with svelte-motion springs; here each icon's width is derived
	// from the pointer's distance to it and eased with a CSS transition.
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { items = [], social = [] } = $props();

	const BASE = 40;
	const MAGNIFICATION = 60;
	const DISTANCE = 140;

	let mouseX = $state(Infinity);
	let icons = $state([]);

	function widthFor(el) {
		if (!el || mouseX === Infinity) return BASE;
		const r = el.getBoundingClientRect();
		const d = Math.abs(mouseX - (r.left + r.width / 2));
		if (d > DISTANCE) return BASE;
		return BASE + (MAGNIFICATION - BASE) * (1 - d / DISTANCE);
	}

	const all = $derived([...items, null, ...social, null, { theme: true }]);
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-10 z-30 mx-auto mb-4 flex h-full max-h-14 origin-bottom">
	<div
		class="fixed inset-x-0 bottom-0 h-16 w-full bg-background backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)]"
	></div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<nav
		aria-label="Site"
		onmousemove={(e) => (mouseX = e.clientX)}
		onmouseleave={() => (mouseX = Infinity)}
		class="pointer-events-auto relative z-50 mx-auto flex h-full min-h-full transform-gpu items-center gap-0.5 rounded-full bg-background px-1 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] sm:gap-1 md:gap-2 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
	>
		{#each all as item, i}
			{#if item === null}
				<span class="h-full w-px shrink-0 bg-border" aria-hidden="true"></span>
			{:else}
				<div
					bind:this={icons[i]}
					class="flex aspect-square items-center justify-center rounded-full transition-[width] duration-150 ease-out"
					style:width="{widthFor(icons[i])}px"
				>
					{#if item.theme}
						<ThemeToggle class="size-full rounded-full border-0" />
					{:else}
						<a
							href={item.href}
							title={item.label}
							aria-label={item.label}
							target={item.href.startsWith('http') ? '_blank' : undefined}
							rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
							class="inline-flex size-full items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
						>
							{@html item.icon}
						</a>
					{/if}
				</div>
			{/if}
		{/each}
	</nav>
</div>
