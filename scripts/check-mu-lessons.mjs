// Checks every lesson in src/lib/tutorial/mu-lessons.js against the real
// pydsa transpiler. For each lesson, the Python shown to the reader and every
// accepted pydsa answer are run on the same setup, and their probes must
// print the same thing. It also checks that static/pydsa/mu.py, the copy the
// browser runs, is the transpiler in MU_DIR. Point MU_DIR at the
// transpiler's directory and MU_PYTHON at a Python that has its dependencies.
//
//   MU_DIR=../leet/mu MU_PYTHON=../leet/.venv/bin/python node scripts/check-mu-lessons.mjs

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { levels } from '../src/lib/tutorial/mu-lessons.js';
import { muProgram, pythonProgram } from '../src/lib/tutorial/programs.js';

const MU_DIR = process.env.MU_DIR || '../leet/mu';
const PY = process.env.MU_PYTHON || 'python3';
const only = process.argv[2];
const dir = mkdtempSync(join(tmpdir(), 'mu-lessons-'));

function run(file) {
	// -S skips site, so a sitecustomize that injects builtins cannot hide a missing import
	return execFileSync(PY, ['-S', file], { encoding: 'utf-8', timeout: 60000, env: { ...process.env, PYTHONPATH: MU_DIR } }).trim();
}

let failures = 0;
let checked = 0;
if (readFileSync(join(MU_DIR, 'mu.py'), 'utf-8') !== readFileSync('static/pydsa/mu.py', 'utf-8')) {
	failures++;
	console.log(`✗ static/pydsa/mu.py differs from ${join(MU_DIR, 'mu.py')}: copy it over`);
}
for (const level of levels) {
	for (const lesson of level.lessons) {
		if (only && lesson.id !== only) continue;
		const pyFile = join(dir, `${lesson.id}.py`);
		writeFileSync(pyFile, pythonProgram(lesson));
		let expected;
		try {
			expected = run(pyFile);
		} catch (e) {
			failures++;
			console.log(`✗ ${level.id}/${lesson.id}: the Python does not run\n${e.stderr || e.message}`);
			continue;
		}
		for (const [i, answer] of [lesson.answer, ...lesson.accept].entries()) {
			const which = i === 0 ? 'answer' : `accept[${i - 1}]`;
			const muFile = join(dir, `${lesson.id}-${i}.mu`);
			writeFileSync(muFile, muProgram(lesson, answer));
			let compiled;
			try {
				compiled = execFileSync(PY, [join(MU_DIR, 'mu.py'), muFile], { encoding: 'utf-8' });
			} catch (e) {
				failures++;
				console.log(`✗ ${level.id}/${lesson.id} ${which}: does not transpile\n${e.stdout}${e.stderr}`);
				continue;
			}
			const outFile = join(dir, `${lesson.id}-${i}.py`);
			writeFileSync(outFile, compiled);
			let got;
			try {
				got = run(outFile);
			} catch (e) {
				failures++;
				console.log(`✗ ${level.id}/${lesson.id} ${which}: transpiled Python fails\n${e.stderr}`);
				continue;
			}
			checked++;
			if (got !== expected) {
				failures++;
				console.log(`✗ ${level.id}/${lesson.id} ${which}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);
			}
		}
	}
}
console.log(`${checked} answers checked, ${failures} failures`);
process.exit(failures ? 1 : 0);
