/* Compiles and runs Java in the browser with CheerpJ (javac + JVM in WebAssembly). */
(function () {
  "use strict";
  var LOADER = "https://cjrtnc.leaningtech.com/5.0/loader.js";
  var JAVA_VERSION = 21;
  var initPromise = null, runCount = 0, busy = false, stuck = false;

  function consoleEl() { return document.getElementById("console"); }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res;
      s.onerror = function () { rej(new Error("Could not download the Java runtime (" + src + "). Check your connection or ad blocker.")); };
      document.head.appendChild(s);
    });
  }

  function init(onStatus) {
    if (!initPromise) {
      initPromise = (async function () {
        onStatus && onStatus("Downloading Java runtime…");
        if (typeof window.cheerpjInit !== "function") await loadScript(LOADER);
        onStatus && onStatus("Starting Java " + JAVA_VERSION + "…");
        await window.cheerpjInit({ version: JAVA_VERSION });
      })();
      initPromise.catch(function () { initPromise = null; });
    }
    return initPromise;
  }

  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (_, rej) {
      setTimeout(function () { var e = new Error("timeout"); e.timeout = true; rej(e); }, ms);
    })]);
  }

  // Returns { phase: "compile"|"run", ok, output, timedOut }
  async function compileAndRun(source, onStatus) {
    if (stuck) throw new Error("Java is still busy with a previous run that never finished (probably an infinite loop). Reload the page to reset it.");
    if (busy) throw new Error("Already running — wait for the current run to finish.");
    busy = true;
    try {
      var first = !initPromise;
      await init(onStatus);
      var n = ++runCount, dir = "/files/run" + n, file = "/str/run" + n + "/Main.java";
      window.cheerpOSAddStringFile(file, source);
      var con = consoleEl();
      con.textContent = "";
      onStatus && onStatus(first ? "Compiling (the first compile warms up javac and is slow)…" : "Compiling…");
      var rc;
      try {
        rc = await withTimeout(window.cheerpjRunMain("com.sun.tools.javac.Main", "", "-nowarn", "-d", dir, file), 180000);
      } catch (e) { if (e.timeout) { stuck = true; return { phase: "compile", ok: false, timedOut: true, output: con.textContent }; } throw e; }
      var compileOut = con.textContent;
      if (rc !== 0) return { phase: "compile", ok: false, output: compileOut };
      con.textContent = "";
      onStatus && onStatus("Running tests…");
      try {
        await withTimeout(window.cheerpjRunMain("Main", dir), 20000);
      } catch (e) { if (e.timeout) { stuck = true; return { phase: "run", ok: false, timedOut: true, output: con.textContent }; } throw e; }
      return { phase: "run", ok: true, output: con.textContent };
    } finally {
      busy = false;
    }
  }

  window.Runner = { init: init, compileAndRun: compileAndRun, isReady: function () { return !!initPromise; } };
})();
