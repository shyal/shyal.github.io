// The tutorial's Python, in a worker so the page stays responsive. Pyodide
// comes from jsDelivr (the same build the leetcode extension ships), mu.py
// and runner.py from /pydsa/. Messages are {id, op, ...}; replies are
// {id, ok, ...}. `transpile` returns the Python for some mu, `run` runs one
// program and returns what it printed.

const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';

let ready;

function boot() {
	ready ??= (async () => {
		postMessage({ status: 'Loading the Python runtime' });
		const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE + 'pyodide.mjs');
		const py = await loadPyodide({ indexURL: PYODIDE });
		postMessage({ status: 'Loading the transpiler' });
		for (const f of ['mu.py', 'runner.py']) {
			const r = await fetch(`/pydsa/${f}`);
			if (!r.ok) throw new Error(`could not fetch ${f}`);
			py.FS.writeFile(`/home/pyodide/${f}`, await r.text());
		}
		py.runPython('import sys; sys.path.insert(0, "/home/pyodide"); import runner');
		postMessage({ status: 'ready' });
		return py;
	})();
	return ready;
}

function firstLine(err) {
	const lines = String(err?.message || err)
		.trim()
		.split('\n')
		.filter(Boolean);
	return (lines[lines.length - 1] || 'error').replace(/^[\w.]*Error: /, '');
}

onmessage = async (e) => {
	const { id, op } = e.data;
	try {
		const py = await boot();
		if (op === 'boot') return postMessage({ id, ok: true });
		py.globals.set('src', e.data.src);
		if (op === 'transpile') {
			return postMessage({ id, ok: true, python: py.runPython('runner.transpile(src)') });
		}
		if (op === 'run') {
			const [out, error] = py.runPython('runner.run(src)').toJs();
			return postMessage({ id, ok: true, out, error });
		}
		postMessage({ id, ok: false, error: `unknown op ${op}` });
	} catch (err) {
		postMessage({ id, ok: false, error: firstLine(err) });
	}
};
