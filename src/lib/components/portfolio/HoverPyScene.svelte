<script>
	// HoverPy in one loop: an app calls three microservice endpoints through
	// the HoverPy proxy, which records each response as it passes. The proxy
	// then flips to simulate mode: the real services are wrapped and go quiet,
	// and every further request is answered straight from the recordings.
	// Packets travel on SMIL motion paths; everything else is CSS keyframes.
	// Both run on the same 16s cycle.

	const W = 400;
	const H = 160;

	// The card crops the sides of the 400-wide view, so everything sits within x 48..352.
	const app = { x: 56, y: 64, w: 52, h: 32 };
	const proxy = { x: 164, y: 46, w: 72, h: 68 };
	const services = [
		{ name: 'users', path: 'GET /users', y: 24 },
		{ name: 'payments', path: 'POST /pay', y: 69 },
		{ name: 'inventory', path: 'GET /stock', y: 114 }
	].map((s) => ({ ...s, x: 286, w: 54, h: 22, cy: s.y + 11 }));
	const WIRE_Y = 80;

	const appRight = app.x + app.w;
	const proxyLeft = proxy.x;
	const proxyRight = proxy.x + proxy.w;
	const curve = (x1, y1, x2, y2) => `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;

	const wires = services.map((s) => curve(proxyRight, WIRE_Y, s.x, s.cy));
	const toApp = `M${appRight} ${WIRE_Y} L${proxyLeft} ${WIRE_Y}`;
	const fromApp = `M${proxyLeft} ${WIRE_Y} L${appRight} ${WIRE_Y}`;

	// Each packet moves along `path` between fractions `s` and `e` of the cycle,
	// and is hidden the rest of the time.
	const packets = [];
	const seg = (path, s, e, cls) => packets.push({ path, s: s.toFixed(4), e: e.toFixed(4), cls });

	// Capture: three round trips, one per service, each taking 11% of the cycle.
	services.forEach((s, i) => {
		const b = 0.04 + i * 0.14;
		seg(toApp, b, b + 0.025, 'req');
		seg(wires[i], b + 0.025, b + 0.05, 'req');
		seg(curve(s.x, s.cy, proxyRight, WIRE_Y), b + 0.06, b + 0.085, 'res');
		seg(fromApp, b + 0.085, b + 0.11, 'res');
	});
	// Simulate: four short trips that never leave the proxy.
	[0, 1, 2, 0].forEach((_, j) => {
		const c = 0.53 + j * 0.08;
		seg(toApp, c, c + 0.02, 'req');
		seg(fromApp, c + 0.025, c + 0.045, 'sim');
	});

	const rowY = (i) => 84 + i * 10;
</script>

<svg
	class="scene"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="xMidYMid slice"
	role="img"
	aria-label="HoverPy: an app's requests to three microservices pass through a proxy that records the responses, then the services are wrapped and the proxy answers from its recordings"
>
	<defs>
		<linearGradient id="hp-bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" class="bg1" />
			<stop offset="1" class="bg2" />
		</linearGradient>
	</defs>

	<rect width={W} height={H} fill="url(#hp-bg)" />
	<g class="stage">
		<!-- Wires -->
		<line x1={appRight} y1={WIRE_Y} x2={proxyLeft} y2={WIRE_Y} class="wire" />
		{#each wires as d}<path {d} class="wire svc-wire" />{/each}

		<!-- App -->
		<rect x={app.x} y={app.y} width={app.w} height={app.h} rx="4" class="panel" />
		<text x={app.x + app.w / 2} y={app.y + 15} class="heading" text-anchor="middle">app.py</text>
		<text x={app.x + app.w / 2} y={app.y + 24} class="sub" text-anchor="middle">requests</text>

		<!-- Proxy -->
		<rect x={proxy.x} y={proxy.y} width={proxy.w} height={proxy.h} rx="4" class="panel proxy" />
		<text x={proxy.x + 7} y={proxy.y + 12} class="heading">HoverPy</text>
		<g class="pill capture">
			<rect x={proxy.x + 7} y={proxy.y + 17} width="30" height="9" rx="4.5" class="pill-bg rec" />
			<circle cx={proxy.x + 12.5} cy={proxy.y + 21.5} r="1.6" class="rec-dot" />
			<text x={proxy.x + 16} y={proxy.y + 23.8} class="pill-text">capture</text>
		</g>
		<g class="pill simulate">
			<rect x={proxy.x + 7} y={proxy.y + 17} width="34" height="9" rx="4.5" class="pill-bg sim" />
			<circle cx={proxy.x + 12.5} cy={proxy.y + 21.5} r="1.6" class="sim-dot" />
			<text x={proxy.x + 16} y={proxy.y + 23.8} class="pill-text">simulate</text>
		</g>
		<line x1={proxy.x + 7} y1={proxy.y + 31} x2={proxy.x + proxy.w - 7} y2={proxy.y + 31} class="rule" />
		{#each services as s, i}
			<g class="row r{i}">
				<rect x={proxy.x + 4} y={rowY(i) - 7} width={proxy.w - 8} height="10" rx="2" class="rowbg f{i}" />
				<circle cx={proxy.x + 10} cy={rowY(i) - 2.2} r="1.5" class="row-dot" />
				<text x={proxy.x + 15} y={rowY(i)} class="row-label">{s.path}</text>
				<text x={proxy.x + proxy.w - 7} y={rowY(i)} class="row-code" text-anchor="end">200</text>
			</g>
		{/each}

		<!-- Services, wrapped once simulation starts -->
		<g class="wrap">
			<rect x="280" y="14" width="66" height="132" rx="5" class="wrap-box" />
			<text x="313" y="152" class="wrap-label" text-anchor="middle">wrapped</text>
		</g>
		<g class="services">
			{#each services as s, i}
				<g class="svc">
					<rect x={s.x} y={s.y} width={s.w} height={s.h} rx="3" class="panel svc-box s{i}" />
					<text x={s.x + 6} y={s.y + 9.5} class="svc-name">{s.name}</text>
					<text x={s.x + 6} y={s.y + 17.5} class="sub">{s.path}</text>
				</g>
			{/each}
		</g>

		<!-- Packets -->
		<g class="packets">
			{#each packets as p}
				<circle r="2.4" class="packet {p.cls}" opacity="0">
					<animateMotion
						dur="16s"
						repeatCount="indefinite"
						path={p.path}
						calcMode="linear"
						keyPoints="0;0;1;1"
						keyTimes="0;{p.s};{p.e};1"
					/>
					<animate
						attributeName="opacity"
						dur="16s"
						repeatCount="indefinite"
						calcMode="discrete"
						values="0;1;0;0"
						keyTimes="0;{p.s};{p.e};1"
					/>
				</circle>
			{/each}
		</g>
	</g>
</svg>

<style>
	.scene {
		--hp-bg1: oklch(0.965 0.01 250);
		--hp-bg2: oklch(0.915 0.02 250);
		--hp-panel: oklch(1 0 0);
		--hp-border: oklch(0.86 0.01 250);
		--hp-ink: oklch(0.35 0.02 250);
		--hp-muted: oklch(0.6 0.015 250);
		--hp-wire: oklch(0.78 0.015 250);
		--hp-accent: oklch(0.55 0.17 250);
		--hp-red: oklch(0.62 0.2 25);
		--hp-red-bg: oklch(0.95 0.03 25);
		--hp-green: oklch(0.65 0.16 150);
		--hp-violet: oklch(0.58 0.2 300);
		--hp-violet-bg: oklch(0.95 0.03 300);
		--hp-flash: oklch(0.94 0.05 300);
		--hp-hit: oklch(0.93 0.05 250);
		display: block;
		width: 100%;
		height: 100%;
		font-family: inherit;
	}
	:global(.dark) .scene {
		--hp-bg1: oklch(0.23 0.015 260);
		--hp-bg2: oklch(0.17 0.015 260);
		--hp-panel: oklch(0.27 0.012 260);
		--hp-border: oklch(0.36 0.015 260);
		--hp-ink: oklch(0.88 0.01 260);
		--hp-muted: oklch(0.6 0.012 260);
		--hp-wire: oklch(0.42 0.015 260);
		--hp-accent: oklch(0.75 0.14 250);
		--hp-red: oklch(0.7 0.18 25);
		--hp-red-bg: oklch(0.33 0.05 25);
		--hp-green: oklch(0.72 0.15 150);
		--hp-violet: oklch(0.75 0.15 300);
		--hp-violet-bg: oklch(0.33 0.05 300);
		--hp-flash: oklch(0.36 0.06 300);
		--hp-hit: oklch(0.36 0.05 250);
	}

	.bg1 { stop-color: var(--hp-bg1); }
	.bg2 { stop-color: var(--hp-bg2); }

	.stage { animation: hp-stage 16s ease-in-out infinite; }

	.panel { fill: var(--hp-panel); stroke: var(--hp-border); stroke-width: 0.6; }
	.heading { fill: var(--hp-ink); font-size: 7.5px; font-weight: 600; }
	.sub { fill: var(--hp-muted); font-size: 5px; }
	.rule { stroke: var(--hp-border); stroke-width: 0.5; }
	.wire { fill: none; stroke: var(--hp-wire); stroke-width: 0.8; }
	.svc-wire { animation: hp-dim 16s ease-out infinite; }

	/* Mode pill: capture until 47%, simulate after. */
	.pill-text { fill: var(--hp-ink); font-size: 5px; font-weight: 600; }
	.pill-bg.rec { fill: var(--hp-red-bg); }
	.pill-bg.sim { fill: var(--hp-violet-bg); }
	.rec-dot { fill: var(--hp-red); animation: hp-blink 1.2s ease-in-out infinite; }
	.sim-dot { fill: var(--hp-violet); }
	.pill.capture { animation: hp-capture 16s ease-out infinite; }
	.pill.simulate { animation: hp-simulate 16s ease-out infinite; }

	/* Recorded rows appear as each response comes back, then light up when replayed. */
	.row { animation: 16s ease-out infinite; }
	.r0 { animation-name: hp-r0; } .r1 { animation-name: hp-r1; } .r2 { animation-name: hp-r2; }
	.row-dot { fill: var(--hp-green); }
	.row-label { fill: var(--hp-ink); font-size: 5.5px; }
	.row-code { fill: var(--hp-muted); font-size: 5px; }
	.rowbg { fill: transparent; }
	.rowbg.f0 { animation: hp-flash0 16s ease-out infinite; }
	.rowbg.f1 { animation: hp-flash1 16s ease-out infinite; }
	.rowbg.f2 { animation: hp-flash2 16s ease-out infinite; }

	/* Services light up when hit during capture, then are wrapped and dimmed. */
	.svc-name { fill: var(--hp-ink); font-size: 6.5px; font-weight: 600; }
	.svc-box.s0 { animation: hp-hit0 16s ease-out infinite; }
	.svc-box.s1 { animation: hp-hit1 16s ease-out infinite; }
	.svc-box.s2 { animation: hp-hit2 16s ease-out infinite; }
	.services { animation: hp-dim 16s ease-out infinite; }
	.wrap { animation: hp-wrap 16s ease-out infinite; }
	.wrap-box { fill: none; stroke: var(--hp-violet); stroke-width: 0.8; stroke-dasharray: 3 2; }
	.wrap-label { fill: var(--hp-violet); font-size: 5.5px; font-weight: 600; }

	.packet.req { fill: var(--hp-accent); }
	.packet.res { fill: var(--hp-green); }
	.packet.sim { fill: var(--hp-violet); }

	@media (prefers-reduced-motion: reduce) {
		.scene * { animation: none !important; }
		.packets { display: none; }
		.pill.capture { opacity: 0; }
		.services, .svc-wire { opacity: 0.45; }
	}

	/* Whole scene: fade in, hold, fade out and reset. */
	@keyframes -global-hp-stage { 0% { opacity: 0; } 2%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }

	@keyframes -global-hp-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
	@keyframes -global-hp-capture { 0%, 47% { opacity: 1; } 49%, 100% { opacity: 0; } }
	@keyframes -global-hp-simulate { 0%, 47% { opacity: 0; } 49%, 100% { opacity: 1; } }

	/* Responses come back through the proxy at 12.5%, 26.5% and 40.5%. */
	@keyframes -global-hp-r0 { 0%, 12.5% { opacity: 0; transform: translateX(-3px); } 15%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-hp-r1 { 0%, 26.5% { opacity: 0; transform: translateX(-3px); } 29%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-hp-r2 { 0%, 40.5% { opacity: 0; transform: translateX(-3px); } 43%, 100% { opacity: 1; transform: translateX(0); } }

	/* Requests reach the services at 9%, 23% and 37%. */
	@keyframes -global-hp-hit0 { 0%, 8.5% { fill: var(--hp-panel); } 9.5% { fill: var(--hp-hit); } 15%, 100% { fill: var(--hp-panel); } }
	@keyframes -global-hp-hit1 { 0%, 22.5% { fill: var(--hp-panel); } 23.5% { fill: var(--hp-hit); } 29%, 100% { fill: var(--hp-panel); } }
	@keyframes -global-hp-hit2 { 0%, 36.5% { fill: var(--hp-panel); } 37.5% { fill: var(--hp-hit); } 43%, 100% { fill: var(--hp-panel); } }

	/* Simulation starts at 47%: services are wrapped and dimmed. */
	@keyframes -global-hp-dim { 0%, 47% { opacity: 1; } 51%, 100% { opacity: 0.45; } }
	@keyframes -global-hp-wrap { 0%, 47% { opacity: 0; } 51%, 100% { opacity: 1; } }

	/* Simulated replies are served from rows 0, 1, 2, 0 at 55%, 63%, 71%, 79%. */
	@keyframes -global-hp-flash0 {
		0%, 54.5% { fill: transparent; } 55.5% { fill: var(--hp-flash); } 60% { fill: transparent; }
		78.5% { fill: transparent; } 79.5% { fill: var(--hp-flash); } 84%, 100% { fill: transparent; }
	}
	@keyframes -global-hp-flash1 { 0%, 62.5% { fill: transparent; } 63.5% { fill: var(--hp-flash); } 68%, 100% { fill: transparent; } }
	@keyframes -global-hp-flash2 { 0%, 70.5% { fill: transparent; } 71.5% { fill: var(--hp-flash); } 76%, 100% { fill: transparent; } }
</style>
