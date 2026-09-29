// pydsa for CodeMirror: a stream tokenizer with the same word lists the
// leetcode extension gives Monaco, and a dark highlight style close to
// leetcode's editor. The python mode is CodeMirror's own.
import { StreamLanguage, HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { tags as t } from '@lezer/highlight';

const KEYWORDS = new Set(
	'def memo for in if elif else while return break continue pass del assert from first import extends and or not is ret'.split(' ')
);
const CONSTANTS = new Set(['true', 'false', 'none', 'inf']);
const FOLDS = new Set(['sum', 'max', 'min', 'count']);
const BUILTINS = new Set(
	`len abs sort scan counter ceil floor cells nbrs table like shape put pairs levels adjacency indegrees
	components graph dijkstra in_bounds edges is_edge grid_bfs triples ceil_div first_true last_true first_false
	last_false min_chunks Multiset heap to_digits to_int even odd print range sorted set list dict zip enumerate
	deque`.split(/\s+/)
);
const TYPES = new Set(['int', 'str', 'char', 'bool', 'float', 'none']);

const mu = StreamLanguage.define({
	name: 'mu',
	startState: () => ({ afterDef: false }),
	token(stream, state) {
		if (stream.sol()) state.afterDef = false;
		if (stream.eatSpace()) return null;
		if (stream.match(/^#.*/)) return 'comment';
		if (stream.match(/^[fFrRbB]{0,2}("""|''')/)) {
			const q = stream.current().slice(-3);
			while (!stream.eol()) {
				if (stream.match(q)) break;
				stream.next();
			}
			return 'string';
		}
		if (stream.match(/^[fFrRbB]{0,2}"(?:[^"\\]|\\.)*"?/) || stream.match(/^[fFrRbB]{0,2}'(?:[^'\\]|\\.)*'?/)) return 'string';
		if (stream.match(/^\d+(\.\d+)?/)) return 'number';
		if (stream.match(/^(\.\.<|\.\.|->|<-|\|)/)) return 'keyword';
		if (stream.match(/^[A-Za-z_]\w*/)) {
			const w = stream.current();
			if (state.afterDef) {
				state.afterDef = false;
				return 'def';
			}
			if (w === 'def' || w === 'memo') {
				state.afterDef = true;
				return 'keyword';
			}
			if (KEYWORDS.has(w)) return 'keyword';
			if (CONSTANTS.has(w)) return 'atom';
			if (FOLDS.has(w)) return 'keyword';
			if (TYPES.has(w) && stream.match(/^(?=\s*[?\],)}]|\s*->|$)/, false)) return 'typeName';
			if (BUILTINS.has(w)) return 'builtin';
			return 'variableName';
		}
		if (stream.match(/^\s\.(?=\s|$|[,)\]])/)) return 'keyword';
		stream.next();
		return null;
	},
	languageData: { commentTokens: { line: '#' } }
});

export const muLanguage = mu;
export const pythonLanguage = python();

// Colours after leetcode's dark editor.
export const highlight = syntaxHighlighting(
	HighlightStyle.define([
		{ tag: t.keyword, color: '#c678dd' },
		{ tag: t.controlKeyword, color: '#c678dd' },
		{ tag: t.definitionKeyword, color: '#c678dd' },
		{ tag: t.operatorKeyword, color: '#c678dd' },
		{ tag: t.atom, color: '#d19a66' },
		{ tag: t.bool, color: '#d19a66' },
		{ tag: t.null, color: '#d19a66' },
		{ tag: t.number, color: '#d19a66' },
		{ tag: t.string, color: '#98c379' },
		{ tag: t.comment, color: '#7f848e', fontStyle: 'italic' },
		{ tag: t.function(t.definition(t.variableName)), color: '#61afef' },
		{ tag: t.function(t.variableName), color: '#61afef' },
		{ tag: t.definition(t.variableName), color: '#61afef' },
		{ tag: t.standard(t.variableName), color: '#56b6c2' },
		{ tag: t.typeName, color: '#e5c07b' },
		{ tag: t.className, color: '#e5c07b' },
		{ tag: t.propertyName, color: '#e06c75' },
		{ tag: t.operator, color: '#abb2bf' },
		{ tag: t.punctuation, color: '#abb2bf' },
		{ tag: t.meta, color: '#c678dd' },
		{ tag: t.variableName, color: '#e6e6e6' }
	])
);
