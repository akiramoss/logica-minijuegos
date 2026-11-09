module.exports = [
{
  id: "kth-largest-stream", title: "Kth Largest Element in a Stream", difficulty: "Easy",
  description: `<p>Implement class <code>KthLargest</code> that keeps track of the <code>k</code>-th largest value in a growing stream of numbers:</p><ul><li><code>KthLargest(int k, int[] nums)</code> starts with the values in <code>nums</code></li><li><code>int add(int val)</code> adds <code>val</code> and returns the current <code>k</code>-th largest value</li></ul><p>When <code>add</code> is called, there are always at least <code>k</code> values.</p><p class="note">Tests list the calls made and the value each one returns (<code>null</code> for the constructor).</p>`,
  constraints: ["1 ≤ k ≤ 10⁴", "Up to 10⁴ calls to add"],
  hint: "A min-heap (PriorityQueue) that never holds more than k values: its smallest element (peek) is the k-th largest overall.",
  design: { className: "KthLargest", ctor: ["int", "int[]"], ctorNames: ["k", "nums"], methods: {
    add: { params: ["int"], names: ["val"], ret: "int" } } },
  solution: `class KthLargest {
    private final PriorityQueue<Integer> pq = new PriorityQueue<>();
    private final int k;
    public KthLargest(int k, int[] nums) { this.k = k; for (int x : nums) add(x); }
    public int add(int val) { pq.add(val); if (pq.size() > k) pq.poll(); return pq.peek(); }
}`,
  tests: [
    { ops: ["KthLargest", "add", "add", "add", "add", "add"], args: [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]], expected: [null, 4, 5, 5, 8, 8] },
    { ops: ["KthLargest", "add", "add"], args: [[1, []], [-3], [-2]], expected: [null, -3, -2] },
    { ops: ["KthLargest", "add", "add", "add"], args: [[2, [0]], [-1], [1], [-2]], expected: [null, -1, 0, 0] },
    { ops: ["KthLargest", "add", "add"], args: [[4, [7, 7, 7]], [7], [1]], expected: [null, 7, 7] }
  ]
},
{
  id: "last-stone-weight", title: "Last Stone Weight", difficulty: "Easy",
  description: `<p>Each turn, take the <b>two heaviest</b> stones and smash them together. If their weights are equal, both are destroyed; otherwise the lighter one is destroyed and the heavier one's weight becomes the difference.</p><p>When at most one stone remains, return its weight (or <code>0</code> if none remain).</p>`,
  constraints: ["1 ≤ stones.length ≤ 30", "1 ≤ stones[i] ≤ 1000"],
  hint: "A max-heap gives you the two heaviest stones each turn: new PriorityQueue<>(Collections.reverseOrder()).",
  method: "lastStoneWeight", params: [{ name: "stones", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) pq.add(s);
        while (pq.size() > 1) { int a = pq.poll(), b = pq.poll(); if (a != b) pq.add(a - b); }
        return pq.isEmpty() ? 0 : pq.peek();
    }
}`,
  tests: [
    { input: [[2, 7, 4, 1, 8, 1]], expected: 1 },
    { input: [[1]], expected: 1 },
    { input: [[3, 3]], expected: 0 },
    { input: [[10, 4, 2, 10]], expected: 2 },
    { input: [[9, 3, 2, 10]], expected: 0 }
  ]
},
{
  id: "kth-largest-array", title: "Kth Largest Element in an Array", difficulty: "Medium",
  description: `<p>Return the <code>k</code>-th largest element of <code>nums</code> in sorted order (not the k-th distinct value). For example, the 2nd largest of <code>[3, 3, 1]</code> is 3.</p><p>Can you beat sorting the whole array?</p>`,
  constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵"],
  hint: "Keep a min-heap of size k as you scan — O(n log k). Quickselect is O(n) on average.",
  method: "findKthLargest", params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : nums) { pq.add(x); if (pq.size() > k) pq.poll(); }
        return pq.peek();
    }
}`,
  tests: [
    { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
    { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
    { input: [[7], 1], expected: 7 },
    { input: [[-1, -5, -3], 3], expected: -5 },
    { input: [[2, 2, 2, 1], 3], expected: 2 }
  ]
},
{
  id: "k-closest-points", title: "K Closest Points to Origin", difficulty: "Medium",
  description: `<p>Each <code>points[i] = [x, y]</code> is a point on the plane. Return the <code>k</code> points closest to the origin <code>(0, 0)</code> by Euclidean distance, in any order.</p><p>The answer is guaranteed to be unique.</p>`,
  constraints: ["1 ≤ k ≤ points.length ≤ 10⁴"],
  hint: "You don't need the square root — compare x² + y². A max-heap of size k (evict the farthest) or sorting both work.",
  method: "kClosest", params: [{ name: "points", type: "int[][]" }, { name: "k", type: "int" }], returnType: "int[][]", compare: "unordered",
  solution: `class Solution {
    public int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1], a[0] * a[0] + a[1] * a[1]));
        for (int[] p : points) { pq.add(p); if (pq.size() > k) pq.poll(); }
        return pq.toArray(new int[0][]);
    }
}`,
  tests: [
    { input: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]] },
    { input: [[[3, 3], [5, -1], [-2, 4]], 2], expected: [[3, 3], [-2, 4]] },
    { input: [[[0, 1]], 1], expected: [[0, 1]] },
    { input: [[[1, 1], [2, 2], [3, 3], [-1, 0]], 3], expected: [[1, 1], [2, 2], [-1, 0]] },
    { input: [[[6, 8], [0, 9], [5, 5]], 1], expected: [[5, 5]] }
  ]
},
{
  id: "task-scheduler", title: "Task Scheduler", difficulty: "Medium",
  description: `<p>A CPU must run a list of <code>tasks</code>, each labelled with a capital letter and taking one time unit. In each unit the CPU either runs one task or stays idle. Two runs of the <b>same</b> task must be separated by at least <code>n</code> units.</p><p>Return the minimum number of units needed to finish every task.</p>`,
  constraints: ["1 ≤ tasks.length ≤ 10⁴", "0 ≤ n ≤ 100"],
  hint: "The most frequent task dictates the shape: (maxCount − 1) blocks of length n + 1, plus one slot per task that ties for the max count. The answer is never less than tasks.length.",
  method: "leastInterval", params: [{ name: "tasks", type: "char[]" }, { name: "n", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] c = new int[26]; int max = 0, ties = 0;
        for (char t : tasks) max = Math.max(max, ++c[t - 'A']);
        for (int x : c) if (x == max) ties++;
        return Math.max(tasks.length, (max - 1) * (n + 1) + ties);
    }
}`,
  tests: [
    { input: [["A", "A", "A", "B", "B", "B"], 2], expected: 8, explain: "A B idle A B idle A B" },
    { input: [["A", "C", "A", "B", "D", "B"], 1], expected: 6 },
    { input: [["A", "A", "A", "B", "B", "B"], 3], expected: 10 },
    { input: [["A"], 5], expected: 1 },
    { input: [["A", "A", "A", "A", "B", "C"], 2], expected: 10 }
  ]
},
{
  id: "median-data-stream", title: "Find Median from Data Stream", difficulty: "Hard",
  description: `<p>Implement class <code>MedianFinder</code>:</p><ul><li><code>MedianFinder()</code> starts empty</li><li><code>void addNum(int num)</code> adds a number</li><li><code>double findMedian()</code> returns the median of everything added so far (the average of the two middle values when the count is even)</li></ul><p><code>findMedian</code> is only called after at least one number was added. Answers within 10⁻⁵ are accepted.</p><p class="note">Tests list the calls made and the value each one returns (<code>null</code> for void methods).</p>`,
  constraints: ["Up to 5·10⁴ calls"],
  hint: "Keep two heaps: a max-heap with the smaller half and a min-heap with the larger half, balanced so their sizes differ by at most one.",
  design: { className: "MedianFinder", ctor: [], ctorNames: [], methods: {
    addNum: { params: ["int"], names: ["num"], ret: "void" }, findMedian: { params: [], ret: "double" } } },
  compare: "float",
  solution: `class MedianFinder {
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()), hi = new PriorityQueue<>();
    public MedianFinder() {}
    public void addNum(int num) {
        lo.add(num); hi.add(lo.poll());
        if (hi.size() > lo.size()) lo.add(hi.poll());
    }
    public double findMedian() { return lo.size() > hi.size() ? lo.peek() : (lo.peek() + (double) hi.peek()) / 2; }
}`,
  tests: [
    { ops: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], args: [[], [1], [2], [], [3], []], expected: [null, null, null, 1.5, null, 2.0] },
    { ops: ["MedianFinder", "addNum", "findMedian"], args: [[], [-4], []], expected: [null, null, -4.0] },
    { ops: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"], args: [[], [5], [15], [1], [3], []], expected: [null, null, null, null, null, 4.0] },
    { ops: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "addNum", "findMedian"], args: [[], [6], [10], [], [2], [6], []], expected: [null, null, null, 8.0, null, null, 6.0] }
  ]
}
];
