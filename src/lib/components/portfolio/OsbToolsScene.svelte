<script>
	// OSBTools in one loop: a scene check runs against a low-poly mesh and
	// finds five faults. "Fix all" is pressed and each fault is repaired in
	// turn: an open border is closed, an n-gon is triangulated, a floating
	// vertex is removed, an inward normal is flipped, and the pivot is moved to
	// the origin. Timing lives in the osb-* keyframes below, all on a 16s cycle.

	const W = 400;
	const H = 160;

	// Isometric projection of a 2x2x2 cube, one quad per unit on each face.
	const S = 26;
	const CX = 276;
	const CY = 86;
	const P = (x, y, z) => [CX + (x - z) * 0.866 * S, CY + (x + z) * 0.5 * S - y * S];
	const poly = (pts) => pts.map(([x, y, z]) => P(x, y, z).map((v) => v.toFixed(1)).join(',')).join(' ');

	const top = [];
	const right = [];
	const left = [];
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 2; j++) {
			top.push(poly([[i, 2, j], [i + 1, 2, j], [i + 1, 2, j + 1], [i, 2, j + 1]]));
			// The upper two quads of the right face are merged into one n-gon.
			if (i === 0) right.push(poly([[2, i, j], [2, i, j + 1], [2, i + 1, j + 1], [2, i + 1, j]]));
			// One quad on the left face is missing: the open border.
			if (!(i === 1 && j === 0)) left.push(poly([[i, j, 2], [i + 1, j, 2], [i + 1, j + 1, 2], [i, j + 1, 2]]));
		}
	}

	const hole = poly([[1, 0, 2], [2, 0, 2], [2, 1, 2], [1, 1, 2]]);
	const ngon = poly([[2, 1, 0], [2, 1, 1], [2, 1, 2], [2, 2, 2], [2, 2, 1], [2, 2, 0]]);
	const tris = [[[2, 2, 0], [2, 1, 1]], [[2, 1, 1], [2, 2, 1]], [[2, 2, 1], [2, 1, 2]]]
		.map(([a, b]) => `M${P(...a).join(' ')} L${P(...b).join(' ')}`)
		.join(' ');

	// Normals from the centre of each top quad. The third one points inwards.
	const normals = [];
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 2; j++) {
			const [bx, by] = P(i + 0.5, 2, j + 0.5);
			const [tx, ty] = P(i + 0.5, 2.55, j + 0.5);
			normals.push({ bx, by, tx, ty, bad: i === 1 && j === 0 });
		}
	}

	const stray = P(2.55, 1.6, -0.2);
	const pivotFrom = P(0.6, 1.2, 0.2);
	const pivotTo = P(1, 0, 1);
	const pivotDx = (pivotTo[0] - pivotFrom[0]).toFixed(1);
	const pivotDy = (pivotTo[1] - pivotFrom[1]).toFixed(1);

	const checks = ['Close open borders', 'Triangulate n-gons', 'Remove floating verts', 'Fix inward normals', 'Pivot to origin'];
	// The card crops the sides of the 400-wide view, so everything sits within x 48..352.
	const rowY = (i) => 48 + i * 17;
</script>

<svg
	class="scene"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="xMidYMid slice"
	role="img"
	aria-label="OSBTools: a scene check finds five faults in a polygon mesh and fixes them one by one"
