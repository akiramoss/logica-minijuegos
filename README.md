# DSA Weekly — 100 Java problems, 5 new every Monday

Live site: https://akiramoss.github.io/logica-minijuegos/

A LeetCode-style practice site. Pick a problem, read it on the left, write Java on the right and press **Run tests**. Java compiles and runs inside your browser (javac + JVM in WebAssembly via [CheerpJ](https://cheerpj.com)), so there's no server and nothing to install.

- **100 problems** across 12 topics: Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search, Linked List, Trees, Tries, Heap, Backtracking, Graphs and Dynamic Programming (34 easy, 52 medium, 14 hard).
- **Weekly unlocks.** 5 problems unlock every Monday from 9 Nov 2026, all easy problems first, then medium, then hard (20 weeks). The site works out what's unlocked from the date, so nothing has to be published each week.
- **Progress** (solved problems and your code) is saved in the browser's localStorage.

## Layout

| Path | What |
|---|---|
| `index.html`, `css/`, `js/` | The site (`js/harness.js` builds the Java test runner, `js/runner.js` talks to CheerpJ) |
| `data/problems.json` | Generated problem data (no reference solutions) |
| `vendor/codemirror/` | Code editor (CodeMirror 5, MIT) |
| `authoring/src/problems/*.js` | Problem sources: statement, signature, tests **and reference solution** |
| `authoring/tools/` | `verify.js` (real JDK check), `build.js` (generates `data/problems.json`), `ui_test.py` (Playwright end-to-end test) |

## Adding or editing a problem

```bash
cd authoring
node tools/verify.js            # every reference passes all tests; every starter fails at least one
node tools/build.js             # regenerate ../data/problems.json
python3 tools/ui_test.py        # optional: end-to-end UI test with Playwright
```

Requires Node 18+ and JDK 17+.

Built with CheerpJ (free Community licence for personal and non-commercial projects).
