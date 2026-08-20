#!/usr/bin/env node
// build-pages — lắp ráp site tĩnh cho GitHub Pages (project site: /vdf-webview-miniapp-sdk/).
//
// Bố cục output _site/:
//   /            = tài liệu API (typedoc, HTML) — link tương đối nên chạy dưới base-path bất kỳ.
//   /demo/       = demo VANILLA (index.html + bundle.js mới + vconsole) — path tương đối, tự chứa.
//
// KHÔNG build react/vue/angular ở đây: build-all-demo.js hardcode base `/miniapp/...` (lệch với
// github-page). Muốn thêm framework demo thì làm base-path riêng cho /vdf-webview-miniapp-sdk/demo/.
//
// Dùng: node scripts/build-pages.js   (CI chạy sau `npm ci`)
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "_site");
const run = (cmd) => { console.log("▶", cmd); execSync(cmd, { cwd: ROOT, stdio: "inherit" }); };

// 1. Build bundle (dist/bundle.js) cho demo vanilla — dùng bản tươi, không tin file commit sẵn.
run("npm run build:js");

// 2. Docs API bằng typedoc (typedoc.json -> out: docs/).
run("npm run typedoc");

// 3. Lắp _site.
fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });

const docsDir = path.join(ROOT, "docs");
if (!fs.existsSync(docsDir)) { console.error("❌ typedoc không sinh docs/ — kiểm typedoc.json"); process.exit(1); }
fs.cpSync(docsDir, SITE, { recursive: true });          // docs -> /

const demoOut = path.join(SITE, "demo");
fs.mkdirSync(demoOut, { recursive: true });
const vanilla = path.join(ROOT, "demo", "vanilla");
for (const f of ["index.html", "vconsole.min.js"]) {
  fs.copyFileSync(path.join(vanilla, f), path.join(demoOut, f));
}
fs.copyFileSync(path.join(ROOT, "dist", "bundle.js"), path.join(demoOut, "bundle.js")); // bundle tươi
// .nojekyll để GitHub Pages không bỏ qua file/thư mục bắt đầu bằng "_" của typedoc.
fs.writeFileSync(path.join(SITE, ".nojekyll"), "");

console.log("✅ _site sẵn sàng: / = docs (typedoc), /demo/ = vanilla demo");
