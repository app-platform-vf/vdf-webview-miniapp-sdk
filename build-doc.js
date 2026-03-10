const fs = require("fs")
const path = require("path")

const SRC_DIR = "./packages"
const OUTPUT_DIR = "./docs-site"


function scanDir(dir) {
  let files = []
  const items = fs.readdirSync(dir)
  items.forEach(item => {
    const full = path.join(dir, item)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      files = files.concat(scanDir(full))
    } else if (item.endsWith(".ts")) {
      files.push(full)
    }
  })
  return files
}

function parseFile(file) {
  const content = fs.readFileSync(file, "utf8")
  const classes = []
  const functions = []
  const exports = []

  // Parse classes
  const classRegex = /export\s+class\s+(\w+)/g
  let match
  while ((match = classRegex.exec(content))) {
    classes.push(match[1])
  }

  // Parse exported functions
  const funcRegex = /export\s+(?:async\s+)?function\s+(\w+)/g
  while ((match = funcRegex.exec(content))) {
    functions.push(match[1])
  }

  // Parse export types/interfaces
  const typeRegex = /export\s+(?:type|interface)\s+(\w+)/g
  while ((match = typeRegex.exec(content))) {
    exports.push(match[1])
  }

  // Parse methods in classes
  const methods = []
  const methodRegex = /^\s+(?:async\s+)?(\w+)\s*\(([^)]*)\).*{/gm
  while ((match = methodRegex.exec(content))) {
    const name = match[1]
    if (!["if","for","while","switch","catch","constructor"].includes(name) && !name.startsWith("_")) {
      methods.push({ name, params: match[2].trim() })
    }
  }

  // Parse comments
  const comments = {}
  const commentRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*\n\s*(?:export\s+)?(?:async\s+)?(?:class|function|type|interface)\s+(\w+)/g
  while ((match = commentRegex.exec(content))) {
    comments[match[2]] = match[1].replace(/\s*\*\s*/g, ' ').trim()
  }

  return { classes, functions, exports, methods, comments }
}

function getPackageName(filePath) {
  const parts = filePath.replace(/\\/g, '/').split('/')
  const pkgIdx = parts.indexOf('packages')
  if (pkgIdx !== -1 && parts[pkgIdx + 1]) return parts[pkgIdx + 1]
  return 'unknown'
}

function getRelPath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '')
}

