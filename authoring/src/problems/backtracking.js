module.exports = [
{
  id: "subsets", title: "Subsets", difficulty: "Medium",
  description: `<p>Given an array of <b>distinct</b> integers, return all possible subsets (the power set), including the empty set. No duplicate subsets; any order is accepted (for the subsets and the values inside them).</p>`,
  constraints: ["1 ≤ nums.length ≤ 10", "Values are distinct"],
  hint: "For each element there are two choices: include it or not. Recurse through the array making that choice, and record the current subset at every leaf.",
  method: "subsets", params: [{ name: "nums", type: "int[]" }], returnType: "List<List<Integer>>", compare: "unorderedDeep",
  solution: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> r = new ArrayList<>(); go(nums, 0, new ArrayList<>(), r); return r;
    }
    private void go(int[] a, int i, List<Integer> cur, List<List<Integer>> r) {
        if (i == a.length) { r.add(new ArrayList<>(cur)); return; }
        cur.add(a[i]); go(a, i + 1, cur, r); cur.remove(cur.size() - 1);
        go(a, i + 1, cur, r);
    }
}`,
  tests: [
    { input: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
    { input: [[0]], expected: [[], [0]] },
    { input: [[5, -1]], expected: [[], [5], [-1], [5, -1]] },
    { input: [[4, 1, 7, 2]], expected: [[], [4], [1], [7], [2], [4, 1], [4, 7], [4, 2], [1, 7], [1, 2], [7, 2], [4, 1, 7], [4, 1, 2], [4, 7, 2], [1, 7, 2], [4, 1, 7, 2]] }
  ]
},
{
  id: "combination-sum", title: "Combination Sum", difficulty: "Medium",
  description: `<p>Given <b>distinct</b> positive <code>candidates</code> and a <code>target</code>, return every unique combination of candidates that adds up to <code>target</code>. The same candidate may be used <b>any number of times</b>.</p><p>Two combinations are the same if they use the same numbers the same number of times. Any order is accepted.</p>`,
  constraints: ["1 ≤ candidates.length ≤ 30", "2 ≤ candidates[i] ≤ 40", "1 ≤ target ≤ 40"],
  hint: "Backtrack with a start index: at index i you may take candidates[i] again (stay at i) or move on to i + 1. Never look back, so you don't produce the same combination in two orders.",
  method: "combinationSum", params: [{ name: "candidates", type: "int[]" }, { name: "target", type: "int" }], returnType: "List<List<Integer>>", compare: "unorderedDeep",
  solution: `class Solution {
    public List<List<Integer>> combinationSum(int[] c, int target) {
        List<List<Integer>> r = new ArrayList<>(); go(c, 0, target, new ArrayList<>(), r); return r;
    }
    private void go(int[] c, int i, int left, List<Integer> cur, List<List<Integer>> r) {
        if (left == 0) { r.add(new ArrayList<>(cur)); return; }
        if (i == c.length || left < 0) return;
        cur.add(c[i]); go(c, i, left - c[i], cur, r); cur.remove(cur.size() - 1);
        go(c, i + 1, left, cur, r);
    }
}`,
  tests: [
    { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
    { input: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
    { input: [[2], 1], expected: [] },
    { input: [[3, 4], 12], expected: [[3, 3, 3, 3], [4, 4, 4]] },
    { input: [[5, 10], 10], expected: [[5, 5], [10]] }
  ]
},
{
  id: "permutations", title: "Permutations", difficulty: "Medium",
  description: `<p>Given an array of <b>distinct</b> integers, return all of its permutations (every possible ordering). The permutations may be listed in any order.</p>`,
  constraints: ["1 ≤ nums.length ≤ 6", "Values are distinct"],
  hint: "Build each permutation position by position, marking which values are already used. Undo the choice after the recursive call returns.",
  method: "permute", params: [{ name: "nums", type: "int[]" }], returnType: "List<List<Integer>>", compare: "unordered",
  solution: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> r = new ArrayList<>(); go(nums, new boolean[nums.length], new ArrayList<>(), r); return r;
    }
    private void go(int[] a, boolean[] used, List<Integer> cur, List<List<Integer>> r) {
        if (cur.size() == a.length) { r.add(new ArrayList<>(cur)); return; }
        for (int i = 0; i < a.length; i++) if (!used[i]) {
            used[i] = true; cur.add(a[i]); go(a, used, cur, r); cur.remove(cur.size() - 1); used[i] = false;
        }
    }
}`,
  tests: [
    { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
    { input: [[0, 1]], expected: [[0, 1], [1, 0]] },
    { input: [[9]], expected: [[9]] },
    { input: [[-1, 4]], expected: [[-1, 4], [4, -1]] }
  ]
},
{
  id: "subsets-ii", title: "Subsets II", difficulty: "Medium",
  description: `<p>Like <i>Subsets</i>, but <code>nums</code> may contain <b>duplicates</b>. Return all possible subsets without listing the same subset twice. Any order is accepted.</p>`,
  constraints: ["1 ≤ nums.length ≤ 10"],
  hint: "Sort first so equal values sit together. When you decide to skip a value, skip all of its copies too.",
  method: "subsetsWithDup", params: [{ name: "nums", type: "int[]" }], returnType: "List<List<Integer>>", compare: "unorderedDeep",
  solution: `class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums); List<List<Integer>> r = new ArrayList<>(); go(nums, 0, new ArrayList<>(), r); return r;
    }
    private void go(int[] a, int start, List<Integer> cur, List<List<Integer>> r) {
        r.add(new ArrayList<>(cur));
        for (int i = start; i < a.length; i++) {
            if (i > start && a[i] == a[i - 1]) continue;
            cur.add(a[i]); go(a, i + 1, cur, r); cur.remove(cur.size() - 1);
        }
    }
}`,
  tests: [
    { input: [[1, 2, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]] },
    { input: [[0]], expected: [[], [0]] },
    { input: [[3, 3, 3]], expected: [[], [3], [3, 3], [3, 3, 3]] },
    { input: [[4, 1, 4]], expected: [[], [1], [4], [1, 4], [4, 4], [1, 4, 4]] }
  ]
},
{
  id: "word-search", title: "Word Search", difficulty: "Medium",
  description: `<p>Given an <code>m × n</code> grid of letters and a <code>word</code>, return <code>true</code> if the word can be traced through <b>horizontally or vertically adjacent</b> cells, using each cell at most once.</p>`,
  constraints: ["1 ≤ m, n ≤ 6", "1 ≤ word.length ≤ 15"],
  hint: "Start a DFS from every cell matching word[0]. Temporarily mark a cell as visited (e.g. replace it with '#') and restore it when backtracking.",
  method: "exist", params: [{ name: "board", type: "char[][]" }, { name: "word", type: "String" }], returnType: "boolean",
  solution: `class Solution {
    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++) for (int j = 0; j < board[0].length; j++) if (dfs(board, word, i, j, 0)) return true;
        return false;
    }
    private boolean dfs(char[][] b, String w, int i, int j, int k) {
        if (k == w.length()) return true;
        if (i < 0 || j < 0 || i >= b.length || j >= b[0].length || b[i][j] != w.charAt(k)) return false;
        char c = b[i][j]; b[i][j] = '#';
        boolean ok = dfs(b, w, i + 1, j, k + 1) || dfs(b, w, i - 1, j, k + 1) || dfs(b, w, i, j + 1, k + 1) || dfs(b, w, i, j - 1, k + 1);
        b[i][j] = c; return ok;
    }
}`,
  tests: [
    { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"], expected: true },
    { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"], expected: true },
    { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"], expected: false, explain: "The B would have to be reused." },
    { input: [[["a"]], "a"], expected: true },
    { input: [[["a","b"],["c","d"]], "abdc"], expected: true },
    { input: [[["a","b"],["c","d"]], "abcd"], expected: false }
  ]
},
{
  id: "letter-combinations", title: "Letter Combinations of a Phone Number", difficulty: "Medium",
  description: `<p>On an old phone keypad, digits map to letters: 2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz. Given a string of digits <code>2-9</code>, return every letter string it could spell, in any order. An empty input gives an empty list.</p>`,
  constraints: ["0 ≤ digits.length ≤ 4"],
  hint: "Recursion over the digits: for each letter of the current digit, append it and recurse on the next digit.",
  method: "letterCombinations", params: [{ name: "digits", type: "String" }], returnType: "List<String>", compare: "unordered",
  solution: `class Solution {
    private static final String[] K = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    public List<String> letterCombinations(String digits) {
        List<String> r = new ArrayList<>(); if (digits.isEmpty()) return r;
        go(digits, 0, new StringBuilder(), r); return r;
    }
    private void go(String d, int i, StringBuilder b, List<String> r) {
        if (i == d.length()) { r.add(b.toString()); return; }
        for (char c : K[d.charAt(i) - '0'].toCharArray()) { b.append(c); go(d, i + 1, b, r); b.deleteCharAt(b.length() - 1); }
    }
}`,
  tests: [
    { input: ["23"], expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"] },
    { input: [""], expected: [] },
    { input: ["2"], expected: ["a", "b", "c"] },
    { input: ["79"], expected: ["pw", "px", "py", "pz", "qw", "qx", "qy", "qz", "rw", "rx", "ry", "rz", "sw", "sx", "sy", "sz"] }
  ]
},
{
  id: "n-queens", title: "N-Queens", difficulty: "Hard",
  description: `<p>Place <code>n</code> chess queens on an <code>n × n</code> board so that no two attack each other (no shared row, column or diagonal). Return <b>every</b> distinct solution.</p><p>Each solution is a list of <code>n</code> strings, one per row, where <code>'Q'</code> is a queen and <code>'.'</code> an empty square. Solutions may be in any order.</p>`,
  constraints: ["1 ≤ n ≤ 9"],
  hint: "Place one queen per row. Track used columns and both diagonal directions (row − col and row + col) in sets or boolean arrays.",
  method: "solveNQueens", params: [{ name: "n", type: "int" }], returnType: "List<List<String>>", compare: "unordered",
  solution: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> r = new ArrayList<>(); int[] col = new int[n];
        go(0, n, col, new boolean[n], new boolean[2 * n], new boolean[2 * n], r); return r;
    }
    private void go(int row, int n, int[] col, boolean[] c, boolean[] d1, boolean[] d2, List<List<String>> r) {
        if (row == n) {
            List<String> b = new ArrayList<>();
            for (int i = 0; i < n; i++) { char[] line = new char[n]; Arrays.fill(line, '.'); line[col[i]] = 'Q'; b.add(new String(line)); }
            r.add(b); return;
        }
        for (int j = 0; j < n; j++) {
            if (c[j] || d1[row - j + n] || d2[row + j]) continue;
            c[j] = d1[row - j + n] = d2[row + j] = true; col[row] = j;
            go(row + 1, n, col, c, d1, d2, r);
            c[j] = d1[row - j + n] = d2[row + j] = false;
        }
    }
}`,
  tests: [
    { input: [4], expected: [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]] },
    { input: [1], expected: [["Q"]] },
    { input: [2], expected: [] },
    { input: [3], expected: [] },
    { input: [5], expected: [
      ["Q....", "..Q..", "....Q", ".Q...", "...Q."], ["Q....", "...Q.", ".Q...", "....Q", "..Q.."],
      [".Q...", "...Q.", "Q....", "..Q..", "....Q"], [".Q...", "....Q", "..Q..", "Q....", "...Q."],
      ["..Q..", "Q....", "...Q.", ".Q...", "....Q"], ["..Q..", "....Q", ".Q...", "...Q.", "Q...."],
      ["...Q.", "Q....", "..Q..", "....Q", ".Q..."], ["...Q.", ".Q...", "....Q", "..Q..", "Q...."],
      ["....Q", ".Q...", "...Q.", "Q....", "..Q.."], ["....Q", "..Q..", "Q....", "...Q.", ".Q..."]] }
  ]
}
];
