"""What the tutorial's worker runs in Pyodide: transpile a lesson's mu and
run a program, catching its output. The transpiler's `deep` helper runs a
memo on a thread with a big stack, and Pyodide has no threads, so it is
swapped for a plain call with a raised recursion limit."""

import io
import sys
import traceback
from contextlib import redirect_stdout

import mu

mu.HELPERS["deep"] = ([], [], "def deep(fn):\n    return fn()")
sys.setrecursionlimit(20000)


def transpile(src):
    return mu.transpile(src)


def run(program):
    """Runs Python; returns (stdout, error). error is '' when it ran clean."""
    out = io.StringIO()
    try:
        with redirect_stdout(out):
            exec(compile(program, "<solution>", "exec"), {"__name__": "__main__"})
        return out.getvalue(), ""
    except BaseException as e:  # noqa: BLE001
        tb = traceback.format_exception_only(type(e), e)
        return out.getvalue(), "".join(tb).strip()