function generateHTML(filesByPackage) {
  const packages = Object.keys(filesByPackage)

  const sidebar = packages.map(pkg => {
    const files = filesByPackage[pkg]
    const items = files.map(f =>
      `<a class="nav-item" href="#${encodeURIComponent(f.relPath)}">${f.fileName}</a>`
    ).join('')
    return `<div class="nav-group"><div class="nav-title">${pkg}</div>${items}</div>`
  }).join('')

  const content = packages.map(pkg => {
    const files = filesByPackage[pkg]
    return files.map(f => {
      const classesHTML = f.parsed.classes.map(c => {
        const desc = f.parsed.comments[c] || ''
        return `<div class="item"><span class="tag tag-class">class</span><strong>${c}</strong>${desc ? '<p class="desc">' + desc + '</p>' : ''}</div>`
      }).join('')

      const funcsHTML = f.parsed.functions.map(fn => {
        const desc = f.parsed.comments[fn] || ''
        return `<div class="item"><span class="tag tag-func">function</span><strong>${fn}()</strong>${desc ? '<p class="desc">' + desc + '</p>' : ''}</div>`
      }).join('')

      const typesHTML = f.parsed.exports.map(t =>
        `<div class="item"><span class="tag tag-type">type</span>${t}</div>`
      ).join('')

      const methodsHTML = f.parsed.methods.map(m =>
        `<div class="item method"><span class="tag tag-method">method</span>${m.name}(${m.params})</div>`
      ).join('')

      const sections = []
      if (classesHTML) sections.push('<h4>Classes</h4>' + classesHTML)
      if (funcsHTML) sections.push('<h4>Functions</h4>' + funcsHTML)
      if (typesHTML) sections.push('<h4>Types / Interfaces</h4>' + typesHTML)
      if (methodsHTML) sections.push('<h4>Methods</h4>' + methodsHTML)

      if (sections.length === 0) return ''

      return `<div class="file-section" id="${encodeURIComponent(f.relPath)}">
        <h3>${f.relPath}</h3>
        ${sections.join('')}
      </div>`
    }).filter(Boolean).join('')
  }).join('')

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Super MiniApp SDK - API Documentation</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;color:#1f1f1f;display:flex;min-height:100vh}
.sidebar{width:260px;background:#fff;border-right:1px solid #e8e8e8;padding:20px 0;position:fixed;top:0;left:0;bottom:0;overflow-y:auto}
.sidebar h2{padding:0 20px 16px;font-size:16px;border-bottom:1px solid #e8e8e8;margin-bottom:12px}
.nav-group{margin-bottom:16px}
.nav-title{padding:8px 20px;font-size:11px;text-transform:uppercase;color:#999;font-weight:700;letter-spacing:.5px}
.nav-item{display:block;padding:4px 20px 4px 32px;font-size:13px;color:#555;text-decoration:none;line-height:1.8}
.nav-item:hover{color:#1677ff;background:#f0f5ff}
.main{margin-left:260px;flex:1;padding:32px 40px}
.main h1{font-size:24px;margin-bottom:8px}
.main>p{color:#666;margin-bottom:28px}
.file-section{background:#fff;border-radius:8px;padding:20px 24px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.file-section h3{font-size:14px;color:#1677ff;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #f0f0f0}
.file-section h4{font-size:12px;color:#999;text-transform:uppercase;margin:16px 0 8px;letter-spacing:.5px}
.file-section h4:first-child{margin-top:0}
.item{padding:6px 0;font-size:13px;border-bottom:1px solid #fafafa}
.item strong{color:#1f1f1f}
.item.method{padding-left:16px;color:#555}
.desc{color:#888;font-size:12px;margin-top:2px}
.tag{display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;margin-right:6px}
.tag-class{background:#e6f4ff;color:#1677ff}
.tag-func{background:#f6ffed;color:#52c41a}
.tag-type{background:#fff7e6;color:#fa8c16}
.tag-method{background:#f9f0ff;color:#722ed1}
.demo-link{display:inline-block;margin-top:8px;padding:8px 20px;background:#1677ff;color:#fff;border-radius:6px;text-decoration:none;font-size:14px}
.demo-link:hover{background:#4096ff}
@media(max-width:768px){.sidebar{display:none}.main{margin-left:0}}
</style>
</head>
<body>
<div class="sidebar">
  <h2>MiniApp SDK</h2>
  ${sidebar}
  <div style="padding:16px 20px;border-top:1px solid #e8e8e8;margin-top:12px">
    <a class="demo-link" href="index.html" style="display:block;text-align:center">Demo</a>
  </div>
</div>
<div class="main">
  <h1>API Documentation</h1>
  <p>Tu dong sinh tu source code. <a href="index.html">Xem trang demo &rarr;</a></p>
  ${content}
</div>
</body>
</html>`
}

function buildDocs() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = scanDir(SRC_DIR)
  const filesByPackage = {}

  files.forEach(file => {
    const pkg = getPackageName(file)
    const parsed = parseFile(file)
    const relPath = getRelPath(file)
    const fileName = path.basename(file)

    if (!filesByPackage[pkg]) filesByPackage[pkg] = []
    filesByPackage[pkg].push({ relPath, fileName, parsed })
  })

  const html = generateHTML(filesByPackage)
  fs.writeFileSync(path.join(OUTPUT_DIR, "api.html"), html)

  console.log("Docs generated:")
  console.log("  -> " + path.join(OUTPUT_DIR, "index.html") + " (demo page)")
  console.log("  -> " + path.join(OUTPUT_DIR, "api.html") + " (API docs)")
}

buildDocs()
