/* Generates starter code from a problem's signature. Shared by browser and Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Starter = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function declType(t) { return t === "ListNodeCycle" ? "ListNode" : t; }
  function defaultReturn(t) {
    switch (t) {
      case "void": return null;
      case "int": case "long": return "0";
      case "double": return "0.0";
      case "boolean": return "false";
      case "char": return "' '";
      default: return "null";
    }
  }
  function method(name, params, ret, indent) {
    var sig = params.map(function (p) { return declType(p.type) + " " + p.name; }).join(", ");
    var r = defaultReturn(ret);
    var lines = [indent + "public " + declType(ret) + " " + name + "(" + sig + ") {",
      indent + "    // Write your code here"];
    if (r !== null) lines.push(indent + "    return " + r + ";");
    lines.push(indent + "}");
    return lines.join("\n");
  }
  function starter(p) {
    if (p.design) {
      var d = p.design, out = ["class " + d.className + " {", ""];
      var ctor = (d.ctorNames || []).map(function (n, i) { return d.ctor[i] + " " + n; }).join(", ");
      out.push("    public " + d.className + "(" + ctor + ") {", "        ", "    }");
      Object.keys(d.methods).forEach(function (name) {
        var m = d.methods[name];
        var params = m.params.map(function (t, i) { return { type: t, name: (m.names && m.names[i]) || "arg" + i }; });
        out.push("");
        out.push(method(name, params, m.ret, "    "));
      });
      out.push("}");
      return out.join("\n");
    }
    var pre = [];
    var types = JSON.stringify([p.returnType].concat(p.params.map(function (x) { return x.type; })));
    if (/ListNode/.test(types)) pre.push("/**\n * Definition for singly-linked list (provided):\n * class ListNode { int val; ListNode next; ListNode(int val) {...} }\n */");
    if (/TreeNode/.test(types)) pre.push("/**\n * Definition for a binary tree node (provided):\n * class TreeNode { int val; TreeNode left, right; TreeNode(int val) {...} }\n */");
    return (pre.length ? pre.join("\n") + "\n" : "") +
      "class Solution {\n" + method(p.method, p.params, p.returnType, "    ") + "\n}";
  }
  return { starter: starter };
});
