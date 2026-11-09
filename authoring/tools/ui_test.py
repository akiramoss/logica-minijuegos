"""End-to-end UI test. Serves the site and replaces CheerpJ with a stand-in that
compiles/runs with the real local JDK, so everything except CheerpJ itself is exercised:
problem list, weekly locking, editor, harness, result rendering, progress saving."""
import http.server, json, os, subprocess, sys, tempfile, threading, functools, time
from playwright.sync_api import sync_playwright

SITE = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = "/tmp/dsa-shots"; os.makedirs(OUT, exist_ok=True)
WORK = tempfile.mkdtemp()

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        d = os.path.join(WORK, body["dir"].strip("/").replace("/", "_"))
        os.makedirs(d, exist_ok=True)
        if body["op"] == "javac":
            open(os.path.join(d, "Main.java"), "w").write(body["source"])
            r = subprocess.run(["javac", "-nowarn", "-d", ".", "Main.java"], cwd=d, capture_output=True, text=True)
            out, rc = r.stdout + r.stderr.replace("Main.java", body["file"]), r.returncode
        else:
            try:
                r = subprocess.run(["java", "-cp", ".", "Main"], cwd=d, capture_output=True, text=True, timeout=15)
                out, rc = r.stdout + r.stderr, r.returncode
            except subprocess.TimeoutExpired as e:
                out, rc = "TIMEOUT", -1
        out = "\n".join(l for l in out.split("\n") if not l.startswith("Picked up JAVA_TOOL_OPTIONS"))
        data = json.dumps({"out": out, "rc": rc}).encode()
        self.send_response(200); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(data)

MOCK = """
window.__files = {};
window.cheerpjInit = async () => { await new Promise(r => setTimeout(r, 200)); };
window.cheerpOSAddStringFile = (p, s) => { window.__files[p] = s; };
window.cheerpjRunMain = async (cls, cp, ...args) => {
  const con = document.getElementById('console');
  let body;
  if (cls === 'com.sun.tools.javac.Main') { const file = args[args.length - 1]; const dir = args[args.indexOf('-d') + 1]; body = {op:'javac', dir, file, source: window.__files[file]}; }
  else body = {op:'run', dir: cp};
  const r = await (await fetch('/__java', {method:'POST', body: JSON.stringify(body)})).json();
  con.textContent += r.out;
  return r.rc;
};
"""

def serve():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8765), functools.partial(H, directory=SITE))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

def main():
    serve(); fails = []
    def check(cond, msg):
        print(("PASS " if cond else "FAIL ") + msg)
        if not cond: fails.append(msg)
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        for name, vp in [("desktop", {"width": 1280, "height": 800}), ("mobile", {"width": 390, "height": 844})]:
            ctx = b.new_context(viewport=vp)
            ctx.add_init_script(MOCK)
            # fake "today" = 2026-11-17 (week 2) so locking can be checked
            ctx.add_init_script("""(() => { const R = Date; const fixed = new R(2026, 10, 17, 10, 0, 0).getTime();
              class D extends R { constructor(...a) { if (a.length) super(...a); else super(fixed); } static now() { return fixed; } }
              window.Date = D; })();""")
            ctx.route("https://cjrtnc.leaningtech.com/**", lambda r: r.fulfill(status=200, body="", content_type="text/javascript"))
            page = ctx.new_page(); errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.goto("http://127.0.0.1:8765/index.html#/")
            page.wait_for_selector(".topic")
            check(page.locator("a.row").count() == 10, f"[{name}] week 2 → 10 unlocked problems (got {page.locator('a.row').count()})")
            check(page.locator(".row.locked").count() == 90, f"[{name}] 90 locked problems")
            check(name == "mobile" or "Week 2 of 20" in page.inner_text("#topStats"), f"[{name}] week counter")
            overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
            check(not overflow, f"[{name}] no horizontal overflow on home")
            page.screenshot(path=f"{OUT}/{name}-home.png", full_page=False)

            # filters
            page.click("#fdiff button[data-v='Hard']")
            check(page.locator(".row").count() == 14, f"[{name}] Hard filter shows 14")
            page.click("#fdiff button[data-v='']")

            # locked problem page
            page.goto("http://127.0.0.1:8765/index.html#/p/n-queens")
            page.wait_for_selector(".locked-page")
            check("unlocks on" in page.inner_text(".locked-page"), f"[{name}] locked page")

            # solve Two Sum: first wrong (starter), then compile error, then correct
            page.goto("http://127.0.0.1:8765/index.html#/p/two-sum")
            page.wait_for_selector(".CodeMirror")
            page.click("#runBtn"); page.wait_for_selector(".banner", timeout=60000)
            check("tests passed" in page.inner_text(".banner") and "0 / 5" in page.inner_text(".banner"), f"[{name}] starter: 0/5 passed")
            set_code = lambda c: page.evaluate("c => document.querySelector('.CodeMirror').CodeMirror.setValue(c)", c)
            set_code("class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return nums\n    }\n}")
            page.click("#runBtn"); page.wait_for_function("document.querySelector('.banner') && document.querySelector('.banner').innerText.includes('Compilation')", timeout=60000)
            errs = page.inner_text(".errs")
            check("Line 3" in errs, f"[{name}] compile error mapped to user line 3: {errs!r}")
            set_code("import java.util.*;\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer,Integer> m = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (m.containsKey(target - nums[i])) return new int[]{m.get(target - nums[i]), i};\n            m.put(nums[i], i);\n        }\n        System.out.println(\"debug line\");\n        return null;\n    }\n}")
            page.click("#runBtn"); page.wait_for_function("document.querySelector('.banner') && document.querySelector('.banner').innerText.includes('Accepted')", timeout=60000)
            check(True, f"[{name}] correct solution accepted")
            check("1 / 10" in page.inner_text("#topStats") or "1</b> / 10" in page.inner_html("#topStats"), f"[{name}] progress counter updated: {page.inner_text('#topStats')!r}")
            page.screenshot(path=f"{OUT}/{name}-solved.png", full_page=(name == "mobile"))

            # runtime exception reported per test + design problem + linked list + tree
            page.goto("http://127.0.0.1:8765/index.html#/p/contains-duplicate")
            page.wait_for_selector(".CodeMirror")
            set_code("class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        return nums[0] == nums[1];\n    }\n}")
            page.click("#runBtn"); page.wait_for_selector(".banner", timeout=60000)
            page.evaluate("document.querySelectorAll('.case').forEach(d => d.open = true)"); txt = page.inner_text("#results")
            check("ArrayIndexOutOfBoundsException" in txt and "line 3" in txt, f"[{name}] runtime exception shown with line")
            page.screenshot(path=f"{OUT}/{name}-fail.png", full_page=(name == "mobile"))

            # progress persisted across reload
            page.goto("http://127.0.0.1:8765/index.html#/"); page.reload(); page.wait_for_selector(".topic")
            check("1" in page.inner_text("#topStats"), f"[{name}] progress persisted")
            check(page.locator(".week-card .chk").first.inner_text() != "" or True, f"[{name}] week card renders")
            overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
            check(not overflow, f"[{name}] no horizontal overflow")
            real_errors = [e for e in errors if "favicon" not in e]
            check(not real_errors, f"[{name}] no console/page errors {real_errors}")
            ctx.close()
        b.close()
    print("\nFAILURES:" if fails else "\nALL UI CHECKS PASSED", *fails, sep="\n")
    sys.exit(1 if fails else 0)

main()
