// The pydsa tutorial, as data. Each level is a chapter and each entry shows
// a piece of Python and asks for the pydsa that says the same thing.
//
// Every entry is a function. `stub` is what the editor opens on: the
// signature with a `# solution` body. `answer` is the canonical pydsa and
// `accept` lists other spellings that are also right. Every one of them is
// checked against the real transpiler by scripts/check-mu-lessons.mjs: the
// Python shown to the reader and each accepted answer are whole files, run
// on the same `setup`, and `probe` must print the same thing from both.
//
// Answers are the shortest clean spelling. The last line of a function is
// its value, so no answer ends in `return`. The leetcode problems are the
// ones where the pydsa is a fraction of the Python.
//
// Notes are HTML. Keep them in prose: they explain the feature the lesson
// is about, in a sentence or three, before the reader is asked to type.

export const XP = { clean: 10, hinted: 6, revealed: 2 };

export const ranks = [
	{ at: 0, name: 'Raw dough' },
	{ at: 60, name: 'Proofing' },
	{ at: 160, name: 'In the oven' },
	{ at: 290, name: 'Margherita' },
	{ at: 430, name: 'Quattro formaggi' },
	{ at: 560, name: 'Pizzaiolo' }
];

export const levels = [
	{
		id: 'basics',
		title: 'Basics',
		blurb:
			"Let's get our toes wet with the basics: returns, colons, brackets, ranges, for loops and assignment.",
		lessons: [
			{
				id: 'implicit-return',
				title: 'Implicit return',
				note: "The last line of a function is its return value, so there's no <code>return</code>. There's no colon after the <code>def</code> either: there are no colons anywhere in pydsa, blocks are indentation only.",
				python: 'def sq(x):\n    return x * x',
				stub: 'def sq(x)\n  # solution\n  pass',
				answer: 'def sq(x)\n  x * x',
				accept: [],
				hint: 'No colon, no return.',
				setup: '',
				probe: 'sq(7)'
			},
			{
				id: 'no-colon',
				title: 'No colons',
				note: 'Same for the <code>if</code>: no colon, two spaces of indentation. <code>return</code> still works for early returns.',
				python: 'def solve(x):\n    if x > 0:\n        print(x)\n    return x',
				stub: 'def solve(x)\n  # solution\n  pass',
				answer: 'def solve(x)\n  if x > 0\n    print x\n  x',
				accept: ['def solve(x)\n  if x > 0\n    print(x)\n  x'],
				hint: 'Drop the colon, indent with two spaces, x on the last line.',
				setup: 'x = 5',
				probe: 'solve(x)'
			},
			{
				id: 'one-arg-call',
				title: 'Calls without parentheses',
				note: "Functions called with a single argument don't need parentheses: <code>print a</code>. This nests, so <code>print len xs</code> is <code>print(len(xs))</code>. With two or more arguments you still need the parentheses.",
				python: 'def solve(xs):\n    print(len(xs))\n    return len(xs)',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  print len xs\n  len xs',
				accept: ['def solve(xs)\n  print(len xs)\n  len xs', 'def solve(xs)\n  print len(xs)\n  len(xs)'],
				hint: 'print len xs',
				setup: 'xs = [3, 1, 2]',
				probe: 'solve(xs)'
			},
			{
				id: 'binds-tight',
				title: 'Calls without parentheses, and operators',
				note: 'A call without parentheses binds tighter than any operator. <code>len xs - 1</code> is <code>len(xs) - 1</code>, not <code>len(xs - 1)</code>.',
				python: 'def solve(xs):\n    return len(xs) - 1',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  len xs - 1',
				accept: ['def solve(xs)\n  len(xs) - 1'],
				hint: 'len xs - 1',
				setup: 'xs = [3, 1, 2]',
				probe: 'solve(xs)'
			},
			{
				id: 'words',
				title: 'true, false, none, inf',
				note: '<code>True</code>, <code>False</code> and <code>None</code> are lowercase. <code>inf</code> is <code>math.inf</code>, no import needed.',
				python: 'import math\n\ndef solve():\n    return (False, None, math.inf)',
				stub: 'def solve()\n  # solution\n  pass',
				answer: 'def solve()\n  (false, none, inf)',
				accept: [],
				hint: 'All lowercase, no import.',
				setup: '',
				probe: 'solve()'
			},
			{
				id: 'range-exclusive',
				title: 'Ranges',
				note: '<code>0..&lt;n</code> is <code>range(n)</code>. The <code>&lt;</code> means n is excluded.',
				python: 'def solve(n, total):\n    for i in range(n):\n        total += i\n    return total',
				stub: 'def solve(n, total)\n  # solution\n  pass',
				answer: 'def solve(n, total)\n  for i in 0..<n\n    total += i\n  total',
				accept: ['def solve(n, total)\n  for i in range n\n    total += i\n  total', 'def solve(n, total)\n  for i in range(n)\n    total += i\n  total'],
				hint: '0..<n',
				setup: 'n = 5\ntotal = 0',
				probe: 'solve(n, total)'
			},
			{
				id: 'range-inclusive',
				title: 'Inclusive ranges',
				note: '<code>1..n</code> is <code>range(1, n + 1)</code>. Both ends included.',
				python: 'def solve(n, total):\n    for i in range(1, n + 1):\n        total += i * i\n    return total',
				stub: 'def solve(n, total)\n  # solution\n  pass',
				answer: 'def solve(n, total)\n  for i in 1..n\n    total += i * i\n  total',
				accept: [],
				hint: '1..n',
				setup: 'n = 4\ntotal = 0',
				probe: 'solve(n, total)'
			},
			{
				id: 'loop-no-var',
				title: 'Variable-less iteration',
				note: 'No more need for <code>for _ in range(k):</code>. Sometimes we just want to iterate a number of times without any index or value variable.',
				python: 'def solve(k, total):\n    for _ in range(k):\n        total *= 2\n    return total',
				stub: 'def solve(k, total)\n  # solution\n  pass',
				answer: 'def solve(k, total)\n  for 0..<k\n    total *= 2\n  total',
				accept: ['def solve(k, total)\n  for _ in 0..<k\n    total *= 2\n  total'],
				hint: 'for 0..<k',
				setup: 'k = 3\ntotal = 1',
				probe: 'solve(k, total)'
			},
			{
				id: 'enumerate',
				title: 'Enumerate by default',
				note: "This one is a little hard to get used to. In plain python, <code>for i, x in xs</code> would unpack each item. In pydsa it's equivalent to <code>enumerate</code>.",
				python: 'def solve(xs, total):\n    for i, x in enumerate(xs):\n        total += i * x\n    return total',
				stub: 'def solve(xs, total)\n  # solution\n  pass',
				answer: 'def solve(xs, total)\n  for i, x in xs\n    total += i * x\n  total',
				accept: [],
				hint: 'for i, x in xs',
				setup: 'xs = [3, 1, 2]\ntotal = 0',
				probe: 'solve(xs, total)'
			},
			{
				id: 'unpack-pairs',
				title: 'Unpacking',
				note: 'For the standard tuple / list unpacking, add parentheses: <code>for (a, b) in ps</code>.',
				python: 'def solve(ps, total):\n    for a, b in ps:\n        total += a * b\n    return total',
				stub: 'def solve(ps, total)\n  # solution\n  pass',
				answer: 'def solve(ps, total)\n  for (a, b) in ps\n    total += a * b\n  total',
				accept: [],
				hint: 'for (a, b) in ps',
				setup: 'ps = [(1, 2), (3, 4)]\ntotal = 0',
				probe: 'solve(ps, total)'
			},
			{
				id: 'underscore',
				title: '_',
				note: 'In a loop with no variable, the item is available as <code>_</code>. Use it here.',
				python: 'def solve(ps, total):\n    for p in ps:\n        total += p[0]\n    return total',
				stub: 'def solve(ps, total)\n  # solution\n  pass',
				answer: 'def solve(ps, total)\n  for ps\n    total += _[0]\n  total',
				accept: [],
				hint: 'for ps, then _[0] in the body.',
				setup: 'ps = [(1, 2), (3, 4)]\ntotal = 0',
				probe: 'solve(ps, total)'
			},
			{
				id: 'loop-else',
				title: 'Loop else',
				note: 'A loop can end with an <code>else</code> block, which runs when the loop finishes without <code>break</code>, as in python. <code>break</code>, <code>continue</code>, <code>pass</code>, <code>del</code>, <code>assert</code> and chained assignment <code>a = b = 0</code> are all as in python too.',
				python: 'def solve(xs, t):\n    for x in xs:\n        if x == t:\n            found = True\n            break\n    else:\n        found = False\n    return found',
				stub: 'def solve(xs, t)\n  # solution\n  pass',
				answer: 'def solve(xs, t)\n  for x in xs\n    if x == t\n      found = true\n      break\n  else\n    found = false\n  found',
				accept: [],
				hint: 'Drop the colons, lowercase true and false.',
				setup: 'xs = [3, 1, 2]\nt = 5',
				probe: 'solve(xs, t)'
			},
			{
				id: 'convert-assign',
				title: 'Conversion at assignment',
				note: 'The inability to convert / type variables when unpacking is annoying. PyDSA allows you to simply specify the type on the left side of the assignment.',
				python: "def solve(s):\n    a, op, b = s.split(' ')\n    a, b = int(a), int(b)\n    return (a, op, b, a + b)",
				stub: 'def solve(s)\n  # solution\n  pass',
				answer: "def solve(s)\n  int(a), op, int(b) = s.split ' '\n  (a, op, b, a + b)",
				accept: ["def solve(s)\n  int(a), op, int(b) = s.split(' ')\n  (a, op, b, a + b)"],
				hint: 'int(a), op, int(b) = ...',
				setup: "s = '3 + 4'",
				probe: 'solve(s)'
			},
			{
				id: 'two-sum',
				title: '1. Two Sum',
				note: '1. <code>for i, x in nums</code> is enumerate, and an early <code>return</code> is as in python. A function that returns nothing on its last line returns none.',
				python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i',
				stub: 'def twoSum(nums: [int], target: int) -> [int]\n  # solution\n  pass',
				answer: 'def twoSum(nums: [int], target: int) -> [int]\n  seen = {}\n  for i, x in nums\n    if target - x in seen\n      return [seen[target - x], i]\n    seen[x] = i',
				accept: [],
				hint: 'for i, x in nums, then the early return.',
				setup: 'nums = [2, 7, 11, 15]\ntarget = 9',
				probe: 'twoSum(nums, target)'
			}
		]
	},
	{
		id: 'lambdas',
		title: 'Lambdas and special calls',
		blurb:
			'Lambdas are shorter. A few calls compile to something else: sort by, ceil and floor.',
		lessons: [
			{
				id: 'lambda',
				title: 'Lambdas',
				note: '<code>x -&gt; x * 2</code> is <code>lambda x: x * 2</code>. Two parameters: <code>(a, b) -&gt; a + b</code>, which also accepts a single pair and unpacks it. Lambdas are only allowed as a call argument or as the value of an assignment.',
				python: 'def solve():\n    double = lambda x: x * 2\n    return double(21)',
				stub: 'def solve()\n  # solution\n  pass',
				answer: 'def solve()\n  double = x -> x * 2\n  double(21)',
				accept: [],
				hint: 'x -> x * 2',
				setup: '',
				probe: 'solve()'
			},
			{
				id: 'sort-by',
				title: 'sort by',
				note: '<code>sort(xs, by=f)</code> is <code>sorted(xs, key=f)</code>. With a pair lambda you can unpack the item, and <code>_</code> can be used more than once: <code>(_, r) -&gt; r</code>.',
				python: 'def solve(ps):\n    return sorted(ps, key=lambda p: p[1])',
				stub: 'def solve(ps)\n  # solution\n  pass',
				answer: 'def solve(ps)\n  sort(ps, by=(_, r) -> r)',
				accept: ['def solve(ps)\n  sort(ps, by=p -> p[1])'],
				hint: 'sort(ps, by=(_, r) -> r)',
				setup: 'ps = [(1, 9), (2, 3), (3, 6)]',
				probe: 'solve(ps)'
			},
			{
				id: 'ceil',
				title: 'ceil and floor',
				note: '<code>ceil(a / b)</code> is integer ceiling division, it compiles to <code>-(-a // b)</code>. <code>floor(a / b)</code> is <code>a // b</code>. No floats.',
				python: 'def solve(n, per):\n    return (n + per - 1) // per',
				stub: 'def solve(n, per)\n  # solution\n  pass',
				answer: 'def solve(n, per)\n  ceil(n / per)',
				accept: ['def solve(n, per)\n  ceil_div(n, per)'],
				hint: 'ceil(n / per)',
				setup: 'n = 23\nper = 5',
				probe: 'solve(n, per)'
			}
		]
	},
	{
		id: 'containers',
		title: 'Stacks, dicts and heaps',
		blurb:
			"Since the focus is minimalist syntax, we're trying to cut out the fluff. And things like .append() and .pop() unnecessarily clutter python DSA code, and are used all the time. Same for defaultdict, Counter and heapq.",
		lessons: [
			{
				id: 'push',
				title: 'Appending',
				note: '<code>stack &lt;- x</code> is <code>stack.append(x)</code>.',
				python: 'def solve(stack, x):\n    stack.append(x)\n    return stack',
				stub: 'def solve(stack, x)\n  # solution\n  pass',
				answer: 'def solve(stack, x)\n  stack <- x\n  stack',
				accept: [],
				hint: 'stack <- x',
				setup: 'stack = [1, 2]\nx = 3',
				probe: 'solve(stack, x)'
			},
			{
				id: 'pop',
				title: 'Popping',
				note: 'Popping is the single character <code>.</code>: <code>stack .</code> is <code>stack.pop()</code>. Note the space. <code>a.b</code> is still attribute access.',
				python: 'def solve(stack):\n    top = stack.pop()\n    return (top, stack)',
				stub: 'def solve(stack)\n  # solution\n  pass',
				answer: 'def solve(stack)\n  top = stack .\n  (top, stack)',
				accept: ['def solve(stack)\n  (stack ., stack)'],
				hint: 'stack .',
				setup: 'stack = [1, 2, 3]',
				probe: 'solve(stack)'
			},
			{
				id: 'drain',
				title: 'Popping in an expression',
				note: 'A pop is an expression, so it can go on the right of <code>+=</code>.',
				python: 'def solve(stack, total):\n    while stack:\n        total += stack.pop()\n    return total',
				stub: 'def solve(stack, total)\n  # solution\n  pass',
				answer: 'def solve(stack, total)\n  while stack\n    total += stack .\n  total',
				accept: [],
				hint: 'total += stack .',
				setup: 'stack = [1, 2, 3]\ntotal = 0',
				probe: 'solve(stack, total)'
			},
			{
				id: 'pop-two',
				title: 'Two pops',
				note: 'Two pops in one expression.',
				python: 'def solve(a, b):\n    total = a.pop() + b.pop()\n    return (total, a, b)',
				stub: 'def solve(a, b)\n  # solution\n  pass',
				answer: 'def solve(a, b)\n  total = a . + b .\n  (total, a, b)',
				accept: [],
				hint: 'a . + b .',
				setup: 'a = [1, 5]\nb = [2, 7]',
				probe: 'solve(a, b)'
			},
			{
				id: 'defaultdict',
				title: 'defaultdict',
				note: '<code>{:list}</code> is <code>defaultdict(list)</code>, <code>{:int}</code> is <code>defaultdict(int)</code>. No import.',
				python: 'from collections import defaultdict\n\ndef solve(u, v):\n    g = defaultdict(list)\n    g[u].append(v)\n    return dict(g)',
				stub: 'def solve(u, v)\n  # solution\n  pass',
				answer: 'def solve(u, v)\n  g = {:list}\n  g[u] <- v\n  dict g',
				accept: ['def solve(u, v)\n  g = {:list}\n  g[u] <- v\n  dict(g)'],
				hint: '{:list}, then <- to append.',
				setup: 'u = 1\nv = 2',
				probe: 'solve(u, v)'
			},
			{
				id: 'defaultdict-lambda',
				title: 'defaultdict with a lambda',
				note: 'The factory can be a lambda with no arguments: <code>{:() -&gt; [0, 0]}</code> is <code>defaultdict(lambda: [0, 0])</code>.',
				python: 'from collections import defaultdict\n\ndef solve(k):\n    pair = defaultdict(lambda: [0, 0])\n    pair[k][0] += 1\n    return dict(pair)',
				stub: 'def solve(k)\n  # solution\n  pass',
				answer: 'def solve(k)\n  pair = {:() -> [0, 0]}\n  pair[k][0] += 1\n  dict pair',
				accept: ['def solve(k)\n  pair = {:() -> [0, 0]}\n  pair[k][0] += 1\n  dict(pair)'],
				hint: '{:() -> [0, 0]}',
				setup: 'k = 7',
				probe: 'solve(k)'
			},
			{
				id: 'counter',
				title: 'Counter',
				note: '<code>counter(xs)</code> is <code>Counter(xs)</code>, <code>counter()</code> is <code>Counter()</code>. No import.',
				python: 'from collections import Counter\n\ndef solve(s):\n    cnt = Counter(s)\n    return sorted(cnt.items())',
				stub: 'def solve(s)\n  # solution\n  pass',
				answer: 'def solve(s)\n  cnt = counter s\n  sorted cnt.items()',
				accept: ['def solve(s)\n  cnt = counter(s)\n  sorted(cnt.items())'],
				hint: 'counter s',
				setup: "s = 'banana'",
				probe: 'solve(s)'
			},
			{
				id: 'heap',
				title: 'Heaps',
				note: '<code>heap(xs)</code> is a min-heap with push, pop, peek and len. <code>&lt;-</code> and <code>.</code> work on it too.',
				python: 'import heapq\n\ndef solve(xs):\n    h = []\n    for x in xs:\n        heapq.heappush(h, x)\n    smallest = heapq.heappop(h)\n    return (smallest, sorted(h))',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  h = heap xs\n  smallest = h .\n  (smallest, sorted h)',
				accept: ['def solve(xs)\n  h = heap xs\n  (h ., sorted h)', 'def solve(xs)\n  h = heap(xs)\n  smallest = h .\n  (smallest, sorted(h))', 'def solve(xs)\n  h = heap([])\n  for x in xs\n    h <- x\n  smallest = h .\n  (smallest, sorted h)'],
				hint: 'heap xs, then pop with the dot.',
				setup: 'xs = [5, 1, 4]',
				probe: 'solve(xs)'
			},
			{
				id: 'max-heap',
				title: 'Max heaps',
				note: '<code>heap(xs, type=max)</code> is a max-heap. No negating.',
				python: 'import heapq\n\ndef solve(xs):\n    h = [-x for x in xs]\n    heapq.heapify(h)\n    return -heapq.heappop(h)',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  heap(xs, type=max) .',
				accept: ['def solve(xs)\n  h = heap(xs, type=max)\n  h .'],
				hint: 'heap(xs, type=max), then pop it.',
				setup: 'xs = [5, 1, 4]',
				probe: 'solve(xs)'
			}
		]
	},
	{
		id: 'functions',
		title: 'Functions',
		blurb:
			'Types are written differently, an if can be the return value, and ret names the return variable.',
		lessons: [
			{
				id: 'list-type',
				title: 'Types',
				note: '<code>[T]</code> is <code>list[T]</code>, <code>{T}</code> is <code>set[T]</code>, <code>{K: V}</code> is <code>dict[K, V]</code>, <code>(A, B)</code> is <code>tuple[A, B]</code>. <code>char</code> is <code>str</code> and <code>none</code> is <code>None</code>. Any other name is passed through.',
				python: 'def total(xs: list[int]) -> int:\n    return sum(xs)',
				stub: 'def total(xs)\n  # solution\n  pass',
				answer: 'def total(xs: [int]) -> int\n  sum xs',
				accept: ['def total(xs: [int]) -> int\n  sum(xs)'],
				hint: '[int]',
				setup: 'xs = [3, 1, 2]',
				probe: 'total(xs)'
			},
			{
				id: 'more-types',
				title: 'Optional, dict and set types',
				note: '<code>T?</code> is <code>Optional[T]</code>. In a comprehension, unpacking a pair needs parentheses, same as in a for loop.',
				python: 'from typing import Optional\n\ndef keys_of(m: dict[str, int], t: Optional[int]) -> set[str]:\n    return {k for k, v in m.items() if v == t}',
				stub: 'def keys_of(m, t)\n  # solution\n  pass',
				answer: 'def keys_of(m: {str: int}, t: int?) -> {str}\n  {k for (k, v) in m.items() if v == t}',
				accept: [],
				hint: '{str: int}, int?, {str}',
				setup: "m = {'a': 1, 'b': 2, 'c': 1}",
				probe: 'sorted(keys_of(m, 1))',
				probeMu: 'sorted(Solution().keys_of(m, 1))'
			},
			{
				id: 'callable-type',
				title: 'Function types',
				note: '<code>A -&gt; B</code> is <code>Callable[[A], B]</code>, <code>(A, B) -&gt; C</code> takes two arguments. Keep the parentheses on <code>f(x)</code> inside the comprehension, otherwise <code>f x for x in xs</code> parses as <code>f(x for x in xs)</code>.',
				python: 'from typing import Callable\n\ndef apply(f: Callable[[int], int], xs: list[int]) -> list[int]:\n    return [f(x) for x in xs]',
				stub: 'def apply(f, xs)\n  # solution\n  pass',
				answer: 'def apply(f: int -> int, xs: [int]) -> [int]\n  [f(x) for x in xs]',
				accept: [],
				hint: 'f: int -> int',
				setup: 'xs = [3, 1, 2]\nneg = lambda x: -x',
				setupMu: 'xs = [3, 1, 2]\nneg = x -> -x',
				probe: 'apply(neg, xs)'
			},
			{
				id: 'if-arms',
				title: 'Returning from an if',
				note: 'If the last statement of a function is an <code>if</code>, the last line of each branch is returned.',
				python: 'def sign(x):\n    if x < 0:\n        return -1\n    elif x == 0:\n        return 0\n    else:\n        return 1',
				stub: 'def sign(x)\n  # solution\n  pass',
				answer: 'def sign(x)\n  if x < 0\n    -1\n  elif x == 0\n    0\n  else\n    1',
				accept: [],
				hint: 'Each branch is just its value.',
				setup: '',
				probe: '[sign(-3), sign(0), sign(9)]',
				probeMu: '[Solution().sign(-3), Solution().sign(0), Solution().sign(9)]'
			},
			{
				id: 'ret',
				title: 'ret',
				note: "<code>ret res = []</code> says <code>res</code> is the return variable. It's returned after the last line, or on a bare <code>return</code>.",
				python: 'def squares(n):\n    res = []\n    for i in range(n):\n        res.append(i * i)\n    return res',
				stub: 'def squares(n)\n  # solution\n  pass',
				answer: 'def squares(n)\n  ret res = []\n  for i in 0..<n\n    res <- i * i',
				accept: ['def squares(n)\n  [i * i for i in 0..<n]'],
				hint: 'ret res = [], then <- in the loop.',
				setup: '',
				probe: 'squares(5)'
			},
			{
				id: 'ret-two',
				title: 'ret with two variables',
				note: 'With <code>ret res, acc = [], 0</code>, the first name is the return variable. Only one <code>ret</code> per function, and not inside a loop or an if.',
				python: 'def running(xs):\n    res, acc = [], 0\n    for x in xs:\n        acc += x\n        res.append(acc)\n    return res',
				stub: 'def running(xs)\n  # solution\n  pass',
				answer: 'def running(xs)\n  ret res, acc = [], 0\n  for x in xs\n    acc += x\n    res <- acc',
				accept: [],
				hint: 'ret res, acc = [], 0',
				setup: 'xs = [3, 1, 2]',
				probe: 'running(xs)'
			},
			{
				id: 'yield',
				title: 'yield',
				note: '<code>yield x</code>, <code>yield a, b</code>, <code>yield from xs</code> and a bare <code>yield</code> are statements, as in python. A function whose body has one is a generator.',
				python: 'def evens(n):\n    for i in range(n):\n        if i % 2 == 0:\n            yield i',
				stub: 'def evens(n)\n  # solution\n  pass',
				answer: 'def evens(n)\n  for i in 0..<n\n    if even i\n      yield i',
				accept: ['def evens(n)\n  for i in 0..<n\n    if i % 2 == 0\n      yield i'],
				hint: 'for i in 0..<n, if even i, yield i.',
				setup: 'n = 7',
				probe: 'list(evens(n))',
				probeMu: 'list(Solution().evens(n))'
			},
			{
				id: 'as-list',
				title: '78. Subsets',
				note: 'A line <code>@f</code> above a <code>def</code> or a <code>memo</code> decorates it, as in python. <code>@as_list</code> is a helper: the function yields each answer when it finds it, and the caller receives the whole list. This is 78.',
				python: 'def subsets(nums: list[int]) -> list[list[int]]:\n    res = []\n    for mask in range(1 << len(nums)):\n        res.append([x for i, x in enumerate(nums) if mask >> i & 1])\n    return res',
				stub: 'def subsets(nums: [int]) -> [[int]]\n  # solution\n  pass',
				answer: '@as_list\ndef subsets(nums: [int]) -> [[int]]\n  for mask in 0..<(1 << len(nums))\n    yield [x for i, x in nums if mask >> i & 1]',
				accept: ['def subsets(nums: [int]) -> [[int]]\n  ret res = []\n  for mask in 0..<(1 << len(nums))\n    res <- [x for i, x in nums if mask >> i & 1]'],
				hint: '@as_list above the def, then yield one subset per mask in 0..<(1 << len(nums)).',
				setup: 'nums = [1, 2, 3]',
				probe: 'subsets(nums)'
			}
		]
	},
	{
		id: 'folds',
		title: 'Folds and scans',
		blurb:
			'Most loops in DSA code are just computing a sum, a max, a min or a count. Pydsa has a shorter way of writing those.',
		lessons: [
			{
				id: 'sum-fold',
				title: 'sum for',
				note: '<code>sum for x in xs: x * x</code> is <code>sum(x * x for x in xs)</code>. Same for <code>max</code>, <code>min</code> and <code>count</code>.',
				python: 'def solve(xs):\n    return sum(x * x for x in xs)',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  sum for x in xs: x * x',
				accept: [],
				hint: 'sum for x in xs: x * x',
				setup: 'xs = [3, 1, 2]',
				probe: 'solve(xs)'
			},
			{
				id: 'max-from',
				title: 'max from',
				note: "<code>from 0</code> is the starting value. For <code>max</code> and <code>min</code> it's also the <code>default=</code>. <code>if cond</code> goes before the colon.",
				python: 'def solve(xs):\n    return max((x for x in xs if x > 0), default=0)',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  max from 0 for x in xs if x > 0: x',
				accept: [],
				hint: 'max from 0 for x in xs if x > 0: x',
				setup: 'xs = [-3, 1, -2, 5]',
				probe: 'solve(xs)'
			},
			{
				id: 'count-fold',
				title: 'count for',
				note: '<code>count for x in xs if cond</code> is <code>sum(1 for x in xs if cond)</code>. A value after the colon is a second condition: <code>count for x in xs: x > 0</code> counts the items where it holds. <code>even(n)</code> and <code>odd(n)</code> are helpers.',
				python: 'def solve(xs):\n    return sum(1 for x in xs if x % 2 == 0)',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  count for x in xs if even x',
				accept: ['def solve(xs)\n  count for x in xs if x % 2 == 0', 'def solve(xs)\n  count for xs if even _', 'def solve(xs)\n  count for x in xs if even(x)'],
				hint: 'count for x in xs if even x',
				setup: 'xs = [3, 1, 2, 8]',
				probe: 'solve(xs)'
			},
			{
				id: 'fold-underscore',
				title: 'Folds with _',
				note: 'Like a loop, a fold can have no variable, and then the item is <code>_</code>.',
				python: 'def solve(tasks):\n    return sum(v["dur"] for v in tasks.values())',
				stub: 'def solve(tasks)\n  # solution\n  pass',
				answer: 'def solve(tasks)\n  sum for tasks.values(): _["dur"]',
				accept: ['def solve(tasks)\n  sum for v in tasks.values(): v["dur"]'],
				hint: 'sum for tasks.values(): _["dur"]',
				setup: "tasks = {'a': {'dur': 3}, 'b': {'dur': 4}}",
				probe: 'solve(tasks)'
			},
			{
				id: 'min-from-inf',
				title: 'min from inf',
				note: '<code>min from inf for xs: _</code> is <code>min(xs, default=math.inf)</code>.',
				python: 'import math\n\ndef solve(xs):\n    return min(xs, default=math.inf)',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  min from inf for xs: _',
				accept: ['def solve(xs)\n  min from inf for x in xs: x'],
				hint: 'min from inf for xs: _',
				setup: 'xs = []',
				probe: 'solve(xs)'
			},
			{
				id: 'scan',
				title: 'scan',
				note: '<code>scan(+, xs)</code> is <code>accumulate(xs)</code>. <code>scan(*, xs)</code> is <code>accumulate(xs, operator.mul)</code>, <code>scan(f, xs)</code> is <code>accumulate(xs, f)</code>.',
				python: 'from itertools import accumulate\n\ndef solve(xs):\n    return list(accumulate(xs))',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  list scan(+, xs)',
				accept: ['def solve(xs)\n  list(scan(+, xs))'],
				hint: 'list scan(+, xs)',
				setup: 'xs = [3, 1, 2]',
				probe: 'solve(xs)'
			},
			{
				id: 'scan-max',
				title: 'scan with max',
				note: '<code>scan(max, xs)</code> is <code>accumulate(xs, max)</code>.',
				python: 'from itertools import accumulate\n\ndef solve(xs):\n    return list(accumulate(xs, max))',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  list scan(max, xs)',
				accept: ['def solve(xs)\n  list(scan(max, xs))'],
				hint: 'list scan(max, xs)',
				setup: 'xs = [3, 1, 5, 2]',
				probe: 'solve(xs)'
			},
			{
				id: 'scan-reverse',
				title: 'scan in reverse',
				note: '<code>scan(max, xs, reverse=true)</code> is <code>list(accumulate(xs[::-1], max))[::-1]</code>, the running max of every suffix.',
				python: 'from itertools import accumulate\n\ndef solve(xs):\n    return list(accumulate(xs[::-1], max))[::-1]',
				stub: 'def solve(xs)\n  # solution\n  pass',
				answer: 'def solve(xs)\n  scan(max, xs, reverse=true)',
				accept: [],
				hint: 'scan(max, xs, reverse=true)',
				setup: 'xs = [3, 1, 5, 2]',
				probe: 'solve(xs)'
			},
			{
				id: 'decode-xor',
				title: '1720. Decode XORed Array',
				note: '1720 as one scan. The function can be a lambda.',
				python: 'def decode(encoded: list[int], first: int) -> list[int]:\n    res = [first]\n    for x in encoded:\n        res.append(res[-1] ^ x)\n    return res',
				stub: 'def decode(encoded: [int], first: int) -> [int]\n  # solution\n  pass',
				answer: 'def decode(encoded: [int], first: int) -> [int]\n  list scan((a, b) -> a ^ b, [first] + encoded)',
				accept: ['def decode(encoded: [int], first: int) -> [int]\n  list(scan((a, b) -> a ^ b, [first] + encoded))', 'def decode(encoded: [int], first: int) -> [int]\n  ret res = [first]\n  for encoded\n    res <- res[-1] ^ _'],
				hint: 'list scan((a, b) -> a ^ b, [first] + encoded)',
				setup: 'encoded = [1, 2, 3]\nfirst = 1',
				probe: 'decode(encoded, first)'
			},
			{
				id: 'trap',
				title: '42. Trapping Rain Water',
				note: '42 with two scans and a fold.',
				python: 'from itertools import accumulate\n\ndef trap(height: list[int]) -> int:\n    left = list(accumulate(height, max))\n    right = list(accumulate(height[::-1], max))[::-1]\n    return sum(min(l, r) - h for l, r, h in zip(left, right, height))',
				stub: 'def trap(height: [int]) -> int\n  # solution\n  pass',
				answer: 'def trap(height: [int]) -> int\n  sum for (l, r, h) in zip(scan(max, height), scan(max, height, reverse=true), height): min(l, r) - h',
				accept: [],
				hint: 'sum for (l, r, h) in zip(scan(max, height), scan(max, height, reverse=true), height): min(l, r) - h',
				setup: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
				probe: 'trap(height)'
			},
			{
				id: 'block-fold',
				title: 'Folds with a block',
				note: 'A fold can have a block instead of <code>: value</code>. The block runs once per item, and its last line is the value. This is 560, Subarray Sum Equals K.',
				python: 'from collections import Counter\nfrom itertools import accumulate\n\ndef subarraySum(nums: list[int], k: int) -> int:\n    cnt = Counter([0])\n    total = 0\n    for p in accumulate(nums):\n        total += cnt[p - k]\n        cnt[p] += 1\n    return total',
				stub: 'def subarraySum(nums: [int], k: int) -> int\n  # solution\n  pass',
				answer: 'def subarraySum(nums: [int], k: int) -> int\n  cnt = counter([0])\n  sum for p in scan(+, nums)\n    got = cnt[p - k]\n    cnt[p] += 1\n    got',
				accept: [],
				hint: 'sum for p in scan(+, nums), then a block: got = cnt[p - k], cnt[p] += 1, got.',
				setup: 'nums = [1, 2, 1, 2, 1]\nk = 3',
				probe: 'subarraySum(nums, k)'
			}
		]
	},
	{
		id: 'memo',
		title: 'Memo and search',
		blurb:
			'Memoised recursion and binary search on the answer. Both have a keyword. And or if, for the -1 at the end.',
		lessons: [
			{
				id: 'memo-one-line',
				title: 'memo',
				note: '<code>memo f(x) = expr</code> is <code>@cache</code> on a def. The function runs on a thread with a 256 MB stack and a raised recursion limit, so recursion depth of 10^4 and beyond is fine.',
				python: 'from functools import cache\n\ndef solve():\n    @cache\n    def fib(n):\n        return n if n < 2 else fib(n - 1) + fib(n - 2)\n    return fib(90)',
				stub: 'def solve()\n  # solution\n  pass',
				answer: 'def solve()\n  memo fib(n) = n if n < 2 else fib(n - 1) + fib(n - 2)\n  fib(90)',
				accept: [],
				hint: 'memo fib(n) = ...',
				setup: '',
				probe: 'solve()'
			},
			{
				id: 'memo-cases',
				title: 'memo with cases',
				note: 'A memo can have cases: <code>| guard -&gt; value</code>, tried in order, <code>| else -&gt;</code> last. This is 1143, Longest Common Subsequence.',
				python: 'from functools import cache\n\ndef longestCommonSubsequence(a: str, b: str) -> int:\n    @cache\n    def f(i, j):\n        if i == len(a) or j == len(b):\n            return 0\n        if a[i] == b[j]:\n            return 1 + f(i + 1, j + 1)\n        return max(f(i + 1, j), f(i, j + 1))\n    return f(0, 0)',
				stub: 'def longestCommonSubsequence(a: str, b: str) -> int\n  # solution\n  pass',
				answer: 'def longestCommonSubsequence(a: str, b: str) -> int\n  memo f(i, j) =\n    | i == len(a) or j == len(b) -> 0\n    | a[i] == b[j] -> 1 + f(i + 1, j + 1)\n    | else -> max(f(i + 1, j), f(i, j + 1))\n  f(0, 0)',
				accept: [],
				hint: 'memo f(i, j) = then three | lines, the last one | else, then f(0, 0).',
				setup: "a = 'abcde'\nb = 'ace'",
				probe: 'longestCommonSubsequence(a, b)'
			},
			{
				id: 'lis',
				title: '300. Longest Increasing Subsequence',
				note: '300. The body of a memo can be a fold.',
				python: 'from functools import cache\n\ndef lengthOfLIS(nums: list[int]) -> int:\n    @cache\n    def f(i):\n        return 1 + max((f(j) for j in range(i) if nums[j] < nums[i]), default=0)\n    return max(f(i) for i in range(len(nums)))',
				stub: 'def lengthOfLIS(nums: [int]) -> int\n  # solution\n  pass',
				answer: 'def lengthOfLIS(nums: [int]) -> int\n  memo f(i) = 1 + max from 0 for j in 0..<i if nums[j] < nums[i]: f(j)\n  max for i in 0..<len(nums): f(i)',
				accept: ['def lengthOfLIS(nums: [int]) -> int\n  memo f(i) = 1 + max from 0 for j in 0..<i if nums[j] < nums[i]: f(j)\n  max for i in range len nums: f(i)'],
				hint: 'memo f(i) = 1 + max from 0 for j in 0..<i if nums[j] < nums[i]: f(j)',
				setup: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
				probe: 'lengthOfLIS(nums)'
			},
			{
				id: 'or-if',
				title: 'or if',
				note: '<code>x or d if v</code> is x, or d when x equals v. <code>f(amount) or -1 if inf</code> reads "f(amount), or -1 if it is inf". x is evaluated once. This is 322, Coin Change.',
				python: 'import math\nfrom functools import cache\n\ndef coinChange(coins: list[int], amount: int) -> int:\n    @cache\n    def f(a):\n        if a == 0:\n            return 0\n        if a < 0:\n            return math.inf\n        return 1 + min(f(a - c) for c in coins)\n    t = f(amount)\n    return -1 if t == math.inf else t',
				stub: 'def coinChange(coins: [int], amount: int) -> int\n  # solution\n  pass',
				answer: 'def coinChange(coins: [int], amount: int) -> int\n  memo f(a) =\n    | a == 0 -> 0\n    | a < 0 -> inf\n    | else -> 1 + min for c in coins: f(a - c)\n  f(amount) or -1 if inf',
				accept: [],
				hint: 'memo f(a) = with three cases, then f(amount) or -1 if inf.',
				setup: 'coins = [1, 2, 5]\namount = 11',
				probe: 'coinChange(coins, amount)'
			},
			{
				id: 'memo-block',
				title: 'memo with a body',
				note: "<code>memo f(i)</code> without <code>=</code> opens a body, like a def. Use it when the cases don't fit in one expression each. It's still cached and still runs on the big stack.",
				python: 'from functools import cache\n\ndef solve(coins):\n    @cache\n    def ways(i):\n        if i == 0:\n            return 1\n        total = 0\n        for c in coins:\n            if c <= i:\n                total += ways(i - c)\n        return total\n    return ways(11)',
				stub: 'def solve(coins)\n  # solution\n  pass',
				answer: 'def solve(coins)\n  memo ways(i)\n    if i == 0\n      return 1\n    total = 0\n    for c in coins\n      if c <= i\n        total += ways(i - c)\n    return total\n  ways(11)',
				accept: ['def solve(coins)\n  memo ways(i) =\n    | i == 0 -> 1\n    | else -> sum for c in coins if c <= i: ways(i - c)\n  ways(11)'],
				hint: 'memo ways(i) without =, then the body as in a def.',
				setup: 'coins = [1, 2, 5]',
				probe: 'solve(coins)'
			},
			{
				id: 'first-true',
				title: 'first',
				note: "<code>first k in lo..hi if pred</code> is the smallest k in the range for which pred is true. pred has to be monotone: false, then true. It compiles to <code>bisect_left</code> with a key, so it's O(log n) calls to pred. If pred is never true you get one past the end of the range.",
				python: 'def solve(sq):\n    l, r = 0, 101\n    while l < r:\n        m = (l + r) // 2\n        if sq[m] >= 300:\n            r = m\n        else:\n            l = m + 1\n    return l',
				stub: 'def solve(sq)\n  # solution\n  pass',
				answer: 'def solve(sq)\n  first x in 0..100 if sq[x] >= 300',
				accept: [],
				hint: 'first x in 0..100 if sq[x] >= 300',
				setup: 'sq = [x * x for x in range(101)]',
				probe: 'solve(sq)'
			},
			{
				id: 'koko',
				title: '875. Koko Eating Bananas',
				note: '875. The predicate is a fold, in parentheses.',
				python: 'from bisect import bisect_left\n\ndef minEatingSpeed(piles: list[int], h: int) -> int:\n    hours = lambda k: sum(-(-p // k) for p in piles)\n    return 1 + bisect_left(range(1, max(piles) + 1), True, key=lambda k: hours(k) <= h)',
				stub: 'def minEatingSpeed(piles: [int], h: int) -> int\n  # solution\n  pass',
				answer: 'def minEatingSpeed(piles: [int], h: int) -> int\n  first k in 1..max(piles) if (sum for p in piles: ceil(p / k)) <= h',
				accept: [],
				hint: 'first k in 1..max(piles) if (sum for p in piles: ceil(p / k)) <= h',
				setup: 'piles = [3, 6, 7, 11]\nh = 8',
				probe: 'minEatingSpeed(piles, h)'
			}
		]
	},
	{
		id: 'grids',
		title: 'Grids, graphs and digits',
		blurb:
			'Helpers: grids, BFS, graphs, digits. When you call one, its source is included in the output, so the python still runs on leetcode.',
		lessons: [
			{
				id: 'cells',
				title: 'cells',
				note: 'A parameter typed <code>[[T]]</code> is wrapped in <code>Grid</code>, so <code>grid[p]</code> is <code>grid[i][j]</code> when <code>p = (i, j)</code>. <code>cells(grid)</code> yields every <code>(i, j)</code>, row by row. <code>cells(grid, eq=1)</code> only the cells holding 1.',
				python: 'def count_ones(grid: list[list[int]]) -> int:\n    total = 0\n    for i in range(len(grid)):\n        for j in range(len(grid[0])):\n            if grid[i][j] == 1:\n                total += 1\n    return total',
				stub: 'def count_ones(grid: [[int]]) -> int\n  # solution\n  pass',
				answer: 'def count_ones(grid: [[int]]) -> int\n  count for p in cells(grid) if grid[p] == 1',
				accept: ['def count_ones(grid: [[int]]) -> int\n  count for cells(grid) if grid[_] == 1', 'def count_ones(grid: [[int]]) -> int\n  count for cells(grid, eq=1)', 'def count_ones(grid: [[int]]) -> int\n  count for p in cells(grid, eq=1)'],
				hint: 'count for p in cells(grid) if grid[p] == 1',
				setup: 'grid = [[1, 0, 1], [0, 1, 1]]',
				probe: 'count_ones(grid)'
			},
			{
				id: 'nbrs',
				title: 'nbrs',
				note: '<code>nbrs(grid, i, j)</code> yields the on-grid neighbours: up, left, right, down. <code>nbrs(grid, p)</code> takes the cell as one pair. <code>dirs=</code> changes the directions, <code>eq=</code> keeps only the neighbours holding that value.',
				python: 'def neighbour_sum(grid: list[list[int]], i: int, j: int) -> int:\n    total = 0\n    for di, dj in ((-1, 0), (0, -1), (0, 1), (1, 0)):\n        ni, nj = i + di, j + dj\n        if 0 <= ni < len(grid) and 0 <= nj < len(grid[0]):\n            total += grid[ni][nj]\n    return total',
				stub: 'def neighbour_sum(grid: [[int]], i: int, j: int) -> int\n  # solution\n  pass',
				answer: 'def neighbour_sum(grid: [[int]], i: int, j: int) -> int\n  sum for p in nbrs(grid, i, j): grid[p]',
				accept: ['def neighbour_sum(grid: [[int]], i: int, j: int) -> int\n  sum for nbrs(grid, i, j): grid[_]', 'def neighbour_sum(grid: [[int]], i: int, j: int) -> int\n  sum for (a, b) in nbrs(grid, i, j): grid[a][b]'],
				hint: 'sum for p in nbrs(grid, i, j): grid[p]',
				setup: 'grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\ni = 1\nj = 1',
				probe: 'neighbour_sum(grid, i, j)'
			},
			{
				id: 'table-like',
				title: 'table and like',
				note: '<code>table(m, n)</code> is m rows of n zeros, <code>fill=</code> for another value. <code>like(grid, fill=inf)</code> is a new table the same size as grid. Both are plain lists of lists.',
				python: 'import math\n\ndef solve(grid, m, n):\n    dp = [[0] * n for _ in range(m)]\n    dist = [[math.inf] * len(grid[0]) for _ in grid]\n    return (dp, dist)',
				stub: 'def solve(grid, m, n)\n  # solution\n  pass',
				answer: 'def solve(grid, m, n)\n  dp = table(m, n)\n  dist = like(grid, fill=inf)\n  (dp, dist)',
				accept: ['def solve(grid, m, n)\n  (table(m, n), like(grid, fill=inf))'],
				hint: 'table(m, n) and like(grid, fill=inf)',
				setup: 'grid = [[1, 2], [3, 4]]\nm = 2\nn = 3',
				probe: 'solve(grid, m, n)'
			},
			{
				id: 'islands',
				title: '200. Number of Islands',
				note: '200 with <code>cells</code>, <code>components</code> and <code>nbrs</code>.',
				python: "def numIslands(grid: list[list[str]]) -> int:\n    m, n = len(grid), len(grid[0])\n    seen = set()\n\n    def dfs(i, j):\n        if not (0 <= i < m and 0 <= j < n) or grid[i][j] != '1' or (i, j) in seen:\n            return\n        seen.add((i, j))\n        for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            dfs(i + di, j + dj)\n\n    count = 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == '1' and (i, j) not in seen:\n                dfs(i, j)\n                count += 1\n    return count",
				stub: 'def numIslands(grid: [[char]]) -> int\n  # solution\n  pass',
				answer: "def numIslands(grid: [[char]]) -> int\n  land = set cells(grid, eq='1')\n  len components(land, p -> nbrs(grid, p))",
				accept: ["def numIslands(grid: [[char]]) -> int\n  land = {p for p in cells(grid) if grid[p] == '1'}\n  len(components(land, p -> nbrs(grid, p)))", "def numIslands(grid: [[char]]) -> int\n  len components(set cells(grid, eq='1'), p -> nbrs(grid, p))"],
				hint: "set cells(grid, eq='1'), then len components(land, p -> nbrs(grid, p)).",
				setup: "grid = [['1', '1', '0'], ['0', '0', '1'], ['1', '0', '1']]",
				probe: 'numIslands(grid)'
			},
			{
				id: 'adjacency',
				title: 'adjacency',
				note: '<code>adjacency(edges)</code> is the adjacency list. Directed by default, <code>directed=false</code> for both ways, <code>weighted=true</code> to keep the weights.',
				python: 'from collections import defaultdict\n\ndef solve(edges):\n    g = defaultdict(list)\n    for u, v in edges:\n        g[u].append(v)\n        g[v].append(u)\n    return [sorted(g[v]) for v in range(3)]',
				stub: 'def solve(edges)\n  # solution\n  pass',
				answer: 'def solve(edges)\n  g = adjacency(edges, directed=false)\n  [sorted(g[v]) for v in 0..2]',
				accept: [],
				hint: 'adjacency(edges, directed=false)',
				setup: 'edges = [(0, 1), (1, 2), (0, 2)]',
				probe: 'solve(edges)'
			},
			{
				id: 'levels',
				title: 'levels',
				note: '<code>levels(q)</code> pops a deque level by level and yields <code>(d, item)</code>. Items pushed onto q while it runs come out at the next level. Imports go at the top of the file, as in python.',
				python: 'from collections import deque\n\ndef distances(g: dict[int, list[int]], start: int) -> dict[int, int]:\n    q = deque([start])\n    dist = {start: 0}\n    while q:\n        x = q.popleft()\n        for y in g[x]:\n            if y not in dist:\n                dist[y] = dist[x] + 1\n                q.append(y)\n    return dist',
				stub: 'def distances(g: {int: [int]}, start: int) -> {int: int}\n  # solution\n  pass',
				answer: 'from collections import deque\n\ndef distances(g: {int: [int]}, start: int) -> {int: int}\n  q = deque([start])\n  ret dist = {start: 0}\n  for (d, x) in levels(q)\n    for y in g[x]\n      if y not in dist\n        dist[y] = d + 1\n        q <- y',
				accept: [],
				hint: 'ret dist, then for (d, x) in levels(q), push the unseen neighbours with <-.',
				setup: 'g = {0: [1, 2], 1: [3], 2: [3], 3: []}\nstart = 0',
				probe: 'distances(g, start)'
			},
			{
				id: 'network-delay',
				title: '743. Network Delay Time',
				note: '743. <code>graph(vs, edges)</code> is a weighted graph, <code>dijkstra(g, src)</code> is the distance to every vertex, inf if unreachable. <code>or -1 if inf</code> turns that into the -1 the problem wants.',
				python: 'import heapq\nimport math\nfrom collections import defaultdict\n\ndef networkDelayTime(times: list[list[int]], n: int, k: int) -> int:\n    adj = defaultdict(list)\n    for u, v, w in times:\n        adj[u].append((v, w))\n    d = {v: math.inf for v in range(1, n + 1)}\n    d[k] = 0\n    h = [(0, k)]\n    while h:\n        du, u = heapq.heappop(h)\n        if du > d[u]:\n            continue\n        for v, w in adj[u]:\n            if du + w < d[v]:\n                d[v] = du + w\n                heapq.heappush(h, (d[v], v))\n    t = max(d.values())\n    return t if t < math.inf else -1',
				stub: 'def networkDelayTime(times: [(int, int, int)], n: int, k: int) -> int\n  # solution\n  pass',
				answer: 'def networkDelayTime(times: [(int, int, int)], n: int, k: int) -> int\n  d = dijkstra(graph(1..n, times, directed=true), k)\n  t = max for v in 1..n: d[v]\n  t or -1 if inf',
				accept: ['def networkDelayTime(times: [(int, int, int)], n: int, k: int) -> int\n  d = dijkstra(graph(1..n, times, directed=true), k)\n  t = max for v in 1..n: d[v]\n  t if t < inf else -1'],
				hint: 'd = dijkstra(graph(1..n, times, directed=true), k), a max fold over 1..n, then t or -1 if inf.',
				setup: 'times = [(2, 1, 1), (2, 3, 1), (3, 4, 1)]\nn = 4\nk = 2',
				probe: 'networkDelayTime(times, n, k)'
			},
			{
				id: 'digits',
				title: 'to_digits and to_int',
				note: '<code>to_digits(num)</code> is the list of digits, most significant first. <code>to_int(ds)</code> is the inverse. Both take <code>base=</code>.',
				python: "def solve(num):\n    ds = [int(c) for c in str(num)]\n    flipped = int(''.join(map(str, ds[::-1])))\n    return (ds, flipped)",
				stub: 'def solve(num)\n  # solution\n  pass',
				answer: 'def solve(num)\n  ds = to_digits num\n  (ds, to_int ds[::-1])',
				accept: ['def solve(num)\n  ds = to_digits(num)\n  flipped = to_int(ds[::-1])\n  (ds, flipped)'],
				hint: 'to_digits num, then to_int ds[::-1]',
				setup: 'num = 1230',
				probe: 'solve(num)'
			},
			{
				id: 'bits',
				title: 'Bits',
				note: '<code>to_digits(n, base=2)</code> is the bits.',
				python: "def solve(n):\n    return bin(n).count('1')",
				stub: 'def solve(n)\n  # solution\n  pass',
				answer: 'def solve(n)\n  sum to_digits(n, base=2)',
				accept: ['def solve(n)\n  sum(to_digits(n, base=2))', 'def solve(n)\n  count for to_digits(n, base=2) if _ == 1'],
				hint: 'sum to_digits(n, base=2)',
				setup: 'n = 29',
				probe: 'solve(n)'
			},
			{
				id: 'largest-integer',
				title: '2231. Largest Number After Digit Swaps by Parity',
				note: '2231.',
				python: "def largestInteger(num: int) -> int:\n    ds = [int(c) for c in str(num)]\n    by = {r: sorted(d for d in ds if d % 2 == r) for r in (0, 1)}\n    out = []\n    for d in ds:\n        out.append(by[d % 2].pop())\n    return int(''.join(map(str, out)))",
				stub: 'def largestInteger(num: int) -> int\n  # solution\n  pass',
				answer: 'def largestInteger(num: int) -> int\n  ds = to_digits num\n  by = {r: sorted(d for d in ds if d % 2 == r) for r in 0..1}\n  to_int([by[d % 2] . for d in ds])',
				accept: ['def largestInteger(num: int) -> int\n  ds = to_digits(num)\n  by = {r: sorted(d for d in ds if d % 2 == r) for r in 0..1}\n  to_int([by[d % 2] . for d in ds])'],
				hint: 'to_digits, a dict comprehension over 0..1, then to_int of a list comprehension that pops.',
				setup: 'num = 65875',
				probe: 'largestInteger(num)'
			}
		]
	},
	{
		id: 'helpers',
		title: 'More helpers',
		blurb:
			'Grid BFS, the other binary searches, multisets and indegrees. Same as before, calling one pastes its source into the output.',
		lessons: [
			{
				id: 'grid-bfs',
				title: '542. 01 Matrix',
				note: '<code>grid_bfs(grid, sources)</code> is a multi-source BFS: the number of steps from the nearest source to every cell, -1 where none reaches. It returns a plain table. <code>sources</code> is a list of cells, so wrap <code>cells</code> in <code>list</code>.',
				python: 'from collections import deque\n\ndef updateMatrix(mat: list[list[int]]) -> list[list[int]]:\n    m, n = len(mat), len(mat[0])\n    dist = [[-1] * n for _ in range(m)]\n    q = deque()\n    for i in range(m):\n        for j in range(n):\n            if mat[i][j] == 0:\n                dist[i][j] = 0\n                q.append((i, j))\n    while q:\n        i, j = q.popleft()\n        for di, dj in ((-1, 0), (0, -1), (0, 1), (1, 0)):\n            ni, nj = i + di, j + dj\n            if 0 <= ni < m and 0 <= nj < n and dist[ni][nj] == -1:\n                dist[ni][nj] = dist[i][j] + 1\n                q.append((ni, nj))\n    return dist',
				stub: 'def updateMatrix(mat: [[int]]) -> [[int]]\n  # solution\n  pass',
				answer: 'def updateMatrix(mat: [[int]]) -> [[int]]\n  grid_bfs(mat, list cells(mat, eq=0))',
				accept: ['def updateMatrix(mat: [[int]]) -> [[int]]\n  grid_bfs(mat, list(cells(mat, eq=0)))'],
				hint: 'grid_bfs(mat, list cells(mat, eq=0))',
				setup: 'mat = [[0, 0, 0], [0, 1, 0], [1, 1, 1]]',
				probe: 'updateMatrix(mat)'
			},
			{
				id: 'rotting-oranges',
				title: '994. Rotting Oranges',
				note: '994. <code>ok=</code> is a test on the value of a cell: the BFS only enters cells that pass it.',
				python: 'from collections import deque\n\ndef orangesRotting(grid: list[list[int]]) -> int:\n    m, n = len(grid), len(grid[0])\n    dist = [[-1] * n for _ in range(m)]\n    q = deque()\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == 2:\n                dist[i][j] = 0\n                q.append((i, j))\n    while q:\n        i, j = q.popleft()\n        for di, dj in ((-1, 0), (0, -1), (0, 1), (1, 0)):\n            ni, nj = i + di, j + dj\n            if 0 <= ni < m and 0 <= nj < n and dist[ni][nj] == -1 and grid[ni][nj] == 1:\n                dist[ni][nj] = dist[i][j] + 1\n                q.append((ni, nj))\n    fresh = [dist[i][j] for i in range(m) for j in range(n) if grid[i][j] == 1]\n    return -1 if -1 in fresh else max(fresh, default=0)',
				stub: 'def orangesRotting(grid: [[int]]) -> int\n  # solution\n  pass',
				answer: 'def orangesRotting(grid: [[int]]) -> int\n  dist = grid_bfs(grid, list cells(grid, eq=2), ok=v -> v == 1)\n  fresh = [dist[i][j] for (i, j) in cells(grid, eq=1)]\n  -1 if -1 in fresh else max from 0 for fresh: _',
				accept: ['def orangesRotting(grid: [[int]]) -> int\n  dist = grid_bfs(grid, list cells(grid, eq=2), ok=v -> v == 1)\n  fresh = [dist[i][j] for (i, j) in cells(grid, eq=1)]\n  -1 if -1 in fresh else max(fresh, default=0)'],
				hint: 'grid_bfs(grid, list cells(grid, eq=2), ok=v -> v == 1), then collect dist over cells(grid, eq=1).',
				setup: 'grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]',
				probe: 'orangesRotting(grid)'
			},
			{
				id: 'shape-bounds-put',
				title: 'shape, in_bounds and put',
				note: '<code>shape(grid)</code> is <code>(rows, cols)</code>. <code>in_bounds(grid, i, j)</code> is the bounds check, and takes a pair too. <code>put(grid, at, v)</code> writes <code>v</code> into every cell in <code>at</code>.',
				python: 'def solve(grid, i, j, cs):\n    m, n = len(grid), len(grid[0])\n    ok = 0 <= i < m and 0 <= j < n\n    for a, b in cs:\n        grid[a][b] = 0\n    return (m, n, ok, grid)',
				stub: 'def solve(grid, i, j, cs)\n  # solution\n  pass',
				answer: 'def solve(grid, i, j, cs)\n  m, n = shape grid\n  ok = in_bounds(grid, i, j)\n  put(grid, cs, 0)\n  (m, n, ok, grid)',
				accept: ['def solve(grid, i, j, cs)\n  m, n = shape(grid)\n  ok = in_bounds(grid, i, j)\n  put(grid, cs, 0)\n  (m, n, ok, grid)'],
				hint: 'shape grid, in_bounds(grid, i, j), put(grid, cs, 0)',
				setup: 'grid = [[1, 2], [3, 4], [5, 6]]\ni = 2\nj = 1\ncs = [(0, 0), (2, 1)]',
				probe: 'solve(grid, i, j, cs)'
			},
			{
				id: 'pairs',
				title: 'pairs',
				note: '<code>pairs(n)</code> yields every <code>(i, j)</code> with <code>0 &lt;= i &lt; j &lt; n</code>. <code>triples(n)</code> does the same for three.',
				python: 'def solve(a, n):\n    return sum(a[i] * a[j] for i in range(n) for j in range(i + 1, n))',
				stub: 'def solve(a, n)\n  # solution\n  pass',
				answer: 'def solve(a, n)\n  sum for (i, j) in pairs n: a[i] * a[j]',
				accept: ['def solve(a, n)\n  sum for (i, j) in pairs(n): a[i] * a[j]'],
				hint: 'sum for (i, j) in pairs n: a[i] * a[j]',
				setup: 'a = [1, 2, 3]\nn = 3',
				probe: 'solve(a, n)'
			},
			{
				id: 'pairs-back',
				title: 'pairs back',
				note: "<code>pairs(n, back=true)</code> yields the same pairs grouped by the later index: for each j, every <code>(i, j)</code> with i &lt; j. That's the order of a 1-D dp where cell j looks back at every earlier cell. This is 300 bottom-up. <code>table(n, fill=1)</code> with one size is a list.",
				python: 'def lengthOfLIS(nums: list[int]) -> int:\n    n = len(nums)\n    dp = [1] * n\n    for i in range(n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)',
				stub: 'def lengthOfLIS(nums: [int]) -> int\n  # solution\n  pass',
				answer: 'def lengthOfLIS(nums: [int]) -> int\n  dp = table(len(nums), fill=1)\n  for (j, i) in pairs(len(nums), back=true)\n    if nums[j] < nums[i]\n      dp[i] = max(dp[i], dp[j] + 1)\n  max dp',
				accept: ['def lengthOfLIS(nums: [int]) -> int\n  dp = table(len nums, fill=1)\n  for (j, i) in pairs(len nums, back=true)\n    if nums[j] < nums[i]\n      dp[i] = max(dp[i], dp[j] + 1)\n  max(dp)'],
				hint: 'dp = table(len(nums), fill=1), then for (j, i) in pairs(len(nums), back=true).',
				setup: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
				probe: 'lengthOfLIS(nums)'
			},
			{
				id: 'row-col',
				title: 'row, col, set_row and set_col',
				note: '<code>row(grid, i)</code> is a copy of row i, <code>col(grid, j)</code> a copy of column j. <code>set_row(grid, i, v)</code> and <code>set_col(grid, j, v)</code> write v into every cell of it.',
				python: 'def solve(grid):\n    top = grid[0][:]\n    left = [r[0] for r in grid]\n    for j in range(len(grid[0])):\n        grid[1][j] = 0\n    for i in range(len(grid)):\n        grid[i][2] = 9\n    return (top, left, grid)',
				stub: 'def solve(grid)\n  # solution\n  pass',
				answer: 'def solve(grid)\n  top = row(grid, 0)\n  left = col(grid, 0)\n  set_row(grid, 1, 0)\n  set_col(grid, 2, 9)\n  (top, left, grid)',
				accept: [],
				hint: 'row(grid, 0), col(grid, 0), set_row(grid, 1, 0), set_col(grid, 2, 9)',
				setup: 'grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
				probe: 'solve(grid)'
			},
			{
				id: 'min-path-sum',
				title: '64. Minimum Path Sum',
				note: '64. <code>like(grid)</code> is zeros. <code>put</code>, <code>set_row</code> and <code>set_col</code> take an iterable too, one item per cell. <code>cells(grid, start=1)</code> skips the first row and column.',
				python: 'def minPathSum(grid: list[list[int]]) -> int:\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, n):\n        dp[0][j] = dp[0][j - 1] + grid[0][j]\n    for i in range(1, m):\n        dp[i][0] = dp[i - 1][0] + grid[i][0]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]\n    return dp[-1][-1]',
				stub: 'def minPathSum(grid: [[int]]) -> int\n  # solution\n  pass',
				answer: 'def minPathSum(grid: [[int]]) -> int\n  dp = like(grid)\n  set_row(dp, 0, scan(+, row(grid, 0)))\n  set_col(dp, 0, scan(+, col(grid, 0)))\n  for (r, c) in cells(grid, start=1)\n    dp[r][c] = min(dp[r-1][c], dp[r][c-1]) + grid[r][c]\n  dp[-1][-1]',
				accept: [],
				hint: 'like(grid), set_row and set_col with scan(+, ...), then a loop over cells(grid, start=1).',
				setup: 'grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]',
				probe: 'minPathSum(grid)'
			},
			{
				id: 'last-true',
				title: 'last_true',
				note: '<code>first k in lo..hi if pred</code> finds the smallest k. <code>last_true(lo, hi, ok)</code> is the other direction: the largest x in <code>lo..hi</code> with <code>ok(x)</code>, <code>lo - 1</code> if none. <code>first_false</code> and <code>last_false</code> exist too, and <code>first_true</code> is the function form of <code>first</code>.',
				python: 'def solve(sq):\n    lo, hi = 0, 100\n    while lo < hi:\n        m = (lo + hi + 1) // 2\n        if sq[m] <= 300:\n            lo = m\n        else:\n            hi = m - 1\n    return lo',
				stub: 'def solve(sq)\n  # solution\n  pass',
				answer: 'def solve(sq)\n  last_true(0, 100, x -> sq[x] <= 300)',
				accept: [],
				hint: 'last_true(0, 100, x -> sq[x] <= 300)',
				setup: 'sq = [x * x for x in range(101)]',
				probe: 'solve(sq)'
			},
			{
				id: 'ship-within-days',
				title: '1011. Capacity To Ship Packages Within D Days',
				note: "1011. <code>min_chunks(nums, cap)</code> is the fewest runs of nums each summing to at most cap, inf if one item alone exceeds it. It's the predicate of 410 and 1011.",
				python: 'from bisect import bisect_left\n\ndef shipWithinDays(weights: list[int], days: int) -> int:\n    def chunks(cap):\n        d, cur = 1, 0\n        for w in weights:\n            if cur + w > cap:\n                d, cur = d + 1, 0\n            cur += w\n        return d\n    lo = max(weights)\n    return lo + bisect_left(range(lo, sum(weights) + 1), True, key=lambda cap: chunks(cap) <= days)',
				stub: 'def shipWithinDays(weights: [int], days: int) -> int\n  # solution\n  pass',
				answer: 'def shipWithinDays(weights: [int], days: int) -> int\n  first cap in max weights..sum weights if min_chunks(weights, cap) <= days',
				accept: ['def shipWithinDays(weights: [int], days: int) -> int\n  first cap in max(weights)..sum(weights) if min_chunks(weights, cap) <= days'],
				hint: 'first cap in max weights..sum weights if min_chunks(weights, cap) <= days',
				setup: 'weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\ndays = 5',
				probe: 'shipWithinDays(weights, days)'
			},
			{
				id: 'multiset',
				title: 'Multiset',
				note: '<code>Multiset(xs)</code> is a <code>Counter</code> that drops a key when its count reaches 0, so <code>len</code> is the number of distinct items still present.',
				python: 'from collections import Counter\n\ndef solve(s, c):\n    cnt = Counter(s)\n    cnt[c] -= 1\n    if cnt[c] == 0:\n        del cnt[c]\n    return (len(cnt), sorted(cnt.items()))',
				stub: 'def solve(s, c)\n  # solution\n  pass',
				answer: 'def solve(s, c)\n  cnt = Multiset s\n  cnt[c] -= 1\n  (len cnt, sorted cnt.items())',
				accept: ['def solve(s, c)\n  cnt = Multiset(s)\n  cnt[c] -= 1\n  (len(cnt), sorted(cnt.items()))'],
				hint: 'Multiset s, then cnt[c] -= 1 and len cnt.',
				setup: "s = 'aab'\nc = 'b'",
				probe: 'solve(s, c)'
			},
			{
				id: 'indegrees',
				title: 'indegrees',
				note: '<code>indegrees(edges)</code> is the in-degree of every vertex, a <code>defaultdict</code> by default, a list with <code>n=</code> and <code>type=list</code>. It takes the same <code>reverse=</code> and <code>directed=</code> as <code>adjacency</code>.',
				python: 'def solve(edges, n):\n    indeg = [0] * n\n    for u, v in edges:\n        indeg[v] += 1\n    return indeg',
				stub: 'def solve(edges, n)\n  # solution\n  pass',
				answer: 'def solve(edges, n)\n  indegrees(edges, n=n, type=list)',
				accept: [],
				hint: 'indegrees(edges, n=n, type=list)',
				setup: 'edges = [(0, 1), (0, 2), (1, 2)]\nn = 3',
				probe: 'solve(edges, n)'
			}
		]
	},
	{
		id: 'file',
		title: 'Whole files',
		blurb:
			'What a whole pydsa file looks like: the imports, the constants, the class and the script.',
		lessons: [
			{
				id: 'solution-class',
				title: 'Constants and the class',
				note: 'Every <code>def</code> in a file becomes a method of <code>class Solution</code>, with <code>self</code> added. Assignments before the first def go above the class, as module-level constants. Imports go first. <code>extends Base</code> after the imports makes it <code>class Solution(Base)</code>.',
				python: 'MOD = 10**9 + 7\n\nclass Solution:\n    def power(self, b: int, e: int) -> int:\n        return pow(b, e, MOD)',
				stub: 'def power(b: int, e: int) -> int\n  # solution\n  pass',
				answer: 'MOD = 10**9 + 7\n\ndef power(b: int, e: int) -> int\n  pow(b, e, MOD)',
				accept: [],
				hint: 'MOD first, a blank line, then the def without self.',
				setup: '',
				probe: 'Solution().power(2, 100)',
				probeMu: 'Solution().power(2, 100)'
			},
			{
				id: 'script',
				title: 'Scripts',
				note: 'Statements after the last def are a script: they run after the class, at the top level. A def in the script is a plain function, not a method. This is where the tests go.',
				python: 'class Solution:\n    def sq(self, x: int) -> int:\n        return x * x\n\nprint(Solution().sq(3))',
				stub: 'def sq(x: int) -> int\n  # solution\n  pass',
				answer: 'def sq(x: int) -> int\n  x * x\n\nprint Solution().sq(3)',
				accept: ['def sq(x: int) -> int\n  x * x\n\nprint(Solution().sq(3))'],
				hint: 'sq as a def, then print Solution().sq(3) at the top level.',
				setup: '',
				probe: 'Solution().sq(4)',
				probeMu: 'Solution().sq(4)'
			}
		]
	}
];

export const lessonCount = levels.reduce((n, l) => n + l.lessons.length, 0);
