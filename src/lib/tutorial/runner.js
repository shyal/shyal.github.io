// The page's side of the worker. One worker per page, started on first use.
// `judge` does what the Run button on leetcode does for a lesson: it runs
// the Python the reader was shown and the reader's mu on the same input,
// then compares what they printed.
import { muProgram, pythonProgram } from './programs.js';

const TIMEOUT = 20000;

let worker;
let seq = 0;
const pending = new Map();
const listeners = new Set();
let status = 'idle';

export function onStatus(fn) {
	listeners.add(fn);
	fn(status);
	return () => listeners.delete(fn);
}

function setStatus(s) {
	status = s;
	for (const fn of listeners) fn(s);
}

function start() {
	if (worker) return worker;
	worker = new Worker(new URL('./mu-worker.js', import.meta.url), { type: 'module' });
	worker.onmessage = (e) => {
		if (e.data.status) return setStatus(e.data.status);
		const p = pending.get(e.data.id);
		if (!p) return;
		pending.delete(e.data.id);
		clearTimeout(p.timer);
		p.resolve(e.data);
	};
	worker.onerror = (e) => {
		setStatus('failed');
		for (const p of pending.values()) p.resolve({ ok: false, error: e.message || 'the worker failed' });
		pending.clear();
	};
	return worker;
}

function call(op, src) {
	const w = start();
	const id = ++seq;
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			pending.delete(id);
			// A runaway program can only be stopped by killing the worker.
			worker.terminate();
			worker = null;
			setStatus('idle');
			resolve({ ok: false, error: 'Time limit exceeded' });
		}, TIMEOUT);
		pending.set(id, { resolve, timer });
		w.postMessage({ id, op, src });
	});
}

/** Starts loading Pyodide without running anything. */
export function warm() {
	return call('boot');
}

export function transpile(src) {
	return call('transpile', src);
}

/**
 * Returns {verdict, expected, got, python, error}. verdict is one of
 * accepted, wrong, runtime, compile, timeout.
 */
export async function judge(lesson, mu) {
	const t = await transpile(muProgram(lesson, mu));
	if (!t.ok) {
		return { verdict: t.error === 'Time limit exceeded' ? 'timeout' : 'compile', error: t.error };
	}
	const [ref, got] = await Promise.all([call('run', pythonProgram(lesson)), call('run', t.python)]);
	const python = await transpile(mu);
	const out = {
		python: python.ok ? python.python : '',
		expected: ref.ok ? ref.out.trim() : '',
		got: got.ok ? got.out.trim() : ''
	};
	if (!got.ok) return { ...out, verdict: got.error === 'Time limit exceeded' ? 'timeout' : 'runtime', error: got.error };
	if (got.error) return { ...out, verdict: 'runtime', error: got.error };
	if (!ref.ok || ref.error) return { ...out, verdict: 'runtime', error: `The reference failed: ${ref.error}` };
	return { ...out, verdict: out.got === out.expected ? 'accepted' : 'wrong' };
}
