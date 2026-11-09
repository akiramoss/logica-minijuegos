// Verifies every problem with a real JDK:
//  - reference solution passes ALL tests
//  - generated starter code compiles and FAILS at least one test
//  - schema sanity checks
// Usage: node tools/verify.js [problemIdFilter]
const fs = require("fs"), path = require("path"), os = require("os");
const { execFile } = require("child_process");
const H = require("../../js/harness.js");
const S = require("../../js/starter.js");
const { loadProblems } = require("./load.js");

const filter = process.argv[2];
const problems = loadProblems().filter(p => !filter || p.id.includes(filter));
const work = fs.mkdtempSync(path.join(os.tmpdir(), "dsa-verify-"));

function run(cmd, args, cwd, timeout) {
  return new Promise(res => execFile(cmd, args, { cwd, timeout, maxBuffer: 1 << 24 }, (err, stdout, stderr) =>
    res({ code: err ? (err.code ?? 1) : 0, killed: err && err.killed, stdout, stderr })));
}

async function exec(p, code, tag) {
  const dir = path.join(work, p.id + "-" + tag);
  fs.mkdirSync(dir, { recursive: true });
  const prog = H.buildProgram(p, code, p.tests);
  fs.writeFileSync(path.join(dir, "Main.java"), prog.source);
  const c = await run("javac", ["-nowarn", "-d", ".", "Main.java"], dir, 120000);
  if (c.code !== 0) return { compileError: c.stderr };
  const r = await run("java", ["-Xss64m", "-cp", ".", "Main"], dir, 20000);
  const parsed = H.parseOutput(r.stdout);
  return { parsed, grades: H.grade(p, p.tests, parsed), stderr: r.stderr, killed: r.killed };
}

const VALID_DIFF = ["Easy", "Medium", "Hard"];
function schema(p) {
  const e = [];
  for (const k of ["id", "title", "topic", "difficulty", "description", "solution", "tests", "hint"]) if (!p[k]) e.push("missing " + k);
  if (!VALID_DIFF.includes(p.difficulty)) e.push("bad difficulty");
  if (!p.design && (!p.method || !p.params || !p.returnType)) e.push("missing signature");
  if (p.tests && p.tests.length < 4) e.push("fewer than 4 tests");
  if (p.tests) p.tests.forEach((t, i) => {
    if (!("expected" in t)) e.push("test " + i + " missing expected");
    if (!p.design && (!t.input || t.input.length !== p.params.length)) e.push("test " + i + " input arity");
    if (p.design && (!t.ops || t.ops.length !== t.args.length || t.ops.length !== t.expected.length)) e.push("test " + i + " design arity");
  });
  return e;
}

(async () => {
  const ids = new Set(); let failures = 0; const queue = problems.slice(); const report = [];
  for (const p of problems) { if (ids.has(p.id)) { console.log("DUPLICATE id " + p.id); failures++; } ids.add(p.id); }
  async function worker() {
    while (queue.length) {
      const p = queue.shift(); const errs = schema(p);
      if (!errs.length) {
        const ref = await exec(p, p.solution, "ref");
        if (ref.compileError) errs.push("reference does not compile:\n" + ref.compileError);
        else {
          ref.grades.forEach((g, i) => { if (g.status !== "pass") errs.push(`ref test ${i}: ${g.status} got=${JSON.stringify(g.actual ?? g.error)} expected=${JSON.stringify(p.tests[i].expected)}`); });
          if (ref.killed) errs.push("reference timed out");
        }
        const st = await exec(p, S.starter(p), "starter");
        if (st.compileError) errs.push("starter does not compile:\n" + st.compileError);
        else if (st.grades.every(g => g.status === "pass")) errs.push("starter passes all tests (tests too weak)");
      }
      if (errs.length) { failures++; report.push(`✗ ${p.id}\n  ` + errs.join("\n  ")); }
      else report.push(`✓ ${p.id}`);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, os.cpus().length) }, worker));
  report.sort().forEach(l => console.log(l));
  console.log(`\n${problems.length} problems checked, ${failures} with problems`);
  process.exit(failures ? 1 : 0);
})();
