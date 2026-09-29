// How a lesson becomes two runnable programs: the Python shown to the reader
// and the reader's mu, each on the same setup, each printing the same probe.
// The build-time checker and the in-browser runner both use these, so what
// passes in one passes in the other.

export function pythonProgram(lesson) {
	return [lesson.setup, lesson.python, `print(${lesson.probe})`].join('\n') + '\n';
}

// The mu is a whole file: its defs become methods of Solution, the setup
// runs after the class as a script, and the probe calls the method.
export function muProgram(lesson, answer) {
	const setup = lesson.setupMu ?? lesson.setup;
	const probe = lesson.probeMu ?? `Solution().${lesson.probe}`;
	return [answer, setup, `print(${probe})`].join('\n') + '\n';
}
