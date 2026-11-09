module.exports = [
{
  id: "best-time-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy",
  description: `<p><code>prices[i]</code> is a stock's price on day <code>i</code>. You may buy on one day and sell on a <b>later</b> day. Return the biggest profit you can make, or <code>0</code> if no profit is possible.</p>`,
  constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
  hint: "Walk through the days keeping the cheapest price seen so far. Selling today earns price − cheapest.",
  method: "maxProfit", params: [{ name: "prices", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int maxProfit(int[] prices) {
        int lo = Integer.MAX_VALUE, best = 0;
        for (int p : prices) { lo = Math.min(lo, p); best = Math.max(best, p - lo); }
        return best;
    }
}`,
  tests: [
    { input: [[7, 1, 5, 3, 6, 4]], expected: 5, explain: "Buy at 1 (day 1), sell at 6 (day 4)." },
    { input: [[7, 6, 4, 3, 1]], expected: 0 },
    { input: [[3]], expected: 0 },
    { input: [[2, 4, 1, 7]], expected: 6 },
    { input: [[9, 2, 8, 1, 3]], expected: 6 }
  ]
},
{
  id: "max-average-subarray", title: "Maximum Average Subarray", difficulty: "Easy",
  description: `<p>Given <code>nums</code> and an integer <code>k</code>, find the contiguous block of exactly <code>k</code> elements with the <b>largest average</b> and return that average.</p><p>Answers within 10⁻⁵ of the correct value are accepted.</p>`,
  constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵"],
  hint: "Compute the sum of the first k elements, then slide: add the element entering the window and subtract the one leaving.",
  method: "findMaxAverage", params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }], returnType: "double", compare: "float",
  solution: `class Solution {
    public double findMaxAverage(int[] nums, int k) {
        long s = 0;
        for (int i = 0; i < k; i++) s += nums[i];
        long best = s;
        for (int i = k; i < nums.length; i++) { s += nums[i] - nums[i - k]; best = Math.max(best, s); }
        return (double) best / k;
    }
}`,
  tests: [
    { input: [[1, 12, -5, -6, 50, 3], 4], expected: 12.75, explain: "(12 − 5 − 6 + 50) / 4 = 12.75" },
    { input: [[5], 1], expected: 5.0 },
    { input: [[-1, -2, -3], 2], expected: -1.5 },
    { input: [[4, 0, 4, 3, 3], 3], expected: 3.3333333 },
    { input: [[0, 1, 1, 3, 3], 4], expected: 2.0 }
  ]
},
{
  id: "longest-substring-no-repeat", title: "Longest Substring Without Repeating Characters", difficulty: "Medium",
  description: `<p>Given a string <code>s</code>, return the length of the longest <b>substring</b> (contiguous piece) in which no character appears twice.</p>`,
  constraints: ["0 ≤ s.length ≤ 5·10⁴", "s has letters, digits, symbols and spaces"],
  hint: "Grow a window to the right. When the new character is already inside the window, shrink from the left until it isn't. A map of last-seen positions lets you jump directly.",
  method: "lengthOfLongestSubstring", params: [{ name: "s", type: "String" }], returnType: "int",
  solution: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int best = 0, lo = 0;
        for (int i = 0; i < s.length(); i++) {
            Integer p = last.get(s.charAt(i));
            if (p != null && p >= lo) lo = p + 1;
            last.put(s.charAt(i), i);
            best = Math.max(best, i - lo + 1);
        }
        return best;
    }
}`,
  tests: [
    { input: ["abcabcbb"], expected: 3, explain: "\"abc\"" },
    { input: ["bbbbb"], expected: 1 },
    { input: ["pwwkew"], expected: 3, explain: "\"wke\" — note \"pwke\" is not contiguous." },
    { input: [""], expected: 0 },
    { input: ["a b c a"], expected: 3 },
    { input: ["abba"], expected: 2 }
  ]
},
{
  id: "char-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium",
  description: `<p>You have a string <code>s</code> of uppercase letters and may change <b>at most</b> <code>k</code> characters into any other uppercase letter. Return the length of the longest substring that can be made of one repeated letter.</p>`,
  constraints: ["1 ≤ s.length ≤ 10⁵", "0 ≤ k ≤ s.length"],
  hint: "A window is fixable if (window length − count of its most frequent letter) ≤ k. Grow right; when it breaks, move left by one.",
  method: "characterReplacement", params: [{ name: "s", type: "String" }, { name: "k", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int characterReplacement(String s, int k) {
        int[] c = new int[26]; int lo = 0, maxf = 0, best = 0;
        for (int i = 0; i < s.length(); i++) {
            maxf = Math.max(maxf, ++c[s.charAt(i) - 'A']);
            while (i - lo + 1 - maxf > k) c[s.charAt(lo++) - 'A']--;
            best = Math.max(best, i - lo + 1);
        }
        return best;
    }
}`,
  tests: [
    { input: ["ABAB", 2], expected: 4 },
    { input: ["AABABBA", 1], expected: 4 },
    { input: ["AAAA", 0], expected: 4 },
    { input: ["ABCD", 0], expected: 1 },
    { input: ["ABBBCB", 1], expected: 5 }
  ]
},
{
  id: "permutation-in-string", title: "Permutation in String", difficulty: "Medium",
  description: `<p>Given two lowercase strings <code>s1</code> and <code>s2</code>, return <code>true</code> if some <b>rearrangement</b> of <code>s1</code> appears as a contiguous substring of <code>s2</code>.</p>`,
  constraints: ["1 ≤ s1.length, s2.length ≤ 10⁴"],
  hint: "Slide a window of length s1.length() across s2 and compare 26-letter counts with s1's counts.",
  method: "checkInclusion", params: [{ name: "s1", type: "String" }, { name: "s2", type: "String" }], returnType: "boolean",
  solution: `class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int n = s1.length(); if (n > s2.length()) return false;
        int[] a = new int[26], b = new int[26];
        for (int i = 0; i < n; i++) { a[s1.charAt(i) - 'a']++; b[s2.charAt(i) - 'a']++; }
        if (Arrays.equals(a, b)) return true;
        for (int i = n; i < s2.length(); i++) {
            b[s2.charAt(i) - 'a']++; b[s2.charAt(i - n) - 'a']--;
            if (Arrays.equals(a, b)) return true;
        }
        return false;
    }
}`,
  tests: [
    { input: ["ab", "eidbaooo"], expected: true, explain: "\"ba\" is inside s2." },
    { input: ["ab", "eidboaoo"], expected: false },
    { input: ["abc", "ab"], expected: false },
    { input: ["a", "a"], expected: true },
    { input: ["adc", "dcda"], expected: true },
    { input: ["hello", "ooolleoooleh"], expected: false }
  ]
},
{
  id: "min-window-substring", title: "Minimum Window Substring", difficulty: "Hard",
  description: `<p>Given strings <code>s</code> and <code>t</code>, return the <b>shortest substring of s</b> that contains every character of <code>t</code> (counting duplicates). If none exists, return the empty string <code>""</code>.</p><p>The tests are built so the shortest window is unique.</p>`,
  constraints: ["1 ≤ s.length, t.length ≤ 10⁵", "Upper- and lowercase English letters"],
  hint: "Expand right until the window covers t (track how many required characters are still missing). Then shrink from the left as much as possible, recording the best window.",
  method: "minWindow", params: [{ name: "s", type: "String" }, { name: "t", type: "String" }], returnType: "String",
  solution: `class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128]; for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), lo = 0, bs = 0, bl = Integer.MAX_VALUE;
        for (int i = 0; i < s.length(); i++) {
            if (need[s.charAt(i)]-- > 0) missing--;
            while (missing == 0) {
                if (i - lo + 1 < bl) { bl = i - lo + 1; bs = lo; }
                if (++need[s.charAt(lo++)] > 0) missing++;
            }
        }
        return bl == Integer.MAX_VALUE ? "" : s.substring(bs, bs + bl);
    }
}`,
  tests: [
    { input: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
    { input: ["a", "a"], expected: "a" },
    { input: ["a", "aa"], expected: "" },
    { input: ["xyzzy", "zz"], expected: "zz" },
    { input: ["bbaac", "abc"], expected: "baac" }
  ]
},
{
  id: "sliding-window-max", title: "Sliding Window Maximum", difficulty: "Hard",
  description: `<p>A window of size <code>k</code> slides over <code>nums</code> from left to right, one step at a time. Return an array with the <b>maximum</b> of each window position.</p>`,
  constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵"],
  hint: "Keep a deque of indices whose values are in decreasing order. Drop indices that left the window from the front, and smaller values from the back before pushing.",
  method: "maxSlidingWindow", params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }], returnType: "int[]",
  solution: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int[] r = new int[nums.length - k + 1]; Deque<Integer> d = new ArrayDeque<>();
        for (int i = 0; i < nums.length; i++) {
            while (!d.isEmpty() && d.peekFirst() <= i - k) d.pollFirst();
            while (!d.isEmpty() && nums[d.peekLast()] <= nums[i]) d.pollLast();
            d.addLast(i);
            if (i >= k - 1) r[i - k + 1] = nums[d.peekFirst()];
        }
        return r;
    }
}`,
  tests: [
    { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
    { input: [[4], 1], expected: [4] },
    { input: [[9, 8, 7, 6], 2], expected: [9, 8, 7] },
    { input: [[1, 2, 3, 4], 4], expected: [4] },
    { input: [[2, -1, 2, 0, -5], 2], expected: [2, 2, 2, 0] }
  ]
}
];
