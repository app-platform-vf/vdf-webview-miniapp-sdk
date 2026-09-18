#!/usr/bin/env node
// Dung trang demo TIEU THU GOI: pack -> install -> bundle tu ban da cai.
//
// Trang nay GIONG demo/vanilla: cung mot bo sinh, cung danh sach ham, cung giao
// dien. Khac biet duy nhat, va la ca ly do no ton tai:
//   demo/vanilla  <- dist/bundle.js, rollup tu packages/core/dist  (MA NGUON)
//   trang nay     <- rollup tu node_modules cua sandbox            (GOI DA CAI)
// Bundle tu ma nguon khong bao gio phat hien duoc loi dong goi.
//
// Chay:  npm run verify:page
// Ra:    scripts/verify-npm-consumer/dist-page/   (index.html + app.js + vconsole.min.js)

import { execSync } from "node:child_process"
import { rmSync, mkdirSync, mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, realpathSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, "..", "..")
const CORE = join(REPO, "packages", "core")
const OUT = join(HERE, "dist-page")
const PKG_NAME = JSON.parse(readFileSync(join(CORE, "package.json"), "utf8")).name

// Sandbox phai nam NGOAI repo: dat trong repo thi npm nhin thay workspace cha
// (`workspaces: ["packages/*"]`) va tu choi khoi tao, hoac te hon la tu lien ket
// nguoc ve packages/core — dung cai bay ma ca bo kiem nay sinh ra de chan.
const SANDBOX = mkdtempSync(join(tmpdir(), "npm-consumer-page-"))
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

console.log("1/5  Dong goi va cai...")
const tgz = execSync(`npm pack --workspace packages/core --pack-destination "${SANDBOX}"`, {
    cwd: REPO, encoding: "utf8",
}).trim().split("\n").pop().trim()
execSync("npm init -y", { cwd: SANDBOX, stdio: "ignore" })
execSync(`npm install "${join(SANDBOX, tgz)}" --no-audit --no-fund`, { cwd: SANDBOX, stdio: "ignore" })

// Chot chong tu lua — giong phep kiem dau tien cua verify.mjs. Neu cho cai dat
// lai tro ve ma nguon thi ca trang nay vo nghia, va no se vo nghia trong im lang.
const installed = join(SANDBOX, "node_modules", PKG_NAME)
if (realpathSync(installed).startsWith(CORE)) {
    console.error("DUNG: node_modules tro nguoc ve packages/core — dang bundle ma nguon, khong phai goi.")
    process.exit(1)
}
const installedPkg = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"))
console.log(`     ${tgz} -> ${installedPkg.name}@${installedPkg.version}`)

console.log("2/5  Chep diem vao sandbox...")
cpSync(join(HERE, "page", "entry.js"), join(SANDBOX, "entry.js"))

console.log("3/5  Bundle bang rollup, phan giai tu sandbox...")
// Ten global PHAI la `WebviewSdk`: do la ten ma dist/bundle.js cua demo/vanilla
// phoi ra, va trang HTML sinh o buoc 4 goi thang `WebviewSdk.<ten ham>()`. Doi
// ten o day thi moi nut bam tren trang hong cung mot luc.
//
// Config viet dang .cjs voi require, giong rollup.config.js co san cua repo: hai
// plugin nay la CommonJS, va mot config .mjs khong import duoc thu muc CJS.
const cfg = join(SANDBOX, "rollup.consumer.cjs")
writeFileSync(cfg, `
const resolvePlugin = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-node-resolve"))});
const commonjs = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-commonjs"))});
module.exports = {
  input: ${JSON.stringify(join(SANDBOX, "entry.js"))},
  context: "this",
  output: { file: ${JSON.stringify(join(OUT, "app.js"))}, format: "iife", name: "WebviewSdk" },
  plugins: [resolvePlugin(), commonjs()]
};
`)
execSync(`"${join(REPO, "node_modules", ".bin", "rollup")}" -c "${cfg}"`, { cwd: SANDBOX, stdio: "inherit" })

