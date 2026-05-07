const fs = require("fs")
const path = require("path")
const readline = require("readline")
const { execSync } = require("child_process")

const DEMO_DIR = path.join(__dirname, "demo")
const VANILLA_BASE_FILE = path.join(DEMO_DIR, "vanilla", ".vanilla-base")

const platforms = [
  {
    name: "angular",
    dir: path.join(DEMO_DIR, "angular"),
    buildScript: (base) => `ng build --base-href=/miniapp/${base}/`,
  },
  {
    name: "react",
    dir: path.join(DEMO_DIR, "react"),
    buildScript: (base) => `vite build --base=/miniapp/${base}`,
  },
  {
    name: "vue",
    dir: path.join(DEMO_DIR, "vue"),
    buildScript: (base) => `vite build --base=/miniapp/${base}`,
  },
]

function getCurrentBase(platform) {
  const pkgPath = path.join(platform.dir, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
  const buildCmd = pkg.scripts?.build || ""
  const match = buildCmd.match(/\/miniapp\/([^\s/]+)/)
  return match ? match[1] : ""
}

function getVanillaBase() {
  try { return fs.readFileSync(VANILLA_BASE_FILE, "utf8").trim() } catch { return "" }
}

function updatePackageJson(platform, base) {
  const pkgPath = path.join(platform.dir, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
  pkg.scripts.build = platform.buildScript(base)
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
}

function buildVanilla(base) {
  const srcDir = path.join(DEMO_DIR, "vanilla")
  const distDir = path.join(DEMO_DIR, "dist", "vanilla", "dist")
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true })

  // Copy bundle.js
  fs.copyFileSync(path.join(srcDir, "bundle.js"), path.join(distDir, "bundle.js"))
  
  // Copy vconsole.min.js
  fs.copyFileSync(path.join(srcDir, "vconsole.min.js"), path.join(distDir, "vconsole.min.js"))

  // Copy index.html và inject <base href>
  let html = fs.readFileSync(path.join(srcDir, "index.html"), "utf8")
  const baseTag = `<base href="/miniapp/${base}/">`
  if (html.includes("<base ")) {
    html = html.replace(/<base [^>]*>/, baseTag)
  } else {
    html = html.replace("<head>", `<head>\n  ${baseTag}`)
  }
  fs.writeFileSync(path.join(distDir, "index.html"), html)

  // Lưu base để lần sau hiển thị
  fs.writeFileSync(VANILLA_BASE_FILE, base)

  console.log(`[vanilla] Build thành công -> demo/dist/vanilla/dist/`)
}

async function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  console.log("\n=== Build All Demo Platforms ===\n")

  const bases = {}
  for (const platform of platforms) {
    const current = getCurrentBase(platform)
    const answer = await prompt(rl, `[${platform.name}] base (hiện tại: ${current}): `)
    bases[platform.name] = answer.trim() || current
  }

  // Vanilla
  const vanillaCurrent = getVanillaBase()
  const vanillaAnswer = await prompt(rl, `[vanilla] base (hiện tại: ${vanillaCurrent}): `)
  bases["vanilla"] = vanillaAnswer.trim() || vanillaCurrent

  rl.close()

  console.log("\n--- Chạy demo.js ---\n")
  execSync("node demo/demo.js", { cwd: __dirname, stdio: "inherit" })
  console.log("\n--- Bắt đầu build ---\n")

  for (const platform of platforms) {
    const base = bases[platform.name]
    console.log(`\n[${platform.name}] base: /miniapp/${base}`)
    updatePackageJson(platform, base)
    console.log(`[${platform.name}] Đã cập nhật package.json`)

    console.log(`[${platform.name}] Đang build...`)
    try {
      let buildCommand = "npm run build";
      if (platform.name === 'angular') {
        const nodeMajorVersion = parseInt(process.versions.node.split('.')[0], 10);
        if (nodeMajorVersion >= 17) {
          buildCommand = "npm run build:v22";
        }
      }
      execSync(buildCommand, {
        cwd: platform.dir,
        stdio: "inherit",
      })
      console.log(`[${platform.name}] Build thành công`)
    } catch (err) {
      console.error(`[${platform.name}] Build thất bại: ${err.message}`)
      process.exit(1)
    }
  }

  // Vanilla
  const vanillaBase = bases["vanilla"]
  if (vanillaBase) {
    console.log(`\n[vanilla] base: /miniapp/${vanillaBase}`)
    console.log(`[vanilla] Đang build...`)
    buildVanilla(vanillaBase)
  } else {
    console.log(`\n[vanilla] Bỏ qua (không có base)`)
  }

  console.log("\n=== Hoàn thành build tất cả platforms ===")
}

main()
