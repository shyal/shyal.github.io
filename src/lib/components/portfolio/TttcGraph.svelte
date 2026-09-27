<script>
	// The Talk to the City pipeline for the Taiwan same-sex marriage report
	// (tttc-turbo.web.app/report/taiwan-zh): its real 27 nodes and 42 edges,
	// laid out in ranks and revealed in execution order while a camera pans
	// down the graph. Timing lives in the keyframes below; ranks reveal every
	// 6.4% of the cycle starting at 4%.

	const W = 400;
	const H = 396;
	const VIEW = 160;

	const rowY = [10, 38, 66, 96, 138, 176, 214, 250, 272, 294, 316, 352, 374];
	const cols = [52, 126, 200, 274, 348];

	const BIG = { w: 34, h: 26 };
	const SMALL = { w: 30, h: 14 };
	const TINY = { w: 22, h: 12 };

	/** @type {Array<{id:string, rank:number, cx:number, w:number, h:number, prompt?:boolean}>} */
	const nodes = [
		{ id: 'csv_1', rank: 0, cx: 200, ...SMALL },
		{ id: 'open_ai_key', rank: 0, cx: 348, ...SMALL },
		{ id: 'limit_csv_1', rank: 1, cx: 200, ...SMALL },
		...['jsonata_2', 'jsonata_1', 'jsonata_3', 'jsonata_4', 'jsonata'].map((id, i) => ({
			id, rank: 2, cx: cols[i], ...SMALL
		})),
		...['count_tokens_3', 'count_tokens_2', 'count_tokens_4', 'count_tokens_5', 'count_tokens_1'].map(
			(id, i) => ({ id, rank: 3, cx: cols[i] - 19, ...TINY })
		),
		...['cluster_extraction_2', 'cluster_extraction_1', 'cluster_extraction_3', 'cluster_extraction_4', 'cluster_extraction'].map(
			(id, i) => ({ id, rank: 3, cx: cols[i] + 13, ...BIG, prompt: true })
		),
		{ id: 'merge_cluster_extraction_1', rank: 4, cx: 200, ...BIG, prompt: true },
		{ id: 'argument_extraction_2', rank: 5, cx: 200, ...BIG, prompt: true },
		{ id: 'score_argument_relevance_1', rank: 6, cx: 200, ...BIG, prompt: true },
		{ id: 'jq_v1_1', rank: 7, cx: 200, ...SMALL },
		{ id: 'feedback_1', rank: 8, cx: 200, ...SMALL },
		{ id: 'merge', rank: 9, cx: 250, ...SMALL },
		{ id: 'translate_1', rank: 10, cx: 250, ...BIG, prompt: true },
		{ id: 'chat_1', rank: 11, cx: 215, ...SMALL },
		{ id: 'report_v1_1', rank: 12, cx: 285, ...SMALL }
	].map((n) => ({ ...n, x: n.cx - n.w / 2, y: rowY[n.rank] }));

	const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

	const pairs = [
		['csv_1', 'limit_csv_1'],
		['limit_csv_1', 'jsonata'], ['limit_csv_1', 'jsonata_1'], ['limit_csv_1', 'jsonata_2'],
		['limit_csv_1', 'jsonata_3'], ['limit_csv_1', 'jsonata_4'],
		['limit_csv_1', 'argument_extraction_2'], ['limit_csv_1', 'report_v1_1'],
		['jsonata', 'count_tokens_1'], ['jsonata_1', 'count_tokens_2'], ['jsonata_2', 'count_tokens_3'],
		['jsonata_3', 'count_tokens_4'], ['jsonata_4', 'count_tokens_5'],
		['jsonata', 'cluster_extraction'], ['jsonata_1', 'cluster_extraction_1'], ['jsonata_2', 'cluster_extraction_2'],
		['jsonata_3', 'cluster_extraction_3'], ['jsonata_4', 'cluster_extraction_4'],
		['open_ai_key', 'cluster_extraction'], ['open_ai_key', 'cluster_extraction_1'], ['open_ai_key', 'cluster_extraction_2'],
		['open_ai_key', 'cluster_extraction_3'], ['open_ai_key', 'cluster_extraction_4'],
		['cluster_extraction', 'merge_cluster_extraction_1'], ['cluster_extraction_1', 'merge_cluster_extraction_1'],
		['cluster_extraction_2', 'merge_cluster_extraction_1'], ['cluster_extraction_3', 'merge_cluster_extraction_1'],
		['cluster_extraction_4', 'merge_cluster_extraction_1'], ['open_ai_key', 'merge_cluster_extraction_1'],
		['merge_cluster_extraction_1', 'argument_extraction_2'], ['open_ai_key', 'argument_extraction_2'],
		['argument_extraction_2', 'score_argument_relevance_1'], ['open_ai_key', 'score_argument_relevance_1'],
		['score_argument_relevance_1', 'jq_v1_1'],
		['jq_v1_1', 'feedback_1'],
		['feedback_1', 'merge'], ['merge_cluster_extraction_1', 'merge'],
		['merge', 'translate_1'], ['open_ai_key', 'translate_1'],
		['translate_1', 'chat_1'], ['open_ai_key', 'chat_1'],
		['translate_1', 'report_v1_1']
	];

	const edges = pairs.map(([s, t]) => {
		const a = byId[s];
		const b = byId[t];
		const sx = a.cx;
		const sy = a.y + a.h;
		const tx = b.cx;
		const ty = b.y;
		const k = Math.max(10, (ty - sy) / 2);
		return { id: `${s}-${t}`, rank: b.rank, d: `M${sx} ${sy} C${sx} ${sy + k}, ${tx} ${ty - k}, ${tx} ${ty}` };
	});

	// 3 lines of "text" for prompt nodes, 1 for the rest, at varying widths.
	const lines = (n) => (n.prompt ? [0.85, 0.6, 0.72] : [0.55]);
