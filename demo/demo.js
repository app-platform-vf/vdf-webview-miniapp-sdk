/**
 * Demo Code Generator
 *
 * Doc events.json va sinh code demo cho Angular, React, Vue.
 * Moi event tao 1 button, click hien popup voi 2 nut:
 *   - "Fill Input": dien default data vao textarea
 *   - "Run": goi event
 *
 * Chay: node demo/demo.js
 */

const fs = require("fs")
const path = require("path")

const EVENTS_FILE = path.join(__dirname, "../packages/core/src/events.json")

// ==================================================================
// Shared CSS
// ==================================================================

const CSS_SHARED = `.container { font-family: system-ui; top: 0; left: 0; padding: 16px; margin: 0 auto; position: fixed; width: 100vw; height: 100vh; overflow: auto; background: #f9f9f9; }
h1 { font-size: 20px; }
.sticky-top { position: sticky; top: -20px; background: white; z-index: 1; padding-right: 20px;}
.section-title { font-size: 14px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 4px; }
.btn-group { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; font-size: 12px; }
.btn:hover { background: #e8e8e8; }
.btn-run { background: #4CAF50; color: #fff; border-color: #4CAF50; }
.btn-run:hover { background: #45a049; }
.btn-fill { background: #2196F3; color: #fff; border-color: #2196F3; }
.btn-fill:hover { background: #1e88e5; }
.input-area { width: calc(100vw - 40px); min-height: 60px; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; }
.evt-wrap { position: relative; display: inline-block; }
.popup-custom { position: absolute; top: 100%; left: 0; z-index: 100; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px; min-width: 220px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.popup-title { font-weight: bold; font-size: 12px; margin-bottom: 4px; }
.popup-desc { font-size: 11px; color: #666; margin-bottom: 8px; }
.popup-actions { display: flex; gap: 6px; }
.overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 50; }
.log-area {
    margin-top: 10px;
    padding: 12px;
    background-color: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    border-radius: 6px;
    border: 1px solid #333;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}
.log-area::-webkit-scrollbar { width: 8px; height: 8px; }
.log-area::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
.log-area::-webkit-scrollbar-thumb:hover { background: #555; }
`

// ==================================================================
// Helpers
// ==================================================================

