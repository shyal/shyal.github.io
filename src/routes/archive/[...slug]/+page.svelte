<script>
	import { onMount } from 'svelte';
	import { Separator } from "$lib/components/ui/separator/index.js";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	let { data } = $props();

	onMount(() => {
		// Initialize Mermaid if any diagrams exist
		const mermaidDivs = document.querySelectorAll('.mermaid');
		if (mermaidDivs.length > 0) {
			import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs').then((mod) => {
				const isDark = document.documentElement.classList.contains('dark');
				mod.default.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default' });
				mod.default.run({ nodes: mermaidDivs });
			});
		}

		// Initialize MathJax if any math exists
		const mathScripts = document.querySelectorAll('script[type="math/tex"]');
		if (mathScripts.length > 0 && !window.MathJax) {
			window.MathJax = {
				tex: { inlineMath: [['$', '$']] },
				startup: { typeset: true }
			};
			const s = document.createElement('script');
			s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
			s.async = true;
			document.head.appendChild(s);
		} else if (window.MathJax?.typeset) {
			window.MathJax.typeset();
		}

		// Convert img[src*=".mp4"] to video elements
		document.querySelectorAll('.content-body img[src*=".mp4"]').forEach((img) => {
			const video = document.createElement('video');
			video.src = img.src;
			video.width = 640;
			video.height = 480;
			video.controls = true;
			video.autoplay = true;
			video.loop = true;
			video.playsInline = true;
			video.muted = true;
			video.className = 'mx-auto my-4 max-w-full rounded';
			img.replaceWith(video);
		});
	});
</script>

<svelte:head>
	<title>{data.title} — Archive — Shyal Beardsley</title>
</svelte:head>

<article class="mx-auto max-w-2xl px-6 py-12">
	<nav class="mb-8 flex items-center justify-between">
		<div class="flex items-center gap-3 text-sm text-muted-foreground">
			<a href="/archive" class="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
				Archive
			</a>
			<span class="text-border">/</span>
			<a href="/" class="transition-colors hover:text-foreground">Home</a>
		</div>
		<ThemeToggle />
	</nav>

	<header class="mb-6">
		<p class="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
			Archived
		</p>
		<h1 class="text-2xl font-semibold tracking-tight">{data.title}</h1>
	</header>

	<div
		class="mb-8 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
	>
		An old note — I haven't updated it since I wrote it.
	</div>

	<div class="content-body">
		{@html data.content}
	</div>

	<Separator class="my-10" />

	<footer class="flex items-center justify-between text-sm text-muted-foreground">
		<a href="/archive" class="transition-colors hover:text-foreground">← Back to archive</a>
		<span>&copy; {new Date().getFullYear()} Shyal Beardsley</span>
	</footer>
</article>
