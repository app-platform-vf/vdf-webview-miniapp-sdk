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
execSync("npm pack --workspace packages/core --pack-destination ./dist", { cwd: ROOT, stdio: "inherit" })

const tgzSrc = path.join(tmpDir, TGZ_NAME)

// 2. Copy .tgz vao tung demo
for (const demo of DEMOS) {
  const targetDir = path.join(ROOT, "demo", demo, "core-lib")
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
  fs.copyFileSync(tgzSrc, path.join(targetDir, TGZ_NAME))
  console.log("Copied " + TGZ_NAME + " -> demo/" + demo + "/core-lib/")
}

console.log("\nDone!")