function toCamelCase(str) {
  return str.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function groupEvents(events) {
  const groups = {}
  events.forEach(evt => {
    let prefix
    if (evt.event.includes("USER_DATA") && evt.event.includes("PERMISSION")) prefix = "UserData Permission"
    else if (evt.event.startsWith("EXIT") || evt.event.includes("OPEN")) prefix = "Routing"
    else if ((evt.event.startsWith("REQUEST") && evt.event.includes("PERMISSION")) || evt.event.includes("EXECUTE_LOCAL_AUTHENTICATION")) prefix = "Device Request Permission"
    else if (evt.event.startsWith("CHECK") && evt.event.includes("PERMISSION")) prefix = "Device Check Permission"
    else if (((evt.event.startsWith("SAVE_") || evt.event.startsWith("GET_")) && evt.event.endsWith("VALUE")) || evt.event.includes("STORAGE")) prefix = "Storage"
    else if (evt.event.includes("LOCATION")) prefix = "Location"
    else if (evt.event.endsWith("COLOR") || evt.event.endsWith("APPEARANCE")) prefix = "UI"
    else prefix = "Get data event"
    if (!groups[prefix]) groups[prefix] = []
    groups[prefix].push(evt)
  })
  return groups
}

function buildSampleData(requestDef) {
  if (!requestDef || Object.keys(requestDef).length === 0) return null
  const parts = {}
  Object.entries(requestDef).forEach(([key, def]) => {
    const meta = def.meta_data || "any"
    if (meta === "object" || meta === "stringify") {
      if (def.fields && Object.keys(def.fields).length > 0) {
        const inner = {}
        Object.entries(def.fields).forEach(([k, v]) => {
          if (v.type === "string") inner[k] = v.description ? v.description.slice(0, 40) : "example"
          else if (v.type === "number") inner[k] = 1
          else if (v.type === "boolean") inner[k] = v.default !== undefined ? v.default : true
          else if (v.type === "array") inner[k] = v.items === "string" ? ["example1", "example2"] : []
          else if (v.type === "object") inner[k] = {}
          else inner[k] = "example"
        })
        parts[key] = inner
      } else {
        parts[key] = {}
      }
    } else if (meta === "array") {
      parts[key] = []
    } else {
      if (meta === "string") parts[key] = "example"
      else if (meta === "number") parts[key] = 1
      else if (meta === "boolean") parts[key] = true
      else parts[key] = "example"
    }
  })
  return parts
}

function hasRequestFields(evt) {
  return Object.keys(evt.request || {}).length > 0
}

// ==================================================================
// Build event registry — shared data for all frameworks
// ==================================================================

function buildEventRegistry(events) {
  return events.map(evt => {
    const camel = toCamelCase(evt.event)
    const hasParams = hasRequestFields(evt)
    const sample = hasParams ? buildSampleData(evt.request) : null
    return { event: evt.event, camel, description: evt.description || '', hasParams, sample }
  })
}

// ==================================================================
// Angular Generator
// ==================================================================

function genAngularComponent(events) {
  const groups = groupEvents(events)
  const registry = buildEventRegistry(events)
  const imports = registry.map(r => r.camel)

  // Build events array for popup
  const evtEntries = registry.map(r => {
    const defaultData = r.sample ? JSON.stringify(r.sample) : 'null'
    return `    { name: '${r.camel}', event: '${r.event}', desc: '${(r.description).replace(/'/g, "\\'")}', hasParams: ${r.hasParams}, defaultData: ${r.hasParams ? `'${defaultData.replace(/'/g, "\\'")}'` : 'null'} }`
  })

  const ts = `import { Component } from '@angular/core';
import {
  getSharedMiniApp,
  MiniApp,
  ${imports.join(",\n  ")},
} from '@webview-sdk/core';

interface EventInfo {
  name: string;
  event: string;
  desc: string;
  hasParams: boolean;
  defaultData: string | null;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  logs: string[] = [];
  inputValue = '';
  popup: EventInfo | null = null;
  private app: MiniApp;

  // Event registry
  private fns: Record<string, () => Promise<any>> = {};

  constructor() {
    this.app = getSharedMiniApp({ debug: true });
    this.app.ready();
    this.registerFns();
  }

  get formatLog() {
    return this.logs.length ? this.logs.join('\\n') : 'No logs yet.'
  }

  private getInput(): any {
    if (!this.inputValue.trim()) return null;
    try { return JSON.parse(this.inputValue); } catch { return null; }
  }

  private getDefault(evt: EventInfo): any {
    if (!evt.defaultData) return null;
    try { return JSON.parse(evt.defaultData); } catch { return null; }
  }

  private registerFns(): void {
${registry.map(r => {
    if (r.hasParams) {
      const defaultJson = JSON.stringify(r.sample)
      return `    this.fns['${r.camel}'] = () => ${r.camel}(this.getInput() || ${defaultJson});`
    }
    return `    this.fns['${r.camel}'] = () => ${r.camel}();`
  }).join("\n")}
    this.fns['invoke'] = () => this.app.invoke(this.getInput()?.event || 'GET_LOCATION', this.getInput());
  }

  // Event groups
  groups: { title: string; events: EventInfo[] }[] = [
${Object.entries(groups).map(([group, evts]) => {
    const items = evts.map(evt => {
      const r = registry.find(x => x.event === evt.event)
      const defaultData = r.sample ? JSON.stringify(r.sample) : 'null'
      return `      { name: '${r.camel}', event: '${r.event}', desc: '${(r.description).replace(/'/g, "\\'")}', hasParams: ${r.hasParams}, defaultData: ${r.hasParams ? `'${defaultData.replace(/'/g, "\\'")}'` : 'null'} }`
    })
    return `    { title: '${group}', events: [\n${items.join(",\n")}\n    ] }`
  }).join(",\n")}
  ];

  log(msg: string, data?: any): void {
    const entry = data ? \`\${msg}: \${JSON.stringify(data, null, 2)}\` : msg;
    this.logs.unshift(\`[\${new Date().toLocaleTimeString()}] \${entry}\`);
  }

  async runEvent(evt: EventInfo): Promise<void> {
    this.popup = null;
    const fn = this.fns[evt.name];
    if (!fn) return;
    try {
      this.log(\`> \${evt.name}...\`);
      const res = await fn();
      this.log(\`OK \${evt.name}\`, res);
    } catch (err) {
      this.log(\`ERR \${evt.name}\`, err);
    }
  }

  fillInput(evt: EventInfo): void {
    if (evt.defaultData) {
      this.inputValue = JSON.stringify(JSON.parse(evt.defaultData), null, 2);
    }
    this.popup = null;
  }

  showPopup(evt: EventInfo): void {
    this.popup = this.popup?.name === evt.name ? null : evt;
  }
}
`

  const html = `<div class="container">
    <h1>MiniApp SDK - Angular Demo</h1>

    <div class="sticky-top">
        <!-- Input JSON -->
        <section>
            <h3 class="section-title">Input Data (JSON)</h3>
            <textarea
                rows="5"
                [(ngModel)]="inputValue"
                placeholder='{"data":{"url":"https://example.com"}}'
                class="input-area"
            ></textarea>
        </section>

        <!-- Logs -->
        <div style="margin-top: 16px">
            <div style="display: flex; justify-content: space-between; align-items: center">
                <h3 style="margin: 0">Logs</h3>
                <button class="btn" (click)="logs = []">Clear</button>
            </div>
            <pre class="log-area"><code style="width: 800px; display: block;">{{ formatLog }}</code></pre>
        </div>
    </div>

    <!-- Event groups -->
    <section *ngFor="let group of groups">
        <h3 class="section-title">{{ group.title }}</h3>
        <div class="btn-group">
            <div *ngFor="let evt of group.events" class="evt-wrap">
                <button class="btn" (click)="showPopup(evt)" [title]="evt.desc">{{ evt.name }}</button>
                <div class="popup-custom" *ngIf="popup?.name === evt.name">
                    <div class="popup-title">{{ evt.event }}</div>
                    <div class="popup-desc" *ngIf="evt.desc">{{ evt.desc }}</div>
                    <div class="popup-actions">
                        <button class="btn btn-run" (click)="runEvent(evt)">Run</button>
                        <button class="btn btn-fill" *ngIf="evt.hasParams" (click)="fillInput(evt)">Fill Input</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Generic invoke -->
    <section>
        <h3 class="section-title">Generic invoke()</h3>
        <div class="btn-group">
            <button class="btn" (click)="runEvent({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: false, defaultData: null })">invoke(input)</button>
        </div>
    </section>
    <div style="padding: 50px"><div>
</div>

<!-- Overlay to close popup -->
<!-- <div class="overlay" *ngIf="popup" (click)="popup = null"></div> -->
`

  const scss = CSS_SHARED

  return { ts, html, scss }
}

