<script>
	// Fades and un-blurs its content once it scrolls into view. The template
	// used svelte-motion for this; a CSS transition and an IntersectionObserver
	// do the same job without the dependency.
	import { onMount } from 'svelte';

	let { delay = 0, class: className = '', children } = $props();

	let el;
	let visible = $state(false);

	onMount(() => {
		if (!('IntersectionObserver' in window)) {
			visible = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					visible = true;
					io.disconnect();
				}
			},
			{ rootMargin: '-20px' }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<div
	bind:this={el}
	class="blur-fade {className}"
	class:is-visible={visible}
	style:transition-delay="{delay}s"
>
	{@render children?.()}
</div>
