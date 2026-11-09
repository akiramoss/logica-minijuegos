module.exports = [
{
  id: "binary-search", title: "Binary Search", difficulty: "Easy",
  description: `<p><code>nums</code> is sorted in ascending order with distinct values. Return the index of <code>target</code>, or <code>-1</code> if it isn't there.</p><p>Your solution must run in O(log n).</p>`,
  constraints: ["1 ≤ nums.length ≤ 10⁴", "Values are distinct and sorted"],
  hint: "Look at the middle element. If it's too small, the answer can only be to its right; if too big, to its left. Repeat on the remaining half.",
  method: "search", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
        }
        return -1;
    }
}`,
  tests: [
    { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    { input: [[5], 5], expected: 0 },
    { input: [[1, 4, 6, 8], 1], expected: 0 },
    { input: [[1, 4, 6, 8], 8], expected: 3 },
    { input: [[2, 3], 1], expected: -1 }
  ]
},
{
  id: "search-insert-position", title: "Search Insert Position", difficulty: "Easy",
  description: `<p>Given a sorted array of distinct integers and a <code>target</code>, return the index of <code>target</code> if it's present. Otherwise, return the index where it <b>would be inserted</b> to keep the array sorted.</p><p>Aim for O(log n).</p>`,
  constraints: ["1 ≤ nums.length ≤ 10⁴"],
  hint: "Binary search for the first index whose value is ≥ target. If no such index exists, the answer is nums.length.",
  method: "searchInsert", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;
        while (lo < hi) { int mid = (lo + hi) >>> 1; if (nums[mid] < target) lo = mid + 1; else hi = mid; }
        return lo;
    }
}`,
  tests: [
    { input: [[1, 3, 5, 6], 5], expected: 2 },
    { input: [[1, 3, 5, 6], 2], expected: 1 },
    { input: [[1, 3, 5, 6], 7], expected: 4 },
    { input: [[1, 3, 5, 6], 0], expected: 0 },
    { input: [[10], 10], expected: 0 }
  ]
},
{
  id: "integer-sqrt", title: "Integer Square Root", difficulty: "Easy",
  description: `<p>Given a non-negative integer <code>x</code>, return the square root of <code>x</code> <b>rounded down</b> to the nearest integer.</p><p>Don't use <code>Math.sqrt</code> or <code>Math.pow</code> — search for the answer instead.</p>`,
  constraints: ["0 ≤ x ≤ 2³¹ − 1"],
  hint: "Binary search on the answer r in [0, x]: is r × r ≤ x? Use long for r × r to avoid overflow.",
  method: "mySqrt", params: [{ name: "x", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int mySqrt(int x) {
        long lo = 0, hi = x;
        while (lo < hi) { long mid = (lo + hi + 1) / 2; if (mid * mid <= x) lo = mid; else hi = mid - 1; }
        return (int) lo;
    }
}`,
  tests: [
    { input: [4], expected: 2 },
    { input: [8], expected: 2, explain: "√8 ≈ 2.83, rounded down is 2." },
    { input: [0], expected: 0 },
    { input: [1], expected: 1 },
    { input: [99], expected: 9 },
    { input: [2147395600], expected: 46340 },
    { input: [2147483647], expected: 46340 }
  ]
},
{
  id: "search-2d-matrix", title: "Search a 2D Matrix", difficulty: "Medium",
  description: `<p>In <code>matrix</code>, each row is sorted ascending, and the first value of each row is greater than the last value of the previous row. Return <code>true</code> if <code>target</code> is in the matrix.</p><p>Aim for O(log(m·n)).</p>`,
  constraints: ["1 ≤ m, n ≤ 100"],
  hint: "Read row by row, the matrix is one sorted list of m·n values. Index k maps to matrix[k / n][k % n].",
  method: "searchMatrix", params: [{ name: "matrix", type: "int[][]" }, { name: "target", type: "int" }], returnType: "boolean",
  solution: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length, lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1, v = matrix[mid / n][mid % n];
            if (v == target) return true;
            if (v < target) lo = mid + 1; else hi = mid - 1;
        }
        return false;
    }
}`,
  tests: [
    { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
    { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
    { input: [[[5]], 5], expected: true },
    { input: [[[1, 2], [3, 4]], 4], expected: true },
    { input: [[[1], [3], [5]], 2], expected: false }
  ]
},
{
  id: "koko-bananas", title: "Koko Eating Bananas", difficulty: "Medium",
  description: `<p>There are piles of bananas, <code>piles[i]</code> in pile <code>i</code>. Koko picks an eating speed <code>k</code> (bananas per hour). Each hour she chooses one pile and eats <code>k</code> bananas from it — if the pile has fewer, she finishes it and waits for the rest of that hour.</p><p>Return the <b>smallest</b> <code>k</code> that lets her finish everything within <code>h</code> hours.</p>`,
  constraints: ["1 ≤ piles.length ≤ h ≤ 10⁹", "1 ≤ piles[i] ≤ 10⁹"],
  hint: "If speed k works, every bigger speed works too. Binary search k in [1, max pile]; hours for a pile is ceil(pile / k). Sum hours in a long.",
  method: "minEatingSpeed", params: [{ name: "piles", type: "int[]" }, { name: "h", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = 0; for (int p : piles) hi = Math.max(hi, p);
        while (lo < hi) {
            int k = lo + (hi - lo) / 2; long hours = 0;
            for (int p : piles) hours += (p + (long) k - 1) / k;
            if (hours <= h) hi = k; else lo = k + 1;
        }
        return lo;
    }
}`,
  tests: [
    { input: [[3, 6, 7, 11], 8], expected: 4 },
    { input: [[30, 11, 23, 4, 20], 5], expected: 30 },
    { input: [[30, 11, 23, 4, 20], 6], expected: 23 },
    { input: [[1, 1, 1], 3], expected: 1 },
    { input: [[1000000000], 2], expected: 500000000 }
  ]
},
{
  id: "min-rotated-sorted", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium",
  description: `<p>An ascending array of <b>distinct</b> values was rotated some number of times (e.g. <code>[0,1,2,4,5,6,7]</code> might become <code>[4,5,6,7,0,1,2]</code>). Return its minimum element in O(log n).</p>`,
  constraints: ["1 ≤ nums.length ≤ 5000", "Values are distinct"],
  hint: "Compare nums[mid] with nums[hi]. If nums[mid] > nums[hi], the minimum is to the right of mid; otherwise it's at mid or to its left.",
  method: "findMin", params: [{ name: "nums", type: "int[]" }], returnType: "int",
  solution: `class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) { int mid = (lo + hi) >>> 1; if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid; }
        return nums[lo];
    }
}`,
  tests: [
    { input: [[3, 4, 5, 1, 2]], expected: 1 },
    { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
    { input: [[11, 13, 15, 17]], expected: 11 },
    { input: [[2, 1]], expected: 1 },
    { input: [[9]], expected: 9 },
    { input: [[5, 6, 7, 8, 9, 2]], expected: 2 }
  ]
},
{
  id: "search-rotated-sorted", title: "Search in Rotated Sorted Array", difficulty: "Medium",
  description: `<p><code>nums</code> is an ascending array of distinct values that may have been rotated at an unknown pivot. Return the index of <code>target</code>, or <code>-1</code> if it isn't present. Required: O(log n).</p>`,
  constraints: ["1 ≤ nums.length ≤ 5000", "Values are distinct"],
  hint: "At every step, at least one half (lo..mid or mid..hi) is sorted. Check whether the target lies inside that sorted half to decide where to go.",
  method: "search", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returnType: "int",
  solution: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
            }
        }
        return -1;
    }
}`,
  tests: [
    { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
    { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
    { input: [[1], 0], expected: -1 },
    { input: [[3, 1], 1], expected: 1 },
    { input: [[6, 7, 1, 2, 3, 4, 5], 7], expected: 1 },
    { input: [[1, 2, 3, 4], 3], expected: 2 }
  ]
},
{
  id: "median-two-sorted", title: "Median of Two Sorted Arrays", difficulty: "Hard",
  description: `<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code>, return the <b>median</b> of all their values combined. (With an even total count, the median is the average of the two middle values.)</p><p>The target complexity is O(log(m + n)), though a linear merge will also pass these tests.</p>`,
  constraints: ["0 ≤ m, n ≤ 1000", "1 ≤ m + n"],
  hint: "Binary search a cut in the smaller array so that the left parts of both arrays together contain half of the values and every left value ≤ every right value.",
  method: "findMedianSortedArrays", params: [{ name: "nums1", type: "int[]" }, { name: "nums2", type: "int[]" }], returnType: "double", compare: "float",
  solution: `class Solution {
    public double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) { int[] t = a; a = b; b = t; }
        int m = a.length, n = b.length, half = (m + n + 1) / 2, lo = 0, hi = m;
        while (true) {
            int i = (lo + hi) / 2, j = half - i;
            int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1], aR = i == m ? Integer.MAX_VALUE : a[i];
            int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1], bR = j == n ? Integer.MAX_VALUE : b[j];
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return Math.max(aL, bL);
                return (Math.max(aL, bL) + (double) Math.min(aR, bR)) / 2;
            }
            if (aL > bR) hi = i - 1; else lo = i + 1;
        }
    }
}`,
  tests: [
    { input: [[1, 3], [2]], expected: 2.0 },
    { input: [[1, 2], [3, 4]], expected: 2.5 },
    { input: [[], [7]], expected: 7.0 },
    { input: [[1, 5, 9], []], expected: 5.0 },
    { input: [[2, 2, 2], [2, 2]], expected: 2.0 },
    { input: [[1, 3, 8, 9, 15], [7, 11, 18, 19, 21, 25]], expected: 11.0 }
  ]
}
];
