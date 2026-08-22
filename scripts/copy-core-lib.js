
// Pack core package thanh .tgz roi copy vao demo/*/core-lib/
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const ROOT = path.join(__dirname, "..")

// Ten file .tgz do `npm pack` sinh ra = <name>-<version>.tgz (bo dau @ va / neu la scoped).
// Doc thang tu package.json de khong lech khi doi ten hoac bump version.
const CORE_PKG = JSON.parse(fs.readFileSync(path.join(ROOT, "packages/core/package.json"), "utf8"))
const PKG_NAME = CORE_PKG.name
const TGZ_NAME = `${PKG_NAME.replace(/^@/, "").replace(/\//g, "-")}-${CORE_PKG.version}.tgz`
const BUNDLE_NAME = "bundle.js"
const DEMOS = ["angular", "react", "vue"]

// 1. Pack ra thu muc tam
const tmpDir = path.join(ROOT, "dist")
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
execSync("npm pack --workspace packages/core --pack-destination ./dist", { cwd: ROOT, stdio: "ignore" })
console.log('\x1b[32m%s\x1b[0m', "\nPacked " + PKG_NAME + " -> dist/" + TGZ_NAME)
const tgzSrc = path.join(tmpDir, TGZ_NAME)
const bundleSrc = path.join(tmpDir, BUNDLE_NAME)

if (!fs.existsSync(tgzSrc)) {
  console.error("\x1b[31m%s\x1b[0m", `Khong tim thay ${tgzSrc} sau khi npm pack — kiem tra name/version trong packages/core/package.json`)
  process.exit(1)
}


console.log('\x1b[32m%s\x1b[0m', "\nCopy .tgz + bundle.js vao tung demo và update thư viện")
// 2. Copy .tgz vao tung demo
for (const demo of DEMOS) {

  const targetDir = path.join(ROOT, "demo", demo, "core-lib")
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
  fs.copyFileSync(tgzSrc, path.join(targetDir, TGZ_NAME))
  console.log('\x1b[32m%s\x1b[0m', "\n    Copied " + TGZ_NAME + " -> demo/" + demo + "/core-lib/")

  // Moi demo khai bao dependency tro thang vao packages/core (file:), nen chi can install lai
  // de npm resolve ban moi nhat — KHONG goi ten package tren registry.
  execSync("npm install", { cwd: path.join(ROOT, "demo", demo), stdio: "ignore" })
  console.log('\x1b[32m%s\x1b[0m', "    Update thư viện " + PKG_NAME + " cho " + demo + " thành công")
}

// 3. Copy bundle.js vao demo/vanilla/
const vanillaDir = path.join(ROOT, "demo", "vanilla")
if (!fs.existsSync(vanillaDir)) fs.mkdirSync(vanillaDir, { recursive: true })
fs.copyFileSync(bundleSrc, path.join(vanillaDir, BUNDLE_NAME))
console.log('\x1b[32m%s\x1b[0m', "\n    Copied " + BUNDLE_NAME + " -> demo/vanilla/")

execSync("node demo.js", { cwd: path.join(ROOT, "demo"), stdio: "ignore" })
console.log('\x1b[32m%s\x1b[0m', "\n=======Đã tự động tạo code demo theo events.json thành công=========")
console.log('\x1b[32m%s\x1b[0m', "\nDone!\n")

