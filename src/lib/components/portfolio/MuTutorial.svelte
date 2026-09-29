<script>
	// The pydsa tutorial, laid out like a leetcode problem: the description on
	// the left, a pydsa editor on the right, a console under it. Run transpiles
	// the reader's pydsa in the browser (Pyodide, in a worker) and runs it
	// against the Python they were shown, on the same input. Every entry is a
	// function and the editor opens on its stub. One green button carries the
	// reader through: Show answer while the stub is untouched, Submit once
	// there is code, Next once it passed. Progress and drafts live in
	// localStorage. The content is in src/lib/tutorial/mu-lessons.js.
	import { onMount, tick } from 'svelte';
	import CodeEditor from './CodeEditor.svelte';
	import { normalize } from '$lib/tutorial/normalize.js';
	import { XP, ranks } from '$lib/tutorial/mu-lessons.js';
	import { judge, onStatus, warm } from '$lib/tutorial/runner.js';

	let { levels } = $props();

	const STORE = 'pydsa-tutorial-v2';
	const all = levels.flatMap((level) => level.lessons.map((lesson) => ({ level, lesson })));
	const total = all.length;

	let done = $state({}); // lesson id -> xp earned
	let drafts = $state({}); // lesson id -> what was typed
	let at = $state(0);
	let code = $state('');
	let hinted = $state(false);
	let revealed = $state(false);
	let streak = $state(0);
	let loaded = $state(false);
	let pane = $state('case'); // case | result
	let running = $state(false);
	let result = $state(null); // last judge result, plus `submitted`
	let runtime = $state('idle');
	let intro = $state(false);
	let editor;
	const INTRO = 'pydsa-intro-seen';
	const TASTE = `# 1143. Longest Common Subsequence
def longestCommonSubsequence(a: str, b: str) -> int
  memo f(i, j) =
    | i == len(a) or j == len(b) -> 0
    | a[i] == b[j]               -> 1 + f(i + 1, j + 1)
    | else                       -> max(f(i + 1, j), f(i, j + 1))
  f(0, 0)`;

	const current = $derived(all[at]);
	const lesson = $derived(current.lesson);
	const level = $derived(current.level);
	const levelIndex = $derived(levels.indexOf(level));
	const indexInLevel = $derived(level.lessons.indexOf(lesson));
	const xp = $derived(Object.values(done).reduce((a, b) => a + b, 0));
	const completed = $derived(Object.keys(done).length);
	const rank = $derived([...ranks].reverse().find((r) => xp >= r.at) ?? ranks[0]);
	const nextRank = $derived(ranks.find((r) => r.at > xp));
	const earnedHere = $derived(done[lesson.id]);
	const untouched = $derived(normalize(code) === normalize(lesson.stub));
	const solutionOpen = $derived(earnedHere != null || revealed);
	const levelDone = (l) => l.lessons.filter((x) => done[x.id] != null).length;

	onStatus((s) => (runtime = s));

	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
			if (saved?.done) {
				done = saved.done;
				drafts = saved.drafts || {};
				streak = saved.streak || 0;
				const firstOpen = all.findIndex(({ lesson }) => done[lesson.id] == null);
				at = typeof saved.at === 'number' && saved.at < total ? saved.at : Math.max(0, firstOpen);
			}
		} catch {}
		code = drafts[lesson.id] || lesson.stub;
		loaded = true;
		try {
			intro = !localStorage.getItem(INTRO);
		} catch {
			intro = true;
		}
	});

	function closeIntro() {
		intro = false;
		try {
			localStorage.setItem(INTRO, '1');
		} catch {}
		warm();
		tick().then(() => editor?.focus());
	}

	function save() {
		try {
			localStorage.setItem(STORE, JSON.stringify({ done, drafts, at, streak }));
		} catch {}
	}

	function go(i) {
		if (i < 0 || i >= total) return;
		drafts = { ...drafts, [lesson.id]: code };
		at = i;
		code = drafts[lesson.id] || lesson.stub;
		hinted = false;
		revealed = false;
		result = null;
		pane = 'case';
		save();
		tick().then(() => editor?.focus());
	}

	async function run(submit) {
		if (running || untouched) return;
		running = true;
		pane = 'result';
		result = null;
		const r = await judge(lesson, code);
		result = { ...r, submitted: submit };
		running = false;
		if (submit && r.verdict === 'accepted') {
			if (done[lesson.id] == null) {
				const earned = revealed ? XP.revealed : hinted ? XP.hinted : XP.clean;
				done = { ...done, [lesson.id]: earned };
				streak = !hinted && !revealed ? streak + 1 : 0;
			}
		} else if (submit) {
			streak = 0;
		}
		drafts = { ...drafts, [lesson.id]: code };
		save();
	}

	function reveal() {
		revealed = true;
		code = lesson.answer;
		tick().then(() => editor?.focus());
	}

	function startOver() {
		done = {};
		drafts = {};
		streak = 0;
		go(0);
	}

	function onEditorFocus() {
		if (runtime === 'idle') warm();
	}

	const VERDICT = {
		accepted: 'Accepted',
		wrong: 'Wrong Answer',
		runtime: 'Runtime Error',
		compile: 'Compile Error',
		timeout: 'Time Limit Exceeded'
	};
	const differs = $derived(result?.verdict === 'accepted' && normalize(code) !== normalize(lesson.answer) && !revealed);

	// The one button that moves things along. Show answer while the stub is
	// untouched, Submit once something was written, Next once this one is
	// solved and the last run did not fail.
	const primary = $derived(
		earnedHere != null && (!result || result.verdict === 'accepted')
			? at < total - 1
				? 'next'
				: 'first'
			: untouched
				? 'reveal'
				: 'submit'
	);
	const PRIMARY = { next: 'Next', first: 'Back to the start', submit: 'Submit', reveal: 'Show answer' };
	function onPrimary() {
		if (primary === 'next') go(at + 1);
		else if (primary === 'first') go(0);
		else if (primary === 'submit') run(true);
		else reveal();
	}
