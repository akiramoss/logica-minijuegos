const NOTE = `<p class="note">Trees are shown in level order (row by row, left to right), with <code>null</code> marking a missing child.</p>`;
module.exports = [
{
  id: "invert-binary-tree", title: "Invert Binary Tree", difficulty: "Easy",
  description: `<p>Mirror a binary tree: swap the left and right child of <b>every</b> node. Return the root.</p>${NOTE}`,
  constraints: ["0 ≤ number of nodes ≤ 100"],
  hint: "Recursion: invert the left subtree, invert the right subtree, then swap them.",
  method: "invertTree", params: [{ name: "root", type: "TreeNode" }], returnType: "TreeNode",
  solution: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode l = invertTree(root.left); root.left = invertTree(root.right); root.right = l;
        return root;
    }
}`,
  tests: [
    { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
    { input: [[2, 1, 3]], expected: [2, 3, 1] },
    { input: [[]], expected: [] },
    { input: [[1, 2]], expected: [1, null, 2] },
    { input: [[1, null, 2, null, 3]], expected: [1, 2, null, 3] }
  ]
},
{
  id: "max-depth-binary-tree", title: "Maximum Depth of Binary Tree", difficulty: "Easy",
  description: `<p>Return the <b>depth</b> of a binary tree: the number of nodes on the longest path from the root down to a leaf. An empty tree has depth 0.</p>${NOTE}`,
  constraints: ["0 ≤ number of nodes ≤ 10⁴"],
  hint: "depth(node) = 1 + max(depth(left), depth(right)), and depth(null) = 0.",
  method: "maxDepth", params: [{ name: "root", type: "TreeNode" }], returnType: "int",
  solution: `class Solution {
    public int maxDepth(TreeNode root) {
        return root == null ? 0 : 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
  tests: [
    { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
    { input: [[1, null, 2]], expected: 2 },
    { input: [[]], expected: 0 },
    { input: [[5]], expected: 1 },
    { input: [[1, 2, null, 3, null, 4]], expected: 4 }
  ]
},
{
  id: "same-tree", title: "Same Tree", difficulty: "Easy",
  description: `<p>Given the roots <code>p</code> and <code>q</code> of two binary trees, return <code>true</code> if they have exactly the same shape and the same values in the same places.</p>${NOTE}`,
  constraints: ["0 ≤ number of nodes ≤ 100"],
  hint: "Two trees are equal if their roots match AND their left subtrees are equal AND their right subtrees are equal. Handle null carefully.",
  method: "isSameTree", params: [{ name: "p", type: "TreeNode" }, { name: "q", type: "TreeNode" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null || q == null) return p == q;
        return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,
  tests: [
    { input: [[1, 2, 3], [1, 2, 3]], expected: true },
    { input: [[1, 2], [1, null, 2]], expected: false },
    { input: [[1, 2, 1], [1, 1, 2]], expected: false },
    { input: [[], []], expected: true },
    { input: [[], [0]], expected: false }
  ]
},
{
  id: "diameter-binary-tree", title: "Diameter of Binary Tree", difficulty: "Easy",
  description: `<p>The <b>diameter</b> of a binary tree is the number of <b>edges</b> on the longest path between any two nodes. The path doesn't have to pass through the root. Return the diameter.</p>${NOTE}`,
  constraints: ["1 ≤ number of nodes ≤ 10⁴"],
  hint: "While computing each node's height, the longest path through that node is height(left) + height(right). Track the max in a field.",
  method: "diameterOfBinaryTree", params: [{ name: "root", type: "TreeNode" }], returnType: "int",
  solution: `class Solution {
    private int best = 0;
    public int diameterOfBinaryTree(TreeNode root) { h(root); return best; }
    private int h(TreeNode n) {
        if (n == null) return 0;
        int l = h(n.left), r = h(n.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    }
}`,
  tests: [
    { input: [[1, 2, 3, 4, 5]], expected: 3, explain: "Path 4 → 2 → 1 → 3 has 3 edges." },
    { input: [[1, 2]], expected: 1 },
    { input: [[7]], expected: 0 },
    { input: [[1, 2, null, 3, 4, 5, null, null, 6]], expected: 4, explain: "The longest path 5 → 3 → 2 → 4 → 6 doesn't use the root." }
  ]
},
{
  id: "balanced-binary-tree", title: "Balanced Binary Tree", difficulty: "Easy",
  description: `<p>A binary tree is <b>height-balanced</b> if, at every node, the heights of the left and right subtrees differ by at most 1. Return <code>true</code> if the tree is balanced.</p>${NOTE}`,
  constraints: ["0 ≤ number of nodes ≤ 5000"],
  hint: "Compute heights bottom-up and return a special value (like −1) as soon as any subtree is unbalanced, so you don't recompute.",
  method: "isBalanced", params: [{ name: "root", type: "TreeNode" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isBalanced(TreeNode root) { return h(root) >= 0; }
    private int h(TreeNode n) {
        if (n == null) return 0;
        int l = h(n.left), r = h(n.right);
        if (l < 0 || r < 0 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
}`,
  tests: [
    { input: [[3, 9, 20, null, null, 15, 7]], expected: true },
    { input: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false },
    { input: [[]], expected: true },
    { input: [[1, null, 2, null, 3]], expected: false },
    { input: [[1, 2, 3, 4, null, null, 5]], expected: true }
  ]
},
{
  id: "subtree-of-another", title: "Subtree of Another Tree", difficulty: "Easy",
  description: `<p>Return <code>true</code> if <code>subRoot</code> appears inside <code>root</code> as a <b>complete subtree</b>: some node of <code>root</code> together with <i>all</i> of its descendants has exactly the same structure and values as <code>subRoot</code>.</p>${NOTE}`,
  constraints: ["1 ≤ nodes in root ≤ 2000", "1 ≤ nodes in subRoot ≤ 1000"],
  hint: "For each node of root, check whether the tree starting there is the same tree as subRoot (reuse your 'Same Tree' logic).",
  method: "isSubtree", params: [{ name: "root", type: "TreeNode" }, { name: "subRoot", type: "TreeNode" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isSubtree(TreeNode root, TreeNode sub) {
        if (root == null) return false;
        return same(root, sub) || isSubtree(root.left, sub) || isSubtree(root.right, sub);
    }
    private boolean same(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && same(a.left, b.left) && same(a.right, b.right);
    }
}`,
  tests: [
    { input: [[3, 4, 5, 1, 2], [4, 1, 2]], expected: true },
    { input: [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]], expected: false, explain: "Node 4 in root has an extra descendant (0)." },
    { input: [[1, 1], [1]], expected: true },
    { input: [[2, 3, 4], [3, 4]], expected: false },
    { input: [[5, 6, 7, 8, null, null, 7], [7]], expected: true }
  ]
},
{
  id: "level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium",
  description: `<p>Return the values of a binary tree <b>level by level</b>: a list of lists where list <code>d</code> holds the values at depth <code>d</code>, from left to right.</p>${NOTE}`,
  constraints: ["0 ≤ number of nodes ≤ 2000"],
  hint: "Breadth-first search with a queue. At the start of each round, queue.size() tells you how many nodes belong to the current level.",
  method: "levelOrder", params: [{ name: "root", type: "TreeNode" }], returnType: "List<List<Integer>>",
  solution: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> r = new ArrayList<>(); if (root == null) return r;
        Deque<TreeNode> q = new ArrayDeque<>(); q.add(root);
        while (!q.isEmpty()) {
            List<Integer> lvl = new ArrayList<>();
            for (int s = q.size(); s > 0; s--) { TreeNode n = q.poll(); lvl.add(n.val); if (n.left != null) q.add(n.left); if (n.right != null) q.add(n.right); }
            r.add(lvl);
        }
        return r;
    }
}`,
  tests: [
    { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
    { input: [[1]], expected: [[1]] },
    { input: [[]], expected: [] },
    { input: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [2, 3], [4, 5]] },
    { input: [[1, null, 2, null, 3]], expected: [[1], [2], [3]] }
  ]
},
{
  id: "right-side-view", title: "Binary Tree Right Side View", difficulty: "Medium",
  description: `<p>Imagine standing to the <b>right</b> of a binary tree. Return the values of the nodes you can see, from top to bottom (the rightmost node of each level).</p>${NOTE}`,
  constraints: ["0 ≤ number of nodes ≤ 100"],
  hint: "Level-order traversal, keeping only the last node of each level. (Or DFS visiting right before left, recording the first node seen at each depth.)",
  method: "rightSideView", params: [{ name: "root", type: "TreeNode" }], returnType: "List<Integer>",
  solution: `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> r = new ArrayList<>(); go(root, 0, r); return r;
    }
    private void go(TreeNode n, int d, List<Integer> r) {
        if (n == null) return;
        if (d == r.size()) r.add(n.val);
        go(n.right, d + 1, r); go(n.left, d + 1, r);
    }
}`,
  tests: [
    { input: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4] },
    { input: [[1, null, 3]], expected: [1, 3] },
    { input: [[]], expected: [] },
    { input: [[1, 2, 3, 4]], expected: [1, 3, 4], explain: "Node 4 is on the left, but nothing blocks it on its level." },
    { input: [[5, 4, null, 3]], expected: [5, 4, 3] }
  ]
},
{
  id: "validate-bst", title: "Validate Binary Search Tree", difficulty: "Medium",
  description: `<p>Return <code>true</code> if the tree is a valid <b>binary search tree</b>: for every node, all values in its left subtree are <b>strictly smaller</b> and all values in its right subtree are <b>strictly larger</b> than the node's value.</p>${NOTE}`,
  constraints: ["1 ≤ number of nodes ≤ 10⁴", "-2³¹ ≤ Node.val ≤ 2³¹ − 1"],
  hint: "Checking only a node's direct children isn't enough. Pass down an allowed (low, high) range — use long bounds so Integer.MIN/MAX values work.",
  method: "isValidBST", params: [{ name: "root", type: "TreeNode" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isValidBST(TreeNode root) { return ok(root, Long.MIN_VALUE, Long.MAX_VALUE); }
    private boolean ok(TreeNode n, long lo, long hi) {
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) return false;
        return ok(n.left, lo, n.val) && ok(n.right, n.val, hi);
    }
}`,
  tests: [
    { input: [[2, 1, 3]], expected: true },
    { input: [[5, 1, 4, null, null, 3, 6]], expected: false },
    { input: [[5, 4, 6, null, null, 3, 7]], expected: false, explain: "3 is in 5's right subtree but is smaller than 5." },
    { input: [[2, 2, 2]], expected: false },
    { input: [[2147483647]], expected: true },
    { input: [[10, 5, 15, 2, 7, 12, 20]], expected: true }
  ]
},
{
  id: "kth-smallest-bst", title: "Kth Smallest Element in a BST", difficulty: "Medium",
  description: `<p>Given the root of a binary search tree and an integer <code>k</code>, return the <code>k</code>-th smallest value in the tree (1-indexed).</p>${NOTE}`,
  constraints: ["1 ≤ k ≤ number of nodes ≤ 10⁴"],
  hint: "An in-order traversal (left, node, right) of a BST visits values in sorted order. Stop at the k-th visit.",
  method: "kthSmallest", params: [{ name: "root", type: "TreeNode" }, { name: "k", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> st = new ArrayDeque<>(); TreeNode c = root;
        while (true) {
            while (c != null) { st.push(c); c = c.left; }
            c = st.pop(); if (--k == 0) return c.val; c = c.right;
        }
    }
}`,
  tests: [
    { input: [[3, 1, 4, null, 2], 1], expected: 1 },
    { input: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
    { input: [[1], 1], expected: 1 },
    { input: [[5, 3, 6, 2, 4, null, null, 1], 6], expected: 6 },
    { input: [[8, 4, 12, 2, 6, 10, 14], 5], expected: 10 }
  ]
},
{
  id: "lca-bst", title: "Lowest Common Ancestor of a BST", difficulty: "Medium",
  description: `<p>Given a binary search tree and two values <code>p</code> and <code>q</code> that both exist in it, return the value of their <b>lowest common ancestor</b>: the deepest node that has both p and q as descendants (a node counts as a descendant of itself).</p>${NOTE}`,
  constraints: ["2 ≤ number of nodes ≤ 10⁵", "All values are unique; p ≠ q"],
  hint: "Use the BST ordering: if both values are smaller than the current node, go left; if both are larger, go right; otherwise you've found the split point.",
  method: "lowestCommonAncestor", params: [{ name: "root", type: "TreeNode" }, { name: "p", type: "int" }, { name: "q", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int lowestCommonAncestor(TreeNode root, int p, int q) {
        TreeNode c = root;
        while (true) {
            if (p < c.val && q < c.val) c = c.left;
            else if (p > c.val && q > c.val) c = c.right;
            else return c.val;
        }
    }
}`,
  tests: [
    { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6 },
    { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2 },
    { input: [[2, 1], 2, 1], expected: 2 },
    { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5], expected: 4 },
    { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 7, 9], expected: 8 }
  ]
},
{
  id: "max-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "Hard",
  description: `<p>A <b>path</b> is a sequence of nodes where each pair of neighbours is connected by an edge; each node appears at most once, and the path doesn't need to pass through the root. Its <b>sum</b> is the sum of its node values.</p><p>Return the maximum sum of any non-empty path.</p>${NOTE}`,
  constraints: ["1 ≤ number of nodes ≤ 3·10⁴", "-1000 ≤ Node.val ≤ 1000"],
  hint: "For each node compute the best downward path starting at it (ignore negative branches with max(0, …)). The best path that 'bends' at the node is node + leftGain + rightGain.",
  method: "maxPathSum", params: [{ name: "root", type: "TreeNode" }], returnType: "int",
  solution: `class Solution {
    private int best = Integer.MIN_VALUE;
    public int maxPathSum(TreeNode root) { gain(root); return best; }
    private int gain(TreeNode n) {
        if (n == null) return 0;
        int l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
        best = Math.max(best, n.val + l + r);
        return n.val + Math.max(l, r);
    }
}`,
  tests: [
    { input: [[1, 2, 3]], expected: 6 },
    { input: [[-10, 9, 20, null, null, 15, 7]], expected: 42, explain: "15 → 20 → 7" },
    { input: [[-3]], expected: -3 },
    { input: [[2, -1]], expected: 2 },
    { input: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], expected: 48 }
  ]
}
];
