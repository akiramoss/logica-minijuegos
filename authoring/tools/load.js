// Loads all problem modules in topic order and assigns release order/weeks.
const path = require("path");
const TOPICS = [
  ["arrays", "Arrays & Hashing"], ["two-pointers", "Two Pointers"], ["sliding-window", "Sliding Window"],
  ["stack", "Stack"], ["binary-search", "Binary Search"], ["linked-list", "Linked List"],
  ["trees", "Trees"], ["tries", "Tries"], ["heap", "Heap / Priority Queue"],
  ["backtracking", "Backtracking"], ["graphs", "Graphs"], ["dp", "Dynamic Programming"]
];
function loadProblems() {
  const all = [];
  TOPICS.forEach(([file, name], ti) => {
    const f = path.join(__dirname, "..", "src", "problems", file + ".js"); if (!require("fs").existsSync(f)) return;
    const list = require(path.join(__dirname, "..", "src", "problems", file + ".js"));
    list.forEach((p, k) => all.push(Object.assign({ topic: name, topicIndex: ti, topicOrder: k }, p)));
  });
  return all;
}
module.exports = { loadProblems, TOPICS };
