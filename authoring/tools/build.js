// Builds data/problems.json: release order (Easy → Medium → Hard,
// topic by topic), weekly batches, starter code, examples. Solutions are excluded.
const fs = require("fs"), path = require("path");
const { loadProblems, TOPICS } = require("./load.js");
const S = require("../../js/starter.js");

const CONFIG = { startDate: "2026-11-09", perWeek: 5 };
const RANK = { Easy: 0, Medium: 1, Hard: 2 };

const ps = loadProblems().sort((a, b) =>
  RANK[a.difficulty] - RANK[b.difficulty] || a.topicIndex - b.topicIndex || a.topicOrder - b.topicOrder);

const out = ps.map((p, i) => {
  const q = {
    id: p.id, n: i + 1, week: Math.floor(i / CONFIG.perWeek) + 1,
    title: p.title, topic: p.topic, difficulty: p.difficulty,
    description: p.description, constraints: p.constraints || [], hint: p.hint,
    starter: S.starter(p), compare: p.compare || "exact", tests: p.tests
  };
  for (const k of ["method", "params", "returnType", "outputArg", "design"]) if (p[k] !== undefined) q[k] = p[k];
  return q;
});

const data = { config: Object.assign({ total: out.length, topics: TOPICS.map(t => t[1]) }, CONFIG), problems: out };
fs.mkdirSync(path.join(__dirname, "..", "..", "data"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "..", "..", "data", "problems.json"), JSON.stringify(data));
console.log(`Wrote ${out.length} problems, ${Math.ceil(out.length / CONFIG.perWeek)} weeks`);
for (let w = 1; w <= 3; w++) console.log("Week " + w + ": " + out.filter(p => p.week === w).map(p => p.title).join(", "));
