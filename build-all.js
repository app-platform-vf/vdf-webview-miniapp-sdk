const fs = require("fs")
const path = require("path")
const readline = require("readline")
const { execSync } = require("child_process")

const DEMO_DIR = path.join(__dirname, "demo")

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

function updatePackageJson(platform, base) {
  const pkgPath = path.join(platform.dir, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
  pkg.scripts.build = platform.buildScript(base)
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
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

  rl.close()

  console.log("\n--- Bắt đầu build ---\n")

  for (const platform of platforms) {
    const base = bases[platform.name]
    console.log(`\n[${platform.name}] base: /miniapp/${base}`)
    updatePackageJson(platform, base)
    console.log(`[${platform.name}] Đã cập nhật package.json`)

    console.log(`[${platform.name}] Đang build...`)
    try {
      execSync("npm run build", {
        cwd: platform.dir,
        stdio: "inherit",
      })
      console.log(`[${platform.name}] Build thành công`)
    } catch (err) {
      console.error(`[${platform.name}] Build thất bại: ${err.message}`)
      process.exit(1)
    }
  }

  console.log("\n=== Hoàn thành build tất cả platforms ===")
}

main()