console.log("4/5  Sinh trang tu CUNG bo sinh voi demo/vanilla...")
// Dung lai genVanillaHTML thay vi chep tay danh sach ham. Chep tay la cach chac
// chan nhat de hai trang lech nhau sau vai thang: them event vao events.json thi
// chi mot ben duoc cap nhat, va khong gi bao cho ai biet.
const require_ = createRequire(import.meta.url)
const { genVanillaHTML, EVENTS_FILE } = require_(join(REPO, "demo", "demo.js"))
const eventsConfig = JSON.parse(readFileSync(EVENTS_FILE, "utf8"))
console.log(`     events.json: ${eventsConfig.events.length} event`)

let html = genVanillaHTML(eventsConfig.events)

/**
 * Thay mot lan duy nhat, va do so lan thay that su.
 *
 * String.replace khong khop thi tra ve chuoi GOC, khong nem loi — nen mot mau do
 * hep se di qua day trong im lang va de lai mot trang hong ma khong ai biet vi
 * sao. Ham nay bien truong hop do thanh mot lan dung co thong bao.
 */
function replaceExactlyOnce(source, needle, replacement, what) {
    const parts = source.split(needle)
    if (parts.length !== 2) {
        console.error(`DUNG: cho "${what}" khop ${parts.length - 1} lan trong trang sinh ra, can dung 1.`)
        console.error(`      Mau tim: ${needle}`)
        console.error(`      Nhieu kha nang demo/demo.js da doi. Sua mau tim o build-page.mjs.`)
        process.exit(1)
    }
    return parts.join(replacement)
}

// (a) Nguon SDK: bundle tu ma nguon -> bundle tu goi da cai. Day la CA noi dung
//     cua trang nay; moi thu con lai giong het demo/vanilla.
html = replaceExactlyOnce(html, `<script src="bundle.js"></script>`, `<script src="app.js"></script>`, "the script nap SDK")

// (b) Tieu de: hai trang mo cung luc trong hai tab thi phai phan biet duoc.
html = replaceExactlyOnce(html, `<title>MiniApp SDK - Demo</title>`, `<title>MiniApp SDK - Demo (goi npm)</title>`, "tieu de trang")
html = replaceExactlyOnce(html, `<h1>MiniApp SDK - Demo</h1>`, `<h1>MiniApp SDK - Demo (goi npm)</h1>`, "dong tieu de trong trang")

// (c) Ghi chu may sinh: trang nay khong den thang tu `npm run demo`.
html = replaceExactlyOnce(
    html,
    `<!-- AUTO-GENERATED by demo/demo.js from events.json — DO NOT EDIT (chay: npm run demo) -->`,
    `<!-- AUTO-GENERATED by demo/demo.js (qua scripts/verify-npm-consumer/build-page.mjs) — DO NOT EDIT (chay: npm run verify:page) -->`,
    "ghi chu may sinh",
)

// (d) Manh ghep rieng cua trang nay: banner nguon goi + hai phep do dinh tuyen.
const extras = readFileSync(join(HERE, "page", "extras.html"), "utf8")
    .replaceAll("__PKG_NAME__", installedPkg.name)
    .replaceAll("__PKG_VERSION__", installedPkg.version)
    .replaceAll("__BUILT_AT__", new Date().toISOString())
html = replaceExactlyOnce(html, `</body>`, `${extras}</body>`, "the dong body")

writeFileSync(join(OUT, "index.html"), html)

console.log("5/5  Chep vConsole (giong demo/vanilla)...")
// Khong co vConsole thi the <script src="vconsole.min.js"> hong va `new VConsole()`
// nem loi NGAY TRUOC khoi script chinh, tuc ca trang trang tron trong WebView.
const vconsole = join(REPO, "demo", "vanilla", "vconsole.min.js")
if (!existsSync(vconsole)) {
    console.error(`DUNG: khong thay ${vconsole} — trang se trang tron trong WebView.`)
    process.exit(1)
}
cpSync(vconsole, join(OUT, "vconsole.min.js"))

for (const f of ["app.js", "index.html", "vconsole.min.js"]) {
    if (!existsSync(join(OUT, f))) {
        console.error(`DUNG: thieu ${f} trong dist-page.`)
        process.exit(1)
    }
}

console.log(`\nXong: ${OUT}`)
console.log(`Phuc vu:  npx -y serve "${OUT}"   roi tro startUrl cua mini-app vao dia chi LAN`)
