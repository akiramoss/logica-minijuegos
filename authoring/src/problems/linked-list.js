const NOTE = `<p class="note">Lists are shown as arrays of node values, from head to tail.</p>`;
module.exports = [
{
  id: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy",
  description: `<p>Given the <code>head</code> of a singly linked list, reverse the list and return the new head.</p>${NOTE}`,
  constraints: ["0 ≤ number of nodes ≤ 5000"],
  hint: "Walk the list keeping three references: prev, current and next. Point current.next back at prev, then step forward.",
  method: "reverseList", params: [{ name: "head", type: "ListNode" }], returnType: "ListNode",
  solution: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        while (head != null) { ListNode nx = head.next; head.next = prev; prev = head; head = nx; }
        return prev;
    }
}`,
  tests: [
    { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
    { input: [[1, 2]], expected: [2, 1] },
    { input: [[]], expected: [] },
    { input: [[9]], expected: [9] },
    { input: [[3, 3, 1]], expected: [1, 3, 3] }
  ]
},
{
  id: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "Easy",
  description: `<p>You get the heads of two sorted linked lists, <code>list1</code> and <code>list2</code>. Splice their nodes together into one sorted list and return its head.</p>${NOTE}`,
  constraints: ["0 ≤ nodes in each list ≤ 50"],
  hint: "A dummy head node removes the special case for the first node. Repeatedly attach the smaller of the two current nodes.",
  method: "mergeTwoLists", params: [{ name: "list1", type: "ListNode" }, { name: "list2", type: "ListNode" }], returnType: "ListNode",
  solution: `class Solution {
    public ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode d = new ListNode(0), t = d;
        while (a != null && b != null) {
            if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; }
            t = t.next;
        }
        t.next = a != null ? a : b;
        return d.next;
    }
}`,
  tests: [
    { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
    { input: [[], []], expected: [] },
    { input: [[], [0]], expected: [0] },
    { input: [[5, 6], [1, 2, 3]], expected: [1, 2, 3, 5, 6] },
    { input: [[-3, 10], [-3, 2, 11]], expected: [-3, -3, 2, 10, 11] }
  ]
},
{
  id: "linked-list-cycle", title: "Linked List Cycle", difficulty: "Easy",
  description: `<p>Given the <code>head</code> of a linked list, return <code>true</code> if the list contains a <b>cycle</b> — some node can be reached again by following <code>next</code> pointers.</p><p>Challenge: use O(1) memory.</p><p class="note">Test input: the node values, plus <code>pos</code> = the index the tail connects back to (−1 means no cycle). <code>pos</code> is not passed to your method.</p>`,
  constraints: ["0 ≤ number of nodes ≤ 10⁴"],
  hint: "Floyd's tortoise and hare: move one pointer 1 step and another 2 steps at a time. If there's a cycle, they must meet.",
  method: "hasCycle", params: [{ name: "head", type: "ListNodeCycle" }], returnType: "boolean",
  solution: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode s = head, f = head;
        while (f != null && f.next != null) { s = s.next; f = f.next.next; if (s == f) return true; }
        return false;
    }
}`,
  tests: [
    { input: [{ vals: [3, 2, 0, -4], pos: 1 }], expected: true },
    { input: [{ vals: [1, 2], pos: 0 }], expected: true },
    { input: [{ vals: [1], pos: -1 }], expected: false },
    { input: [{ vals: [], pos: -1 }], expected: false },
    { input: [{ vals: [1, 2, 3, 4, 5], pos: -1 }], expected: false },
    { input: [{ vals: [7], pos: 0 }], expected: true }
  ]
},
{
  id: "middle-linked-list", title: "Middle of the Linked List", difficulty: "Easy",
  description: `<p>Return the <b>middle node</b> of a non-empty singly linked list. If there are two middle nodes, return the <b>second</b> one. (The tests show the list from that node to the end.)</p>${NOTE}`,
  constraints: ["1 ≤ number of nodes ≤ 100"],
  hint: "Move a slow pointer one step and a fast pointer two steps. When fast reaches the end, slow is in the middle.",
  method: "middleNode", params: [{ name: "head", type: "ListNode" }], returnType: "ListNode",
  solution: `class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode s = head, f = head;
        while (f != null && f.next != null) { s = s.next; f = f.next.next; }
        return s;
    }
}`,
  tests: [
    { input: [[1, 2, 3, 4, 5]], expected: [3, 4, 5] },
    { input: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6] },
    { input: [[1]], expected: [1] },
    { input: [[1, 2]], expected: [2] },
    { input: [[8, 6, 4]], expected: [6, 4] }
  ]
},
{
  id: "remove-nth-from-end", title: "Remove Nth Node From End of List", difficulty: "Medium",
  description: `<p>Remove the <code>n</code>-th node <b>counting from the end</b> of the list and return the head. Try to do it in a single pass.</p>${NOTE}`,
  constraints: ["1 ≤ n ≤ number of nodes ≤ 30"],
  hint: "Use a dummy node before head. Move a fast pointer n steps ahead, then move both until fast hits the end — slow is right before the node to delete.",
  method: "removeNthFromEnd", params: [{ name: "head", type: "ListNode" }, { name: "n", type: "int" }], returnType: "ListNode",
  solution: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode d = new ListNode(0, head), f = d, s = d;
        for (int i = 0; i < n; i++) f = f.next;
        while (f.next != null) { f = f.next; s = s.next; }
        s.next = s.next.next;
        return d.next;
    }
}`,
  tests: [
    { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
    { input: [[1], 1], expected: [] },
    { input: [[1, 2], 1], expected: [1] },
    { input: [[1, 2], 2], expected: [2] },
    { input: [[10, 20, 30], 3], expected: [20, 30] }
  ]
},
{
  id: "reorder-list", title: "Reorder List", difficulty: "Medium",
  description: `<p>A list <code>L0 → L1 → … → Ln-1 → Ln</code> must be rearranged <b>in place</b> into <code>L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …</code>. Change the links, not the values. The method returns nothing — tests check the list starting at <code>head</code>.</p>${NOTE}`,
  constraints: ["1 ≤ number of nodes ≤ 5·10⁴"],
  hint: "Three steps: find the middle, reverse the second half, then weave the two halves together.",
  method: "reorderList", params: [{ name: "head", type: "ListNode" }], returnType: "void", outputArg: 0,
  solution: `class Solution {
    public void reorderList(ListNode head) {
        ListNode s = head, f = head;
        while (f.next != null && f.next.next != null) { s = s.next; f = f.next.next; }
        ListNode prev = null, c = s.next; s.next = null;
        while (c != null) { ListNode nx = c.next; c.next = prev; prev = c; c = nx; }
        ListNode a = head, b = prev;
        while (b != null) { ListNode an = a.next, bn = b.next; a.next = b; b.next = an; a = an; b = bn; }
    }
}`,
  tests: [
    { input: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] },
    { input: [[1, 2, 3, 4, 5]], expected: [1, 5, 2, 4, 3] },
    { input: [[1]], expected: [1] },
    { input: [[1, 2]], expected: [1, 2] },
    { input: [[1, 2, 3, 4, 5, 6]], expected: [1, 6, 2, 5, 3, 4] }
  ]
},
{
  id: "add-two-numbers", title: "Add Two Numbers", difficulty: "Medium",
  description: `<p>Two non-negative integers are stored as linked lists of digits in <b>reverse order</b> (the head holds the ones digit). Add them and return the sum as a list in the same format.</p><p>The numbers have no leading zeros, except the number 0 itself.</p>${NOTE}`,
  constraints: ["1 ≤ nodes in each list ≤ 100", "0 ≤ Node.val ≤ 9"],
  hint: "Add digit by digit like on paper, carrying when a column reaches 10. Don't forget a final carry.",
  method: "addTwoNumbers", params: [{ name: "l1", type: "ListNode" }, { name: "l2", type: "ListNode" }], returnType: "ListNode",
  solution: `class Solution {
    public ListNode addTwoNumbers(ListNode a, ListNode b) {
        ListNode d = new ListNode(0), t = d; int carry = 0;
        while (a != null || b != null || carry > 0) {
            int s = carry + (a != null ? a.val : 0) + (b != null ? b.val : 0);
            carry = s / 10; t.next = new ListNode(s % 10); t = t.next;
            if (a != null) a = a.next; if (b != null) b = b.next;
        }
        return d.next;
    }
}`,
  tests: [
    { input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8], explain: "342 + 465 = 807" },
    { input: [[0], [0]], expected: [0] },
    { input: [[9, 9, 9, 9], [9, 9]], expected: [8, 9, 0, 0, 1] },
    { input: [[1], [9, 9]], expected: [0, 0, 1] },
    { input: [[5], [5]], expected: [0, 1] }
  ]
},
{
  id: "merge-k-sorted-lists", title: "Merge k Sorted Lists", difficulty: "Hard",
  description: `<p>You get an array of <code>k</code> linked lists, each sorted ascending. Merge them all into one sorted list and return its head.</p>${NOTE}`,
  constraints: ["0 ≤ k ≤ 10⁴", "Total nodes ≤ 10⁴"],
  hint: "A min-heap (PriorityQueue) holding the current head of each list always gives you the next smallest node in O(log k).",
  method: "mergeKLists", params: [{ name: "lists", type: "ListNode[]" }], returnType: "ListNode",
  solution: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((x, y) -> Integer.compare(x.val, y.val));
        for (ListNode l : lists) if (l != null) pq.add(l);
        ListNode d = new ListNode(0), t = d;
        while (!pq.isEmpty()) { ListNode n = pq.poll(); t.next = n; t = n; if (n.next != null) pq.add(n.next); }
        return d.next;
    }
}`,
  tests: [
    { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
    { input: [[]], expected: [] },
    { input: [[[]]], expected: [] },
    { input: [[[2], [], [1]]], expected: [1, 2] },
    { input: [[[-5, 0], [-6, 10], [3]]], expected: [-6, -5, 0, 3, 10] }
  ]
},
{
  id: "reverse-k-group", title: "Reverse Nodes in k-Group", difficulty: "Hard",
  description: `<p>Reverse the nodes of the list <code>k</code> at a time and return the new head. If the number of nodes left at the end is less than <code>k</code>, leave them in their original order.</p><p>Only change links, not node values.</p>${NOTE}`,
  constraints: ["1 ≤ k ≤ number of nodes ≤ 5000"],
  hint: "Process groups one at a time: check that k nodes remain, reverse exactly those k, and connect the previous group's tail to the new group's head.",
  method: "reverseKGroup", params: [{ name: "head", type: "ListNode" }, { name: "k", type: "int" }], returnType: "ListNode",
  solution: `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode d = new ListNode(0, head), groupPrev = d;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;
            ListNode groupNext = kth.next, prev = groupNext, c = groupPrev.next;
            while (c != groupNext) { ListNode nx = c.next; c.next = prev; prev = c; c = nx; }
            ListNode first = groupPrev.next; groupPrev.next = kth; groupPrev = first;
        }
        return d.next;
    }
}`,
  tests: [
    { input: [[1, 2, 3, 4, 5], 2], expected: [2, 1, 4, 3, 5] },
    { input: [[1, 2, 3, 4, 5], 3], expected: [3, 2, 1, 4, 5] },
    { input: [[1, 2, 3], 1], expected: [1, 2, 3] },
    { input: [[1, 2, 3, 4], 4], expected: [4, 3, 2, 1] },
    { input: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [3, 2, 1, 6, 5, 4, 7] }
  ]
}
];
