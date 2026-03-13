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
// Helpers
// ==================================================================

function toCamelCase(str) {
  return str.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function groupEvents(events) {
  const groups = {}
  events.forEach(evt => {
    let prefix
    if (evt.event.startsWith("REQUEST_") && evt.event.includes("PERMISSION")) prefix = "Request Permissions"
    else if (evt.event.startsWith("CHECK_") && evt.event.includes("PERMISSION")) prefix = "Check Permissions"
    else if (evt.event.startsWith("APP_") || evt.event.startsWith("OPEN_") || evt.event === "EXIT") prefix = "Navigation"
    else if (evt.event.startsWith("GET_")) prefix = "Data"
    else if (evt.event.startsWith("SET_") || evt.event.startsWith("UPDATE_")) prefix = "UI Customization"
    else if (evt.event.startsWith("STORAGE_")) prefix = "Storage"
    else if (evt.event.startsWith("UI_")) prefix = "UI"
    else if (evt.event.startsWith("NAVIGATOR_")) prefix = "Navigator"
    else prefix = "Other"
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
          if (v.required !== false || Object.keys(def.fields).indexOf(k) < 2) {
            if (v.type === "string") inner[k] = v.description ? v.description.slice(0, 20) : "example"
            else if (v.type === "number") inner[k] = 1
            else if (v.type === "boolean") inner[k] = true
            else if (v.type === "array") inner[k] = []
            else inner[k] = "example"
          }
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
    const entry = data ? \`\${msg}: \${JSON.stringify(data)}\` : msg;
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
      this.log(\`ERR \${evt.name}: \${(err as any).message}\`);
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

    <!-- Input JSON -->
    <section>
        <h3 class="section-title">Input Data (JSON)</h3>
        <textarea
            [(ngModel)]="inputValue"
            placeholder='{"data":{"url":"https://example.com"}}'
            class="input-area"
        ></textarea>
    </section>

    <!-- Event groups -->
    <section *ngFor="let group of groups">
        <h3 class="section-title">{{ group.title }}</h3>
        <div class="btn-group">
            <div *ngFor="let evt of group.events" class="evt-wrap">
                <button class="btn" (click)="showPopup(evt)" [title]="evt.desc">{{ evt.name }}</button>
                <div class="popup" *ngIf="popup?.name === evt.name">
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

    <!-- Logs -->
    <div style="margin-top: 16px">
        <div style="display: flex; justify-content: space-between; align-items: center">
            <h3 style="margin: 0">Logs</h3>
            <button class="btn" (click)="logs = []">Clear</button>
        </div>
        <pre class="log-area">{{ logs.length ? logs.join('\\n') : 'No logs yet.' }}</pre>
    </div>
</div>

<!-- Overlay to close popup -->
<div class="overlay" *ngIf="popup" (click)="popup = null"></div>
`

  return { ts, html }
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

  return `import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getSharedMiniApp,
  ${imports.join(",\n  ")},
} from '@webview-sdk/core';

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
    const entry = data ? \`\${msg}: \${JSON.stringify(data)}\` : msg;
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
      log(\`ERR \${evt.name}: \${err.message}\`);
    }
  }, [log]);

  const fillInput = useCallback((evt: EventInfo) => {
    if (evt.defaultData) {
      setInput(JSON.stringify(JSON.parse(evt.defaultData), null, 2));
    }
    setPopup(null);
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20 }}>MiniApp SDK - React Demo</h1>

      {/* Input */}
      <Section title="Input Data (JSON)">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='{"data":{"url":"https://example.com"}}'
          style={{ width: '100%', minHeight: 60, fontFamily: 'monospace', fontSize: 12, padding: 8, border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' as const }}
        />
      </Section>

      {groups.map(g => (
        <Section key={g.title} title={g.title}>
          {g.events.map(evt => (
            <div key={evt.name} style={{ position: 'relative', display: 'inline-block' }}>
              <Btn onClick={() => setPopup(popup?.name === evt.name ? null : evt)}>{evt.name}</Btn>
              {popup?.name === evt.name && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 12, minWidth: 220, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>{evt.event}</div>
                  {evt.desc && <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>{evt.desc}</div>}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn onClick={() => runEvent(evt)}>Run</Btn>
                    {evt.hasParams && <Btn onClick={() => fillInput(evt)}>Fill Input</Btn>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </Section>
      ))}

      {/* Generic invoke */}
      <Section title="Generic invoke()">
        <Btn onClick={() => runEvent({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: false, defaultData: null })}>invoke(input)</Btn>
      </Section>

      {/* Logs */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Logs</h3>
          <Btn onClick={() => setLogs([])}>Clear</Btn>
        </div>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 8, fontSize: 12, maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
          {logs.length ? logs.join('\\n') : 'No logs yet.'}
        </pre>
      </div>

      {/* Overlay */}
      {popup && <div onClick={() => setPopup(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 14, color: '#666', borderBottom: '1px solid #eee', paddingBottom: 4 }}>{title}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>{children}</div>
    </div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: 12 }}>
      {children}
    </button>
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
import { ref, onMounted } from 'vue';
import {
  getSharedMiniApp,
  ${imports.join(",\n  ")},
} from '@webview-sdk/core';

const app = getSharedMiniApp({ debug: true });
const logs = ref<string[]>([]);
const input = ref('');
const popup = ref<any>(null);

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
  const entry = data ? \`\${msg}: \${JSON.stringify(data)}\` : msg;
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
    log(\`ERR \${evt.name}: \${err.message}\`);
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
  <div style="font-family: system-ui; padding: 16px; max-width: 600px; margin: 0 auto">
    <h1 style="font-size: 20px">MiniApp SDK - Vue Demo</h1>

    <!-- Input -->
    <section>
      <h3 class="section-title">Input Data (JSON)</h3>
      <textarea
        v-model="input"
        placeholder='{"data":{"url":"https://example.com"}}'
        class="input-area"
      ></textarea>
    </section>

    <!-- Event groups -->
    <section v-for="group in groups" :key="group.title">
      <h3 class="section-title">{{ group.title }}</h3>
      <div class="btn-group">
        <div v-for="evt in group.events" :key="evt.name" class="evt-wrap">
          <button class="btn" @click="showPopup(evt)" :title="evt.desc">{{ evt.name }}</button>
          <div v-if="popup?.name === evt.name" class="popup">
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

    <!-- Logs -->
    <div style="margin-top: 16px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h3 style="margin: 0">Logs</h3>
        <button class="btn" @click="logs = []">Clear</button>
      </div>
      <pre class="log-area">{{ logs.length ? logs.join('\\n') : 'No logs yet.' }}</pre>
    </div>

    <!-- Overlay -->
    <div v-if="popup" class="overlay" @click="popup = null"></div>
  </div>
</template>

<style>
.section-title { font-size: 14px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 4px; }
.btn-group { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; font-size: 12px; }
.btn:hover { background: #e8e8e8; }
.btn-run { background: #4CAF50; color: #fff; border-color: #4CAF50; }
.btn-run:hover { background: #45a049; }
.btn-fill { background: #2196F3; color: #fff; border-color: #2196F3; }
.btn-fill:hover { background: #1e88e5; }
.input-area { width: 100%; min-height: 60px; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; }
.evt-wrap { position: relative; display: inline-block; }
.popup { position: absolute; top: 100%; left: 0; z-index: 100; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px; min-width: 220px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.popup-title { font-weight: bold; font-size: 12px; margin-bottom: 4px; }
.popup-desc { font-size: 11px; color: #666; margin-bottom: 8px; }
.popup-actions { display: flex; gap: 6px; }
.overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 50; }
.log-area { background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-size: 12px; max-height: 300px; overflow: auto; white-space: pre-wrap; }
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
console.log("Generated: angular/src/app/app.component.ts")
console.log("Generated: angular/src/app/app.component.html")

// React
const react = genReactApp(config.events)
fs.writeFileSync(path.join(__dirname, "react/src/App.tsx"), react)
console.log("Generated: react/src/App.tsx")

// Vue
const vue = genVueApp(config.events)
fs.writeFileSync(path.join(__dirname, "vue/src/App.vue"), vue)
console.log("Generated: vue/src/App.vue")

console.log("\nDone! All 3 demos generated from events.json")
