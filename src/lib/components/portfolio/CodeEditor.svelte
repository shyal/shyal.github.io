<script>
	// A CodeMirror 6 editor for the tutorial: pydsa or Python, dark like
	// leetcode's, two-space indents, Tab indents. `value` is bound both ways.
	// `onrun` fires on Cmd or Ctrl and Enter.
	import { onMount } from 'svelte';
	import { EditorState, Compartment } from '@codemirror/state';
	import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, placeholder as ph } from '@codemirror/view';
	import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
	import { indentUnit, bracketMatching } from '@codemirror/language';
	import { muLanguage, pythonLanguage, highlight } from '$lib/tutorial/mu-language.js';

	let {
		value = $bindable(''),
		lang = 'mu',
		readonly = false,
		placeholder = '',
		minLines = 6,
		onrun = () => {},
		onfocus = () => {}
	} = $props();

	let host;
	let view;
	const editable = new Compartment();

	const theme = EditorView.theme(
		{
			'&': { backgroundColor: '#1e1e1e', color: '#e6e6e6', fontSize: '13px', height: '100%' },
			'.cm-scroller': {
				fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
				lineHeight: '1.6',
				minHeight: `calc(${minLines} * 1.6 * 13px + 16px)`
			},
			'.cm-content': { padding: '8px 0', caretColor: '#fff' },
			'.cm-line': { padding: '0 12px' },
			'.cm-gutters': { backgroundColor: '#1e1e1e', color: '#5c6370', border: 'none', paddingLeft: '4px' },
			'.cm-activeLineGutter': { backgroundColor: '#282828' },
			'.cm-activeLine': { backgroundColor: '#ffffff08' },
			'&.cm-focused': { outline: 'none' },
			'&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: '#3e4451' },
			'.cm-cursor': { borderLeftColor: '#fff' },
			'.cm-matchingBracket': { backgroundColor: '#ffffff1a', outline: '1px solid #ffffff33' },
			'.cm-placeholder': { color: '#5c6370', fontStyle: 'italic' }
		},
		{ dark: true }
	);

	onMount(() => {
		view = new EditorView({
			parent: host,
			state: EditorState.create({
				doc: value,
				extensions: [
					lineNumbers(),
					highlightActiveLine(),
					highlightActiveLineGutter(),
					drawSelection(),
					history(),
					bracketMatching(),
					indentUnit.of('  '),
					EditorState.tabSize.of(2),
					lang === 'python' ? pythonLanguage : muLanguage,
					highlight,
					theme,
					ph(placeholder),
					keymap.of([
						{ key: 'Mod-Enter', run: () => (onrun(), true) },
						indentWithTab,
						...defaultKeymap,
						...historyKeymap
					]),
					editable.of([EditorState.readOnly.of(readonly), EditorView.editable.of(!readonly)]),
					EditorView.updateListener.of((u) => {
						if (u.docChanged) value = u.state.doc.toString();
						if (u.focusChanged && u.view.hasFocus) onfocus();
					})
				]
			})
		});
		return () => view.destroy();
	});

	// A change from outside (a new lesson, a revealed answer) replaces the doc.
	$effect(() => {
		if (view && value !== view.state.doc.toString()) {
			view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
		}
	});

	export function focus() {
		view?.focus();
	}
</script>

<div class="editor" class:readonly bind:this={host}></div>

<style>
	.editor { height: 100%; overflow: hidden; }
	.editor :global(.cm-editor) { height: 100%; }
	.readonly :global(.cm-activeLine), .readonly :global(.cm-activeLineGutter) { background: transparent !important; }
</style>
