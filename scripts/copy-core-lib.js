// Pack @webview-sdk/core thanh .tgz roi copy vao demo/*/core-lib/
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const ROOT = path.join(__dirname, "..")
const TGZ_NAME = "webview-sdk-core-1.0.0.tgz"
const DEMOS = ["angular", "react", "vue"]

// 1. Pack ra thu muc tam
const tmpDir = path.join(ROOT, "dist")
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
execSync("npm pack --workspace packages/core --pack-destination ./dist", { cwd: ROOT, stdio: "ignore" })
console.log('\x1b[32m%s\x1b[0m',"\nPacked @webview-sdk/core")
const tgzSrc = path.join(tmpDir, TGZ_NAME)


console.log('\x1b[32m%s\x1b[0m',"\nCopy .tgz vao tung demo và update thư viện")
// 2. Copy .tgz vao tung demo
for (const demo of DEMOS) {

  const targetDir = path.join(ROOT, "demo", demo, "core-lib")
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
  fs.copyFileSync(tgzSrc, path.join(targetDir, TGZ_NAME))
  console.log('\x1b[32m%s\x1b[0m',"\n    Copied " + TGZ_NAME + " -> demo/" + demo + "/core-lib/")

  execSync("npm install @webview-sdk/core", { cwd: path.join(ROOT, "demo", demo), stdio: "ignore" })
  console.log('\x1b[32m%s\x1b[0m',"    Update thư viện @webview-sdk/core cho "+ demo +" thành công")
}

execSync("node demo.js", { cwd: path.join(ROOT, "demo"), stdio: "ignore" })
console.log('\x1b[32m%s\x1b[0m',"\n=======Đã tự động tạo code demo theo events.json thành công=========")
console.log('\x1b[32m%s\x1b[0m',  "\nDone!\n")
