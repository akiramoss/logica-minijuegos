module.exports = [
{
  id: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy",
  description: `<p>You're given an integer array <code>nums</code>. Return <code>true</code> if some value shows up <b>at least twice</b>, and <code>false</code> if every element is distinct.</p>`,
  constraints: ["0 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
  hint: "A HashSet remembers what you've already seen. What should happen when add() finds the value is already there?",
  method: "containsDuplicate", params: [{ name: "nums", type: "int[]" }], returnType: "boolean",
  solution: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) if (!seen.add(x)) return true;
        return false;
    }
}`,
  tests: [
    { input: [[1, 2, 3, 1]], expected: true, explain: "1 appears at index 0 and index 3." },
    { input: [[4, 5, 6, 7]], expected: false },
    { input: [[]], expected: false },
    { input: [[7]], expected: false },
    { input: [[-3, 0, 9, 12, -3]], expected: true },
    { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
  ]
},
{
  id: "valid-anagram", title: "Valid Anagram", difficulty: "Easy",
  description: `<p>Two strings are <b>anagrams</b> if one can be rearranged into the other using every letter exactly once. Given <code>s</code> and <code>t</code>, return <code>true</code> if they are anagrams of each other.</p>`,
  constraints: ["1 ≤ s.length, t.length ≤ 5·10⁴", "Only lowercase English letters"],
  hint: "Count how many times each of the 26 letters appears. Increment for s, decrement for t — what should the counts be at the end?",
  method: "isAnagram", params: [{ name: "s", type: "String" }, { name: "t", type: "String" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] c = new int[26];
        for (int i = 0; i < s.length(); i++) { c[s.charAt(i) - 'a']++; c[t.charAt(i) - 'a']--; }
        for (int x : c) if (x != 0) return false;
        return true;
    }
}`,
  tests: [
    { input: ["listen", "silent"], expected: true },
    { input: ["rat", "car"], expected: false },
    { input: ["a", "a"], expected: true },
    { input: ["ab", "a"], expected: false },
    { input: ["aabb", "abab"], expected: true },
    { input: ["aacc", "ccac"], expected: false }
  ]
},
{
  id: "two-sum", title: "Two Sum", difficulty: "Easy",
  description: `<p>Given an array <code>nums</code> and an integer <code>target</code>, find the two <b>different indices</b> whose values add up to <code>target</code>. Return them as <code>[i, j]</code> with <code>i &lt; j</code>.</p><p>Every input has exactly one valid answer.</p>`,
  constraints: ["2 ≤ nums.length ≤ 10⁴", "Exactly one valid pair exists"],
  hint: "For each number x, the partner you need is target − x. A HashMap from value to index lets you check in O(1) whether that partner appeared earlier.",
  method: "twoSum", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returnType: "int[]",
  solution: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> idx = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = idx.get(target - nums[i]);
            if (j != null) return new int[]{j, i};
            idx.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  tests: [
    { input: [[3, 8, 11, 5], 13], expected: [1, 3], explain: "nums[1] + nums[3] = 8 + 5 = 13." },
    { input: [[4, 4], 8], expected: [0, 1] },
    { input: [[1, 6, 2, 9], 3], expected: [0, 2] },
    { input: [[-2, 8, 10, -5], 5], expected: [2, 3] },
    { input: [[0, 5, 3, 0], 0], expected: [0, 3] }
  ]
},
{
  id: "majority-element", title: "Majority Element", difficulty: "Easy",
  description: `<p>The <b>majority element</b> of an array of length <code>n</code> is the value that appears <b>more than n / 2</b> times. Given <code>nums</code>, return its majority element. One is guaranteed to exist.</p>`,
  constraints: ["1 ≤ nums.length ≤ 5·10⁴", "A majority element always exists"],
  hint: "Counting with a HashMap works. For O(1) memory: keep a candidate and a counter — matching values add 1, others subtract 1, and a counter of 0 means pick a new candidate.",
  method: "majorityElement", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int majorityElement(int[] nums) {
        int cand = 0, cnt = 0;
        for (int x : nums) { if (cnt == 0) cand = x; cnt += (x == cand) ? 1 : -1; }
        return cand;
    }
}`,
  tests: [
    { input: [[2, 7, 2]], expected: 2 },
    { input: [[1, 3, 3, 1, 3, 3, 1]], expected: 3 },
    { input: [[9]], expected: 9 },
    { input: [[5, 5, 6, 6, 5]], expected: 5 },
    { input: [[-1, -1, -1, 4, 4]], expected: -1 }
  ]
},
{
  id: "missing-number", title: "Missing Number", difficulty: "Easy",
  description: `<p>An array <code>nums</code> holds <code>n</code> distinct numbers taken from the range <code>0..n</code> (that range has <code>n + 1</code> values). Exactly one value of the range is missing — return it.</p>`,
  constraints: ["1 ≤ n ≤ 10⁴", "All values are distinct"],
  hint: "You know what 0 + 1 + … + n adds up to. Compare it with the actual sum of the array.",
  method: "missingNumber", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length, sum = n * (n + 1) / 2;
        for (int x : nums) sum -= x;
        return sum;
    }
}`,
  tests: [
    { input: [[3, 0, 1]], expected: 2, explain: "n = 3, so the range is 0..3. 2 is the one not in the array." },
    { input: [[0, 1]], expected: 2 },
    { input: [[1]], expected: 0 },
    { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    { input: [[0]], expected: 1 }
  ]
},
{
  id: "single-number", title: "Single Number", difficulty: "Easy",
  description: `<p>In the array <code>nums</code>, every value appears <b>exactly twice</b> except for one value that appears once. Find that lonely value.</p><p>Bonus: can you do it in O(n) time and O(1) extra memory?</p>`,
  constraints: ["1 ≤ nums.length ≤ 3·10⁴ (always odd)"],
  hint: "A HashSet you add to and remove from works. For O(1) memory, think about XOR: x ^ x = 0 and x ^ 0 = x.",
  method: "singleNumber", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int singleNumber(int[] nums) {
        int r = 0;
        for (int x : nums) r ^= x;
        return r;
    }
}`,
  tests: [
    { input: [[2, 2, 1]], expected: 1 },
    { input: [[4, 1, 2, 1, 2]], expected: 4 },
    { input: [[7]], expected: 7 },
    { input: [[-5, 3, 3]], expected: -5 },
    { input: [[10, 20, 30, 20, 10]], expected: 30 }
  ]
},
{
  id: "group-anagrams", title: "Group Anagrams", difficulty: "Medium",
  description: `<p>Given an array of lowercase words <code>strs</code>, put words that are anagrams of each other into the same group. Return the list of groups.</p><p>Groups, and the words inside each group, may be in <b>any order</b>.</p>`,
  constraints: ["1 ≤ strs.length ≤ 10⁴", "0 ≤ strs[i].length ≤ 100"],
  hint: "Anagrams share a 'signature': the sorted letters, or the 26 letter counts. Use that signature as a HashMap key.",
  method: "groupAnagrams", params: [{ name: "strs", type: "String[]" }], returnType: "List<List<String>>",
  compare: "unorderedDeep",
  solution: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> g = new HashMap<>();
        for (String s : strs) {
            char[] c = s.toCharArray(); Arrays.sort(c);
            g.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(g.values());
    }
}`,
  tests: [
    { input: [["tea", "eat", "bat", "ate", "tab", "cat"]], expected: [["tea", "eat", "ate"], ["bat", "tab"], ["cat"]] },
    { input: [[""]], expected: [[""]] },
    { input: [["x"]], expected: [["x"]] },
    { input: [["abc", "def", "fed", "cab", "bca"]], expected: [["abc", "cab", "bca"], ["def", "fed"]] },
    { input: [["aa", "a", "aa"]], expected: [["aa", "aa"], ["a"]] }
  ]
},
{
  id: "top-k-frequent", title: "Top K Frequent Elements", difficulty: "Medium",
  description: `<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> values that occur <b>most often</b>, in any order.</p><p>The answer is guaranteed to be unique.</p>`,
  constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ k ≤ number of distinct values"],
  hint: "Count frequencies with a HashMap. Then either sort by count, use a min-heap of size k, or bucket values by their frequency (O(n)).",
  method: "topKFrequent", params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }], returnType: "int[]",
  compare: "unordered",
  solution: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> f = new HashMap<>();
        for (int x : nums) f.merge(x, 1, Integer::sum);
        List<Integer>[] b = new List[nums.length + 1];
        for (Map.Entry<Integer, Integer> e : f.entrySet()) {
            if (b[e.getValue()] == null) b[e.getValue()] = new ArrayList<>();
            b[e.getValue()].add(e.getKey());
        }
        int[] r = new int[k]; int i = 0;
        for (int c = nums.length; c > 0 && i < k; c--) if (b[c] != null) for (int v : b[c]) if (i < k) r[i++] = v;
        return r;
    }
}`,
  tests: [
    { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
    { input: [[5], 1], expected: [5] },
    { input: [[4, 4, 6, 6, 6, 7], 1], expected: [6] },
    { input: [[-1, -1, 2, 2, 3, 3, 3, 8], 3], expected: [3, -1, 2] },
    { input: [[9, 8, 9, 8, 7, 9], 2], expected: [9, 8] }
  ]
},
{
  id: "product-except-self", title: "Product of Array Except Self", difficulty: "Medium",
  description: `<p>Given <code>nums</code>, build an array <code>answer</code> where <code>answer[i]</code> is the product of every element of <code>nums</code> <b>except</b> <code>nums[i]</code>.</p><p>Do it in O(n) time <b>without using division</b>.</p>`,
  constraints: ["2 ≤ nums.length ≤ 10⁵", "All products fit in a 32-bit int"],
  hint: "answer[i] = (product of everything to the left of i) × (product of everything to the right of i). Two passes, one in each direction.",
  method: "productExceptSelf", params: [{ name: "nums", type: "int[]" }], returnType: "int[]",
  solution: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length; int[] r = new int[n];
        r[0] = 1;
        for (int i = 1; i < n; i++) r[i] = r[i - 1] * nums[i - 1];
        int right = 1;
        for (int i = n - 1; i >= 0; i--) { r[i] *= right; right *= nums[i]; }
        return r;
    }
}`,
  tests: [
    { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
    { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
    { input: [[2, 5]], expected: [5, 2] },
    { input: [[0, 0, 4]], expected: [0, 0, 0] },
    { input: [[3, -2, 1, 2]], expected: [-4, 6, -12, -6] }
  ]
},
{
  id: "valid-sudoku", title: "Valid Sudoku", difficulty: "Medium",
  description: `<p>A 9×9 Sudoku board is given as a grid of characters: digits <code>'1'</code>–<code>'9'</code> or <code>'.'</code> for an empty cell. The board is <b>valid</b> if no digit repeats inside any row, any column, or any of the nine 3×3 boxes.</p><p>Only the filled cells need to be checked — the board doesn't have to be solvable.</p>`,
  constraints: ["board is 9×9", "board[i][j] is '1'-'9' or '.'"],
  hint: "Use 27 sets (9 rows, 9 columns, 9 boxes). The box of cell (r, c) is (r / 3) * 3 + c / 3.",
  method: "isValidSudoku", params: [{ name: "board", type: "char[][]" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isValidSudoku(char[][] board) {
        boolean[][] row = new boolean[9][9], col = new boolean[9][9], box = new boolean[9][9];
        for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
            char ch = board[r][c]; if (ch == '.') continue;
            int d = ch - '1', b = (r / 3) * 3 + c / 3;
            if (row[r][d] || col[c][d] || box[b][d]) return false;
            row[r][d] = col[c][d] = box[b][d] = true;
        }
        return true;
    }
}`,
  tests: [
    { input: [[
      ["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],
      ["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],
      [".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]], expected: true },
    { input: [[
      ["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],
      ["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],
      [".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]], expected: false, explain: "Column 0 has two 8s (and so does the top-left box)." },
    { input: [[
      [".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]], expected: true },
    { input: [[
      ["1",".",".",".",".",".",".",".","1"],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]], expected: false },
    { input: [[
      ["2",".",".",".",".",".",".",".","."],[".",".","2",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]], expected: false, explain: "Both 2s sit in the top-left 3×3 box." }
  ]
},
{
  id: "longest-consecutive", title: "Longest Consecutive Sequence", difficulty: "Medium",
  description: `<p>Given an <b>unsorted</b> array <code>nums</code>, return the length of the longest run of consecutive integers (like 4, 5, 6, 7) that can be formed from its values. Order in the array doesn't matter.</p><p>Aim for O(n) time.</p>`,
  constraints: ["0 ≤ nums.length ≤ 10⁵"],
  hint: "Put everything in a HashSet. Only start counting from x if x − 1 is NOT in the set — that way each run is counted once.",
  method: "longestConsecutive", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int best = 0;
        for (int x : s) if (!s.contains(x - 1)) {
            int y = x; while (s.contains(y + 1)) y++;
            best = Math.max(best, y - x + 1);
        }
        return best;
    }
}`,
  tests: [
    { input: [[100, 4, 200, 1, 3, 2]], expected: 4, explain: "1, 2, 3, 4" },
    { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
    { input: [[]], expected: 0 },
    { input: [[5]], expected: 1 },
    { input: [[1, 2, 2, 3]], expected: 3 },
    { input: [[-2, -1, 10, 11, 12, 13]], expected: 4 }
  ]
},
{
  id: "first-missing-positive", title: "First Missing Positive", difficulty: "Hard",
  description: `<p>Given an unsorted integer array <code>nums</code>, return the <b>smallest positive integer</b> (1, 2, 3, …) that does not appear in it.</p><p>Your algorithm must run in O(n) time and use O(1) extra memory (you may modify the array).</p>`,
  constraints: ["1 ≤ nums.length ≤ 10⁵", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1"],
  hint: "The answer is always in 1..n+1. Try to place each value v (when 1 ≤ v ≤ n) at index v − 1 by swapping, then scan for the first index whose value is wrong.",
  method: "firstMissingPositive", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++)
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int t = nums[nums[i] - 1]; nums[nums[i] - 1] = nums[i]; nums[i] = t;
            }
        for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
}`,
  tests: [
    { input: [[1, 2, 0]], expected: 3 },
    { input: [[3, 4, -1, 1]], expected: 2 },
    { input: [[7, 8, 9, 11, 12]], expected: 1 },
    { input: [[1]], expected: 2 },
    { input: [[2, 2, 1, 1]], expected: 3 },
    { input: [[2147483647, -2147483648, 1, 3]], expected: 2 }
  ]
}
];
