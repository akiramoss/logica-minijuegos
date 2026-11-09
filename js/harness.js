/* Shared test harness: builds a Java program (Main.java) that runs a
 * problem's tests against the user's Solution and prints one JSON line per
 * test between markers. Used by the browser (with CheerpJ) and by the Node
 * verification script (with a real JDK). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Harness = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var BEGIN = "@@DSA_BEGIN@@";
  var END = "@@DSA_END@@";

  var JAVA_HELPERS = [
    "class ListNode {",
    "  int val; ListNode next;",
    "  ListNode() {}",
    "  ListNode(int val) { this.val = val; }",
    "  ListNode(int val, ListNode next) { this.val = val; this.next = next; }",
    "}",
    "class TreeNode {",
    "  int val; TreeNode left; TreeNode right;",
    "  TreeNode() {}",
    "  TreeNode(int val) { this.val = val; }",
    "  TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }",
    "}"
  ].join("\n");

  var MAIN_UTILS = [
    "  @SafeVarargs static <T> List<T> L(T... a) { return new ArrayList<>(Arrays.asList(a)); }",
    "  static ListNode mkList(int[] v) { ListNode d = new ListNode(0), c = d; for (int x : v) { c.next = new ListNode(x); c = c.next; } return d.next; }",
    "  static ListNode mkCycle(int[] v, int pos) { ListNode h = mkList(v); if (pos < 0 || h == null) return h; ListNode t = h, p = null; int i = 0; for (ListNode c = h; c != null; c = c.next, i++) { if (i == pos) p = c; t = c; } t.next = p; return h; }",
    "  static TreeNode mkTree(Integer[] v) {",
    "    if (v.length == 0 || v[0] == null) return null;",
    "    TreeNode r = new TreeNode(v[0]); ArrayDeque<TreeNode> q = new ArrayDeque<>(); q.add(r); int i = 1;",
    "    while (!q.isEmpty() && i < v.length) { TreeNode n = q.poll();",
    "      if (i < v.length && v[i] != null) { n.left = new TreeNode(v[i]); q.add(n.left); } i++;",
    "      if (i < v.length && v[i] != null) { n.right = new TreeNode(v[i]); q.add(n.right); } i++; }",
    "    return r;",
    "  }",
    "  static String esc(String s) { StringBuilder b = new StringBuilder(\"\\\"\"); for (char ch : s.toCharArray()) { if (ch == '\"' || ch == '\\\\') b.append('\\\\').append(ch); else if (ch == '\\n') b.append(\"\\\\n\"); else if (ch < 32) b.append(String.format(\"\\\\u%04x\", (int) ch)); else b.append(ch); } return b.append('\"').toString(); }",
    "  static String ser(Object o) {",
    "    if (o == null) return \"null\";",
    "    if (o instanceof String) return esc((String) o);",
    "    if (o instanceof Character) return esc(String.valueOf(o));",
    "    if (o instanceof Double || o instanceof Float) { double d = ((Number) o).doubleValue(); if (Double.isNaN(d) || Double.isInfinite(d)) return esc(String.valueOf(d)); return String.valueOf(d); }",
    "    if (o instanceof Number || o instanceof Boolean) return String.valueOf(o);",
    "    if (o instanceof int[]) { int[] a = (int[]) o; StringBuilder b = new StringBuilder(\"[\"); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }",
    "    if (o instanceof long[]) { long[] a = (long[]) o; StringBuilder b = new StringBuilder(\"[\"); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }",
    "    if (o instanceof double[]) { double[] a = (double[]) o; StringBuilder b = new StringBuilder(\"[\"); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(ser(a[i])); } return b.append(']').toString(); }",
    "    if (o instanceof boolean[]) { boolean[] a = (boolean[]) o; StringBuilder b = new StringBuilder(\"[\"); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }",
    "    if (o instanceof char[]) { char[] a = (char[]) o; StringBuilder b = new StringBuilder(\"[\"); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(ser(a[i])); } return b.append(']').toString(); }",
    "    if (o instanceof Object[]) { Object[] a = (Object[]) o; StringBuilder b = new StringBuilder(\"[\"); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(ser(a[i])); } return b.append(']').toString(); }",
    "    if (o instanceof Collection) { StringBuilder b = new StringBuilder(\"[\"); boolean f = true; for (Object x : (Collection<?>) o) { if (!f) b.append(','); f = false; b.append(ser(x)); } return b.append(']').toString(); }",
    "    if (o instanceof ListNode) { StringBuilder b = new StringBuilder(\"[\"); int n = 0; for (ListNode c = (ListNode) o; c != null; c = c.next) { if (n > 0) b.append(','); if (++n > 10000) return esc(\"<list too long or has a cycle>\"); b.append(c.val); } return b.append(']').toString(); }",
    "    if (o instanceof TreeNode) { List<String> out = new ArrayList<>(); ArrayDeque<TreeNode> q = new ArrayDeque<>(); List<TreeNode> lvl = new ArrayList<>(); lvl.add((TreeNode) o); int guard = 0;",
    "      while (!lvl.isEmpty()) { List<TreeNode> nx = new ArrayList<>(); for (TreeNode t : lvl) { if (++guard > 100000) return esc(\"<tree too large>\"); if (t == null) { out.add(\"null\"); } else { out.add(String.valueOf(t.val)); nx.add(t.left); nx.add(t.right); } } boolean any = false; for (TreeNode t : nx) if (t != null) any = true; lvl = any ? nx : new ArrayList<TreeNode>(); }",
    "      int e = out.size(); while (e > 0 && out.get(e - 1).equals(\"null\")) e--; return \"[\" + String.join(\",\", out.subList(0, e)) + \"]\"; }",
    "    return esc(String.valueOf(o));",
    "  }",
    "  static String err(Throwable t) { String m = t.getClass().getSimpleName(); if (t.getMessage() != null) m += \": \" + t.getMessage(); for (StackTraceElement s : t.getStackTrace()) { if (\"Solution\".equals(s.getClassName()) || s.getClassName().equals(DESIGN)) { m += \" (line \" + s.getLineNumber() + \")\"; break; } } return esc(m); }"
  ].join("\n");

  // ---------- Java literals from JSON values ----------
  function jstr(s) {
    var out = '"';
    for (var i = 0; i < s.length; i++) {
      var c = s[i], code = s.charCodeAt(i);
      if (c === '"' || c === "\\") out += "\\" + c;
      else if (c === "\n") out += "\\n";
      else if (code < 32 || code > 126) out += "\\u" + ("0000" + code.toString(16)).slice(-4);
      else out += c;
    }
    return out + '"';
  }
  function jchar(c) {
    if (c === "'" || c === "\\") return "'\\" + c + "'";
    var code = c.charCodeAt(0);
    if (code < 32 || code > 126) return "'\\u" + ("0000" + code.toString(16)).slice(-4) + "'";
    return "'" + c + "'";
  }
  function jdouble(v) {
    var s = String(v);
    return /[.eE]/.test(s) ? s : s + ".0";
  }

  function lit(type, v) {
    switch (type) {
      case "int": return String(v);
      case "long": return String(v) + "L";
      case "double": return jdouble(v);
      case "boolean": return String(!!v);
      case "char": return jchar(v);
      case "String": return jstr(v);
      case "int[]": return "new int[]{" + v.join(",") + "}";
      case "long[]": return "new long[]{" + v.map(function (x) { return x + "L"; }).join(",") + "}";
      case "double[]": return "new double[]{" + v.map(jdouble).join(",") + "}";
      case "boolean[]": return "new boolean[]{" + v.join(",") + "}";
      case "char[]": return "new char[]{" + v.map(jchar).join(",") + "}";
      case "String[]": return "new String[]{" + v.map(jstr).join(",") + "}";
      case "int[][]": return "new int[][]{" + v.map(function (r) { return "{" + r.join(",") + "}"; }).join(",") + "}";
      case "char[][]": return "new char[][]{" + v.map(function (r) { return "{" + r.map(jchar).join(",") + "}"; }).join(",") + "}";
      case "List<Integer>": return "Main.<Integer>L(" + v.join(",") + ")";
      case "List<String>": return "Main.<String>L(" + v.map(jstr).join(",") + ")";
      case "List<List<Integer>>": return "Main.<List<Integer>>L(" + v.map(function (r) { return lit("List<Integer>", r); }).join(",") + ")";
      case "List<List<String>>": return "Main.<List<String>>L(" + v.map(function (r) { return lit("List<String>", r); }).join(",") + ")";
      case "ListNode": return "mkList(new int[]{" + v.join(",") + "})";
      case "ListNode[]": return "new ListNode[]{" + v.map(function (r) { return lit("ListNode", r); }).join(",") + "}";
      case "ListNodeCycle": return "mkCycle(new int[]{" + v.vals.join(",") + "}, " + v.pos + ")";
      case "TreeNode": return "mkTree(new Integer[]{" + v.map(function (x) { return x === null ? "null" : String(x); }).join(",") + "})";
      default: throw new Error("Unsupported type: " + type);
    }
  }
  function declType(type) {
    return type === "ListNodeCycle" ? "ListNode" : type;
  }

  // ---------- program builder ----------
  function splitUserCode(code) {
    var imports = [], body = [];
    code.split("\n").forEach(function (line) {
      if (/^\s*import\s+[\w.*]+\s*;\s*$/.test(line)) { imports.push(line.trim()); body.push(""); }
      else if (/^\s*package\s+[\w.]+\s*;\s*$/.test(line)) body.push("");
      else body.push(line);
    });
    // a public class in Main.java would not compile: make it package-private
    var text = body.join("\n").replace(/(^|\n)(\s*)public\s+((?:final\s+|abstract\s+)*)class\s+/g, "$1$2$3class ");
    return { imports: imports, body: text };
  }

  function testCall(p, t, i) {
    var lines = [];
    lines.push("    try {");
    if (p.design) {
      var d = p.design, ops = t.ops, args = t.args;
      lines.push("      List<String> r = new ArrayList<>(); r.add(\"null\");");
      var ctorArgs = (d.ctor || []).map(function (ty, k) { return lit(ty, args[0][k]); });
      lines.push("      " + d.className + " obj = new " + d.className + "(" + ctorArgs.join(", ") + ");");
      for (var j = 1; j < ops.length; j++) {
        var m = d.methods[ops[j]];
        if (!m) throw new Error(p.id + ": unknown design method " + ops[j]);
        var a = m.params.map(function (ty, k) { return lit(ty, args[j][k]); }).join(", ");
        if (m.ret === "void") lines.push("      obj." + ops[j] + "(" + a + "); r.add(\"null\");");
        else lines.push("      r.add(ser(obj." + ops[j] + "(" + a + ")));");
      }
      lines.push("      out(" + i + ", true, \"[\" + String.join(\",\", r) + \"]\");");
    } else {
      var params = p.params;
      params.forEach(function (prm, k) {
        lines.push("      " + declType(prm.type) + " a" + k + " = " + lit(prm.type, t.input[k]) + ";");
      });
      var call = "new Solution()." + p.method + "(" + params.map(function (_, k) { return "a" + k; }).join(", ") + ")";
      if (p.returnType === "void") {
        lines.push("      " + call + ";");
        lines.push("      out(" + i + ", true, ser(a" + (p.outputArg || 0) + "));");
      } else {
        lines.push("      " + declType(p.returnType) + " res = " + call + ";");
        lines.push("      out(" + i + ", true, ser(res));");
      }
    }
    lines.push("    } catch (Throwable e) { out(" + i + ", false, err(e)); }");
    return lines.join("\n");
  }

  function buildProgram(p, userCode, tests) {
    var u = splitUserCode(userCode);
    var std = ["import java.util.*;", "import java.util.function.*;", "import java.util.stream.*;"];
    var imports = std.concat(u.imports.filter(function (x) { return std.indexOf(x) < 0; }));
    var src = [];
    src.push(imports.join("\n"));
    src.push(JAVA_HELPERS);
    src.push("// ---- your code ----");
    src.push(u.body);
    src.push("// ---- test runner ----");
    src.push("public class Main {");
    src.push("  static final String DESIGN = " + jstr(p.design ? p.design.className : "Solution") + ";");
    src.push(MAIN_UTILS);
    src.push("  static void out(int i, boolean ok, String v) { System.out.println(\"{\\\"i\\\":\" + i + \",\\\"ok\\\":\" + ok + \",\\\"v\\\":\" + v + \"}\"); System.out.flush(); }");
    tests.forEach(function (t, i) {
      src.push("  static void t" + i + "() {");
      src.push(testCall(p, t, i));
      src.push("  }");
    });
    src.push("  public static void main(String[] args) {");
    src.push("    System.out.println(\"" + BEGIN + "\");");
    tests.forEach(function (_, i) { src.push("    t" + i + "();"); });
    src.push("    System.out.println(\"" + END + "\"); System.out.flush();");
    src.push("  }");
    src.push("}");
    var text = src.join("\n");
    // line in Main.java where user code starts (1-based), to map compiler errors
    var before = src.slice(0, 3).join("\n").split("\n").length + 1;
    return { source: text, userLineOffset: before - 1 };
  }

  // ---------- result parsing & comparison ----------
  function parseOutput(text) {
    var b = text.indexOf(BEGIN), e = text.indexOf(END);
    var userOut = [], results = {};
    var region = b >= 0 ? text.slice(b + BEGIN.length, e >= 0 ? e : undefined) : "";
    var pre = b >= 0 ? text.slice(0, b) : text;
    pre.split("\n").forEach(function (l) { if (l.trim()) userOut.push(l); });
    region.split("\n").forEach(function (l) {
      var s = l.trim();
      if (!s) return;
      if (s.charAt(0) === "{" && s.indexOf('"i":') === 1) {
        try { var r = JSON.parse(s); results[r.i] = r; return; } catch (err) { /* fall through */ }
      }
      userOut.push(l);
    });
    return { started: b >= 0, finished: e >= 0, results: results, stdout: userOut.join("\n") };
  }

  function canon(v) { return JSON.stringify(v); }
  function sortDeep(v) {
    if (!Array.isArray(v)) return v;
    var inner = v.map(function (x) { return Array.isArray(x) ? sortDeep(x) : x; });
    return inner.slice().sort(function (a, b) {
      var A = canon(a), B = canon(b);
      return A < B ? -1 : A > B ? 1 : 0;
    });
  }
  function sortOuter(v) {
    if (!Array.isArray(v)) return v;
    return v.slice().sort(function (a, b) {
      var A = canon(a), B = canon(b);
      return A < B ? -1 : A > B ? 1 : 0;
    });
  }
  function nearlyEqual(a, b) {
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= 1e-5 * Math.max(1, Math.abs(b));
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (!nearlyEqual(a[i], b[i])) return false;
      return true;
    }
    return canon(a) === canon(b);
  }

  function compare(mode, actual, expected) {
    switch (mode || "exact") {
      case "exact": return canon(actual) === canon(expected);
      case "float": return nearlyEqual(actual, expected);
      case "unordered": return canon(sortOuter(actual)) === canon(sortOuter(expected));
      case "unorderedDeep": return canon(sortDeep(actual)) === canon(sortDeep(expected));
      default: throw new Error("Unknown compare mode " + mode);
    }
  }

  function grade(p, tests, parsed) {
    return tests.map(function (t, i) {
      var r = parsed.results[i];
      if (!r) return { i: i, status: "not-run" };
      if (!r.ok) return { i: i, status: "error", error: r.v };
      var v = r.v;
      // an empty list / tree is a null reference in Java: show and compare it as []
      var rt = p.returnType === "void" && p.params ? p.params[p.outputArg || 0].type : p.returnType;
      if (v === null && /^(ListNode|TreeNode)/.test(rt || "")) v = [];
      var pass = compare(p.compare, v, t.expected);
      return { i: i, status: pass ? "pass" : "fail", actual: v };
    });
  }

  // Map javac errors "Main.java:LINE: error: msg" to user-code lines.
  function mapCompileErrors(text, userLineOffset, userLineCount) {
    var errs = [];
    var re = /Main\.java:(\d+): error: ([^\n]*)/g, m;
    while ((m = re.exec(text))) {
      var line = parseInt(m[1], 10) - userLineOffset;
      errs.push({ line: line >= 1 && line <= userLineCount ? line : null, message: m[2] });
    }
    return errs;
  }

  return {
    BEGIN: BEGIN, END: END,
    buildProgram: buildProgram, parseOutput: parseOutput,
    compare: compare, grade: grade, mapCompileErrors: mapCompileErrors, lit: lit
  };
});