// ==================================================================
// React Generator
// ==================================================================

function genReactApp(events) {
  const groups = groupEvents(events)
  const registry = buildEventRegistry(events)
  const imports = registry.map(r => r.camel)

  // Build fns registry
  const fnEntries = registry.map(r => {
    if (r.hasParams) {
      const defaultJson = JSON.stringify(r.sample)
      return `    '${r.camel}': () => ${r.camel}(getInput() || ${defaultJson})`
    }
    return `    '${r.camel}': () => ${r.camel}()`
  })

  // Build groups data
  const groupsData = Object.entries(groups).map(([group, evts]) => {
    const items = evts.map(evt => {
      const r = registry.find(x => x.event === evt.event)
      const defaultData = r.sample ? JSON.stringify(JSON.stringify(r.sample)) : 'null'
      return `      { name: '${r.camel}', event: '${r.event}', desc: ${JSON.stringify(r.description)}, hasParams: ${r.hasParams}, defaultData: ${r.hasParams ? defaultData : 'null'} }`
    })
    return `  { title: ${JSON.stringify(group)}, events: [\n${items.join(",\n")}\n  ] }`
  })

  return `import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  getSharedMiniApp,
  ${imports.join(",\n  ")},
} from '@webview-sdk/core';
import './App.css';

const app = getSharedMiniApp({ debug: true });

interface EventInfo {
  name: string;
  event: string;
  desc: string;
  hasParams: boolean;
  defaultData: string | null;
}

const groups: { title: string; events: EventInfo[] }[] = [
${groupsData.join(",\n")}
];

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [popup, setPopup] = useState<EventInfo | null>(null);
  const inputRef = useRef(input);
  inputRef.current = input;

  useEffect(() => { app.ready(); }, []);

  const formatLog = useMemo(() => {
    return logs.length ? logs.join('\\n') : 'No logs yet.';
  }, [logs]);

  const getInput = useCallback((): any => {
    const v = inputRef.current.trim();
    if (!v) return null;
    try { return JSON.parse(v); } catch { return null; }
  }, []);

  const fns: Record<string, () => Promise<any>> = {
${fnEntries.join(",\n")},
    'invoke': () => app.invoke(getInput()?.event || 'GET_LOCATION', getInput()),
  };

  const log = useCallback((msg: string, data?: any) => {
    const entry = data ? \`\${msg}: \${JSON.stringify(data, null, 2)}\` : msg;
    setLogs(prev => [\`[\${new Date().toLocaleTimeString()}] \${entry}\`, ...prev]);
  }, []);

  const runEvent = useCallback(async (evt: EventInfo) => {
    setPopup(null);
    const fn = fns[evt.name];
    if (!fn) return;
    try {
      log(\`> \${evt.name}...\`);
      const res = await fn();
      log(\`OK \${evt.name}\`, res);
    } catch (err: any) {
      log(\`ERR \${evt.name}\`, err);
    }
  }, [log]);

  const fillInput = useCallback((evt: EventInfo) => {
    if (evt.defaultData) {
      setInput(JSON.stringify(JSON.parse(evt.defaultData), null, 2));
    }
    setPopup(null);
  }, []);

  return (
    <div className="container">
      <h1>MiniApp SDK - React Demo</h1>

      <div className="sticky-top">
        {/* Input */}
        <section>
          <h3 className="section-title">Input Data (JSON)</h3>
          <textarea
            rows={5}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"data":{"url":"https://example.com"}}'
            className="input-area"
          />
        </section>

        {/* Logs */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Logs</h3>
            <button className="btn" onClick={() => setLogs([])}>Clear</button>
          </div>
          <pre className="log-area"><code style={{ width: 800, display: 'block' }}>{formatLog}</code></pre>
        </div>
      </div>

      {groups.map(g => (
        <section key={g.title}>
          <h3 className="section-title">{g.title}</h3>
          <div className="btn-group">
            {g.events.map(evt => (
              <div key={evt.name} className="evt-wrap">
                <button className="btn" onClick={() => setPopup(popup?.name === evt.name ? null : evt)} title={evt.desc}>{evt.name}</button>
                {popup?.name === evt.name && (
                  <div className="popup-custom">
                    <div className="popup-title">{evt.event}</div>
                    {evt.desc && <div className="popup-desc">{evt.desc}</div>}
                    <div className="popup-actions">
                      <button className="btn btn-run" onClick={() => runEvent(evt)}>Run</button>
                      {evt.hasParams && <button className="btn btn-fill" onClick={() => fillInput(evt)}>Fill Input</button>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Generic invoke */}
      <section>
        <h3 className="section-title">Generic invoke()</h3>
        <div className="btn-group">
          <button className="btn" onClick={() => runEvent({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: false, defaultData: null })}>invoke(input)</button>
        </div>
      </section>
    </div>
  );
}
`
}

