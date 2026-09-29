<script>
	// pydsa in one loop: an editor cycles through four solutions written in the
	// dialect. Each one is typed in line by line, holds long enough to read,
	// then gives way to the next. Every animation is SMIL with computed
	// keyTimes, all on one CYCLE.
	import { onMount } from 'svelte';

	const W = 400;
	const H = 160;

	const examples = [
		{
			file: '0200.mu',
			lines: [
				'# 200. Number of Islands',
				'def numIslands(grid: [[char]]) -> int',
				"  land = set cells(grid, eq='1')",
				'  len components(land, p -> nbrs(grid, p))'
			]
		},
		{
			file: '1143.mu',
			lines: [
				'# 1143. Longest Common Subsequence',
				'def longestCommonSubsequence(a: str, b: str) -> int',
				'  memo f(i, j) =',
				'    | i == len(a) or j == len(b) -> 0',
				'    | a[i] == b[j]               -> 1 + f(i + 1, j + 1)',
				'    | else                       -> max(f(i + 1, j), f(i, j + 1))',
				'  f(0, 0)'
			]
		},
		{
			file: '0875.mu',
			lines: [
				'# 875. Koko Eating Bananas',
				'def minEatingSpeed(piles: [int], h: int) -> int',
				'  first k in 1..max(piles) if (sum for p in piles: ceil(p / k)) <= h'
			]
		},
		{
			file: '0560.mu',
			lines: [
				'# 560. Subarray Sum Equals K',
				'def subarraySum(nums: [int], k: int) -> int',
				'  cnt = counter([0])',
				'  sum for p in scan(+, nums)',
				'    got = cnt[p - k]',
				'    cnt[p] += 1',
				'    got'
			]
		}
	];

	// Layout. The card crops the right edge on narrow screens, so the scene is
	// anchored left and nothing important sits past x = 270.
	const FONT = 6.8;
	const CHAR = FONT * 0.62; // monospace advance
	const LINE = 12.5;
	const CODE_X = 30;
	const CODE_Y = 40;

	// Timing, in seconds
	const CYCLE = 26;
	const SLOT = CYCLE / examples.length;
	const FADE = 0.35;
	const PER_CHAR = 0.022;
	const GAP = 0.12;

	const f4 = (t) => (t / CYCLE).toFixed(4);

	const KEYWORDS = new Set([
		'def', 'for', 'in', 'if', 'else', 'return', 'memo', 'first', 'sum', 'count',
		'and', 'or', 'not', 'while', 'from', 'by', 'extends'
	]);
	const TYPES = new Set(['int', 'char', 'str', 'bool', 'none']);
	const HELPERS = new Set([
		'cells', 'nbrs', 'components', 'counter', 'scan', 'sort', 'ceil', 'floor',
		'len', 'max', 'min', 'table', 'like', 'pairs', 'levels', 'to_digits', 'to_int'
	]);

	function tokenize(line) {
		const re = /(#.*$)|('[^']*'|"[^"]*")|(\b\d+\b)|(->|\.\.<?|<-|\|)|([A-Za-z_]\w*)|(\s+|.)/g;
		const out = [];
		let m;
		while ((m = re.exec(line))) {
			let c = '';
			if (m[1]) c = 'cm';
			else if (m[2]) c = 'st';
			else if (m[3]) c = 'nu';
			else if (m[4]) c = 'op';
			else if (m[5]) c = KEYWORDS.has(m[5]) ? 'kw' : TYPES.has(m[5]) ? 'ty' : HELPERS.has(m[5]) ? 'fn' : '';
			const last = out[out.length - 1];
			if (last && last.c === c) last.s += m[0];
			else out.push({ s: m[0], c });
		}
		return out;
	}

	const schedule = examples.map((ex, n) => {
		const start = n * SLOT + 0.01;
		const end = start + SLOT - 0.3;
		let t = start + FADE;
		const lines = ex.lines.map((text) => {
			const s = t;
			const e = s + text.length * PER_CHAR;
			t = e + GAP;
			return { text, s, e, w: text.length * CHAR + 2, toks: tokenize(text) };
		});
		return { ...ex, start, end, done: t, lines };
	});

	// With reduced motion, the second example is shown still.
	let reduced = $state(false);
	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced = mq.matches;
		const on = (e) => (reduced = e.matches);
		mq.addEventListener('change', on);
		return () => mq.removeEventListener('change', on);
	});