</script>

{#if intro}
	<div class="veil" role="presentation" onclick={closeIntro}>
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="intro-title" onclick={(e) => e.stopPropagation()}>
			<p class="kicker">Experimental</p>
			<h2 id="intro-title">pydsa, pronounced pizza</h2>
			<p>pydsa is a python dialect i'm evolving specifically for:</p>
			<ul>
				<li>expressing DSA with as few tokens as possible</li>
				<li>reading as closely as possible to plain english / pseudocode</li>
				<li>solving leetcode problems as quickly as possible</li>
			</ul>
			<p>It transpiles to python. The python it generates is often quite a lot slower than hand written python, but it's much, much more succinct.</p>
			<div class="taste"><CodeEditor value={TASTE} lang="mu" readonly minLines={1} /></div>
			<p>I'll assume you're already familiar with python's syntax; this way, we can simply cover the differences.</p>
			<p class="small">Version 0.6. The first run downloads a python runtime, it takes a few seconds.</p>
			<div class="help"><button type="button" class="btn green" onclick={closeIntro}>Start the tutorial</button></div>
		</div>
	</div>
{/if}

<section class="lc" aria-label="pydsa tutorial">
	<header class="top">
		<div class="brand">
			<a class="back" href="/" aria-label="Back to shyal.com">‹</a>
			<span class="logo">pydsa</span>
			<span class="sub">tutorial · 0.6</span>
			<button type="button" class="about" onclick={() => (intro = true)}>What is this?</button>
		</div>
		<div class="stats">
			<span class="stat"><b>{xp}</b> XP</span>
			<span class="stat rank">{rank.name}{#if nextRank}<i> · {nextRank.at - xp} to {nextRank.name}</i>{/if}</span>
			<span class="stat"><b>{completed}</b>/{total}</span>
			<span class="stat" title="In a row with no hint or reveal"><b>{streak}</b> streak</span>
		</div>
		<nav class="levels" aria-label="Levels">
				{#each levels as l, li}
					{@const n = levelDone(l)}
					<button type="button" class="lvl" class:active={l === level} class:full={n === l.lessons.length} onclick={() => go(all.findIndex((x) => x.level === l))}>
						<span class="n">{li + 1}</span>{l.title}<span class="c">{n}/{l.lessons.length}</span>
					</button>
				{/each}
		</nav>
	</header>

	<div class="panes">
		<div class="panel left">
			<div class="tabs">
				<span class="tabname">Description</span>
				<span class="grow"></span>
				<button type="button" class="nav" onclick={() => go(at - 1)} disabled={at === 0} aria-label="Previous">‹</button>
				<span class="pos">{at + 1} / {total}</span>
				<button type="button" class="nav" onclick={() => go(at + 1)} disabled={at === total - 1} aria-label="Next">›</button>
			</div>

			<div class="body">
				<h3>{lesson.title}</h3>
				<div class="chips">
					<span class="chip lvlchip">{levelIndex + 1}.{indexInLevel + 1} · {level.title}</span>
					{#if earnedHere != null}<span class="chip ok">Solved · {earnedHere} XP</span>{/if}
				</div>
				{#if indexInLevel === 0}<p class="blurb">{level.blurb}</p>{/if}
				<p class="note">{@html lesson.note}</p>

				<p class="h">Python</p>
				<div class="ro"><CodeEditor value={lesson.python} lang="python" readonly minLines={1} /></div>

				<p class="h">Example</p>
				<div class="example">
					<p><span class="k">Input</span><code>{lesson.setup || '(nothing)'}</code></p>
					<p><span class="k">Prints</span><code>{lesson.probe}</code></p>
					<p class="dim">Your pydsa runs on this input and has to print the same thing as the python.</p>
				</div>

				{#if hinted}
					<p class="hint"><b>Hint.</b> {lesson.hint}</p>
				{/if}
				<div class="help">
					{#if !hinted}<button type="button" class="btn" onclick={() => (hinted = true)}>Show hint</button>{/if}
					{#if !revealed}<button type="button" class="btn" onclick={reveal}>Show answer</button>{/if}
					{#if completed === total}<button type="button" class="btn" onclick={startOver}>Start over</button>{/if}
				</div>

				{#if solutionOpen}
					<p class="h">Solution</p>
					{#if differs}<p class="note">Yours passed too. This is the canonical version.</p>{/if}
					<div class="ro"><CodeEditor value={lesson.answer} lang="mu" readonly minLines={1} /></div>
					{#if lesson.accept.length}
						<p class="h">Also fine</p>
						{#each lesson.accept as alt}
							<div class="ro"><CodeEditor value={alt} lang="mu" readonly minLines={1} /></div>
						{/each}
					{/if}
				{/if}

				{#if result?.python}
					<p class="h">What your pydsa compiles to</p>
					<div class="ro"><CodeEditor value={result.python} lang="python" readonly minLines={1} /></div>
				{/if}
			</div>
		</div>

		<div class="panel right">
			<div class="tabs">
				<span class="tabname"><span class="code-icon">&lt;/&gt;</span> Code</span>
				<span class="grow"></span>
				<span class="lang">pydsa</span>
			</div>
			<div class="edit">
				<CodeEditor bind:this={editor} bind:value={code} lang="mu" minLines={10} onrun={() => run(false)} onfocus={onEditorFocus} />
			</div>
			<div class="bar">
				<span class="keys">Tab indents. Cmd or Ctrl and Enter runs.</span>
				<span class="grow"></span>
				<button type="button" class="btn" onclick={() => run(false)} disabled={running || untouched || !loaded}>▷ Run</button>
				<button type="button" class="btn green primary" onclick={onPrimary} disabled={running || (primary === 'submit' && !loaded)}>{PRIMARY[primary]}</button>
			</div>

			<div class="console">
				<div class="tabs small">
					<button type="button" class:on={pane === 'case'} onclick={() => (pane = 'case')}>Testcase</button>
					<button type="button" class:on={pane === 'result'} onclick={() => (pane = 'result')}>Test result</button>
					<span class="grow"></span>
					<span class="rt" class:busy={running}>
						{#if runtime === 'ready'}Python ready{:else if runtime === 'failed'}Python failed to load{:else if runtime === 'idle'}Python loads on first run{:else}{runtime}…{/if}
					</span>
				</div>
				<div class="out">
					{#if pane === 'case'}
						<p class="k">Input</p>
						<pre>{lesson.setup || '(nothing)'}</pre>
						<p class="k">Prints</p>
						<pre>{lesson.probe}</pre>
					{:else if running}
						<p class="pending">{runtime === 'ready' ? 'Running' : runtime}…</p>
					{:else if !result}
						<p class="dim">Nothing run yet.</p>
					{:else}
						<p class="verdict {result.verdict}">
							{VERDICT[result.verdict]}
							{#if result.submitted && result.verdict === 'accepted' && earnedHere != null}<span class="xp">+{earnedHere} XP</span>{/if}
						</p>
						{#if result.error}
							<pre class="err">{result.error}</pre>
						{/if}
						{#if result.verdict !== 'compile'}
							<p class="k">Output</p>
							<pre>{result.got || '(nothing)'}</pre>
							<p class="k">Expected</p>
							<pre>{result.expected}</pre>
						{/if}
						{#if result.verdict === 'accepted' && !result.submitted}
							<p class="dim">Submit to earn the XP.</p>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* The widget is dark whatever the site theme is, like leetcode's editor. */
	.lc {
		--bg: #1a1a1a;
		--panel: #262626;
		--panel2: #2e2e2e;
		--line: #3a3a3a;
		--fg: #eff1f6;
		--fg2: #b3b3b3;
		--dim: #8a8a8a;
		--green: #2cbb5d;
		--red: #ef4743;
		--orange: #ffa116;
		--yellow: #ffc01e;
		display: flex;
		flex-direction: column;
		height: 100dvh;
		background: var(--bg);
		color: var(--fg);
		font-size: 0.85rem;
		font-family: ui-sans-serif, system-ui, sans-serif;
		overflow: hidden;
	}
	.about { margin-left: 0.5rem; padding: 0.15rem 0.5rem; border: 1px solid var(--line); border-radius: 999px; background: transparent; color: var(--fg2); font: inherit; font-size: 0.7rem; cursor: pointer; }
	.about:hover { color: var(--fg); background: #ffffff0d; }

	.veil { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 1rem; background: #000000b3; backdrop-filter: blur(3px); }
	.modal {
		--line: #3a3a3a; --fg: #eff1f6; --fg2: #b3b3b3; --dim: #8a8a8a; --green: #2cbb5d; --orange: #ffa116;
		width: min(640px, 100%);
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		padding: 1.5rem 1.6rem 1.4rem;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: #262626;
		color: var(--fg2);
		font-size: 0.9rem;
		line-height: 1.65;
		font-family: ui-sans-serif, system-ui, sans-serif;
		box-shadow: 0 20px 60px #00000080;
	}
	.modal .kicker { margin: 0; color: var(--orange); font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
	.modal h2 { margin: 0.2rem 0 0.8rem; font-size: 1.4rem; font-weight: 700; color: var(--fg); }
	.modal p { margin: 0 0 0.8rem; }
	.modal ul { margin: 0 0 0.8rem 1.2rem; list-style: disc; }
	.modal li { margin: 0.15rem 0; }
	.modal .small { color: var(--dim); font-size: 0.8rem; }
	.taste { margin: 0 0 1rem; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
	.modal .help { margin-top: 0.4rem; }

	.back { display: inline-grid; place-items: center; width: 1.5rem; height: 1.5rem; margin-right: 0.1rem; border-radius: 6px; color: var(--fg2); font-size: 1.1rem; text-decoration: none; }
	.back:hover { background: #ffffff14; color: var(--fg); }

	.top {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.4rem 1rem;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--line);
		background: var(--panel);
	}
	.brand { display: flex; align-items: baseline; gap: 0.5rem; }
	.logo { font-weight: 700; color: var(--orange); letter-spacing: 0.02em; }
	.sub { color: var(--dim); font-size: 0.72rem; }
	.levels { grid-column: 1 / -1; display: flex; gap: 0.25rem; overflow-x: auto; scrollbar-width: none; margin: 0 -0.25rem; }
	.lvl {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.55rem;
		border: 1px solid transparent;
		border-radius: 999px;
		background: transparent;
		color: var(--fg2);
		font: inherit;
		font-size: 0.75rem;
		cursor: pointer;
		white-space: nowrap;
	}
	.lvl:hover { background: var(--panel2); color: var(--fg); }
	.lvl.active { background: var(--panel2); border-color: var(--line); color: var(--fg); }
	.lvl .n { display: inline-grid; place-items: center; width: 1rem; height: 1rem; border-radius: 999px; background: var(--line); font-size: 0.6rem; font-weight: 700; }
	.lvl.full .n { background: var(--green); color: #000; }
	.lvl .c { color: var(--dim); font-size: 0.68rem; }
	.stats { display: flex; align-items: center; gap: 0.9rem; font-size: 0.78rem; color: var(--fg2); white-space: nowrap; }
	.stat b { color: var(--fg); font-weight: 700; }
	.rank { color: var(--yellow); }
	.rank i { font-style: normal; color: var(--dim); }

	.panes { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 6px; }
	.panel { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); overflow: hidden; }
	.left { min-height: 0; }
	.tabs { display: flex; align-items: center; gap: 0.25rem; padding: 0.3rem 0.5rem; border-bottom: 1px solid var(--line); background: var(--panel2); font-size: 0.78rem; }
	.tabs.small { font-size: 0.72rem; }
	.tabs button { padding: 0.3rem 0.55rem; border: 0; border-radius: 6px; background: transparent; color: var(--fg2); font: inherit; cursor: pointer; }
	.tabs button:hover:not(:disabled) { color: var(--fg); background: #ffffff0d; }
	.tabs button.on { color: var(--fg); background: #ffffff14; }
	.tabs button:disabled { color: var(--dim); cursor: default; }
	.tabname { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.35rem; color: var(--fg); }
	.code-icon { color: var(--green); font-weight: 700; font-family: ui-monospace, Menlo, monospace; }
	.lang { padding: 0.2rem 0.5rem; border-radius: 6px; background: #ffffff14; color: var(--fg2); font-size: 0.72rem; }
	.grow { flex: 1; }
	.nav { font-size: 1rem; line-height: 1; padding: 0.15rem 0.5rem !important; }
	.pos { color: var(--dim); font-size: 0.72rem; }

	.body { flex: 1; padding: 1rem 1.1rem 1.25rem; overflow-y: auto; line-height: 1.65; color: var(--fg2); }
	h3 { margin: 0 0 0.5rem; font-size: 1.05rem; font-weight: 600; color: var(--fg); }
	.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.9rem; }
	.chip { padding: 0.1rem 0.55rem; border-radius: 999px; background: #ffffff14; color: var(--fg2); font-size: 0.7rem; }
	.chip.lvlchip { color: var(--yellow); background: #ffc01e1f; }
	.chip.ok { color: var(--green); background: #2cbb5d1f; }
	.blurb { margin: 0 0 0.8rem; padding: 0.6rem 0.8rem; border-left: 2px solid var(--orange); background: #ffffff08; color: var(--fg); border-radius: 0 6px 6px 0; }
	.note { margin: 0 0 1rem; }
	.note :global(code), .example code, .hint :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.85em;
		padding: 0.1em 0.35em;
		border-radius: 4px;
		background: #ffffff14;
		color: var(--fg);
	}
	.h { margin: 1.1rem 0 0.4rem; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--dim); }
	.ro { border: 1px solid var(--line); border-radius: 6px; overflow: hidden; margin-bottom: 0.5rem; }
	.example { padding: 0.7rem 0.85rem; border-radius: 6px; background: #ffffff08; }
	.example p { margin: 0 0 0.35rem; }
	.example .k { display: inline-block; width: 3.6rem; color: var(--dim); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; }
	.example code { white-space: pre-wrap; }
	.dim { color: var(--dim); }
	.example .dim { margin: 0.5rem 0 0; font-size: 0.78rem; }
	.hint { margin: 1rem 0 0; padding: 0.6rem 0.8rem; border-radius: 6px; background: #ffa1161a; color: var(--fg); }
	.hint b { color: var(--orange); }
	.help { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		height: 2rem;
		padding: 0 0.85rem;
		border: 0;
		border-radius: 6px;
		background: #ffffff14;
		color: var(--fg);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;
	}
	.btn:hover:not(:disabled) { background: #ffffff22; }
	.btn:disabled { opacity: 0.45; cursor: default; }
	.btn.green { background: var(--green); color: #fff; }
	.btn.green:hover:not(:disabled) { background: #33c968; }

	.right { min-height: 0; }
	.edit { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
	.edit :global(.editor) { flex: 1; }
	.bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.6rem; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--panel2); }
	.keys { color: var(--dim); font-size: 0.7rem; }
	.console { display: flex; flex-direction: column; flex: 0 0 auto; height: 36%; min-height: 170px; }
	.rt { color: var(--dim); font-size: 0.7rem; }
	.rt.busy { color: var(--orange); }
	.out { flex: 1; padding: 0.75rem 0.85rem; overflow: auto; }
	.out .k { margin: 0.5rem 0 0.25rem; color: var(--dim); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; }
	.out pre { margin: 0; padding: 0.5rem 0.7rem; border-radius: 6px; background: #ffffff0a; color: var(--fg); font-family: ui-monospace, Menlo, monospace; font-size: 0.78rem; white-space: pre-wrap; word-break: break-word; }
	.out pre.err { color: #f4a09c; background: #ef47431a; }
	.out .dim, .out .pending { margin: 0; }
	.pending { color: var(--orange); }
	.verdict { margin: 0 0 0.25rem; font-size: 1.05rem; font-weight: 600; }
	.verdict.accepted { color: var(--green); }
	.verdict.wrong, .verdict.runtime, .verdict.compile, .verdict.timeout { color: var(--red); }
	.xp { margin-left: 0.5rem; font-size: 0.8rem; color: var(--yellow); }
	.btn.primary { min-width: 7rem; justify-content: center; }

	@media (max-width: 860px) {
		.lc { height: auto; min-height: 100dvh; overflow: visible; }
		.panes { grid-template-columns: 1fr; }
		.left { min-height: 0; }
		.right { min-height: 80dvh; }
		.body { overflow: visible; }
		.edit { min-height: 260px; }
		.console { height: auto; }
		.top { grid-template-columns: 1fr; }
		.keys { display: none; }
		.stats { justify-content: space-between; }
	}
</style>
