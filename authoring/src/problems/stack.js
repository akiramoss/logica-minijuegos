module.exports = [
{
  id: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy",
  description: `<p>The string <code>s</code> contains only the characters <code>( ) { } [ ]</code>. It is <b>valid</b> when every opening bracket is closed by the same type of bracket, and brackets close in the correct order.</p><p>Return <code>true</code> if <code>s</code> is valid.</p>`,
  constraints: ["1 ≤ s.length ≤ 10⁴"],
  hint: "Push opening brackets on a stack. A closing bracket must match the top of the stack. What must the stack look like at the end?",
  method: "isValid", params: [{ name: "s", type: "String" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')'); else if (c == '[') st.push(']'); else if (c == '{') st.push('}');
            else if (st.isEmpty() || st.pop() != c) return false;
        }
        return st.isEmpty();
    }
}`,
  tests: [
    { input: ["()[]{}"], expected: true },
    { input: ["(]"], expected: false },
    { input: ["{[()]}"], expected: true },
    { input: ["(("], expected: false },
    { input: ["]"], expected: false },
    { input: ["([)]"], expected: false }
  ]
},
{
  id: "baseball-game", title: "Baseball Game", difficulty: "Easy",
  description: `<p>You keep score for a strange game. Each entry of <code>ops</code> is one of:</p><ul><li>an integer <code>x</code> — record a new score of x</li><li><code>"+"</code> — record the sum of the previous two scores</li><li><code>"D"</code> — record double the previous score</li><li><code>"C"</code> — cancel (remove) the previous score</li></ul><p>Return the sum of all scores still recorded at the end. Every operation is guaranteed to be valid.</p>`,
  constraints: ["1 ≤ ops.length ≤ 1000"],
  hint: "A stack of scores fits perfectly: each operation only looks at (or removes) the most recent entries.",
  method: "calPoints", params: [{ name: "ops", type: "String[]" }], returnType: "int",
  solution: `class Solution {
    public int calPoints(String[] ops) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String o : ops) {
            if (o.equals("+")) { int a = st.pop(), b = st.peek(); st.push(a); st.push(a + b); }
            else if (o.equals("D")) st.push(2 * st.peek());
            else if (o.equals("C")) st.pop();
            else st.push(Integer.parseInt(o));
        }
        int s = 0; for (int x : st) s += x; return s;
    }
}`,
  tests: [
    { input: [["5", "2", "C", "D", "+"]], expected: 30, explain: "Scores: [5] → [5,2] → [5] → [5,10] → [5,10,15]. Sum = 30." },
    { input: [["5", "-2", "4", "C", "D", "9", "+", "+"]], expected: 27 },
    { input: [["1", "C"]], expected: 0 },
    { input: [["3"]], expected: 3 },
    { input: [["2", "D", "D", "+"]], expected: 26 }
  ]
},
{
  id: "min-stack", title: "Min Stack", difficulty: "Medium",
  description: `<p>Design a stack that, besides the usual operations, can return its <b>minimum</b> element in constant time. Implement class <code>MinStack</code>:</p><ul><li><code>MinStack()</code> creates an empty stack</li><li><code>void push(int val)</code></li><li><code>void pop()</code> removes the top element</li><li><code>int top()</code> returns the top element</li><li><code>int getMin()</code> returns the smallest element in the stack</li></ul><p>All four methods must run in O(1). <code>pop</code>, <code>top</code> and <code>getMin</code> are only called on non-empty stacks.</p><p class="note">Tests list the calls made and the value each one returns (<code>null</code> for void methods).</p>`,
  constraints: ["Up to 3·10⁴ calls"],
  hint: "Alongside each value, store the minimum of the stack at the moment it was pushed (a second stack, or pairs).",
  design: { className: "MinStack", ctor: [], ctorNames: [], methods: {
    push: { params: ["int"], names: ["val"], ret: "void" }, pop: { params: [], ret: "void" },
    top: { params: [], ret: "int" }, getMin: { params: [], ret: "int" } } },
  solution: `class MinStack {
    private final Deque<int[]> st = new ArrayDeque<>();
    public MinStack() {}
    public void push(int val) { st.push(new int[]{val, st.isEmpty() ? val : Math.min(val, st.peek()[1])}); }
    public void pop() { st.pop(); }
    public int top() { return st.peek()[0]; }
    public int getMin() { return st.peek()[1]; }
}`,
  tests: [
    { ops: ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], args: [[], [-2], [0], [-3], [], [], [], []], expected: [null, null, null, null, -3, null, 0, -2] },
    { ops: ["MinStack", "push", "getMin", "top"], args: [[], [7], [], []], expected: [null, null, 7, 7] },
    { ops: ["MinStack", "push", "push", "push", "getMin", "pop", "getMin"], args: [[], [2], [2], [3], [], [], []], expected: [null, null, null, null, 2, null, 2] },
    { ops: ["MinStack", "push", "push", "getMin", "pop", "getMin", "push", "getMin", "top"], args: [[], [5], [1], [], [], [], [8], [], []], expected: [null, null, null, 1, null, 5, null, 5, 8] }
  ]
},
{
  id: "eval-rpn", title: "Evaluate Reverse Polish Notation", difficulty: "Medium",
  description: `<p>An arithmetic expression is written in <b>Reverse Polish Notation</b>: operators come <i>after</i> their two operands, e.g. <code>["2","1","+","3","*"]</code> means <code>(2 + 1) * 3</code>. Evaluate <code>tokens</code> and return the result.</p><p>Operators are <code>+ - * /</code>; division truncates toward zero (like Java's <code>/</code> on ints). The expression is always valid and never divides by zero.</p>`,
  constraints: ["1 ≤ tokens.length ≤ 10⁴", "Intermediate results fit in an int"],
  hint: "Numbers go on a stack. An operator pops two values — careful: the first one popped is the RIGHT operand.",
  method: "evalRPN", params: [{ name: "tokens", type: "String[]" }], returnType: "int",
  solution: `class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String t : tokens) {
            switch (t) {
                case "+": st.push(st.pop() + st.pop()); break;
                case "*": st.push(st.pop() * st.pop()); break;
                case "-": { int b = st.pop(), a = st.pop(); st.push(a - b); break; }
                case "/": { int b = st.pop(), a = st.pop(); st.push(a / b); break; }
                default: st.push(Integer.parseInt(t));
            }
        }
        return st.pop();
    }
}`,
  tests: [
    { input: [["2", "1", "+", "3", "*"]], expected: 9 },
    { input: [["4", "13", "5", "/", "+"]], expected: 6 },
    { input: [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], expected: 22 },
    { input: [["42"]], expected: 42 },
    { input: [["7", "-3", "/"]], expected: -2 },
    { input: [["3", "8", "-"]], expected: -5 }
  ]
},
{
  id: "generate-parentheses", title: "Generate Parentheses", difficulty: "Medium",
  description: `<p>Given <code>n</code>, return <b>every</b> string of <code>n</code> pairs of parentheses that is well-formed (balanced). Any order is accepted.</p>`,
  constraints: ["1 ≤ n ≤ 8"],
  hint: "Build strings character by character. You may add '(' while you have opens left, and ')' only when it wouldn't close more than you've opened.",
  method: "generateParenthesis", params: [{ name: "n", type: "int" }], returnType: "List<String>", compare: "unordered",
  solution: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> r = new ArrayList<>(); go(r, new StringBuilder(), 0, 0, n); return r;
    }
    private void go(List<String> r, StringBuilder b, int open, int close, int n) {
        if (b.length() == 2 * n) { r.add(b.toString()); return; }
        if (open < n) { b.append('('); go(r, b, open + 1, close, n); b.deleteCharAt(b.length() - 1); }
        if (close < open) { b.append(')'); go(r, b, open, close + 1, n); b.deleteCharAt(b.length() - 1); }
    }
}`,
  tests: [
    { input: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] },
    { input: [1], expected: ["()"] },
    { input: [2], expected: ["(())", "()()"] },
    { input: [4], expected: ["(((())))", "((()()))", "((())())", "((()))()", "(()(()))", "(()()())", "(()())()", "(())(())", "(())()()", "()((()))", "()(()())", "()(())()", "()()(())", "()()()()"] }
  ]
},
{
  id: "daily-temperatures", title: "Daily Temperatures", difficulty: "Medium",
  description: `<p><code>temperatures[i]</code> is the temperature on day <code>i</code>. For each day, return how many days you must wait for a <b>strictly warmer</b> day, or <code>0</code> if no warmer day comes.</p>`,
  constraints: ["1 ≤ temperatures.length ≤ 10⁵"],
  hint: "Keep a stack of days still waiting for a warmer day (their temperatures decrease from bottom to top). Today resolves every waiting day that is colder.",
  method: "dailyTemperatures", params: [{ name: "temperatures", type: "int[]" }], returnType: "int[]",
  solution: `class Solution {
    public int[] dailyTemperatures(int[] t) {
        int[] r = new int[t.length]; Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < t.length; i++) {
            while (!st.isEmpty() && t[st.peek()] < t[i]) { int j = st.pop(); r[j] = i - j; }
            st.push(i);
        }
        return r;
    }
}`,
  tests: [
    { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
    { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    { input: [[30, 60, 90]], expected: [1, 1, 0] },
    { input: [[50, 50, 50]], expected: [0, 0, 0] },
    { input: [[80, 70, 60, 90]], expected: [3, 2, 1, 0] }
  ]
},
{
  id: "car-fleet", title: "Car Fleet", difficulty: "Medium",
  description: `<p><code>n</code> cars drive along a one-lane road toward a destination at mile <code>target</code>. Car <code>i</code> starts at <code>position[i]</code> with constant <code>speed[i]</code>. A car can never pass another: when it catches up, it slows down and they drive together as a <b>fleet</b>.</p><p>Catching up exactly at the destination still counts as one fleet. Return how many fleets arrive at the destination.</p>`,
  constraints: ["1 ≤ n ≤ 10⁵", "0 ≤ position[i] < target, all positions distinct"],
  hint: "Sort cars by position, closest to the target first. Compute each car's arrival time; a car that would arrive no later than the fleet in front of it joins that fleet.",
  method: "carFleet", params: [{ name: "target", type: "int" }, { name: "position", type: "int[]" }, { name: "speed", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length; Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> position[b] - position[a]);
        int fleets = 0; double slowest = 0;
        for (int i : idx) {
            double t = (double) (target - position[i]) / speed[i];
            if (t > slowest) { fleets++; slowest = t; }
        }
        return fleets;
    }
}`,
  tests: [
    { input: [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]], expected: 3 },
    { input: [10, [3], [3]], expected: 1 },
    { input: [100, [0, 2, 4], [4, 2, 1]], expected: 1 },
    { input: [10, [0, 5], [1, 1]], expected: 2 },
    { input: [20, [6, 2, 17], [3, 9, 2]], expected: 2 }
  ]
},
{
  id: "largest-rectangle-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard",
  description: `<p><code>heights</code> describes a histogram whose bars are all 1 unit wide. Return the area of the <b>largest rectangle</b> that fits entirely inside the histogram.</p>`,
  constraints: ["1 ≤ heights.length ≤ 10⁵", "0 ≤ heights[i] ≤ 10⁴"],
  hint: "For each bar, the widest rectangle of its height extends until the first shorter bar on each side. A stack of increasing heights finds those boundaries in one pass.",
  method: "largestRectangleArea", params: [{ name: "heights", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int largestRectangleArea(int[] h) {
        Deque<Integer> st = new ArrayDeque<>(); int best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = i == h.length ? 0 : h[i];
            while (!st.isEmpty() && h[st.peek()] >= cur) {
                int height = h[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }
}`,
  tests: [
    { input: [[2, 1, 5, 6, 2, 3]], expected: 10, explain: "Bars 5 and 6 form a 5 × 2 rectangle." },
    { input: [[2, 4]], expected: 4 },
    { input: [[0]], expected: 0 },
    { input: [[3, 3, 3]], expected: 9 },
    { input: [[6, 2, 5, 4, 5, 1, 6]], expected: 12 }
  ]
}
];
