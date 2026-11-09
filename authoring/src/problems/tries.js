module.exports = [
{
  id: "longest-common-prefix", title: "Longest Common Prefix", difficulty: "Easy",
  description: `<p>Return the longest string that is a <b>prefix of every word</b> in <code>strs</code>. If they share no prefix, return <code>""</code>.</p><p>This is a great warm-up for tries: the common prefix is the path from the root while each node has exactly one child.</p>`,
  constraints: ["1 ≤ strs.length ≤ 200", "0 ≤ strs[i].length ≤ 200"],
  hint: "Compare characters column by column across all words, stopping at the first mismatch or the end of the shortest word.",
  method: "longestCommonPrefix", params: [{ name: "strs", type: "String[]" }], returnType: "String",
  solution: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        for (int i = 0; i < strs[0].length(); i++)
            for (String s : strs)
                if (i >= s.length() || s.charAt(i) != strs[0].charAt(i)) return strs[0].substring(0, i);
        return strs[0];
    }
}`,
  tests: [
    { input: [["flower", "flow", "flight"]], expected: "fl" },
    { input: [["dog", "racecar", "car"]], expected: "" },
    { input: [["solo"]], expected: "solo" },
    { input: [["ab", "a"]], expected: "a" },
    { input: [["interview", "internet", "interval"]], expected: "inter" },
    { input: [["", "b"]], expected: "" }
  ]
},
{
  id: "implement-trie", title: "Implement Trie (Prefix Tree)", difficulty: "Medium",
  description: `<p>A <b>trie</b> stores strings in a tree where each edge is a letter, so words sharing a prefix share a path. Implement class <code>Trie</code>:</p><ul><li><code>Trie()</code> creates an empty trie</li><li><code>void insert(String word)</code></li><li><code>boolean search(String word)</code> — true if <code>word</code> was inserted</li><li><code>boolean startsWith(String prefix)</code> — true if any inserted word starts with <code>prefix</code></li></ul><p class="note">Tests list the calls made and the value each one returns (<code>null</code> for void methods).</p>`,
  constraints: ["Lowercase letters only", "Up to 3·10⁴ calls"],
  hint: "Each node has 26 child slots and an 'end of word' flag. search needs the flag at the last node; startsWith only needs the path to exist.",
  design: { className: "Trie", ctor: [], ctorNames: [], methods: {
    insert: { params: ["String"], names: ["word"], ret: "void" },
    search: { params: ["String"], names: ["word"], ret: "boolean" },
    startsWith: { params: ["String"], names: ["prefix"], ret: "boolean" } } },
  solution: `class Trie {
    private final Trie[] next = new Trie[26];
    private boolean end;
    public Trie() {}
    public void insert(String word) { Trie t = this; for (char c : word.toCharArray()) { if (t.next[c - 'a'] == null) t.next[c - 'a'] = new Trie(); t = t.next[c - 'a']; } t.end = true; }
    private Trie walk(String s) { Trie t = this; for (char c : s.toCharArray()) { t = t.next[c - 'a']; if (t == null) return null; } return t; }
    public boolean search(String word) { Trie t = walk(word); return t != null && t.end; }
    public boolean startsWith(String prefix) { return walk(prefix) != null; }
}`,
  tests: [
    { ops: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"], args: [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]], expected: [null, null, true, false, true, null, true] },
    { ops: ["Trie", "search", "startsWith"], args: [[], ["a"], ["a"]], expected: [null, false, false] },
    { ops: ["Trie", "insert", "insert", "startsWith", "startsWith", "search"], args: [[], ["car"], ["cat"], ["ca"], ["co"], ["ca"]], expected: [null, null, null, true, false, false] },
    { ops: ["Trie", "insert", "search", "search", "startsWith"], args: [[], ["z"], ["z"], ["zz"], ["z"]], expected: [null, null, true, false, true] }
  ]
},
{
  id: "add-search-words", title: "Design Add and Search Words", difficulty: "Medium",
  description: `<p>Implement class <code>WordDictionary</code>:</p><ul><li><code>WordDictionary()</code> creates an empty dictionary</li><li><code>void addWord(String word)</code></li><li><code>boolean search(String word)</code> — true if some added word matches. <code>word</code> may contain dots <code>'.'</code>, and a dot matches <b>any one letter</b>.</li></ul><p class="note">Tests list the calls made and the value each one returns (<code>null</code> for void methods).</p>`,
  constraints: ["Lowercase letters; search patterns may include '.'", "At most 2 dots per search"],
  hint: "Store words in a trie. When searching, a dot means 'try every existing child' — a small DFS.",
  design: { className: "WordDictionary", ctor: [], ctorNames: [], methods: {
    addWord: { params: ["String"], names: ["word"], ret: "void" },
    search: { params: ["String"], names: ["word"], ret: "boolean" } } },
  solution: `class WordDictionary {
    private final WordDictionary[] next = new WordDictionary[26];
    private boolean end;
    public WordDictionary() {}
    public void addWord(String word) { WordDictionary t = this; for (char c : word.toCharArray()) { if (t.next[c - 'a'] == null) t.next[c - 'a'] = new WordDictionary(); t = t.next[c - 'a']; } t.end = true; }
    public boolean search(String word) { return find(word, 0); }
    private boolean find(String w, int i) {
        if (i == w.length()) return end;
        char c = w.charAt(i);
        if (c != '.') return next[c - 'a'] != null && next[c - 'a'].find(w, i + 1);
        for (WordDictionary n : next) if (n != null && n.find(w, i + 1)) return true;
        return false;
    }
}`,
  tests: [
    { ops: ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"], args: [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]], expected: [null, null, null, null, false, true, true, true] },
    { ops: ["WordDictionary", "addWord", "search", "search", "search"], args: [[], ["a"], ["."], [".."], ["a"]], expected: [null, null, true, false, true] },
    { ops: ["WordDictionary", "search"], args: [[], ["."]], expected: [null, false] },
    { ops: ["WordDictionary", "addWord", "addWord", "search", "search", "search"], args: [[], ["at"], ["and"], ["a."], ["a.d"], ["an."]], expected: [null, null, null, true, true, true] },
    { ops: ["WordDictionary", "addWord", "search", "search"], args: [[], ["hello"], ["h.ll."], ["h.l.o."]], expected: [null, null, true, false] }
  ]
},
{
  id: "word-search-ii", title: "Word Search II", difficulty: "Hard",
  description: `<p>Given an <code>m × n</code> grid of letters <code>board</code> and a list of <code>words</code>, return every word that can be traced on the board. A word is traced by moving between <b>horizontally or vertically adjacent</b> cells, and a single cell can't be used twice in the same word.</p><p>Return each found word once, in any order.</p>`,
  constraints: ["1 ≤ m, n ≤ 12", "1 ≤ words.length ≤ 3·10⁴", "Words are distinct"],
  hint: "Put all words in a trie, then DFS from each cell while walking the trie at the same time — one search finds many words. Remove a word from the trie once found.",
  method: "findWords", params: [{ name: "board", type: "char[][]" }, { name: "words", type: "String[]" }], returnType: "List<String>", compare: "unordered",
  solution: `class Solution {
    static class Node { Node[] next = new Node[26]; String word; }
    public List<String> findWords(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) { Node t = root; for (char c : w.toCharArray()) { if (t.next[c - 'a'] == null) t.next[c - 'a'] = new Node(); t = t.next[c - 'a']; } t.word = w; }
        List<String> r = new ArrayList<>();
        for (int i = 0; i < board.length; i++) for (int j = 0; j < board[0].length; j++) dfs(board, i, j, root, r);
        return r;
    }
    private void dfs(char[][] b, int i, int j, Node t, List<String> r) {
        if (i < 0 || j < 0 || i >= b.length || j >= b[0].length) return;
        char c = b[i][j]; if (c == '#' || t.next[c - 'a'] == null) return;
        t = t.next[c - 'a'];
        if (t.word != null) { r.add(t.word); t.word = null; }
        b[i][j] = '#';
        dfs(b, i + 1, j, t, r); dfs(b, i - 1, j, t, r); dfs(b, i, j + 1, t, r); dfs(b, i, j - 1, t, r);
        b[i][j] = c;
    }
}`,
  tests: [
    { input: [[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath", "pea", "eat", "rain"]], expected: ["eat", "oath"] },
    { input: [[["a","b"],["c","d"]], ["abcb"]], expected: [] },
    { input: [[["a"]], ["a", "b"]], expected: ["a"] },
    { input: [[["a","b"],["c","d"]], ["ab", "ac", "ad", "abdc", "bdca"]], expected: ["ab", "ac", "abdc", "bdca"] },
    { input: [[["a","a"]], ["aaa", "aa"]], expected: ["aa"] }
  ]
}
];
