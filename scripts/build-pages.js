#!/usr/bin/env node
// build-pages — lắp ráp site tĩnh cho GitHub Pages (project site: /vdf-webview-miniapp-sdk/).
//
// Cấu trúc output _site/:
//   /                = landing (link tới /docs/ và /demo/)
//   /docs/           = tài liệu API (typedoc, HTML)
//   /demo/           = landing liệt kê các demo theo công nghệ
//   /demo/vanilla/   = demo HTML/JS thuần (bundle.js + vConsole) — chạy trong webview thật (G3)
//   /demo/react/     = demo React (vite build)   — base /vdf-webview-miniapp-sdk/demo/react/
//   /demo/vue/       = demo Vue   (vite build)   — base .../demo/vue/
//   /demo/angular/   = demo Angular (ng build)   — base .../demo/angular/
//
// Resilient: docs + vanilla LUÔN có; mỗi SPA build trong try/catch — 1 framework lỗi chỉ cảnh
// báo + bỏ qua, KHÔNG làm hỏng cả deploy. Landing /demo/ chỉ link tới demo build thành công.
//
// Dùng: node scripts/build-pages.js   (CI chạy sau `npm ci` ở root)
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "_site");
const REPO_BASE = "/vdf-webview-miniapp-sdk"; // đổi nếu repo github đổi tên
const run = (cmd, cwd = ROOT) => { console.log("▶", cmd, `(cwd=${path.relative(ROOT, cwd) || "."})`); execSync(cmd, { cwd, stdio: "inherit" }); };
const cp = (src, dst) => fs.cpSync(src, dst, { recursive: true });

fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });

// ── 1. Docs (Docusaurus) -> /docs/  +  typedoc API reference -> /docs/reference/ ─
run("node build-doc.js");                                   // regen website/docs từ events.json
run("npm install --no-audit --no-fund", path.join(ROOT, "website"));
run("npm run build", path.join(ROOT, "website"));           // docusaurus build -> website/build
cp(path.join(ROOT, "website", "build"), path.join(SITE, "docs"));
run("npm run typedoc");                                     // typedoc -> docs/
const tdDir = path.join(ROOT, "docs");
if (!fs.existsSync(tdDir)) { console.error("❌ typedoc không sinh docs/ — kiểm typedoc.json"); process.exit(1); }
cp(tdDir, path.join(SITE, "docs", "reference"));            // giữ API reference tại /docs/reference/

// ── 2. Vanilla demo (luôn có) -> /demo/vanilla/ ───────────────────────────────
run("npm run build:js"); // bundle.js tươi
const built = []; // demo build thành công (cho landing)
const vanillaOut = path.join(SITE, "demo", "vanilla");
fs.mkdirSync(vanillaOut, { recursive: true });
for (const f of ["index.html", "vconsole.min.js"]) cp(path.join(ROOT, "demo", "vanilla", f), path.join(vanillaOut, f));
cp(path.join(ROOT, "dist", "bundle.js"), path.join(vanillaOut, "bundle.js"));
built.push({ name: "vanilla", label: "Vanilla JS (HTML thuần + vConsole)" });

// ── 3. SPA demos (resilient) -> /demo/<fw>/ ───────────────────────────────────
const spas = [
  { name: "react", label: "React (Vite)" },
  { name: "vue", label: "Vue 3 (Vite)" },
  { name: "angular", label: "Angular" },
];
for (const s of spas) {
  const dir = path.join(ROOT, "demo", s.name);
  try {
    if (!fs.existsSync(path.join(dir, "package.json"))) throw new Error("thiếu package.json");
    run("npm install --no-audit --no-fund", dir);
    run("npm run build", dir); // base đã khai đúng /vdf-webview-miniapp-sdk/demo/<fw>/ trong package.json
    // vite outDir + angular outputPath đều = ../dist/<fw>/dist (theo config repo)
    let out = path.join(ROOT, "demo", "dist", s.name, "dist");
    if (!fs.existsSync(path.join(out, "index.html"))) {
      // fallback: dò index.html trong demo/<fw>/dist hoặc demo/dist/<fw>/**
      const cands = [path.join(dir, "dist"), path.join(ROOT, "demo", "dist", s.name)];
      out = cands.map(c => fs.existsSync(path.join(c, "index.html")) ? c
              : (fs.existsSync(c) ? fs.readdirSync(c).map(d => path.join(c, d)).find(d => fs.existsSync(path.join(d, "index.html"))) : null))
            .find(Boolean);
      if (!out) throw new Error("không tìm thấy index.html sau build");
    }
    cp(out, path.join(SITE, "demo", s.name));
    built.push(s);
    console.log(`✅ demo ${s.name} build OK`);
  } catch (e) {
    console.warn(`⚠️  demo ${s.name} build FAIL (bỏ qua, không chặn deploy): ${e.message}`);
  }
}

// ── 4. Landing pages ──────────────────────────────────────────────────────────
const demoCards = built.map(b =>
  `<li><a href="${REPO_BASE}/demo/${b.name}/">${b.label}</a></li>`).join("\n      ");
const demoIndex = `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>vdf-webview-miniapp-sdk — Demos</title>
<style>body{font-family:system-ui;max-width:760px;margin:40px auto;padding:0 16px;line-height:1.6}a{color:#0b57d0}</style></head>
<body><h1>Demos — vdf-webview-miniapp-sdk</h1>
<p>Cùng một bộ test bridge event, dựng bằng các công nghệ khác nhau. Bản <b>vanilla</b> chạy được trong WebView thật (có vConsole).</p>
<ul>
      ${demoCards}
</ul>
<p><a href="${REPO_BASE}/docs/">← Tài liệu API</a></p></body></html>`;
fs.writeFileSync(path.join(SITE, "demo", "index.html"), demoIndex);

const rootIndex = `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>vdf-webview-miniapp-sdk</title>
<style>body{font-family:system-ui;max-width:760px;margin:40px auto;padding:0 16px;line-height:1.6}a{color:#0b57d0}</style></head>
<body><h1>vdf-webview-miniapp-sdk</h1>
<p>SDK phía WebView cho Super MiniApp — giao tiếp WebView ↔ Native (Android/iOS) qua bridge event.</p>
<ul>
  <li><a href="${REPO_BASE}/docs/">📖 Tài liệu API (typedoc)</a></li>
  <li><a href="${REPO_BASE}/demo/">🧪 Demos (vanilla / react / vue / angular)</a></li>
</ul>
<p><code>npm install vdf-webview-miniapp-sdk</code></p></body></html>`;
fs.writeFileSync(path.join(SITE, "index.html"), rootIndex);

fs.writeFileSync(path.join(SITE, ".nojekyll"), ""); // typedoc có thư mục bắt đầu bằng "_"

console.log(`\n✅ _site sẵn sàng. Demo build: ${built.map(b => b.name).join(", ")}`);