</script>

<svg
	class="graph"
	viewBox="0 0 {W} {VIEW}"
	preserveAspectRatio="xMidYMid slice"
	role="img"
	aria-label="The Talk to the City pipeline: a dependency graph of 27 processing nodes, from CSV input to the finished report"
>
	<defs>
		<linearGradient id="tttc-bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" class="bg1" />
			<stop offset="1" class="bg2" />
		</linearGradient>
	</defs>
	<rect width={W} height={VIEW} fill="url(#tttc-bg)" />
	<g class="cam">
		<g class="edges">
			{#each edges as e (e.id)}
				<path d={e.d} pathLength="1" class="edge" style:animation-name="e{e.rank}" />
			{/each}
		</g>
		<g class="nodes">
			{#each nodes as n (n.id)}
				<g class="node" style:animation-name="n{n.rank}">
					<rect x={n.x} y={n.y} width={n.w} height={n.h} rx="1.6" class="box" />
					<rect x={n.x + 2} y={n.y + 2} width={n.w - 4} height="2.6" rx=".6" class="head" class:prompt={n.prompt} />
					{#each lines(n) as f, i}
						<rect x={n.x + 2.5} y={n.y + 7 + i * 4.2} width={(n.w - 5) * f} height="1.4" rx=".5" class="line" />
					{/each}
				</g>
			{/each}
		</g>
	</g>
</svg>

<style>
	.graph {
		--g-bg1: oklch(0.955 0.012 250);
		--g-bg2: oklch(0.905 0.02 250);
		--g-node: oklch(1 0 0);
		--g-stroke: oklch(0.8 0.01 250);
		--g-edge: oklch(0.7 0.02 250);
		--g-head: oklch(0.86 0.01 250);
		--g-head-prompt: oklch(0.74 0.11 290);
		--g-line: oklch(0.85 0.01 250);
		--g-accent: oklch(0.55 0.17 250);
		display: block;
		width: 100%;
		height: 100%;
	}
	:global(.dark) .graph {
		--g-bg1: oklch(0.24 0.015 260);
		--g-bg2: oklch(0.18 0.015 260);
		--g-node: oklch(0.29 0.01 260);
		--g-stroke: oklch(0.42 0.015 260);
		--g-edge: oklch(0.5 0.02 260);
		--g-head: oklch(0.42 0.015 260);
		--g-head-prompt: oklch(0.6 0.13 290);
		--g-line: oklch(0.45 0.01 260);
		--g-accent: oklch(0.75 0.14 250);
	}

	.bg1 { stop-color: var(--g-bg1); }
	.bg2 { stop-color: var(--g-bg2); }

	.cam {
		animation: cam 22s ease-in-out infinite;
		will-change: transform;
	}

	.edge {
		fill: none;
		stroke: var(--g-edge);
		stroke-width: 0.7;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
		animation: 22s linear infinite;
	}

	.node {
		color: var(--g-stroke);
		transform-box: fill-box;
		transform-origin: center;
		animation: 22s ease-out infinite;
	}
	.box {
		fill: var(--g-node);
		stroke: currentColor;
		stroke-width: 0.8;
	}
	.head { fill: var(--g-head); }
	.head.prompt { fill: var(--g-head-prompt); }
	.line { fill: var(--g-line); }

	@media (prefers-reduced-motion: reduce) {
		.cam, .edge, .node { animation: none; }
		.cam { transform: translateY(-110px); }
	}

	/* Camera: follows the rank being revealed, holds on the report, fades and resets. */
	@keyframes -global-cam {
		0% { opacity: 1; transform: translateY(0); }
		4%, 10.4%, 16.8% { transform: translateY(0); }
		23.2% { transform: translateY(-21px); }
		29.6% { transform: translateY(-63px); }
		36% { transform: translateY(-101px); }
		42.4% { transform: translateY(-139px); }
		48.8% { transform: translateY(-169px); }
		55.2% { transform: translateY(-191px); }
		61.6% { transform: translateY(-213px); }
		68%, 74.4%, 80.8%, 89% { opacity: 1; transform: translateY(-236px); }
		95% { opacity: 0; transform: translateY(-236px); }
		95.1% { opacity: 0; transform: translateY(0); }
		100% { opacity: 1; transform: translateY(0); }
	}

	/* Rank r: edges draw in just before its nodes pop; both flash the accent, then settle. */
	@keyframes -global-n0 { 0%, 4% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 6.2% { opacity: 1; transform: scale(1); color: var(--g-accent); } 11%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e0 { 0%, 1.4% { stroke-dashoffset: 1; stroke: var(--g-accent); } 4% { stroke-dashoffset: 0; stroke: var(--g-accent); } 10%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n1 { 0%, 10.4% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 12.6% { opacity: 1; transform: scale(1); color: var(--g-accent); } 17.4%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e1 { 0%, 7.8% { stroke-dashoffset: 1; stroke: var(--g-accent); } 10.4% { stroke-dashoffset: 0; stroke: var(--g-accent); } 16.4%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n2 { 0%, 16.8% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 19% { opacity: 1; transform: scale(1); color: var(--g-accent); } 23.8%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e2 { 0%, 14.2% { stroke-dashoffset: 1; stroke: var(--g-accent); } 16.8% { stroke-dashoffset: 0; stroke: var(--g-accent); } 22.8%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n3 { 0%, 23.2% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 25.4% { opacity: 1; transform: scale(1); color: var(--g-accent); } 30.2%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e3 { 0%, 20.6% { stroke-dashoffset: 1; stroke: var(--g-accent); } 23.2% { stroke-dashoffset: 0; stroke: var(--g-accent); } 29.2%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n4 { 0%, 29.6% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 31.8% { opacity: 1; transform: scale(1); color: var(--g-accent); } 36.6%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e4 { 0%, 27% { stroke-dashoffset: 1; stroke: var(--g-accent); } 29.6% { stroke-dashoffset: 0; stroke: var(--g-accent); } 35.6%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n5 { 0%, 36% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 38.2% { opacity: 1; transform: scale(1); color: var(--g-accent); } 43%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e5 { 0%, 33.4% { stroke-dashoffset: 1; stroke: var(--g-accent); } 36% { stroke-dashoffset: 0; stroke: var(--g-accent); } 42%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n6 { 0%, 42.4% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 44.6% { opacity: 1; transform: scale(1); color: var(--g-accent); } 49.4%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e6 { 0%, 39.8% { stroke-dashoffset: 1; stroke: var(--g-accent); } 42.4% { stroke-dashoffset: 0; stroke: var(--g-accent); } 48.4%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n7 { 0%, 48.8% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 51% { opacity: 1; transform: scale(1); color: var(--g-accent); } 55.8%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e7 { 0%, 46.2% { stroke-dashoffset: 1; stroke: var(--g-accent); } 48.8% { stroke-dashoffset: 0; stroke: var(--g-accent); } 54.8%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n8 { 0%, 55.2% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 57.4% { opacity: 1; transform: scale(1); color: var(--g-accent); } 62.2%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e8 { 0%, 52.6% { stroke-dashoffset: 1; stroke: var(--g-accent); } 55.2% { stroke-dashoffset: 0; stroke: var(--g-accent); } 61.2%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n9 { 0%, 61.6% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 63.8% { opacity: 1; transform: scale(1); color: var(--g-accent); } 68.6%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e9 { 0%, 59% { stroke-dashoffset: 1; stroke: var(--g-accent); } 61.6% { stroke-dashoffset: 0; stroke: var(--g-accent); } 67.6%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n10 { 0%, 68% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 70.2% { opacity: 1; transform: scale(1); color: var(--g-accent); } 75%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e10 { 0%, 65.4% { stroke-dashoffset: 1; stroke: var(--g-accent); } 68% { stroke-dashoffset: 0; stroke: var(--g-accent); } 74%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n11 { 0%, 74.4% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 76.6% { opacity: 1; transform: scale(1); color: var(--g-accent); } 81.4%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e11 { 0%, 71.8% { stroke-dashoffset: 1; stroke: var(--g-accent); } 74.4% { stroke-dashoffset: 0; stroke: var(--g-accent); } 80.4%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
	@keyframes -global-n12 { 0%, 80.8% { opacity: 0; transform: scale(.7); color: var(--g-accent); } 83% { opacity: 1; transform: scale(1); color: var(--g-accent); } 87.8%, 100% { opacity: 1; transform: scale(1); color: var(--g-stroke); } }
	@keyframes -global-e12 { 0%, 78.2% { stroke-dashoffset: 1; stroke: var(--g-accent); } 80.8% { stroke-dashoffset: 0; stroke: var(--g-accent); } 86.8%, 100% { stroke-dashoffset: 0; stroke: var(--g-edge); } }
</style>
