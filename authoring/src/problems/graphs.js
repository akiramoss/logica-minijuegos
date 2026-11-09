module.exports = [
{
  id: "flood-fill", title: "Flood Fill", difficulty: "Easy",
  description: `<p>An image is a grid of integers (pixel colours). Starting from pixel <code>(sr, sc)</code>, repaint it and every pixel connected to it <b>4-directionally</b> (up, down, left, right) that has the <b>same original colour</b>, using <code>color</code>. Return the modified image.</p>`,
  constraints: ["1 ≤ m, n ≤ 50"],
  hint: "DFS or BFS from the start pixel, only stepping onto neighbours with the original colour. If the new colour equals the original, there's nothing to do (and no infinite loop!).",
  method: "floodFill", params: [{ name: "image", type: "int[][]" }, { name: "sr", type: "int" }, { name: "sc", type: "int" }, { name: "color", type: "int" }], returnType: "int[][]",
  solution: `class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int old = image[sr][sc]; if (old != color) fill(image, sr, sc, old, color); return image;
    }
    private void fill(int[][] g, int r, int c, int old, int nu) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != old) return;
        g[r][c] = nu; fill(g, r + 1, c, old, nu); fill(g, r - 1, c, old, nu); fill(g, r, c + 1, old, nu); fill(g, r, c - 1, old, nu);
    }
}`,
  tests: [
    { input: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], expected: [[2, 2, 2], [2, 2, 0], [2, 0, 1]], explain: "The bottom-right 1 isn't connected 4-directionally." },
    { input: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], expected: [[0, 0, 0], [0, 0, 0]] },
    { input: [[[5]], 0, 0, 9], expected: [[9]] },
    { input: [[[1, 2, 1], [2, 1, 2]], 0, 2, 7], expected: [[1, 2, 7], [2, 1, 2]] },
    { input: [[[3, 3], [3, 4]], 1, 0, 1], expected: [[1, 1], [1, 4]] }
  ]
},
{
  id: "path-exists-graph", title: "Find if Path Exists in Graph", difficulty: "Easy",
  description: `<p>An undirected graph has <code>n</code> vertices labelled <code>0</code> to <code>n − 1</code>. Each <code>edges[i] = [u, v]</code> connects u and v. Return <code>true</code> if there is a path from <code>source</code> to <code>destination</code>.</p>`,
  constraints: ["1 ≤ n ≤ 2·10⁵", "0 ≤ edges.length ≤ 2·10⁵", "No self-loops or duplicate edges"],
  hint: "Build an adjacency list, then BFS/DFS from source with a visited array. (Union-Find also works.)",
  method: "validPath", params: [{ name: "n", type: "int" }, { name: "edges", type: "int[][]" }, { name: "source", type: "int" }, { name: "destination", type: "int" }], returnType: "boolean",
  solution: `class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        boolean[] seen = new boolean[n]; Deque<Integer> q = new ArrayDeque<>(); q.add(source); seen[source] = true;
        while (!q.isEmpty()) { int u = q.poll(); if (u == destination) return true; for (int v : g.get(u)) if (!seen[v]) { seen[v] = true; q.add(v); } }
        return false;
    }
}`,
  tests: [
    { input: [3, [[0, 1], [1, 2], [2, 0]], 0, 2], expected: true },
    { input: [6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5], expected: false },
    { input: [1, [], 0, 0], expected: true },
    { input: [4, [[0, 1], [2, 3]], 1, 3], expected: false },
    { input: [5, [[0, 4], [4, 3], [3, 1], [1, 2]], 2, 0], expected: true }
  ]
},
{
  id: "number-of-islands", title: "Number of Islands", difficulty: "Medium",
  description: `<p>The grid contains <code>'1'</code> (land) and <code>'0'</code> (water). An <b>island</b> is a group of land cells connected horizontally or vertically. Return how many islands there are. Everything outside the grid is water.</p>`,
  constraints: ["1 ≤ m, n ≤ 300"],
  hint: "Scan every cell. When you hit unvisited land, count a new island and sink the whole island with DFS/BFS so you don't count it again.",
  method: "numIslands", params: [{ name: "grid", type: "char[][]" }], returnType: "int",
  solution: `class Solution {
    public int numIslands(char[][] grid) {
        int n = 0;
        for (int i = 0; i < grid.length; i++) for (int j = 0; j < grid[0].length; j++) if (grid[i][j] == '1') { n++; sink(grid, i, j); }
        return n;
    }
    private void sink(char[][] g, int i, int j) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != '1') return;
        g[i][j] = '0'; sink(g, i + 1, j); sink(g, i - 1, j); sink(g, i, j + 1); sink(g, i, j - 1);
    }
}`,
  tests: [
    { input: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expected: 1 },
    { input: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3 },
    { input: [[["0"]]], expected: 0 },
    { input: [[["1","0","1"],["0","1","0"],["1","0","1"]]], expected: 5, explain: "Diagonal neighbours don't connect." },
    { input: [[["1","1"],["1","1"]]], expected: 1 }
  ]
},
{
  id: "max-area-island", title: "Max Area of Island", difficulty: "Medium",
  description: `<p>The grid contains <code>1</code> (land) and <code>0</code> (water). An island is a group of 1s connected 4-directionally, and its <b>area</b> is its number of cells. Return the largest island area, or <code>0</code> if there is no land.</p>`,
  constraints: ["1 ≤ m, n ≤ 50"],
  hint: "Like Number of Islands, but have your DFS return how many cells it sank.",
  method: "maxAreaOfIsland", params: [{ name: "grid", type: "int[][]" }], returnType: "int",
  solution: `class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int best = 0;
        for (int i = 0; i < grid.length; i++) for (int j = 0; j < grid[0].length; j++) best = Math.max(best, area(grid, i, j));
        return best;
    }
    private int area(int[][] g, int i, int j) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != 1) return 0;
        g[i][j] = 0; return 1 + area(g, i + 1, j) + area(g, i - 1, j) + area(g, i, j + 1) + area(g, i, j - 1);
    }
}`,
  tests: [
    { input: [[[0, 0, 1, 0, 0], [1, 1, 1, 0, 1], [0, 1, 0, 0, 1], [0, 0, 0, 1, 1]]], expected: 5 },
    { input: [[[0, 0, 0, 0]]], expected: 0 },
    { input: [[[1]]], expected: 1 },
    { input: [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], expected: 1 },
    { input: [[[1, 1, 0, 1], [1, 0, 0, 1], [0, 0, 1, 1], [1, 1, 1, 0]]], expected: 7 }
  ]
},
{
  id: "rotting-oranges", title: "Rotting Oranges", difficulty: "Medium",
  description: `<p>Each cell of the grid is <code>0</code> (empty), <code>1</code> (fresh orange) or <code>2</code> (rotten orange). Every minute, each fresh orange that is 4-directionally next to a rotten one becomes rotten.</p><p>Return the minimum number of minutes until no fresh orange remains, or <code>-1</code> if that never happens.</p>`,
  constraints: ["1 ≤ m, n ≤ 10"],
  hint: "Multi-source BFS: start with ALL rotten oranges in the queue at minute 0 and expand one layer per minute. Count fresh oranges to know whether any were unreachable.",
  method: "orangesRotting", params: [{ name: "grid", type: "int[][]" }], returnType: "int",
  solution: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;
        Deque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) { if (grid[i][j] == 2) q.add(new int[]{i, j}); else if (grid[i][j] == 1) fresh++; }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty() && fresh > 0) {
            for (int s = q.size(); s > 0; s--) {
                int[] c = q.poll();
                for (int[] d : dirs) { int r = c[0] + d[0], k = c[1] + d[1];
                    if (r >= 0 && k >= 0 && r < m && k < n && grid[r][k] == 1) { grid[r][k] = 2; fresh--; q.add(new int[]{r, k}); } }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
  tests: [
    { input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
    { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1, explain: "The bottom-left orange can never be reached." },
    { input: [[[0, 2]]], expected: 0 },
    { input: [[[0]]], expected: 0 },
    { input: [[[2, 1, 1, 1, 2]]], expected: 2 },
    { input: [[[1]]], expected: -1 }
  ]
},
{
  id: "course-schedule", title: "Course Schedule", difficulty: "Medium",
  description: `<p>There are <code>numCourses</code> courses labelled <code>0</code> to <code>numCourses − 1</code>. Each <code>prerequisites[i] = [a, b]</code> means you must take course <code>b</code> before course <code>a</code>. Return <code>true</code> if it is possible to finish every course.</p>`,
  constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000"],
  hint: "It's impossible exactly when the prerequisite graph has a cycle. Kahn's algorithm: repeatedly take courses with no remaining prerequisites and count how many you managed to take.",
  method: "canFinish", params: [{ name: "numCourses", type: "int" }, { name: "prerequisites", type: "int[][]" }], returnType: "boolean",
  solution: `class Solution {
    public boolean canFinish(int n, int[][] pre) {
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : pre) { g.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q = new ArrayDeque<>(); for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
        int done = 0;
        while (!q.isEmpty()) { int u = q.poll(); done++; for (int v : g.get(u)) if (--indeg[v] == 0) q.add(v); }
        return done == n;
    }
}`,
  tests: [
    { input: [2, [[1, 0]]], expected: true },
    { input: [2, [[1, 0], [0, 1]]], expected: false },
    { input: [3, []], expected: true },
    { input: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: false },
    { input: [5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]]], expected: true }
  ]
},
{
  id: "pacific-atlantic", title: "Pacific Atlantic Water Flow", difficulty: "Medium",
  description: `<p><code>heights</code> is an island map. The <b>Pacific</b> touches the top and left edges; the <b>Atlantic</b> touches the bottom and right edges. Rain flows from a cell to a 4-directional neighbour whose height is <b>less than or equal</b>.</p><p>Return the coordinates <code>[r, c]</code> of every cell from which water can reach <b>both</b> oceans, in any order.</p>`,
  constraints: ["1 ≤ m, n ≤ 200"],
  hint: "Reverse the flow: DFS from each ocean's border cells going UPHILL (to neighbours ≥ current). Answer = cells reached from both oceans.",
  method: "pacificAtlantic", params: [{ name: "heights", type: "int[][]" }], returnType: "List<List<Integer>>", compare: "unordered",
  solution: `class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] h) {
        int m = h.length, n = h[0].length; boolean[][] p = new boolean[m][n], a = new boolean[m][n];
        for (int i = 0; i < m; i++) { dfs(h, p, i, 0, 0); dfs(h, a, i, n - 1, 0); }
        for (int j = 0; j < n; j++) { dfs(h, p, 0, j, 0); dfs(h, a, m - 1, j, 0); }
        List<List<Integer>> r = new ArrayList<>();
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) if (p[i][j] && a[i][j]) r.add(Arrays.asList(i, j));
        return r;
    }
    private void dfs(int[][] h, boolean[][] seen, int i, int j, int prev) {
        if (i < 0 || j < 0 || i >= h.length || j >= h[0].length || seen[i][j] || h[i][j] < prev) return;
        seen[i][j] = true;
        dfs(h, seen, i + 1, j, h[i][j]); dfs(h, seen, i - 1, j, h[i][j]); dfs(h, seen, i, j + 1, h[i][j]); dfs(h, seen, i, j - 1, h[i][j]);
    }
}`,
  tests: [
    { input: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]], expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] },
    { input: [[[1]]], expected: [[0, 0]] },
    { input: [[[1, 1], [1, 1]]], expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    { input: [[[3, 2, 1]]], expected: [[0, 0], [0, 1], [0, 2]] },
    { input: [[[1, 2], [4, 3]]], expected: [[0, 1], [1, 0], [1, 1]] }
  ]
},
{
  id: "connected-components", title: "Number of Connected Components", difficulty: "Medium",
  description: `<p>An undirected graph has <code>n</code> nodes labelled <code>0</code> to <code>n − 1</code> and the given <code>edges</code>. Return the number of <b>connected components</b> (groups of nodes reachable from each other).</p>`,
  constraints: ["1 ≤ n ≤ 2000", "No duplicate edges"],
  hint: "Union-Find: start with n components, and every edge that joins two different sets reduces the count by one. (DFS over unvisited nodes also works.)",
  method: "countComponents", params: [{ name: "n", type: "int" }, { name: "edges", type: "int[][]" }], returnType: "int",
  solution: `class Solution {
    private int[] parent;
    private int find(int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
    public int countComponents(int n, int[][] edges) {
        parent = new int[n]; for (int i = 0; i < n; i++) parent[i] = i;
        int c = n;
        for (int[] e : edges) { int a = find(e[0]), b = find(e[1]); if (a != b) { parent[a] = b; c--; } }
        return c;
    }
}`,
  tests: [
    { input: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
    { input: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
    { input: [4, []], expected: 4 },
    { input: [6, [[0, 1], [1, 2], [2, 0], [4, 5]]], expected: 3 },
    { input: [1, []], expected: 1 }
  ]
},
{
  id: "word-ladder", title: "Word Ladder", difficulty: "Hard",
  description: `<p>A <b>transformation sequence</b> goes from <code>beginWord</code> to <code>endWord</code> changing exactly <b>one letter</b> at each step, where every intermediate word (and <code>endWord</code>) must be in <code>wordList</code>.</p><p>Return the number of words in the <b>shortest</b> such sequence (including both ends), or <code>0</code> if none exists.</p>`,
  constraints: ["1 ≤ beginWord.length ≤ 10", "All words have the same length, lowercase", "1 ≤ wordList.length ≤ 5000"],
  hint: "BFS over words, where neighbours differ by one letter. Generate neighbours by trying all 26 letters at each position and checking a HashSet of the word list.",
  method: "ladderLength", params: [{ name: "beginWord", type: "String" }, { name: "endWord", type: "String" }, { name: "wordList", type: "List<String>" }], returnType: "int",
  solution: `class Solution {
    public int ladderLength(String begin, String end, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList); if (!words.contains(end)) return 0;
        Deque<String> q = new ArrayDeque<>(); q.add(begin); words.remove(begin);
        for (int steps = 1; !q.isEmpty(); steps++) {
            for (int s = q.size(); s > 0; s--) {
                String w = q.poll(); if (w.equals(end)) return steps;
                char[] c = w.toCharArray();
                for (int i = 0; i < c.length; i++) { char o = c[i];
                    for (char x = 'a'; x <= 'z'; x++) { c[i] = x; String nw = new String(c); if (words.remove(nw)) q.add(nw); }
                    c[i] = o; }
            }
        }
        return 0;
    }
}`,
  tests: [
    { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]], expected: 5, explain: "hit → hot → dot → dog → cog" },
    { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]], expected: 0 },
    { input: ["a", "c", ["a", "b", "c"]], expected: 2 },
    { input: ["cold", "warm", ["cord", "card", "ward", "warm", "worm", "word", "wood"]], expected: 5 },
    { input: ["same", "came", ["came"]], expected: 2 }
  ]
}
];
