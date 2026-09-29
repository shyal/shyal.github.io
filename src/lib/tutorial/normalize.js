// How a typed answer is compared with the accepted ones. Whitespace inside a
// line does not matter, nor do blank lines, comments or the kind of quote.
// Indentation is dropped too, so the check is on the tokens, not the layout.
export function normalize(code) {
	return code
		.split('\n')
		.map((line) => line.replace(/#.*$/, '').replace(/\s+/g, '').replace(/"/g, "'"))
		.filter(Boolean)
		.join('\n');
}

export function matches(typed, lesson) {
	const t = normalize(typed);
	if (!t) return false;
	return [lesson.answer, ...lesson.accept].some((a) => normalize(a) === t);
}
