module.exports = [
{
  id: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy",
  description: `<p>A phrase is a <b>palindrome</b> if, after turning uppercase letters into lowercase and throwing away everything that isn't a letter or digit, it reads the same forwards and backwards.</p><p>Given a string <code>s</code>, return <code>true</code> if it is a palindrome.</p>`,
  constraints: ["1 ≤ s.length ≤ 2·10⁵", "s contains printable ASCII characters"],
  hint: "Put one pointer at each end. Skip characters that aren't letters/digits (Character.isLetterOrDigit), compare lowercase versions, and move inward.",
  method: "isPalindrome", params: [{ name: "s", type: "String" }], returnType: "boolean",
  solution: `class Solution {
    public boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (!Character.isLetterOrDigit(s.charAt(i))) { i++; continue; }
            if (!Character.isLetterOrDigit(s.charAt(j))) { j--; continue; }
            if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) return false;
            i++; j--;
        }
        return true;
    }
}`,
  tests: [
    { input: ["Was it a car or a cat I saw?"], expected: true },
    { input: ["hello"], expected: false },
    { input: [" "], expected: true, explain: "Nothing is left after cleaning, and an empty string reads the same both ways." },
    { input: ["0P"], expected: false },
    { input: ["No 'x' in Nixon"], expected: true },
    { input: ["ab2a"], expected: false }
  ]
},
{
  id: "merge-sorted-array", title: "Merge Sorted Array", difficulty: "Easy",
  description: `<p>You have two arrays sorted in non-decreasing order: <code>nums1</code> with <code>m</code> real values followed by <code>n</code> zeros (empty slots), and <code>nums2</code> with <code>n</code> values.</p><p>Merge <code>nums2</code> into <code>nums1</code> <b>in place</b> so that <code>nums1</code> ends up fully sorted. The method returns nothing — the tests check <code>nums1</code> afterwards.</p>`,
  constraints: ["nums1.length == m + n", "0 ≤ m, n ≤ 200"],
  hint: "Fill nums1 from the back: compare the largest remaining values of both arrays and write the bigger one at the end.",
  method: "merge", params: [{ name: "nums1", type: "int[]" }, { name: "m", type: "int" }, { name: "nums2", type: "int[]" }, { name: "n", type: "int" }],
  returnType: "void", outputArg: 0,
  solution: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
    }
}`,
  tests: [
    { input: [[1, 4, 7, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 4, 5, 6, 7] },
    { input: [[1], 1, [], 0], expected: [1] },
    { input: [[0], 0, [3], 1], expected: [3] },
    { input: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], expected: [1, 2, 3, 4, 5, 6] },
    { input: [[-1, 2, 2, 0, 0], 3, [2, 9], 2], expected: [-1, 2, 2, 2, 9] }
  ]
},
{
  id: "move-zeroes", title: "Move Zeroes", difficulty: "Easy",
  description: `<p>Given an array <code>nums</code>, move every <code>0</code> to the end while keeping the <b>relative order</b> of the non-zero values. Do it in place — the tests check <code>nums</code> after your method runs.</p>`,
  constraints: ["1 ≤ nums.length ≤ 10⁴"],
  hint: "Keep a 'write' pointer for where the next non-zero value should go. After copying all non-zeros forward, fill the rest with zeros.",
  method: "moveZeroes", params: [{ name: "nums", type: "int[]" }], returnType: "void", outputArg: 0,
  solution: `class Solution {
    public void moveZeroes(int[] nums) {
        int w = 0;
        for (int x : nums) if (x != 0) nums[w++] = x;
        while (w < nums.length) nums[w++] = 0;
    }
}`,
  tests: [
    { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
    { input: [[0]], expected: [0] },
    { input: [[1, 2, 3]], expected: [1, 2, 3] },
    { input: [[0, 0, -4, 0, 5]], expected: [-4, 5, 0, 0, 0] },
    { input: [[7, 0, 0, 9, 0, 1]], expected: [7, 9, 1, 0, 0, 0] }
  ]
},
{
  id: "two-sum-ii", title: "Two Sum II – Sorted Input", difficulty: "Medium",
  description: `<p><code>numbers</code> is sorted in non-decreasing order. Find two numbers that add up to <code>target</code> and return their positions <b>1-indexed</b>, as <code>[index1, index2]</code> with <code>index1 &lt; index2</code>.</p><p>Exactly one solution exists. Use only O(1) extra memory.</p>`,
  constraints: ["2 ≤ numbers.length ≤ 3·10⁴", "Exactly one solution"],
  hint: "Start with pointers at both ends. If the sum is too small, which pointer should move to make it bigger?",
  method: "twoSum", params: [{ name: "numbers", type: "int[]" }, { name: "target", type: "int" }], returnType: "int[]",
  solution: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int i = 0, j = numbers.length - 1;
        while (i < j) {
            int s = numbers[i] + numbers[j];
            if (s == target) return new int[]{i + 1, j + 1};
            if (s < target) i++; else j--;
        }
        return new int[0];
    }
}`,
  tests: [
    { input: [[2, 7, 11, 15], 9], expected: [1, 2] },
    { input: [[1, 3, 4, 6, 10], 10], expected: [3, 4] },
    { input: [[-3, -1, 0, 5], -4], expected: [1, 2] },
    { input: [[5, 25, 75], 100], expected: [2, 3] },
    { input: [[0, 2, 2, 9], 4], expected: [2, 3] }
  ]
},
{
  id: "three-sum", title: "3Sum", difficulty: "Medium",
  description: `<p>Given <code>nums</code>, return every <b>unique</b> triplet <code>[a, b, c]</code> of values taken from three different positions such that <code>a + b + c == 0</code>.</p><p>The same triplet of values must not appear twice. Triplets (and the numbers inside them) may be returned in any order.</p>`,
  constraints: ["3 ≤ nums.length ≤ 3000"],
  hint: "Sort first. Fix the first number, then use two pointers on the rest of the array to find pairs summing to its negative. Skip equal neighbours to avoid duplicates.",
  method: "threeSum", params: [{ name: "nums", type: "int[]" }], returnType: "List<List<Integer>>", compare: "unorderedDeep",
  solution: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> r = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = nums.length - 1;
            while (lo < hi) {
                int s = nums[i] + nums[lo] + nums[hi];
                if (s < 0) lo++; else if (s > 0) hi--;
                else {
                    r.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                    while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                    lo++; hi--;
                }
            }
        }
        return r;
    }
}`,
  tests: [
    { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
    { input: [[0, 1, 1]], expected: [] },
    { input: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
    { input: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
    { input: [[3, -2, 1, 0]], expected: [] },
    { input: [[-4, -1, -1, 0, 1, 2]], expected: [[-1, -1, 2], [-1, 0, 1]] }
  ]
},
{
  id: "container-most-water", title: "Container With Most Water", difficulty: "Medium",
  description: `<p><code>height[i]</code> is the height of a vertical wall standing at position <code>i</code>. Pick two walls; together with the ground they form a container holding <code>min(height[i], height[j]) × (j − i)</code> units of water.</p><p>Return the <b>maximum</b> amount of water any pair can hold.</p>`,
  constraints: ["2 ≤ height.length ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
  hint: "Start with the widest container (both ends). The shorter wall limits the water, so moving the taller one inward can never help — move the shorter one.",
  method: "maxArea", params: [{ name: "height", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int maxArea(int[] height) {
        int i = 0, j = height.length - 1, best = 0;
        while (i < j) {
            best = Math.max(best, Math.min(height[i], height[j]) * (j - i));
            if (height[i] < height[j]) i++; else j--;
        }
        return best;
    }
}`,
  tests: [
    { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, explain: "Walls at index 1 (8) and 8 (7): min(8, 7) × 7 = 49." },
    { input: [[1, 1]], expected: 1 },
    { input: [[4, 3, 2, 1, 4]], expected: 16 },
    { input: [[0, 2]], expected: 0 },
    { input: [[2, 3, 10, 5, 7, 8, 9]], expected: 36 }
  ]
},
{
  id: "sort-colors", title: "Sort Colors", difficulty: "Medium",
  description: `<p><code>nums</code> contains only <code>0</code>s, <code>1</code>s and <code>2</code>s (think red, white, blue). Sort it <b>in place</b> so all 0s come first, then 1s, then 2s — without calling a library sort.</p><p>Challenge: one pass, O(1) memory.</p>`,
  constraints: ["1 ≤ nums.length ≤ 300", "nums[i] is 0, 1 or 2"],
  hint: "Dutch national flag: keep three pointers — low (next spot for 0), mid (current), high (next spot for 2). Swap and move depending on nums[mid].",
  method: "sortColors", params: [{ name: "nums", type: "int[]" }], returnType: "void", outputArg: 0,
  solution: `class Solution {
    public void sortColors(int[] nums) {
        int lo = 0, mid = 0, hi = nums.length - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) { int t = nums[lo]; nums[lo++] = nums[mid]; nums[mid++] = t; }
            else if (nums[mid] == 2) { int t = nums[hi]; nums[hi--] = nums[mid]; nums[mid] = t; }
            else mid++;
        }
    }
}`,
  tests: [
    { input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
    { input: [[2, 0, 1]], expected: [0, 1, 2] },
    { input: [[1]], expected: [1] },
    { input: [[2, 2, 2, 0]], expected: [0, 2, 2, 2] },
    { input: [[1, 0, 1, 0, 1]], expected: [0, 0, 1, 1, 1] }
  ]
},
{
  id: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard",
  description: `<p><code>height</code> describes a skyline of bars, each 1 unit wide. After it rains, water collects between taller bars. Return the total number of units of water trapped.</p><p>Water above bar <code>i</code> = <code>min(tallest bar to its left, tallest bar to its right) − height[i]</code> (if positive).</p>`,
  constraints: ["1 ≤ height.length ≤ 2·10⁴", "0 ≤ height[i] ≤ 10⁵"],
  hint: "Two pointers with running leftMax and rightMax: whichever side has the smaller max is the one whose water level you already know for sure.",
  method: "trap", params: [{ name: "height", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int trap(int[] height) {
        int i = 0, j = height.length - 1, lm = 0, rm = 0, w = 0;
        while (i < j) {
            if (height[i] < height[j]) { lm = Math.max(lm, height[i]); w += lm - height[i]; i++; }
            else { rm = Math.max(rm, height[j]); w += rm - height[j]; j--; }
        }
        return w;
    }
}`,
  tests: [
    { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
    { input: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    { input: [[1]], expected: 0 },
    { input: [[3, 0, 3]], expected: 3 },
    { input: [[1, 2, 3, 4]], expected: 0 },
    { input: [[5, 1, 1, 1, 2]], expected: 3 }
  ]
}
];
