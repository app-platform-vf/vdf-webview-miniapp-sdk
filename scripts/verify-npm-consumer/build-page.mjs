#!/usr/bin/env node
// Dung trang demo TIEU THU GOI: pack -> install -> bundle tu ban da cai.
//
// Khac biet duy nhat so voi demo/vanilla, va la ca ly do ton tai:
//   demo/vanilla  <- dist/bundle.js, rollup tu packages/core/dist  (MA NGUON)
//   trang nay     <- rollup tu node_modules cua sandbox            (GOI DA CAI)
// Bundle tu ma nguon khong bao gio phat hien duoc loi dong goi.
//
// Chay:  npm run verify:page
// Ra:    scripts/verify-npm-consumer/dist-page/   (index.html + app.js)

import { execSync } from "node:child_process"
import { rmSync, mkdirSync, mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, realpathSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

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

console.log("1/4  Dong goi va cai...")
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

console.log("2/4  Chep diem vao vao sandbox...")
cpSync(join(HERE, "page", "entry.js"), join(SANDBOX, "entry.js"))

console.log("3/4  Bundle bang rollup, phan giai tu sandbox...")
// Config viet dang .cjs voi require, giong rollup.config.js co san cua repo: hai
// plugin nay la CommonJS, va mot config .mjs khong import duoc thu muc CJS.
const cfg = join(SANDBOX, "rollup.consumer.cjs")
writeFileSync(cfg, `
const resolvePlugin = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-node-resolve"))});
const commonjs = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-commonjs"))});
module.exports = {
  input: ${JSON.stringify(join(SANDBOX, "entry.js"))},
  context: "this",
  output: { file: ${JSON.stringify(join(OUT, "app.js"))}, format: "iife", name: "ConsumerApp" },
  plugins: [resolvePlugin(), commonjs()]
};
`)
execSync(`"${join(REPO, "node_modules", ".bin", "rollup")}" -c "${cfg}"`, { cwd: SANDBOX, stdio: "inherit" })

console.log("4/4  Sinh trang...")
const html = readFileSync(join(HERE, "page", "index.html"), "utf8")
    .replaceAll("__PKG_NAME__", installedPkg.name)
    .replaceAll("__PKG_VERSION__", installedPkg.version)
    .replaceAll("__BUILT_AT__", new Date().toISOString())
writeFileSync(join(OUT, "index.html"), html)

if (!existsSync(join(OUT, "app.js"))) {
    console.error("DUNG: rollup khong sinh ra app.js.")
    process.exit(1)
}

console.log(`\nXong: ${OUT}`)
console.log(`Phuc vu:  npx -y serve "${OUT}"   roi tro startUrl cua mini-app vao dia chi LAN`)