</script>

<svg
	class="scene"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="xMinYMid slice"
	role="img"
	aria-label="pydsa: an editor cycles through four LeetCode solutions written in the dialect, each typed in line by line"
>
	<defs>
		<linearGradient id="pz-bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" class="bg1" />
			<stop offset="1" class="bg2" />
		</linearGradient>
		{#if !reduced}
			{#each schedule as ex, n}
				{#each ex.lines as l, i}
					<clipPath id="pz-c{n}-{i}">
						<rect x={CODE_X - 1} y={CODE_Y + i * LINE - LINE + 3} width="0" height={LINE}>
							<animate
								attributeName="width"
								values="0;0;{l.w};{l.w};0;0"
								keyTimes="0;{f4(l.s)};{f4(l.e)};{f4(ex.end)};{f4(ex.end + 0.05)};1"
								dur="{CYCLE}s"
								repeatCount="indefinite"
							/>
						</rect>
					</clipPath>
				{/each}
			{/each}
		{/if}
	</defs>

	<rect width={W} height={H} fill="url(#pz-bg)" />

	<!-- Editor chrome -->
	<rect x="0" y="0" width={W} height="20" class="bar" />
	<circle cx="12" cy="10" r="2.6" class="dot d1" />
	<circle cx="21" cy="10" r="2.6" class="dot d2" />
	<circle cx="30" cy="10" r="2.6" class="dot d3" />
	<rect x="0" y="20" width="22" height={H - 20} class="gutter" />

	{#each schedule as ex, n}
		{#if !reduced || n === 1}
			<g class="ex" opacity={reduced ? 1 : 0}>
				{#if !reduced}
					<animate
						attributeName="opacity"
						values="0;0;1;1;0;0"
						keyTimes="0;{f4(ex.start)};{f4(ex.start + FADE)};{f4(ex.end - FADE)};{f4(ex.end)};1"
						dur="{CYCLE}s"
						repeatCount="indefinite"
					/>
				{/if}

				<!-- Tab -->
				<rect x="46" y="4" width={ex.file.length * 5 + 16} height="16" rx="3" class="tab" />
				<text x="54" y="14.5" class="tabtext">{ex.file}</text>

				<!-- Line numbers and code -->
				{#each ex.lines as l, i}
					<text x="17" y={CODE_Y + i * LINE} class="ln" text-anchor="end">{i + 1}</text>
					<g clip-path={reduced ? undefined : `url(#pz-c${n}-${i})`}>
						<text x={CODE_X} y={CODE_Y + i * LINE} class="code" xml:space="preserve">{#each l.toks as t}<tspan class={t.c}>{t.s}</tspan>{/each}</text>
					</g>
				{/each}

				<!-- Caret: sits at the end of the line being typed -->
				{#if !reduced}
					<rect x={CODE_X} y={CODE_Y - LINE + 4} width="0.9" height={LINE - 3} class="caret">
						<animate
							attributeName="opacity"
							values="0;0;1;1;0;0"
							keyTimes="0;{f4(ex.start + FADE - 0.05)};{f4(ex.start + FADE)};{f4(ex.done)};{f4(ex.done + 0.05)};1"
							dur="{CYCLE}s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="y"
							values={ex.lines.map((_, i) => CODE_Y + i * LINE - LINE + 4).join(';')}
							keyTimes={ex.lines.map((l, i) => (i === 0 ? '0' : f4(l.s))).join(';')}
							calcMode="discrete"
							dur="{CYCLE}s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="x"
							values={[CODE_X, ...ex.lines.flatMap((l) => [CODE_X, CODE_X + l.w - 2]), CODE_X + ex.lines.at(-1).w - 2].join(';')}
							keyTimes={['0', ...ex.lines.flatMap((l) => [f4(l.s), f4(l.e)]), '1'].join(';')}
							dur="{CYCLE}s"
							repeatCount="indefinite"
						/>
					</rect>
				{/if}

				<!-- Status: appears once the solution is typed -->
				<g class="status" opacity={reduced ? 1 : 0}>
					{#if !reduced}
						<animate
							attributeName="opacity"
							values="0;0;1;1;0;0"
							keyTimes="0;{f4(ex.done + 0.1)};{f4(ex.done + 0.4)};{f4(ex.end - FADE)};{f4(ex.end)};1"
							dur="{CYCLE}s"
							repeatCount="indefinite"
						/>
					{/if}
					<rect x="30" y="139" width="90" height="13" rx="6.5" class="pill" />
					<path d="M38 145.5 l2.2 2.2 4.4 -4.6" class="tick" />
					<text x="48" y="148.3" class="pilltext">class Solution · ready</text>
				</g>
			</g>
		{/if}
	{/each}
</svg>

<style>
	.scene {
		--pz-bg1: oklch(0.975 0.008 60);
		--pz-bg2: oklch(0.94 0.014 60);
		--pz-bar: oklch(0.92 0.012 60);
		--pz-gutter: oklch(0.955 0.01 60);
		--pz-ink: oklch(0.32 0.02 60);
		--pz-muted: oklch(0.72 0.01 60);
		--pz-kw: oklch(0.55 0.19 30);
		--pz-ty: oklch(0.55 0.13 250);
		--pz-fn: oklch(0.5 0.12 190);
		--pz-st: oklch(0.58 0.15 140);
		--pz-nu: oklch(0.6 0.14 70);
		--pz-op: oklch(0.55 0.19 30);
		--pz-cm: oklch(0.66 0.01 60);
		--pz-pill: oklch(1 0 0);
		--pz-ok: oklch(0.65 0.16 150);
		display: block;
		width: 100%;
		height: 100%;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	:global(.dark) .scene {
		--pz-bg1: oklch(0.24 0.012 60);
		--pz-bg2: oklch(0.18 0.012 60);
		--pz-bar: oklch(0.21 0.012 60);
		--pz-gutter: oklch(0.215 0.012 60);
		--pz-ink: oklch(0.9 0.01 60);
		--pz-muted: oklch(0.48 0.01 60);
		--pz-kw: oklch(0.78 0.16 30);
		--pz-ty: oklch(0.78 0.11 250);
		--pz-fn: oklch(0.78 0.11 190);
		--pz-st: oklch(0.8 0.13 140);
		--pz-nu: oklch(0.82 0.13 70);
		--pz-op: oklch(0.78 0.16 30);
		--pz-cm: oklch(0.55 0.01 60);
		--pz-pill: oklch(0.27 0.012 60);
		--pz-ok: oklch(0.75 0.15 150);
	}

	.bg1 { stop-color: var(--pz-bg1); }
	.bg2 { stop-color: var(--pz-bg2); }
	.bar { fill: var(--pz-bar); }
	.gutter { fill: var(--pz-gutter); }
	.dot { fill: var(--pz-muted); opacity: 0.7; }
	.d1 { fill: oklch(0.72 0.17 25); } .d2 { fill: oklch(0.82 0.15 85); } .d3 { fill: oklch(0.75 0.16 145); }
	.tab { fill: var(--pz-bg1); }
	.tabtext { fill: var(--pz-ink); font-size: 6.5px; }
	.ln { fill: var(--pz-muted); font-size: 6px; }
	.code { fill: var(--pz-ink); font-size: 6.8px; white-space: pre; }
	.kw { fill: var(--pz-kw); font-weight: 600; }
	.ty { fill: var(--pz-ty); }
	.fn { fill: var(--pz-fn); }
	.st { fill: var(--pz-st); }
	.nu { fill: var(--pz-nu); }
	.op { fill: var(--pz-op); }
	.cm { fill: var(--pz-cm); font-style: italic; }
	.caret { fill: var(--pz-kw); }
	.pill { fill: var(--pz-pill); stroke: var(--pz-ok); stroke-width: 0.6; }
	.tick { fill: none; stroke: var(--pz-ok); stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
	.pilltext { fill: var(--pz-ink); font-size: 5.6px; }
</style>
