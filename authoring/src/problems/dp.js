module.exports = [
{
  id: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy",
  description: `<p>A staircase has <code>n</code> steps. Each move you climb either <b>1 or 2</b> steps. In how many distinct ways can you reach the top?</p>`,
  constraints: ["1 ≤ n ≤ 45"],
  hint: "To stand on step n you came from step n − 1 or step n − 2, so ways(n) = ways(n − 1) + ways(n − 2).",
  method: "climbStairs", params: [{ name: "n", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1;
        for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }
        return b;
    }
}`,
  tests: [
    { input: [2], expected: 2, explain: "1+1 or 2" },
    { input: [3], expected: 3 },
    { input: [1], expected: 1 },
    { input: [5], expected: 8 },
    { input: [45], expected: 1836311903 }
  ]
},
{
  id: "min-cost-stairs", title: "Min Cost Climbing Stairs", difficulty: "Easy",
  description: `<p><code>cost[i]</code> is the price of stepping on stair <code>i</code>. After paying, you can climb one or two stairs. You may start on stair 0 or stair 1, and the goal is to get <b>past</b> the last stair. Return the minimum total cost.</p>`,
  constraints: ["2 ≤ cost.length ≤ 1000", "0 ≤ cost[i] ≤ 999"],
  hint: "Let best[i] be the cheapest way to stand on stair i. best[i] = cost[i] + min(best[i − 1], best[i − 2]); the answer is min of the last two.",
  method: "minCostClimbingStairs", params: [{ name: "cost", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int a = 0, b = 0;
        for (int i = 2; i <= cost.length; i++) { int c = Math.min(b + cost[i - 1], a + cost[i - 2]); a = b; b = c; }
        return b;
    }
}`,
  tests: [
    { input: [[10, 15, 20]], expected: 15 },
    { input: [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], expected: 6 },
    { input: [[0, 0]], expected: 0 },
    { input: [[5, 3]], expected: 3 },
    { input: [[1, 2, 3, 4]], expected: 4 }
  ]
},
{
  id: "counting-bits", title: "Counting Bits", difficulty: "Easy",
  description: `<p>Given <code>n</code>, return an array <code>ans</code> of length <code>n + 1</code> where <code>ans[i]</code> is the number of <code>1</code> bits in the binary form of <code>i</code>.</p><p>Challenge: O(n) without a built-in bit counter.</p>`,
  constraints: ["0 ≤ n ≤ 10⁵"],
  hint: "i >> 1 drops the last bit, and you've already computed it: ans[i] = ans[i >> 1] + (i & 1).",
  method: "countBits", params: [{ name: "n", type: "int" }], returnType: "int[]",
  solution: `class Solution {
    public int[] countBits(int n) {
        int[] r = new int[n + 1];
        for (int i = 1; i <= n; i++) r[i] = r[i >> 1] + (i & 1);
        return r;
    }
}`,
  tests: [
    { input: [2], expected: [0, 1, 1] },
    { input: [5], expected: [0, 1, 1, 2, 1, 2] },
    { input: [0], expected: [0] },
    { input: [8], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1] }
  ]
},
{
  id: "house-robber", title: "House Robber", difficulty: "Medium",
  description: `<p>Houses along a street hold <code>nums[i]</code> money each. You can't rob two <b>adjacent</b> houses (the alarms are linked). Return the maximum amount you can take.</p>`,
  constraints: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 400"],
  hint: "At house i you either skip it (best up to i − 1) or rob it (nums[i] + best up to i − 2). Keep just the last two values.",
  method: "rob", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int rob(int[] nums) {
        int a = 0, b = 0;
        for (int x : nums) { int c = Math.max(b, a + x); a = b; b = c; }
        return b;
    }
}`,
  tests: [
    { input: [[1, 2, 3, 1]], expected: 4 },
    { input: [[2, 7, 9, 3, 1]], expected: 12 },
    { input: [[5]], expected: 5 },
    { input: [[2, 1, 1, 2]], expected: 4 },
    { input: [[0, 0, 0]], expected: 0 }
  ]
},
{
  id: "house-robber-ii", title: "House Robber II", difficulty: "Medium",
  description: `<p>Same rules as <i>House Robber</i>, but the houses stand in a <b>circle</b>: the first and the last house are neighbours. Return the maximum amount you can take.</p>`,
  constraints: ["1 ≤ nums.length ≤ 100"],
  hint: "You can't rob both the first and the last house. Run the linear House Robber twice: once without the last house, once without the first.",
  method: "rob", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        return Math.max(line(nums, 0, nums.length - 2), line(nums, 1, nums.length - 1));
    }
    private int line(int[] nums, int lo, int hi) {
        int a = 0, b = 0;
        for (int i = lo; i <= hi; i++) { int c = Math.max(b, a + nums[i]); a = b; b = c; }
        return b;
    }
}`,
  tests: [
    { input: [[2, 3, 2]], expected: 3 },
    { input: [[1, 2, 3, 1]], expected: 4 },
    { input: [[1, 2, 3]], expected: 3 },
    { input: [[7]], expected: 7 },
    { input: [[200, 3, 140, 20, 10]], expected: 340 }
  ]
},
{
  id: "coin-change", title: "Coin Change", difficulty: "Medium",
  description: `<p>You have unlimited coins of each value in <code>coins</code>. Return the <b>fewest</b> coins needed to make exactly <code>amount</code>, or <code>-1</code> if it can't be done.</p>`,
  constraints: ["1 ≤ coins.length ≤ 12", "0 ≤ amount ≤ 10⁴"],
  hint: "dp[a] = fewest coins for amount a. dp[0] = 0, and dp[a] = 1 + min over coins c ≤ a of dp[a − c]. Greedy (biggest coin first) does NOT always work.",
  method: "coinChange", params: [{ name: "coins", type: "int[]" }, { name: "amount", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1]; Arrays.fill(dp, amount + 1); dp[0] = 0;
        for (int a = 1; a <= amount; a++) for (int c : coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
  tests: [
    { input: [[1, 2, 5], 11], expected: 3, explain: "5 + 5 + 1" },
    { input: [[2], 3], expected: -1 },
    { input: [[1], 0], expected: 0 },
    { input: [[1, 3, 4], 6], expected: 2, explain: "3 + 3 beats the greedy 4 + 1 + 1." },
    { input: [[7, 3], 20], expected: 4 }
  ]
},
{
  id: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "Medium",
  description: `<p>Return the length of the longest <b>strictly increasing subsequence</b> of <code>nums</code>. A subsequence keeps the original order but may skip elements.</p>`,
  constraints: ["1 ≤ nums.length ≤ 2500"],
  hint: "O(n²): len[i] = 1 + max(len[j]) over j < i with nums[j] < nums[i]. O(n log n): keep the smallest possible tail for each length and binary search.",
  method: "lengthOfLIS", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length]; int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) { int m = (lo + hi) >>> 1; if (tails[m] < x) lo = m + 1; else hi = m; }
            tails[lo] = x; if (lo == size) size++;
        }
        return size;
    }
}`,
  tests: [
    { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, explain: "e.g. 2, 3, 7, 18" },
    { input: [[0, 1, 0, 3, 2, 3]], expected: 4 },
    { input: [[7, 7, 7, 7]], expected: 1 },
    { input: [[5]], expected: 1 },
    { input: [[1, 3, 6, 7, 9, 4, 10, 5, 6]], expected: 6 }
  ]
},
{
  id: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Medium",
  description: `<p>Return the length of the longest <b>subsequence</b> shared by <code>text1</code> and <code>text2</code> (characters in the same order, not necessarily contiguous). Return 0 if they share none.</p>`,
  constraints: ["1 ≤ text1.length, text2.length ≤ 1000", "Lowercase letters"],
  hint: "2-D table: dp[i][j] = LCS of the first i chars and first j chars. Equal chars → dp[i−1][j−1] + 1, otherwise max(dp[i−1][j], dp[i][j−1]).",
  method: "longestCommonSubsequence", params: [{ name: "text1", type: "String" }, { name: "text2", type: "String" }], returnType: "int",
  solution: `class Solution {
    public int longestCommonSubsequence(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++) for (int j = 1; j <= b.length(); j++)
            dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[a.length()][b.length()];
    }
}`,
  tests: [
    { input: ["abcde", "ace"], expected: 3 },
    { input: ["abc", "abc"], expected: 3 },
    { input: ["abc", "def"], expected: 0 },
    { input: ["bsbininm", "jmjkbkjkv"], expected: 1 },
    { input: ["oxcpqrsvwf", "shmtulqrypy"], expected: 2 }
  ]
},
{
  id: "word-break", title: "Word Break", difficulty: "Medium",
  description: `<p>Return <code>true</code> if string <code>s</code> can be split into a sequence of one or more words from <code>wordDict</code>. Dictionary words may be reused.</p>`,
  constraints: ["1 ≤ s.length ≤ 300", "1 ≤ wordDict.length ≤ 1000"],
  hint: "ok[i] = can the first i characters be split? ok[0] = true; ok[i] is true if some word w ends at i and ok[i − w.length()] is true.",
  method: "wordBreak", params: [{ name: "s", type: "String" }, { name: "wordDict", type: "List<String>" }], returnType: "boolean",
  solution: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        boolean[] ok = new boolean[s.length() + 1]; ok[0] = true;
        for (int i = 1; i <= s.length(); i++)
            for (String w : wordDict)
                if (w.length() <= i && ok[i - w.length()] && s.startsWith(w, i - w.length())) { ok[i] = true; break; }
        return ok[s.length()];
    }
}`,
  tests: [
    { input: ["leetcode", ["leet", "code"]], expected: true },
    { input: ["applepenapple", ["apple", "pen"]], expected: true },
    { input: ["catsandog", ["cats", "dog", "sand", "and", "cat"]], expected: false },
    { input: ["aaaaaaa", ["aaa", "aaaa"]], expected: true },
    { input: ["ab", ["a", "c"]], expected: false }
  ]
},
{
  id: "distinct-subsequences", title: "Distinct Subsequences", difficulty: "Hard",
  description: `<p>Count the number of <b>distinct ways</b> to pick characters from <code>s</code> (keeping their order) so that they spell <code>t</code>. Two ways are different if they use a different set of positions in <code>s</code>.</p><p>The answer fits in a 32-bit signed integer.</p>`,
  constraints: ["1 ≤ s.length, t.length ≤ 1000"],
  hint: "dp[i][j] = ways to form t's first j chars from s's first i chars. Always inherit dp[i−1][j]; if s[i−1] == t[j−1], also add dp[i−1][j−1]. dp[i][0] = 1.",
  method: "numDistinct", params: [{ name: "s", type: "String" }, { name: "t", type: "String" }], returnType: "int",
  solution: `class Solution {
    public int numDistinct(String s, String t) {
        long[] dp = new long[t.length() + 1]; dp[0] = 1;
        for (int i = 1; i <= s.length(); i++)
            for (int j = Math.min(i, t.length()); j >= 1; j--)
                if (s.charAt(i - 1) == t.charAt(j - 1)) dp[j] += dp[j - 1];
        return (int) dp[t.length()];
    }
}`,
  tests: [
    { input: ["rabbbit", "rabbit"], expected: 3 },
    { input: ["babgbag", "bag"], expected: 5 },
    { input: ["abc", "abcd"], expected: 0 },
    { input: ["aaa", "a"], expected: 3 },
    { input: ["aaaa", "aa"], expected: 6 }
  ]
}
];
