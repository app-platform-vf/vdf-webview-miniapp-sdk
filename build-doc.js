const fs = require("fs")
const path = require("path")

const EVENTS_JSON = "./packages/core/src/events.json"
const OUTPUT_DIR = "./docs-site"

function toCamelCase(str) {
  return str.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function categorizeEvent(event) {
  if (["APP_OPEN_WEBVIEW", "APP_OPEN_STORE", "EXIT", "OPEN_EXTERNAL_LINK", "OPEN_MINI_APP"].includes(event)) return "Navigation"
  if (event.startsWith("REQUEST_MULTIPLE") || event.startsWith("CHECK_MULTIPLE") || event === "REQUEST_PERMISSION_WITH_CODE" || event === "CHECK_PERMISSION_WITH_CODE") return "User Data Permission"
  if (event === "GET_MULTIPLE_USER_DATA") return "User Data"
  if (event === "CLEAR_PERMISSION_CACHE") return "Permission Cache"
  if (event.startsWith("REQUEST_") && event.endsWith("_PERMISSION")) return "Device Permission (Request)"
  if (event.startsWith("CHECK_") && event.endsWith("_PERMISSION")) return "Device Permission (Check)"
  if (event.includes("LOCAL_AUTHENTICATION")) return "Biometric Authentication"
  if (event === "GET_CONTACTS") return "Contacts"
  if (event === "PICK_FILE") return "File Picker"
  if (event.startsWith("SAVE_") || event.startsWith("GET_STRING") || event.startsWith("GET_BOOLEAN") || event.startsWith("GET_INTEGER") || event.startsWith("GET_LONG") || event.startsWith("GET_FLOAT") || event === "CLEAR_STORAGE") return "Local Storage"
  if (event === "GET_LOCATION") return "Location"
  if (event.includes("STATUS_BAR") || event.includes("NAVIGATION_BAR")) return "UI Customization"
  if (event.startsWith("SHARE_")) return "Share"
  return "Other"
}

function renderFields(fields, prefix = "") {
  if (!fields || Object.keys(fields).length === 0) return ""
  let rows = ""
  for (const [name, info] of Object.entries(fields)) {
    const type = info.type || info.meta_data || "any"
    const required = info.required ? '<span class="req">required</span>' : '<span class="opt">optional</span>'
    const desc = info.description || ""
    const def = info.default ? `<code class="default">${info.default}</code>` : ""
    rows += `<tr><td><code>${prefix}${name}</code></td><td><code>${type}</code></td><td>${required}</td><td>${desc}${def ? " " + def : ""}</td></tr>`
  }
  return `<table class="fields-table"><thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`
}

function renderResponseFields(response) {
  if (!response || Object.keys(response).length === 0) return '<p class="empty">No response data</p>'

  if (response.data && response.data.fields) {
    const metaNote = response.data.meta_data === "array" ? ' <span class="meta-badge">array</span>' : ""
    return `<div class="resp-info">${metaNote}</div>` + renderFields(response.data.fields)
  }

  const fields = {}
  for (const [key, val] of Object.entries(response)) {
    if (typeof val === "object" && val !== null) {
      fields[key] = val
      if (val.fields) {
        return renderFields({ [key]: val, ...val.fields })
      }
    }
  }
  if (Object.keys(fields).length > 0) return renderFields(fields)
  return '<p class="empty">No response data</p>'
}

function generateHTML(events) {
  const grouped = {}
  events.forEach(ev => {
    const cat = categorizeEvent(ev.event)
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(ev)
  })

  const categoryOrder = [
    "Navigation", "User Data Permission", "User Data", "Permission Cache",
    "Device Permission (Request)", "Device Permission (Check)",
    "Biometric Authentication", "Contacts", "File Picker",
    "Local Storage", "Location", "UI Customization", "Share", "Other"
  ]

  const sidebar = categoryOrder.filter(c => grouped[c]).map(cat => {
    const items = grouped[cat].map(ev =>
      `<a class="nav-item" href="#${ev.event}">${toCamelCase(ev.event)}()</a>`
    ).join("")
    return `<div class="nav-group"><div class="nav-title">${cat}</div>${items}</div>`
  }).join("")

  const content = categoryOrder.filter(c => grouped[c]).map(cat => {
    const eventsHTML = grouped[cat].map(ev => {
      const fnName = toCamelCase(ev.event)
      const hasRequest = ev.request && ev.request.data && ev.request.data.fields && Object.keys(ev.request.data.fields).length > 0
      const metaData = ev.request?.data?.meta_data
      const stringifyNote = metaData === "stringify" ? '<span class="meta-badge stringify">data is JSON.stringify()</span>' : ""

      let requestHTML = ""
      if (hasRequest) {
        requestHTML = `<div class="section-label">Request <span class="data-note">data</span> ${stringifyNote}</div>` + renderFields(ev.request.data.fields)
      } else {
        requestHTML = `<div class="section-label">Request</div><p class="empty">No request parameters</p>`
      }

      const hasResponse = ev.response && ev.response.data && ev.response.data.fields && Object.keys(ev.response.data.fields).length > 0
      const responseHTML = `<div class="section-label">Response${hasResponse ? ' <span class="data-note">data</span>' : ''}</div>` + renderResponseFields(ev.response)

      return `<div class="event-card" id="${ev.event}">
        <div class="event-header">
          <span class="fn-name">${fnName}()</span>
          <span class="event-code">${ev.event}</span>
        </div>
        <p class="event-desc">${ev.description || ""}</p>
        ${requestHTML}
        ${responseHTML}
      </div>`
    }).join("")

    return `<div class="category-section">
      <h2 class="category-title">${cat}</h2>
      ${eventsHTML}
    </div>`
  }).join("")

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Super MiniApp SDK - API Documentation</title>
<base href="/miniapp/01km259cd43861c023e04cyqv3-pre-release/">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;color:#1f1f1f;display:flex;min-height:100vh}
.sidebar{width:280px;background:#fff;border-right:1px solid #e8e8e8;padding:20px 0;position:fixed;top:0;left:0;bottom:0;overflow-y:auto}
.sidebar h2{padding:0 20px 16px;font-size:16px;border-bottom:1px solid #e8e8e8;margin-bottom:12px}
.nav-group{margin-bottom:8px}
.nav-title{padding:8px 20px;font-size:11px;text-transform:uppercase;color:#999;font-weight:700;letter-spacing:.5px}
.nav-item{display:block;padding:3px 20px 3px 32px;font-size:12px;color:#555;text-decoration:none;line-height:1.7;font-family:'SF Mono',Monaco,Consolas,monospace}
.nav-item:hover{color:#1677ff;background:#f0f5ff}
.main{margin-left:280px;flex:1;padding:32px 40px;}
.main h1{font-size:24px;margin-bottom:4px}
.main>.subtitle{color:#666;margin-bottom:28px}
.category-section{margin-bottom:32px}
.category-title{font-size:18px;color:#1f1f1f;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #1677ff}
.event-card{background:#fff;border-radius:8px;padding:20px 24px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.event-header{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.fn-name{font-size:16px;font-weight:700;color:#1f1f1f;font-family:'SF Mono',Monaco,Consolas,monospace}
.event-code{font-size:11px;color:#1677ff;background:#e6f4ff;padding:2px 8px;border-radius:4px;font-family:monospace}
.event-desc{color:#555;font-size:13px;margin-bottom:12px;line-height:1.5}
.section-label{font-size:12px;font-weight:700;color:#999;text-transform:uppercase;margin:12px 0 6px;letter-spacing:.5px}
.fields-table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px}
.fields-table th{text-align:left;padding:6px 10px;background:#fafafa;border-bottom:2px solid #f0f0f0;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.3px}
.fields-table td{padding:6px 10px;border-bottom:1px solid #f5f5f5}
.fields-table code{background:#f5f5f5;padding:1px 5px;border-radius:3px;font-size:12px}
.req{color:#ff4d4f;font-size:11px;font-weight:600}
.opt{color:#999;font-size:11px}
.default{background:#fff7e6;color:#d48806;font-size:11px}
.meta-badge{display:inline-block;padding:1px 8px;border-radius:4px;font-size:10px;font-weight:600;background:#f6ffed;color:#52c41a;margin-left:8px}
.meta-badge.stringify{background:#fff0f6;color:#eb2f96}
.data-note{font-size:11px;font-weight:400;color:#1677ff;background:#e6f4ff;padding:1px 6px;border-radius:3px;text-transform:none;letter-spacing:0;font-family:'SF Mono',Monaco,Consolas,monospace}
.empty{color:#ccc;font-size:12px;font-style:italic;margin:4px 0}
.resp-info{margin-bottom:4px}
.demo-link{display:inline-block;margin-top:8px;padding:8px 20px;background:#1677ff;color:#fff;border-radius:6px;text-decoration:none;font-size:14px}
.demo-link:hover{background:#4096ff}
.stats{display:flex;gap:16px;margin-bottom:24px}
.stat-card{background:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.stat-card .num{font-size:24px;font-weight:700;color:#1677ff}
.stat-card .label{font-size:12px;color:#999}
.getting-started{margin-bottom:32px}
.getting-started .category-title{margin-top:24px}
.framework-title{font-size:15px;color:#1f1f1f;margin:16px 0 8px;padding-left:4px}
.code-block{background:#1e1e1e;color:#d4d4d4;padding:16px;border-radius:6px;overflow-x:auto;font-size:13px;line-height:1.6;font-family:'SF Mono',Monaco,Consolas,monospace;white-space:pre}
.code-block code{background:none;padding:0;color:inherit;font-size:inherit}
@media(max-width:768px){.sidebar{display:none}.main{margin-left:0}}
</style>
</head>
<body>
<div class="sidebar">
  <h2>MiniApp SDK</h2>
  <div style="padding:16px 20px;border-top:1px solid #e8e8e8;margin-top:12px; position: sticky;top: -25px;background: white;">
    <a class="demo-link" href="https://staging1.viettelmoney.vn/miniapp/01km03tv28thk14tt8bq4adha5-pre-release/" style="display:block;text-align:center">Demo Angular</a>
    <a class="demo-link" href="https://staging1.viettelmoney.vn/miniapp/01km03s38mdqyz1xd1fj03yz90-pre-release/" style="display:block;text-align:center">Demo React</a>
    <a class="demo-link" href="https://staging1.viettelmoney.vn/miniapp/01km03swe6njmgnx0jfva6dgvd-pre-release/" style="display:block;text-align:center">Demo Vue</a>
  </div>
  <div class="nav-group">
    <div class="nav-title">Getting Started</div>
    <a class="nav-item" href="#cai-dat">Cai dat</a>
    <a class="nav-item" href="#bat-dau-nhanh">Bat dau nhanh</a>
    <a class="nav-item" href="#giao-thuc-chung">Giao thuc chung</a>
  </div>
  ${sidebar}
</div>
<div class="main">
  <h1>API Documentation</h1>
  <p class="subtitle">Tu dong sinh tu events.json — ${events.length} events.</p>
  <div class="stats">
    <div class="stat-card"><div class="num">${events.length}</div><div class="label">Total Events</div></div>
    <div class="stat-card"><div class="num">${Object.keys(grouped).length}</div><div class="label">Categories</div></div>
  </div>
  <div class="getting-started">
    <h2 class="category-title" id="cai-dat">Cai dat</h2>
    <div class="event-card">
      <p style="color:#555;font-size:13px;margin-bottom:12px"><strong>Buoc 1:</strong> Tai file thu vien va code demo</p>
      <a class="demo-link" href="webview-sdk-core-1.0.0.tgz" download style="margin-bottom:16px">Tai webview-sdk-core-1.0.0.tgz</a>
      <a class="demo-link" href="demo.zip" download style="margin-bottom:16px">Tai code demo</a>

      <p style="color:#555;font-size:13px;margin-top:16px;margin-bottom:8px"><strong>Buoc 2:</strong> Copy file <code>webview-sdk-core-1.0.0.tgz</code> vao thu muc <code>core-lib/</code> trong project</p>
      <pre class="code-block"><code>mkdir -p core-lib
cp webview-sdk-core-1.0.0.tgz core-lib/</code></pre>

      <p style="color:#555;font-size:13px;margin-top:16px;margin-bottom:8px"><strong>Buoc 3:</strong> Them dependency vao <code>package.json</code></p>
      <pre class="code-block"><code>{
  "dependencies": {
    "@webview-sdk/core": "file:core-lib/webview-sdk-core-1.0.0.tgz"
  }
}</code></pre>

      <p style="color:#555;font-size:13px;margin-top:16px;margin-bottom:8px"><strong>Buoc 4:</strong> Cai dat</p>
      <pre class="code-block"><code>npm install</code></pre>

      <p style="color:#555;font-size:13px;margin-top:12px">Chi can 1 package duy nhat cho moi framework (React, Vue, Angular, vanilla JS).</p>
    </div>

    <h2 class="category-title" id="bat-dau-nhanh">Bat dau nhanh</h2>
    <div class="event-card">
      <pre class="code-block"><code>import { getSharedMiniApp, getLocation, appOpenWebview, isSuccess } from '@webview-sdk/core'

const app = getSharedMiniApp({ debug: true })
app.ready()

// Goi API qua generated function (type-safe)
const res = await getLocation()
if (isSuccess(res)) {
  console.log(res.data)
}

// Goi API co tham so
await appOpenWebview({ data: { url: 'https://example.com', serviceName: 'Demo' } })

// Goi API qua invoke (dynamic)
const res2 = await app.invoke('GET_LOCATION')</code></pre>
    </div>

    <h3 class="framework-title">React</h3>
    <div class="event-card">
      <pre class="code-block"><code>import { useEffect } from 'react'
import { getSharedMiniApp, getLocation, isSuccess } from '@webview-sdk/core'

const app = getSharedMiniApp({ debug: true })

function App() {
  useEffect(() =&gt; { app.ready() }, [])

  const handleClick = async () =&gt; {
    const res = await getLocation()
    if (isSuccess(res)) console.log(res.data)
  }

  return &lt;button onClick={handleClick}&gt;Get Location&lt;/button&gt;
}</code></pre>
    </div>

    <h3 class="framework-title">Vue 3</h3>
    <div class="event-card">
      <pre class="code-block"><code>&lt;script setup&gt;
import { onMounted } from 'vue'
import { getSharedMiniApp, getLocation, isSuccess } from '@webview-sdk/core'

const app = getSharedMiniApp({ debug: true })
onMounted(() =&gt; { app.ready() })

async function handleClick() {
  const res = await getLocation()
  if (isSuccess(res)) console.log(res.data)
}
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="handleClick"&gt;Get Location&lt;/button&gt;
&lt;/template&gt;</code></pre>
    </div>

    <h3 class="framework-title">Angular</h3>
    <div class="event-card">
      <pre class="code-block"><code>import { Component } from '@angular/core'
import { getSharedMiniApp, MiniApp, getLocation, isSuccess } from '@webview-sdk/core'

@Component({
  template: \`&lt;button (click)="handleClick()"&gt;Get Location&lt;/button&gt;\`
})
export class AppComponent {
  private app: MiniApp

  constructor() {
    this.app = getSharedMiniApp({ debug: true })
    this.app.ready()
  }

  async handleClick() {
    const res = await getLocation()
    if (isSuccess(res)) console.log(res.data)
  }
}</code></pre>
    </div>
    <h2 class="category-title" id="giao-thuc-chung">Giao thuc chung (Base Protocol)</h2>
    <div class="event-card">
      <p style="color:#555;font-size:13px;margin-bottom:12px">Tat ca request va response deu ke thua cac truong chung ben duoi. Phan <strong>Request</strong> va <strong>Response</strong> cua moi event chi hien thi truong <code>data</code> rieng.</p>

      <div class="section-label">MiniAppRequestBase — Tat ca Request deu co</div>
      <table class="fields-table">
        <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>event</code></td><td><code>string</code></td><td><span class="req">required</span></td><td>Ten event (VD: GET_LOCATION)</td></tr>
          <tr><td><code>sender</code></td><td><code>string</code></td><td><span class="req">required</span></td><td>Nguon gui, mac dinh "MINIAPP_WEBVIEW"</td></tr>
          <tr><td><code>request_id</code></td><td><code>string</code></td><td><span class="req">required</span></td><td>ID duy nhat cua request, dung de map response</td></tr>
          <tr><td><code>data</code></td><td><code>object</code></td><td><span class="opt">optional</span></td><td>Du lieu rieng cua tung event (xem chi tiet ben duoi)</td></tr>
        </tbody>
      </table>

      <div class="section-label">MiniAppResponseBase — Tat ca Response deu co</div>
      <table class="fields-table">
        <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>event</code></td><td><code>string</code></td><td><span class="req">required</span></td><td>Ten event tuong ung voi request</td></tr>
          <tr><td><code>sender</code></td><td><code>string</code></td><td><span class="req">required</span></td><td>Nguon gui, mac dinh "MINIAPP_SDK"</td></tr>
          <tr><td><code>response_id</code></td><td><code>string</code></td><td><span class="req">required</span></td><td>ID cua response</td></tr>
          <tr><td><code>request_id</code></td><td><code>string</code></td><td><span class="req">required</span></td><td>ID cua request tuong ung</td></tr>
          <tr><td><code>eventStatus</code></td><td><code>EventStatus</code></td><td><span class="req">required</span></td><td>Trang thai xu ly (errorCode, errorMessageVN, errorMessageEN, realMsg)</td></tr>
          <tr><td><code>errorData</code></td><td><code>string</code></td><td><span class="opt">optional</span></td><td>Du lieu loi chi tiet (neu co)</td></tr>
          <tr><td><code>message</code></td><td><code>string</code></td><td><span class="opt">optional</span></td><td>Thong bao bo sung</td></tr>
          <tr><td><code>data</code></td><td><code>object</code></td><td><span class="opt">optional</span></td><td>Du lieu tra ve rieng cua tung event (xem chi tiet ben duoi)</td></tr>
        </tbody>
      </table>

      <div class="section-label">EventStatus</div>
      <table class="fields-table">
        <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>errorCode</code></td><td><code>string</code></td><td>"SDK000" = thanh cong. Dung <code>isSuccess(res)</code> de kiem tra</td></tr>
          <tr><td><code>errorMessageVN</code></td><td><code>string</code></td><td>Thong bao loi tieng Viet</td></tr>
          <tr><td><code>errorMessageEN</code></td><td><code>string</code></td><td>Thong bao loi tieng Anh</td></tr>
          <tr><td><code>realMsg</code></td><td><code>string</code></td><td>Thong bao goc tu native</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  ${content}
</div>
</body>
</html>`
}

function buildDocs() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const eventsData = JSON.parse(fs.readFileSync(EVENTS_JSON, "utf8"))
  const events = eventsData.events || []

  const html = generateHTML(events)
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), html)

  console.log(`Docs generated: ${events.length} events`)
  console.log("  -> " + path.join(OUTPUT_DIR, "index.html") + " (API docs)")
}

buildDocs()
