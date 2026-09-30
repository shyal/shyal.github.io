import { levels } from '$lib/tutorial/mu-lessons.js';
import mu from '../../../../static/pydsa/mu.py?raw';

// The language version, read from the transpiler the browser runs.
const version = mu.match(/^VERSION = "([^"]+)"/m)[1];

// The page is the tutorial app. The client gets everything the in-browser
// runner needs: the Python, the setup, the probe, and the accepted answers.
export function load() {
	return {
		version,
		levels: levels.map((level) => ({
			id: level.id,
			title: level.title,
			blurb: level.blurb,
			lessons: level.lessons.map((l) => ({
				id: l.id,
				title: l.title,
				note: l.note,
				hint: l.hint,
				python: l.python,
				stub: l.stub,
				answer: l.answer,
				accept: l.accept,
				setup: l.setup,
				setupMu: l.setupMu,
				probe: l.probe,
				probeMu: l.probeMu
			}))
		}))
	};
}