>
	<defs>
		<linearGradient id="osb-bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" class="bg1" />
			<stop offset="1" class="bg2" />
		</linearGradient>
	</defs>

	<rect width={W} height={H} fill="url(#osb-bg)" />
	<g class="stage">
		<!-- Check panel -->
		<rect x="52" y="10" width="146" height="140" rx="4" class="panel" />
		<text x="62" y="26" class="heading">Scene check</text>
		<text x="62" y="35" class="sub">5 issues found</text>
		{#each checks as label, i}
			<g class="row r{i}">
				<rect x="57" y={rowY(i) - 8} width="136" height="15" rx="2" class="rowbg f{i}" />
				<rect x="62" y={rowY(i) - 4.5} width="8" height="8" rx="1.5" class="box" />
				<path d="M63.8 {rowY(i) - 0.5} l2.2 2.2 4.2 -4.4" pathLength="1" class="tick f{i}" />
				<text x="76" y={rowY(i) + 2} class="label">{label}</text>
				<circle cx="186" cy={rowY(i) - 0.5} r="2.2" class="dot f{i}" />
			</g>
		{/each}
		<g class="button">
			<rect x="62" y="130" width="46" height="13" rx="3" class="btn" />
			<text x="85" y="139" class="btn-text" text-anchor="middle">Fix all</text>
		</g>

		<!-- Mesh -->
		<g class="mesh">
			{#each left as d}<polygon points={d} class="face left" />{/each}
			{#each right as d}<polygon points={d} class="face right" />{/each}
			<polygon points={ngon} class="face right ngon" />
			<path d={tris} pathLength="1" class="edge tri" />
			<polygon points={hole} class="face left fill-hole" />
			<polygon points={hole} class="border" />
			{#each top as d}<polygon points={d} class="face top" />{/each}

			{#each normals as n}
				<g class="normal" class:bad={n.bad} style:transform-origin="{n.bx}px {n.by}px">
					<line x1={n.bx} y1={n.by} x2={n.tx} y2={n.ty} />
					<circle cx={n.tx} cy={n.ty} r="1.3" />
				</g>
			{/each}

			<g class="stray" style:transform-origin="{stray[0]}px {stray[1]}px">
				<circle cx={stray[0]} cy={stray[1]} r="1.8" class="stray-dot" />
				<circle cx={stray[0]} cy={stray[1]} r="4.5" class="stray-ring" />
			</g>

			<g class="pivot" style:--dx="{pivotDx}px" style:--dy="{pivotDy}px">
				<line x1={pivotFrom[0]} y1={pivotFrom[1]} x2={pivotFrom[0] + 8.7} y2={pivotFrom[1] + 5} class="ax x" />
				<line x1={pivotFrom[0]} y1={pivotFrom[1]} x2={pivotFrom[0]} y2={pivotFrom[1] - 10} class="ax y" />
				<line x1={pivotFrom[0]} y1={pivotFrom[1]} x2={pivotFrom[0] - 8.7} y2={pivotFrom[1] + 5} class="ax z" />
				<circle cx={pivotFrom[0]} cy={pivotFrom[1]} r="1.6" class="pivot-dot" />
			</g>
		</g>
	</g>
</svg>

<style>
	.scene {
		--osb-bg1: oklch(0.965 0.01 250);
		--osb-bg2: oklch(0.915 0.02 250);
		--osb-panel: oklch(1 0 0);
		--osb-border: oklch(0.86 0.01 250);
		--osb-ink: oklch(0.35 0.02 250);
		--osb-muted: oklch(0.6 0.015 250);
		--osb-box: oklch(0.8 0.01 250);
		--osb-face-top: oklch(0.9 0.02 250);
		--osb-face-right: oklch(0.8 0.03 250);
		--osb-face-left: oklch(0.72 0.04 250);
		--osb-edge: oklch(0.42 0.03 250);
		--osb-accent: oklch(0.55 0.17 250);
		--osb-red: oklch(0.62 0.2 25);
		--osb-amber: oklch(0.8 0.14 80);
		--osb-green: oklch(0.65 0.16 150);
		--osb-flash: oklch(0.94 0.05 150);
		--osb-x: oklch(0.62 0.2 25);
		--osb-y: oklch(0.7 0.18 145);
		--osb-z: oklch(0.6 0.18 260);
		display: block;
		width: 100%;
		height: 100%;
		font-family: inherit;
	}
	:global(.dark) .scene {
		--osb-bg1: oklch(0.23 0.015 260);
		--osb-bg2: oklch(0.17 0.015 260);
		--osb-panel: oklch(0.27 0.012 260);
		--osb-border: oklch(0.36 0.015 260);
		--osb-ink: oklch(0.88 0.01 260);
		--osb-muted: oklch(0.6 0.012 260);
		--osb-box: oklch(0.45 0.012 260);
		--osb-face-top: oklch(0.42 0.03 260);
		--osb-face-right: oklch(0.34 0.03 260);
		--osb-face-left: oklch(0.28 0.03 260);
		--osb-edge: oklch(0.75 0.03 260);
		--osb-accent: oklch(0.75 0.14 250);
		--osb-red: oklch(0.7 0.18 25);
		--osb-amber: oklch(0.78 0.14 80);
		--osb-green: oklch(0.72 0.15 150);
		--osb-flash: oklch(0.34 0.05 150);
		--osb-x: oklch(0.7 0.18 25);
		--osb-y: oklch(0.75 0.16 145);
		--osb-z: oklch(0.7 0.15 260);
	}

	.bg1 { stop-color: var(--osb-bg1); }
	.bg2 { stop-color: var(--osb-bg2); }

	.stage { animation: osb-stage 16s ease-in-out infinite; }

	/* Panel */
	.panel { fill: var(--osb-panel); stroke: var(--osb-border); stroke-width: 0.6; }
	.heading { fill: var(--osb-ink); font-size: 8px; font-weight: 600; }
	.sub { fill: var(--osb-muted); font-size: 5.5px; }
	.label { fill: var(--osb-ink); font-size: 6.5px; }
	.box { fill: none; stroke: var(--osb-box); stroke-width: 0.7; }
	.tick { fill: none; stroke: var(--osb-green); stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
	.dot { fill: var(--osb-red); }
	.rowbg { fill: transparent; }
	.row { animation: 16s ease-out infinite; }
	.r0 { animation-name: osb-r0; } .r1 { animation-name: osb-r1; } .r2 { animation-name: osb-r2; } .r3 { animation-name: osb-r3; } .r4 { animation-name: osb-r4; }
	.button { animation: osb-button 16s ease-out infinite; transform-box: fill-box; transform-origin: center; }
	.btn { fill: var(--osb-accent); }
	.btn-text { fill: white; font-size: 6.5px; font-weight: 600; }

	/* Mesh */
	.face { stroke: var(--osb-edge); stroke-width: 0.6; stroke-linejoin: round; }
	.face.top { fill: var(--osb-face-top); }
	.face.right { fill: var(--osb-face-right); }
	.face.left { fill: var(--osb-face-left); }
	.edge { fill: none; stroke: var(--osb-edge); stroke-width: 0.6; stroke-linecap: round; }

	/* Fault 0: open border. The missing face fills in and its red outline settles. */
	.fill-hole { animation: osb-hole 16s ease-out infinite; }
	.border { fill: none; stroke: var(--osb-red); stroke-width: 1.1; stroke-linejoin: round; animation: osb-border 16s ease-out infinite; }

	/* Fault 1: n-gon. The face glows amber until diagonals are drawn across it. */
	.ngon { animation: osb-ngon 16s ease-out infinite; }
	.tri { stroke-dasharray: 1; stroke-dashoffset: 1; animation: osb-tri 16s ease-out infinite; }

	/* Fault 2: floating vertex. It shrinks away. */
	.stray { animation: osb-stray 16s ease-in infinite; }
	.stray-dot { fill: var(--osb-red); }
	.stray-ring { fill: none; stroke: var(--osb-red); stroke-width: 0.6; animation: osb-stray-ring 1.6s ease-out infinite; transform-box: fill-box; transform-origin: center; }

	/* Fault 3: inward normal. The bad one flips and turns green. */
	.normal line { stroke: var(--osb-accent); stroke-width: 0.8; stroke-linecap: round; }
	.normal circle { fill: var(--osb-accent); }
	.normal.bad { animation: osb-flip 16s cubic-bezier(.3,1.4,.5,1) infinite; }
	.normal.bad line { stroke: var(--osb-red); animation: osb-normal-colour 16s ease-out infinite; }
	.normal.bad circle { fill: var(--osb-red); animation: osb-normal-fill 16s ease-out infinite; }

	/* Fault 4: pivot. The gizmo slides down to the base of the mesh. */
	.pivot { animation: osb-pivot 16s cubic-bezier(.2,.8,.2,1) infinite; }
	.ax { stroke-width: 1; stroke-linecap: round; }
	.ax.x { stroke: var(--osb-x); }
	.ax.y { stroke: var(--osb-y); }
	.ax.z { stroke: var(--osb-z); }
	.pivot-dot { fill: var(--osb-ink); }

	/* Checklist rows respond to each fix: 0 at 22%, 1 at 34%, 2 at 46%, 3 at 58%, 4 at 70%. */
	.rowbg.f0 { animation: osb-flash0 16s ease-in-out infinite; } .tick.f0 { animation: osb-tick0 16s ease-out infinite; } .dot.f0 { animation: osb-dot0 16s ease-out infinite; }
	.rowbg.f1 { animation: osb-flash1 16s ease-in-out infinite; } .tick.f1 { animation: osb-tick1 16s ease-out infinite; } .dot.f1 { animation: osb-dot1 16s ease-out infinite; }
	.rowbg.f2 { animation: osb-flash2 16s ease-in-out infinite; } .tick.f2 { animation: osb-tick2 16s ease-out infinite; } .dot.f2 { animation: osb-dot2 16s ease-out infinite; }
	.rowbg.f3 { animation: osb-flash3 16s ease-in-out infinite; } .tick.f3 { animation: osb-tick3 16s ease-out infinite; } .dot.f3 { animation: osb-dot3 16s ease-out infinite; }
	.rowbg.f4 { animation: osb-flash4 16s ease-in-out infinite; } .tick.f4 { animation: osb-tick4 16s ease-out infinite; } .dot.f4 { animation: osb-dot4 16s ease-out infinite; }

	@media (prefers-reduced-motion: reduce) {
		.scene * { animation: none !important; }
		.tick { stroke-dashoffset: 0; }
		.tri { stroke-dashoffset: 0; }
		.dot { fill: var(--osb-green); }
		.border, .stray { opacity: 0; }
		.fill-hole { opacity: 1; }
		.normal.bad line { stroke: var(--osb-accent); }
		.normal.bad circle { fill: var(--osb-accent); }
		.pivot { transform: translate(var(--dx), var(--dy)); }
	}

	/* Whole scene: fade in, hold, fade out and reset. */
	@keyframes -global-osb-stage { 0% { opacity: 0; } 2%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }

	/* Rows appear one by one as the check runs, then the button is pressed at 17%. */
	@keyframes -global-osb-r0 { 0%, 3% { opacity: 0; transform: translateX(-4px); } 6%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-osb-r1 { 0%, 4.5% { opacity: 0; transform: translateX(-4px); } 7.5%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-osb-r2 { 0%, 6% { opacity: 0; transform: translateX(-4px); } 9%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-osb-r3 { 0%, 7.5% { opacity: 0; transform: translateX(-4px); } 10.5%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-osb-r4 { 0%, 9% { opacity: 0; transform: translateX(-4px); } 12%, 100% { opacity: 1; transform: translateX(0); } }
	@keyframes -global-osb-button {
		0%, 11% { opacity: 0; transform: scale(1); }
		14%, 17% { opacity: 1; transform: scale(1); }
		18% { transform: scale(0.92); }
		19.5%, 100% { opacity: 1; transform: scale(1); }
	}

	/* Fix 0 at 22%: border closes. */
	@keyframes -global-osb-hole { 0%, 22% { opacity: 0; } 26%, 100% { opacity: 1; } }
	@keyframes -global-osb-border { 0%, 22% { opacity: 1; } 27%, 100% { opacity: 0; } }
	/* Fix 1 at 34%: diagonals draw across the n-gon. */
	@keyframes -global-osb-ngon { 0%, 34% { fill: var(--osb-amber); } 40%, 100% { fill: var(--osb-face-right); } }
	@keyframes -global-osb-tri { 0%, 34% { stroke-dashoffset: 1; } 39%, 100% { stroke-dashoffset: 0; } }
	/* Fix 2 at 46%: stray vertex shrinks away. */
	@keyframes -global-osb-stray { 0%, 46% { opacity: 1; transform: scale(1); } 49%, 100% { opacity: 0; transform: scale(0); } }
	@keyframes -global-osb-stray-ring { 0% { opacity: 0.8; transform: scale(0.3); } 100% { opacity: 0; transform: scale(1.2); } }
	/* Fix 3 at 58%: the inward normal flips. */
	@keyframes -global-osb-flip { 0%, 58% { transform: rotate(180deg); } 63%, 100% { transform: rotate(0deg); } }
	@keyframes -global-osb-normal-colour { 0%, 60% { stroke: var(--osb-red); } 64%, 100% { stroke: var(--osb-accent); } }
	@keyframes -global-osb-normal-fill { 0%, 60% { fill: var(--osb-red); } 64%, 100% { fill: var(--osb-accent); } }
	/* Fix 4 at 70%: pivot slides to the base. */
	@keyframes -global-osb-pivot { 0%, 70% { transform: translate(0, 0); } 76%, 100% { transform: translate(var(--dx), var(--dy)); } }

	@keyframes -global-osb-flash0 { 0%, 22% { fill: transparent; } 23% { fill: var(--osb-flash); } 32%, 100% { fill: transparent; } }
	@keyframes -global-osb-flash1 { 0%, 34% { fill: transparent; } 35% { fill: var(--osb-flash); } 44%, 100% { fill: transparent; } }
	@keyframes -global-osb-flash2 { 0%, 46% { fill: transparent; } 47% { fill: var(--osb-flash); } 56%, 100% { fill: transparent; } }
	@keyframes -global-osb-flash3 { 0%, 58% { fill: transparent; } 59% { fill: var(--osb-flash); } 68%, 100% { fill: transparent; } }
	@keyframes -global-osb-flash4 { 0%, 70% { fill: transparent; } 71% { fill: var(--osb-flash); } 80%, 100% { fill: transparent; } }
	@keyframes -global-osb-tick0 { 0%, 24% { stroke-dashoffset: 1; } 27%, 100% { stroke-dashoffset: 0; } }
	@keyframes -global-osb-tick1 { 0%, 36% { stroke-dashoffset: 1; } 39%, 100% { stroke-dashoffset: 0; } }
	@keyframes -global-osb-tick2 { 0%, 48% { stroke-dashoffset: 1; } 51%, 100% { stroke-dashoffset: 0; } }
	@keyframes -global-osb-tick3 { 0%, 60% { stroke-dashoffset: 1; } 63%, 100% { stroke-dashoffset: 0; } }
	@keyframes -global-osb-tick4 { 0%, 72% { stroke-dashoffset: 1; } 75%, 100% { stroke-dashoffset: 0; } }
	@keyframes -global-osb-dot0 { 0%, 24% { fill: var(--osb-red); } 27%, 100% { fill: var(--osb-green); } }
	@keyframes -global-osb-dot1 { 0%, 36% { fill: var(--osb-red); } 39%, 100% { fill: var(--osb-green); } }
	@keyframes -global-osb-dot2 { 0%, 48% { fill: var(--osb-red); } 51%, 100% { fill: var(--osb-green); } }
	@keyframes -global-osb-dot3 { 0%, 60% { fill: var(--osb-red); } 63%, 100% { fill: var(--osb-green); } }
	@keyframes -global-osb-dot4 { 0%, 72% { fill: var(--osb-red); } 75%, 100% { fill: var(--osb-green); } }
</style>
