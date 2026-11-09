(function () {
  "use strict";
  var DATA = null, BY_ID = {};
  var STORE_KEY = "dsa-weekly-v1";
  var DAY = 86400000;
  var filters = { q: "", topic: "", diff: "", status: "" };
  var editor = null, current = null, saveTimer = null;

  // ---------- storage ----------
  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
  var store = load();
  store.solved = store.solved || {}; store.code = store.code || {};
  function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* private mode: progress lives for this visit only */ } }

  // ---------- helpers ----------
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function startDate() { var p = DATA.config.startDate.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function weekDate(w) { var d = startDate(); d.setDate(d.getDate() + (w - 1) * 7); return d; }
  function fmtDate(d) { return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
  function currentWeek() {
    var now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var w = Math.floor((today - startDate()) / (7 * DAY)) + 1;
    return Math.max(0, w);
  }
  function totalWeeks() { return Math.ceil(DATA.problems.length / DATA.config.perWeek); }
  function isOpen(p) { return p.week <= currentWeek(); }
  function released() { return DATA.problems.filter(isOpen); }
  function solvedCount(list) { return list.filter(function (p) { return store.solved[p.id]; }).length; }
  function diffClass(d) { return "d-" + d.toLowerCase(); }
  function show(v) { return JSON.stringify(v); }

  function renderStats() {
    var r = released(), w = Math.min(currentWeek(), totalWeeks());
    document.getElementById("topStats").innerHTML =
      '<span class="stat"><b>' + solvedCount(r) + "</b> / " + r.length + " solved</span>" +
      '<span class="stat muted">Week ' + w + " of " + totalWeeks() + "</span>";
  }

  // ---------- home ----------
  function renderHome() {
    current = null; editor = null;
    var app = document.getElementById("app"), w = currentWeek(), rel = released();
    var thisWeek = DATA.problems.filter(function (p) { return p.week === Math.min(w, totalWeeks()); });
    var pct = rel.length ? Math.round(100 * solvedCount(rel) / rel.length) : 0;
    var next = w < totalWeeks() ? "Next 5 unlock <b>" + fmtDate(weekDate(w + 1)) + "</b>" : "Every problem is unlocked 🎉";
    if (w === 0) next = "The first problems unlock <b>" + fmtDate(weekDate(1)) + "</b>";

    var html = '<section class="hero">' +
      '<div class="hero-text"><h1>Solve data-structure problems in Java, one week at a time.</h1>' +
      '<p>100 problems from easy to hard. Five new ones unlock every Monday: easy problems first, then medium, then hard. Write your solution and run the tests right here in the browser.</p>' +
      '<div class="progress"><div class="bar"><span style="width:' + pct + '%"></span></div><span>' + solvedCount(rel) + " of " + rel.length + " unlocked problems solved · " + next + "</span></div>" +
      '<button class="btn primary" id="randomBtn">🎲 Random unsolved problem</button></div>' +
      '<div class="week-card"><h2>This week' + (w ? " · Week " + Math.min(w, totalWeeks()) : "") + "</h2><ol>" +
      thisWeek.map(function (p) {
        return '<li><a href="#/p/' + p.id + '" class="' + (isOpen(p) ? "" : "locked") + '"><span class="chk">' + (store.solved[p.id] ? "✓" : "") + "</span>" + esc(p.title) + ' <span class="badge ' + diffClass(p.difficulty) + '">' + p.difficulty + "</span></a></li>";
      }).join("") + "</ol></div></section>";

    html += '<section class="filters">' +
      '<input id="fq" type="search" placeholder="Search problems…" value="' + esc(filters.q) + '">' +
      '<select id="ftopic"><option value="">All topics</option>' + DATA.config.topics.map(function (t) { return "<option" + (filters.topic === t ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("") + "</select>" +
      '<div class="seg" id="fdiff">' + ["", "Easy", "Medium", "Hard"].map(function (d) { return '<button data-v="' + d + '" class="' + (filters.diff === d ? "on" : "") + '">' + (d || "All") + "</button>"; }).join("") + "</div>" +
      '<select id="fstatus"><option value="">Any status</option><option value="todo"' + (filters.status === "todo" ? " selected" : "") + '>Unsolved</option><option value="done"' + (filters.status === "done" ? " selected" : "") + '>Solved</option><option value="open"' + (filters.status === "open" ? " selected" : "") + ">Unlocked only</option></select>" +
      "</section><section id='list'></section>";
    app.innerHTML = html;

    document.getElementById("randomBtn").onclick = randomProblem;
    document.getElementById("fq").oninput = function (e) { filters.q = e.target.value; renderList(); };
    document.getElementById("ftopic").onchange = function (e) { filters.topic = e.target.value; renderList(); };
    document.getElementById("fstatus").onchange = function (e) { filters.status = e.target.value; renderList(); };
    Array.prototype.forEach.call(document.querySelectorAll("#fdiff button"), function (b) {
      b.onclick = function () { filters.diff = b.dataset.v; Array.prototype.forEach.call(document.querySelectorAll("#fdiff button"), function (x) { x.classList.toggle("on", x === b); }); renderList(); };
    });
    renderList(); renderStats();
  }

  function matches(p) {
    if (filters.topic && p.topic !== filters.topic) return false;
    if (filters.diff && p.difficulty !== filters.diff) return false;
    if (filters.status === "todo" && (store.solved[p.id] || !isOpen(p))) return false;
    if (filters.status === "done" && !store.solved[p.id]) return false;
    if (filters.status === "open" && !isOpen(p)) return false;
    if (filters.q && p.title.toLowerCase().indexOf(filters.q.toLowerCase()) < 0) return false;
    return true;
  }

  function renderList() {
    var list = document.getElementById("list"), html = "", any = false;
    DATA.config.topics.forEach(function (t) {
      var ps = DATA.problems.filter(function (p) { return p.topic === t && matches(p); });
      if (!ps.length) return;
      any = true;
      var all = DATA.problems.filter(function (p) { return p.topic === t; });
      html += '<div class="topic"><h3>' + esc(t) + ' <span class="muted">' + solvedCount(all) + "/" + all.length + "</span></h3><ul>";
      ps.forEach(function (p) {
        var open = isOpen(p), done = store.solved[p.id];
        html += "<li>" + (open ? '<a href="#/p/' + p.id + '" class="row">' : '<div class="row locked" title="Unlocks ' + fmtDate(weekDate(p.week)) + '">') +
          '<span class="chk">' + (done ? "✓" : open ? "" : "🔒") + "</span>" +
          '<span class="num">' + p.n + ".</span>" +
          '<span class="ttl">' + esc(p.title) + "</span>" +
          '<span class="badge ' + diffClass(p.difficulty) + '">' + p.difficulty + "</span>" +
          '<span class="wk">' + (open ? "Week " + p.week : "Unlocks " + fmtDate(weekDate(p.week))) + "</span>" +
          (open ? "</a>" : "</div>") + "</li>";
      });
      html += "</ul></div>";
    });
    list.innerHTML = any ? html : '<p class="empty">No problems match these filters.</p>';
  }

  function randomProblem() {
    var pool = released().filter(function (p) { return !store.solved[p.id] && matches(p); });
    if (!pool.length) pool = released().filter(function (p) { return !store.solved[p.id]; });
    if (!pool.length) { alertBox("You've solved every unlocked problem. New ones arrive " + fmtDate(weekDate(currentWeek() + 1)) + "!"); return; }
    location.hash = "#/p/" + pool[Math.floor(Math.random() * pool.length)].id;
  }
  function alertBox(msg) {
    var b = el('<div class="toast">' + esc(msg) + "</div>");
    document.body.appendChild(b); setTimeout(function () { b.remove(); }, 4000);
  }

  // ---------- problem page ----------
  function paramNames(p) { return p.design ? [] : p.params.map(function (x) { return x.name; }); }
  function inputLines(p, t) {
    if (p.design) return "<div><b>Calls:</b> " + esc(show(t.ops)) + "</div><div><b>Arguments:</b> " + esc(show(t.args)) + "</div>";
    return p.params.map(function (prm, k) {
      var v = t.input[k];
      if (prm.type === "ListNodeCycle") return "<div>" + esc(prm.name) + " = " + esc(show(v.vals)) + ", pos = " + v.pos + "</div>";
      return "<div>" + esc(prm.name) + " = " + esc(show(v)) + "</div>";
    }).join("");
  }
  function exampleTests(p) {
    var ex = p.tests.slice(0, 2);
    p.tests.slice(2).forEach(function (t) { if (t.explain && ex.length < 3) ex.push(t); });
    return ex;
  }

  function renderProblem(id) {
    var p = BY_ID[id], app = document.getElementById("app");
    if (!p) { app.innerHTML = '<p class="empty">Problem not found. <a href="#/">Back to all problems</a></p>'; return; }
    if (!isOpen(p)) {
      app.innerHTML = '<div class="locked-page"><div class="big">🔒</div><h2>' + esc(p.title) + "</h2><p>This problem unlocks on <b>" + fmtDate(weekDate(p.week)) + "</b> (week " + p.week + ").</p><a class='btn' href='#/'>← All problems</a></div>";
      return;
    }
    current = p;
    var idx = DATA.problems.indexOf(p);
    var prev = DATA.problems[idx - 1], next = DATA.problems[idx + 1];
    var examples = exampleTests(p).map(function (t, i) {
      return '<div class="example"><div class="ex-h">Example ' + (i + 1) + "</div>" + inputLines(p, t) +
        "<div><b>Output:</b> " + esc(show(t.expected)) + "</div>" + (t.explain ? '<div class="explain">' + esc(t.explain) + "</div>" : "") + "</div>";
    }).join("");

    app.innerHTML = '<div class="split">' +
      '<section class="pane left">' +
      '<a href="#/" class="back">← All problems</a>' +
      '<h1 class="ptitle">' + p.n + ". " + esc(p.title) + (store.solved[p.id] ? ' <span class="solved-tag">✓ Solved</span>' : "") + "</h1>" +
      '<div class="meta"><span class="badge ' + diffClass(p.difficulty) + '">' + p.difficulty + '</span><span class="pill">' + esc(p.topic) + '</span><span class="pill">Week ' + p.week + "</span></div>" +
      '<div class="desc">' + p.description + "</div>" + examples +
      (p.constraints.length ? '<h4>Constraints</h4><ul class="cons">' + p.constraints.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" : "") +
      '<details class="hint"><summary>💡 Show a hint</summary><p>' + esc(p.hint) + "</p></details>" +
      '<div class="navbtns">' + (prev && isOpen(prev) ? '<a class="btn" href="#/p/' + prev.id + '">← Previous</a>' : "<span></span>") +
      '<button class="btn" id="rnd">🎲 Random</button>' +
      (next && isOpen(next) ? '<a class="btn" href="#/p/' + next.id + '">Next →</a>' : "<span></span>") + "</div>" +
      "</section>" +
      '<section class="pane right">' +
      '<div class="toolbar"><span class="lang">Java 21</span><span class="grow"></span>' +
      '<button class="btn ghost" id="resetBtn">Reset code</button>' +
      '<button class="btn primary" id="runBtn" title="Ctrl/Cmd + Enter">▶ Run tests</button></div>' +
      '<div class="editor-wrap"><textarea id="code"></textarea></div>' +
      '<div class="results" id="results"><p class="muted">Write your solution, then press <b>Run tests</b>. ' +
      (Runner.isReady() ? "" : "The first run downloads Java into your browser, so it can take 20–40 seconds. After that, runs are much faster.") + "</p></div>" +
      "</section></div>";

    document.getElementById("rnd").onclick = randomProblem;
    var ta = document.getElementById("code");
    ta.value = store.code[p.id] || p.starter;
    editor = CodeMirror.fromTextArea(ta, {
      mode: "text/x-java", lineNumbers: true, indentUnit: 4, tabSize: 4, matchBrackets: true, autoCloseBrackets: true,
      extraKeys: {
        Tab: function (cm) { cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    "); },
        "Ctrl-Enter": runTests, "Cmd-Enter": runTests
      }
    });
    editor.on("change", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { store.code[p.id] = editor.getValue(); persist(); }, 400);
      clearMarks();
    });
    document.getElementById("runBtn").onclick = runTests;
    var resetArmed = false, rb = document.getElementById("resetBtn");
    rb.onclick = function () {
      if (!resetArmed) { resetArmed = true; rb.textContent = "Click again to reset"; setTimeout(function () { resetArmed = false; rb.textContent = "Reset code"; }, 3000); return; }
      editor.setValue(p.starter); delete store.code[p.id]; persist(); resetArmed = false; rb.textContent = "Reset code";
    };
    renderStats();
    window.scrollTo(0, 0);
    // warm up Java in the background so the first run is quicker
    setTimeout(function () { if (current === p) Runner.init().catch(function () {}); }, 1500);
  }

  var marks = [];
  function clearMarks() { marks.forEach(function (l) { editor && editor.removeLineClass(l, "background", "err-line"); }); marks = []; }

  async function runTests() {
    var p = current; if (!p || !editor) return;
    var btn = document.getElementById("runBtn"), res = document.getElementById("results");
    var code = editor.getValue();
    store.code[p.id] = code; persist(); clearMarks();
    btn.disabled = true;
    var status = function (s) { res.innerHTML = '<p class="running"><span class="spin"></span>' + esc(s) + "</p>"; };
    status(Runner.isReady() ? "Compiling…" : "Loading Java…");
    var prog = Harness.buildProgram(p, code, p.tests);
    try {
      var r = await Runner.compileAndRun(prog.source, status);
      if (current !== p) return;
      if (r.timedOut) {
        res.innerHTML = '<div class="banner bad">⏱ Time limit exceeded</div><p>Your code ran for more than ' + (r.phase === "compile" ? "3 minutes while compiling" : "20 seconds") +
          " — usually an infinite loop. Java is still stuck on it, so <b>reload the page</b> before running again (your code is saved).</p>";
        return;
      }
      if (r.phase === "compile") {
        var errs = Harness.mapCompileErrors(r.output, prog.userLineOffset, code.split("\n").length);
        errs.forEach(function (e) { if (e.line) { var h = editor.addLineClass(e.line - 1, "background", "err-line"); marks.push(h); } });
        res.innerHTML = '<div class="banner bad">Compilation error</div>' + (errs.length
          ? "<ul class='errs'>" + errs.map(function (e) { return "<li>" + (e.line ? "<b>Line " + e.line + ":</b> " : "") + esc(e.message) + "</li>"; }).join("") + "</ul>"
          : "") + "<details><summary>Full compiler output</summary><pre>" + esc(cleanCompilerOutput(r.output, prog.userLineOffset)) + "</pre></details>";
        return;
      }
      var parsed = Harness.parseOutput(r.output);
      var grades = Harness.grade(p, p.tests, parsed);
      showResults(p, grades, parsed, prog.userLineOffset);
    } catch (e) {
      res.innerHTML = '<div class="banner bad">Could not run Java</div><p>' + esc(e.message || e) + "</p>";
    } finally {
      btn.disabled = false;
    }
  }

  function cleanCompilerOutput(text, off) {
    return text.replace(/(?:\/str\/run\d+\/)?Main\.java:(\d+):/g, function (_, n) { var l = +n - off; return l >= 1 ? "Line " + l + ":" : "(test harness):"; });
  }

  function showResults(p, grades, parsed, off) {
    var fixLine = function (m) { return String(m).replace(/\(line (\d+)\)/, function (_, n) { var l = +n - off; return l >= 1 ? "(line " + l + ")" : ""; }); };
    var res = document.getElementById("results");
    var pass = grades.filter(function (g) { return g.status === "pass"; }).length, all = grades.length;
    var ok = pass === all;
    var html = "";
    if (ok) {
      var first = !store.solved[p.id];
      store.solved[p.id] = Date.now(); persist(); renderStats();
      var idx = DATA.problems.indexOf(p), next = DATA.problems.slice(idx + 1).filter(function (q) { return isOpen(q) && !store.solved[q.id]; })[0];
      html += '<div class="banner good">✓ Accepted — all ' + all + " tests passed" + (first ? "!" : "") + "</div>" +
        (next ? '<p><a class="btn primary" href="#/p/' + next.id + '">Next problem: ' + esc(next.title) + " →</a></p>" : "");
      var t = document.querySelector(".ptitle"); if (t && !t.querySelector(".solved-tag")) t.insertAdjacentHTML("beforeend", ' <span class="solved-tag">✓ Solved</span>');
    } else {
      html += '<div class="banner bad">' + pass + " / " + all + " tests passed</div>";
      if (!parsed.started) html += "<p>Your program stopped before the tests could run.</p>";
      else if (!parsed.finished) html += "<p>The run stopped early, maybe from a <code>System.exit</code> call or a crash such as running out of memory.</p>";
    }
    html += '<div class="cases">' + grades.map(function (g, i) {
      var t = p.tests[i], cls = g.status === "pass" ? "pass" : "fail";
      var icon = g.status === "pass" ? "✓" : "✗";
      var body = inputLines(p, t) + "<div><b>Expected:</b> " + esc(show(t.expected)) + "</div>";
      if (g.status === "fail") body += "<div><b>Your output:</b> " + esc(show(g.actual)) + "</div>";
      if (g.status === "error") body += "<div class='errtxt'><b>Exception:</b> " + esc(fixLine(g.error)) + "</div>";
      if (g.status === "not-run") body += "<div class='errtxt'>Not run</div>";
      if (g.status === "pass" && show(g.actual) !== show(t.expected)) body += "<div><b>Your output:</b> " + esc(show(g.actual)) + " <span class='muted'>(order doesn't matter)</span></div>";
      return '<details class="case ' + cls + '"' + (g.status !== "pass" && !ok ? " open" : "") + "><summary>" + icon + " Test " + (i + 1) + "</summary>" + body + "</details>";
    }).join("") + "</div>";
    if (parsed.stdout) html += "<h4>Your printed output</h4><pre class='stdout'>" + esc(parsed.stdout.slice(0, 5000)) + "</pre>";
    res.innerHTML = html;
    // only open the first failing case to keep things tidy
    var opened = res.querySelectorAll(".case.fail[open]"); for (var k = 1; k < opened.length; k++) opened[k].open = false;
  }

  // ---------- router ----------
  function route() {
    var h = location.hash || "#/";
    var m = h.match(/^#\/p\/([\w-]+)/);
    if (m) renderProblem(m[1]); else renderHome();
  }

  fetch("data/problems.json").then(function (r) { return r.json(); }).then(function (d) {
    DATA = d; d.problems.forEach(function (p) { BY_ID[p.id] = p; });
    window.addEventListener("hashchange", route);
    route();
  }).catch(function () {
    document.getElementById("app").innerHTML = '<p class="empty">Could not load the problem list. Please reload the page.</p>';
  });
})();
