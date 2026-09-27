<script>
	// FlowPilot Studio in one loop: a plain-English request is typed into the
	// prompt bar, a chart and a table are built from the studio's Flow
	// Production Tracking data, then a webhook fires and an automation updates
	// a shot's status in both. Timing lives in the fp-* keyframes below, all on
	// a 16s cycle.

	const W = 400;
	const H = 160;

	// Chart: seven status bars, as a fraction of the plot height.
	const plot = { x: 62, y: 54, w: 160, h: 84 };
	const bars = [0.55, 0.85, 0.4, 0.7, 0.3, 0.6, 0.45];
	const barW = 13;
	const step = plot.w / bars.length;

	// Table: five rows of shot, task, status, due.
	const table = { x: 240, y: 34, w: 152, h: 118 };
	const rows = [
		{ status: 'ip' }, { status: 'ip' }, { status: 'wtg' }, { status: 'fin' }, { status: 'wtg' }
	];
	const rowY = (i) => 54 + i * 17;
	const nameW = [30, 36, 26, 34, 28];
</script>

<svg
	class="scene"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="xMidYMid slice"
	role="img"
	aria-label="FlowPilot Studio: a plain-English request becomes a chart and a table of shots, then a webhook updates a shot's status"
>
	<defs>
		<linearGradient id="fp-bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" class="bg1" />
			<stop offset="1" class="bg2" />
		</linearGradient>
		<clipPath id="fp-type">
			<rect x="70" y="8" width="0" height="20" class="typeclip" />
		</clipPath>
	</defs>

	<rect width={W} height={H} fill="url(#fp-bg)" />
	<g class="stage">
		<!-- Sidebar -->
		<rect x="0" y="0" width="44" height={H} class="panel" />
		<rect x="10" y="10" width="24" height="6" rx="1.5" class="logo" />
		{#each [28, 42, 56, 70, 84] as y, i}
			<rect x="10" y={y} width={i === 1 ? 26 : 20} height="4" rx="1" class="nav" class:active={i === 1} />
		{/each}

		<!-- Prompt bar -->
		<rect x="52" y="8" width="340" height="18" rx="9" class="card" />
		<path d="M61 13.5 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2z" class="spark" />
		<g clip-path="url(#fp-type)">
			<text x="71" y="20" class="prompt">Shots by status this week, with anything overdue</text>
		</g>
		<rect x="71" y="12" width="0.9" height="10" class="caret" />
		<circle cx="381" cy="17" r="6" class="send" />
		<path d="M378.5 17 h5 m-2 -2.2 l2.2 2.2 -2.2 2.2" class="send-arrow" />

		<!-- Chart card -->
		<g class="card-in c1">
			<rect x="52" y="34" width="180" height="118" rx="4" class="card" />
			<rect x="60" y="42" width="52" height="3" rx="1" class="title" />
			<rect x="60" y="48" width="28" height="2" rx="1" class="sub" />
			<line x1={plot.x} y1={plot.y + plot.h} x2={plot.x + plot.w} y2={plot.y + plot.h} class="axis" />
			{#each bars as f, i}
				<g class="bar b{i}" style:transform-origin="{plot.x + i * step + step / 2}px {plot.y + plot.h}px">
					<rect
						x={plot.x + i * step + (step - barW) / 2}
						y={plot.y + plot.h * (1 - f)}
						width={barW}
						height={plot.h * f}
						rx="1.2"
						class="barfill"
						class:hot={i === 1}
						class:done={i === 3}
					/>
				</g>
				<rect x={plot.x + i * step + step / 2 - 5} y={plot.y + plot.h + 4} width="10" height="2" rx="1" class="tick" />
			{/each}
		</g>

		<!-- Table card -->
		<g class="card-in c2">
			<rect x={table.x} y={table.y} width={table.w} height={table.h} rx="4" class="card" />
			<rect x="248" y="42" width="40" height="3" rx="1" class="title" />
			{#each [246, 284, 322, 356] as x, i}
				<rect x={x} y="49" width={[30, 30, 24, 28][i]} height="1.6" rx=".8" class="head" />
			{/each}
			{#each rows as r, i}
				<g class="row r{i}">
					<rect x="243" y={rowY(i) - 3} width="146" height="14" rx="2" class="rowbg" class:target={i === 1} />
					<rect x="246" y={rowY(i)} width={nameW[i]} height="3" rx="1" class="cell" />
					<rect x="284" y={rowY(i)} width={22 + (i % 3) * 4} height="3" rx="1" class="cell" />
					<rect x="322" y={rowY(i) - 1.5} width="20" height="6" rx="3" class="pill {r.status}" class:target={i === 1} />
					<rect x="356" y={rowY(i)} width={20 + (i % 2) * 6} height="3" rx="1" class="cell" />
				</g>
			{/each}
		</g>

		<!-- Webhook event: badge slides in, a pulse travels to the row, the row flips to done -->
		<g class="hook">
			<rect x="300" y="136" width="86" height="12" rx="6" class="badge" />
			<path d="M308 138.5 l-2.4 4 h2 l-0.8 3.5 2.6 -4.4 h-2z" class="bolt" />
			<text x="313" y="145" class="badge-text">Webhook · shot updated</text>
		</g>
		<circle cx="332" cy="142" r="2.2" class="pulse" />
		<circle cx="332" cy={rowY(1) + 1.5} r="2.2" class="ring" />
	</g>
</svg>

<style>
	.scene {
		--fp-bg1: oklch(0.965 0.01 250);
		--fp-bg2: oklch(0.915 0.02 250);
		--fp-panel: oklch(0.93 0.015 250);
		--fp-card: oklch(1 0 0);
		--fp-border: oklch(0.86 0.01 250);
		--fp-ink: oklch(0.35 0.02 250);
		--fp-muted: oklch(0.82 0.01 250);
		--fp-faint: oklch(0.9 0.01 250);
		--fp-accent: oklch(0.55 0.17 250);
		--fp-accent-soft: oklch(0.72 0.12 250);
		--fp-amber: oklch(0.8 0.14 80);
		--fp-green: oklch(0.7 0.16 150);
		--fp-grey: oklch(0.8 0.01 250);
		--fp-flash: oklch(0.94 0.05 150);
		display: block;
		width: 100%;
		height: 100%;
		font-family: inherit;
	}
	:global(.dark) .scene {
		--fp-bg1: oklch(0.23 0.015 260);
		--fp-bg2: oklch(0.17 0.015 260);
		--fp-panel: oklch(0.2 0.015 260);
		--fp-card: oklch(0.27 0.012 260);
		--fp-border: oklch(0.36 0.015 260);
		--fp-ink: oklch(0.88 0.01 260);
		--fp-muted: oklch(0.45 0.012 260);
		--fp-faint: oklch(0.36 0.012 260);
		--fp-accent: oklch(0.75 0.14 250);
		--fp-accent-soft: oklch(0.6 0.12 250);
		--fp-amber: oklch(0.78 0.14 80);
		--fp-green: oklch(0.72 0.15 150);
		--fp-grey: oklch(0.5 0.01 260);
		--fp-flash: oklch(0.34 0.05 150);
	}

	.bg1 { stop-color: var(--fp-bg1); }
	.bg2 { stop-color: var(--fp-bg2); }

	.stage { animation: fp-stage 16s ease-in-out infinite; }

	.panel { fill: var(--fp-panel); }
	.logo { fill: var(--fp-accent); }
	.nav { fill: var(--fp-muted); }
	.nav.active { fill: var(--fp-ink); }
	.card { fill: var(--fp-card); stroke: var(--fp-border); stroke-width: 0.6; }
	.title { fill: var(--fp-ink); opacity: 0.8; }
	.sub, .head, .tick { fill: var(--fp-muted); }
	.cell { fill: var(--fp-faint); }
	.axis { stroke: var(--fp-border); stroke-width: 0.6; }
	.spark { fill: var(--fp-accent); }
	.prompt { fill: var(--fp-ink); font-size: 7px; letter-spacing: 0.1px; }
	.typeclip { animation: fp-type 16s steps(46, end) infinite; }
	.caret { fill: var(--fp-accent); animation: fp-caret 16s linear infinite; }
	.send { fill: var(--fp-accent); animation: fp-send 16s ease-out infinite; transform-box: fill-box; transform-origin: center; }
	.send-arrow { fill: none; stroke: white; stroke-width: 0.9; stroke-linecap: round; stroke-linejoin: round; }

	.card-in { animation: 16s ease-out infinite; }
	.c1 { animation-name: fp-c1; }
	.c2 { animation-name: fp-c2; }

	.bar { animation: 16s cubic-bezier(.2,.8,.2,1) infinite; }
	.barfill { fill: var(--fp-accent-soft); }
	.barfill.hot { fill: var(--fp-accent); animation: fp-hot 16s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom; }
	.barfill.done { animation: fp-done 16s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom; }
	.b0 { animation-name: fp-b0; } .b1 { animation-name: fp-b1; } .b2 { animation-name: fp-b2; } .b3 { animation-name: fp-b3; }
	.b4 { animation-name: fp-b4; } .b5 { animation-name: fp-b5; } .b6 { animation-name: fp-b6; }

	.row { animation: 16s ease-out infinite; }
	.r0 { animation-name: fp-r0; } .r1 { animation-name: fp-r1; } .r2 { animation-name: fp-r2; } .r3 { animation-name: fp-r3; } .r4 { animation-name: fp-r4; }
	.rowbg { fill: transparent; }
	.rowbg.target { animation: fp-rowflash 16s ease-in-out infinite; }
	.pill.ip { fill: var(--fp-amber); }
	.pill.wtg { fill: var(--fp-grey); }
	.pill.fin { fill: var(--fp-green); }
	.pill.target { animation: fp-pill 16s ease-in-out infinite; }

	.hook { animation: fp-hook 16s cubic-bezier(.2,.8,.2,1) infinite; }
	.badge { fill: var(--fp-card); stroke: var(--fp-accent); stroke-width: 0.6; }
	.bolt { fill: var(--fp-amber); }
	.badge-text { fill: var(--fp-ink); font-size: 5.5px; }
	.pulse { fill: var(--fp-accent); animation: fp-pulse 16s ease-in-out infinite; }
	.ring { fill: none; stroke: var(--fp-green); stroke-width: 0.8; transform-box: fill-box; transform-origin: center; animation: fp-ring 16s ease-out infinite; }

	@media (prefers-reduced-motion: reduce) {
		.scene * { animation: none !important; }
		.typeclip { width: 300px; }
		.caret, .pulse, .ring { opacity: 0; }
		.pill.target { fill: var(--fp-green); }
	}

	/* Whole scene: fade out and reset at the end of the cycle. */
	@keyframes -global-fp-stage { 0% { opacity: 0; } 2%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }

	/* Prompt types from 4% to 20%; caret blinks while typing, then hides. */
	@keyframes -global-fp-type { 0%, 4% { width: 0; } 20%, 100% { width: 300px; } }
	@keyframes -global-fp-caret {
		0%, 4% { opacity: 1; transform: translateX(0); }
		20% { transform: translateX(190px); }
		4.1%, 6%, 8.1%, 10%, 12.1%, 14%, 16.1%, 18% { opacity: 1; }
		5.9%, 7.9%, 9.9%, 11.9%, 13.9%, 15.9%, 17.9%, 19.9% { opacity: 0; }
		20.1%, 100% { opacity: 0; transform: translateX(190px); }
	}
	@keyframes -global-fp-send { 0%, 20% { transform: scale(1); } 21.5% { transform: scale(1.35); } 23%, 100% { transform: scale(1); } }

	/* Cards land after the request is sent. */
	@keyframes -global-fp-c1 { 0%, 22% { opacity: 0; transform: translateY(6px); } 26%, 100% { opacity: 1; transform: translateY(0); } }
	@keyframes -global-fp-c2 { 0%, 25% { opacity: 0; transform: translateY(6px); } 29%, 100% { opacity: 1; transform: translateY(0); } }

	/* Bars grow one after another. */
	@keyframes -global-fp-b0 { 0%, 26% { transform: scaleY(0); } 32%, 100% { transform: scaleY(1); } }
	@keyframes -global-fp-b1 { 0%, 27.5% { transform: scaleY(0); } 33.5%, 100% { transform: scaleY(1); } }
	@keyframes -global-fp-b2 { 0%, 29% { transform: scaleY(0); } 35%, 100% { transform: scaleY(1); } }
	@keyframes -global-fp-b3 { 0%, 30.5% { transform: scaleY(0); } 36.5%, 100% { transform: scaleY(1); } }
	@keyframes -global-fp-b4 { 0%, 32% { transform: scaleY(0); } 38%, 100% { transform: scaleY(1); } }
	@keyframes -global-fp-b5 { 0%, 33.5% { transform: scaleY(0); } 39.5%, 100% { transform: scaleY(1); } }
	@keyframes -global-fp-b6 { 0%, 35% { transform: scaleY(0); } 41%, 100% { transform: scaleY(1); } }

	/* Rows fade in one after another. */
	@keyframes -global-fp-r0 { 0%, 30% { opacity: 0; transform: translateX(4px); } 34%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-fp-r1 { 0%, 32% { opacity: 0; transform: translateX(4px); } 36%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-fp-r2 { 0%, 34% { opacity: 0; transform: translateX(4px); } 38%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-fp-r3 { 0%, 36% { opacity: 0; transform: translateX(4px); } 40%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-fp-r4 { 0%, 38% { opacity: 0; transform: translateX(4px); } 42%, 100% { opacity: 1; transform: translateX(0); } }

	/* Webhook: badge slides in at 56%, the pulse climbs to the row by 66%, the row flips at 66%. */
	@keyframes -global-fp-hook { 0%, 56% { opacity: 0; transform: translateX(14px); } 60%, 86% { opacity: 1; transform: translateX(0); } 90%, 100% { opacity: 0; transform: translateX(0); } }
	@keyframes -global-fp-pulse { 0%, 60% { opacity: 0; transform: translateY(0); } 61% { opacity: 1; } 66% { opacity: 1; transform: translateY(-69.5px); } 67%, 100% { opacity: 0; transform: translateY(-69.5px); } }
	@keyframes -global-fp-ring { 0%, 66% { opacity: 0; transform: scale(1); } 66.5% { opacity: 1; transform: scale(1); } 72%, 100% { opacity: 0; transform: scale(4); } }
	@keyframes -global-fp-rowflash { 0%, 66% { fill: transparent; } 67% { fill: var(--fp-flash); } 78%, 100% { fill: transparent; } }
	@keyframes -global-fp-pill { 0%, 66% { fill: var(--fp-amber); } 68%, 100% { fill: var(--fp-green); } }
	/* The chart follows the change: in-progress shrinks a step, finished grows one. */
	@keyframes -global-fp-hot { 0%, 66% { transform: scaleY(1); } 70%, 100% { transform: scaleY(0.88); } }
	@keyframes -global-fp-done { 0%, 66% { transform: scaleY(1); } 70%, 100% { transform: scaleY(1.14); } }
</style>