// ==================================================================
// Vue Generator
// ==================================================================

function genVueApp(events) {
  const groups = groupEvents(events)
  const registry = buildEventRegistry(events)
  const imports = registry.map(r => r.camel)

  // Build fns map — use single quotes for Vue template safety
  const fnEntries = registry.map(r => {
    if (r.hasParams) {
      const defaultJson = JSON.stringify(r.sample).replace(/"/g, "'")
      return `  '${r.camel}': () => ${r.camel}(getInput() || ${defaultJson})`
    }
    return `  '${r.camel}': () => ${r.camel}()`
  })

  // Build groups — escape for Vue template
  const groupsData = Object.entries(groups).map(([group, evts]) => {
    const items = evts.map(evt => {
      const r = registry.find(x => x.event === evt.event)
      const defaultData = r.sample ? JSON.stringify(r.sample).replace(/\\/g, '\\\\').replace(/'/g, "\\'") : ''
      const desc = r.description.replace(/'/g, "\\'")
      return `      { name: '${r.camel}', event: '${r.event}', desc: '${desc}', hasParams: ${r.hasParams}, defaultData: '${defaultData}' }`
    })
    return `  { title: '${group}', events: [\n${items.join(",\n")}\n  ] }`
  })

  return `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  getSharedMiniApp,
  ${imports.join(",\n  ")},
} from '@webview-sdk/core';

const app = getSharedMiniApp({ debug: true });
const logs = ref<string[]>([]);
const input = ref('');
const popup = ref<any>(null);

const formatLog = computed(() => {
  return logs.value.length ? logs.value.join('\\n') : 'No logs yet.';
});

onMounted(() => { app.ready(); });

function getInput(): any {
  const v = input.value.trim();
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}

const fns: Record<string, () => Promise<any>> = {
${fnEntries.join(",\n")},
  'invoke': () => app.invoke(getInput()?.event || 'GET_LOCATION', getInput()),
};

interface EventInfo {
  name: string;
  event: string;
  desc: string;
  hasParams: boolean;
  defaultData: string;
}

const groups: { title: string; events: EventInfo[] }[] = [
${groupsData.join(",\n")}
];

function log(msg: string, data?: any) {
  const entry = data ? \`\${msg}: \${JSON.stringify(data, null, 2)}\` : msg;
  logs.value.unshift(\`[\${new Date().toLocaleTimeString()}] \${entry}\`);
}

async function runEvent(evt: EventInfo) {
  popup.value = null;
  const fn = fns[evt.name];
  if (!fn) return;
  try {
    log(\`> \${evt.name}...\`);
    const res = await fn();
    log(\`OK \${evt.name}\`, res);
  } catch (err: any) {
    log(\`ERR \${evt.name}\`, err);
  }
}

function fillInput(evt: EventInfo) {
  if (evt.defaultData) {
    try { input.value = JSON.stringify(JSON.parse(evt.defaultData), null, 2); } catch {}
  }
  popup.value = null;
}

function showPopup(evt: EventInfo) {
  popup.value = popup.value?.name === evt.name ? null : evt;
}
</script>

<template>
  <div class="container">
    <h1>MiniApp SDK - Vue Demo</h1>

    <div class="sticky-top">
      <!-- Input -->
      <section>
        <h3 class="section-title">Input Data (JSON)</h3>
        <textarea
          rows="5"
          v-model="input"
          placeholder='{"data":{"url":"https://example.com"}}'
          class="input-area"
        ></textarea>
      </section>

      <!-- Logs -->
      <div style="margin-top: 16px">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <h3 style="margin: 0">Logs</h3>
          <button class="btn" @click="logs = []">Clear</button>
        </div>
        <pre class="log-area"><code style="width: 800px; display: block;">{{ formatLog }}</code></pre>
      </div>
    </div>

    <!-- Event groups -->
    <section v-for="group in groups" :key="group.title">
      <h3 class="section-title">{{ group.title }}</h3>
      <div class="btn-group">
        <div v-for="evt in group.events" :key="evt.name" class="evt-wrap">
          <button class="btn" @click="showPopup(evt)" :title="evt.desc">{{ evt.name }}</button>
          <div v-if="popup?.name === evt.name" class="popup-custom">
            <div class="popup-title">{{ evt.event }}</div>
            <div v-if="evt.desc" class="popup-desc">{{ evt.desc }}</div>
            <div class="popup-actions">
              <button class="btn btn-run" @click="runEvent(evt)">Run</button>
              <button v-if="evt.hasParams" class="btn btn-fill" @click="fillInput(evt)">Fill Input</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Generic invoke -->
    <section>
      <h3 class="section-title">Generic invoke()</h3>
      <div class="btn-group">
        <button class="btn" @click="runEvent({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: false, defaultData: '' })">invoke(input)</button>
      </div>
    </section>
  </div>
</template>

<style>
${CSS_SHARED}
</style>
`
}

// ==================================================================
// Main
// ==================================================================

console.log("Reading events.json...")
const config = JSON.parse(fs.readFileSync(EVENTS_FILE, "utf-8"))
console.log(`Found ${config.events.length} events\n`)

// Angular
const angular = genAngularComponent(config.events)
fs.writeFileSync(path.join(__dirname, "angular/src/app/app.component.ts"), angular.ts)
fs.writeFileSync(path.join(__dirname, "angular/src/app/app.component.html"), angular.html)
fs.writeFileSync(path.join(__dirname, "angular/src/app/app.component.scss"), angular.scss)
console.log("Generated: angular/src/app/app.component.ts")
console.log("Generated: angular/src/app/app.component.html")
console.log("Generated: angular/src/app/app.component.scss")

// React
const react = genReactApp(config.events)
fs.writeFileSync(path.join(__dirname, "react/src/App.tsx"), react)
fs.writeFileSync(path.join(__dirname, "react/src/App.css"), CSS_SHARED)
console.log("Generated: react/src/App.tsx")
console.log("Generated: react/src/App.css")

// Vue
const vue = genVueApp(config.events)
fs.writeFileSync(path.join(__dirname, "vue/src/App.vue"), vue)
console.log("Generated: vue/src/App.vue")

console.log("\nDone! All 3 demos generated from events.json")
