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

const CSS_SHARED = `.container { font-family: system-ui; top: 0; left: 0; padding: 16px; padding-top: calc(16px + env(safe-area-inset-top)); padding-bottom: calc(16px + env(safe-area-inset-bottom)); padding-left: calc(16px + env(safe-area-inset-left)); padding-right: calc(16px + env(safe-area-inset-right)); margin: 0 auto; position: fixed; width: 100vw; height: 100vh; height: 100dvh; overflow: auto; background: #f9f9f9; box-sizing: border-box; }
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
.btn-save { background: #9C27B0; color: #fff; border-color: #9C27B0; }
.btn-save:hover { background: #7B1FA2; }
.btn-delete { background: #f44336; color: #fff; border-color: #f44336; }
.btn-delete:hover { background: #d32f2f; }
.input-area { width: 100%; box-sizing: border-box; min-height: 80px; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; touch-action: manipulation; }
.btn.long-pressing { background: #ff9800 !important; color: #fff !important; border-color: #ff9800 !important; transform: scale(0.95); transition: transform 0.15s; }
.evt-wrap { display: inline-block; }
.popup-overlay { position: fixed; inset: 0; z-index: 99; background: rgba(0,0,0,0.4); }
.popup-custom { position: fixed; left: 0; right: 0; bottom: 0; z-index: 100; background: #fff; border-radius: 16px 16px 0 0; padding: 16px; max-height: 85vh; overflow-y: auto; box-shadow: 0 -4px 24px rgba(0,0,0,0.2); }
.popup-title { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
.popup-desc { font-size: 11px; color: #888; margin-bottom: 8px; }
.popup-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.popup-log { margin-top: 8px; padding: 8px 10px; background-color: #1e1e1e; color: #d4d4d4; font-family: 'Consolas','Monaco','Courier New',monospace; font-size: 11px; line-height: 1.5; border-radius: 6px; max-height: 200px; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word; }
.popup-log::-webkit-scrollbar { width: 6px; }
.popup-log::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
`

// ==================================================================
// Smart Tap + Long Press utilities (injected into all frameworks)
// ==================================================================

const SMART_TAP_UTILS_TS = `
function selectBetweenChar(el: HTMLTextAreaElement, char: string): void {
  const pos = el.selectionStart ?? 0;
  const text = el.value;
  const start = text.lastIndexOf(char, pos - 1);
  const end = text.indexOf(char, pos);
  if (start === -1 || end === -1) return;
  el.focus();
  el.setSelectionRange(start + 1, end);
}
function setupSmartTap(el: HTMLTextAreaElement): void {
  let tapCount = 0;
  let tapTimer: ReturnType<typeof setTimeout> | null = null;
  el.addEventListener('touchend', () => {
    tapCount++;
    if (tapTimer) clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      if (tapCount >= 3) selectBetweenChar(el, '"');
      tapCount = 0;
    }, 300);
  });
}
function setupLongPress(el: HTMLElement, onLongPress: () => void, duration = 600): void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const start = () => {
    el.classList.add('long-pressing');
    timer = setTimeout(() => { timer = null; onLongPress(); el.classList.remove('long-pressing'); }, duration);
  };
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } el.classList.remove('long-pressing'); };
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('touchend', cancel);
  el.addEventListener('touchmove', cancel);
}
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
    // else if (evt.event.includes("LOCATION")) prefix = "Location"
    else if (evt.event.includes("COLOR") || evt.event.includes("APPEARANCE") || evt.event.includes("THEME")) prefix = "UI"
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
    const meta = def.meta_data || 'any'
    if (meta === 'object' || meta === 'stringify') {
      if (def.fields && Object.keys(def.fields).length > 0) {
        const inner = {}
        Object.entries(def.fields).forEach(([k, v]) => {
          // Priority: use default value from events.json if available
          if (v.default !== undefined) {
            const d = v.default
            if (typeof d === 'boolean' || typeof d === 'number') {
              inner[k] = d
            } else if (typeof d === 'string' && (d.startsWith('[') || d.startsWith('{'))) {
              // default is a JSON string (array/object) — parse to JS value
              try { inner[k] = JSON.parse(d) } catch { inner[k] = d }
            } else {
              inner[k] = d
            }
          } else {
            // Fallback placeholder by type
            if (v.type === 'string') inner[k] = '...'
            else if (v.type === 'number') inner[k] = 0
            else if (v.type === 'boolean') inner[k] = true
            else if (v.type === 'array') inner[k] = []
            else if (v.type === 'object') inner[k] = {}
            else inner[k] = '...'
          }
        })
        parts[key] = inner
      } else {
        parts[key] = {}
      }
    } else if (meta === 'array') {
      parts[key] = []
    } else {
      // Top-level primitive — also prefer default
      if (def.default !== undefined) parts[key] = def.default
      else if (meta === 'string') parts[key] = '...'
      else if (meta === 'number') parts[key] = 0
      else if (meta === 'boolean') parts[key] = true
      else parts[key] = '...'
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

  const ts = `import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import {
  MiniApp,
  getSharedMiniApp,
  ${imports.join(",\n  ")},
} from '@webview-sdk/core';

interface EventInfo {
  name: string;
  event: string;
  desc: string;
  hasParams: boolean;
  defaultData: string | null;
}

${SMART_TAP_UTILS_TS}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  inputs: Record<string, string> = {};
  eventLogs: Record<string, string[]> = {};
  popup: EventInfo | null = null;
  private app: MiniApp;
  private smartTapReady = new WeakSet<HTMLTextAreaElement>();

  // Event registry
  private fns: Record<string, () => Promise<any>> = {};

  constructor() {
    this.app = getSharedMiniApp({ debug: true });
    this.app.ready();
    this.registerFns();
  }

  ngAfterViewInit(): void {
    document.querySelectorAll<HTMLElement>('.btn[data-evt]').forEach(btn => {
      const evtName = btn.dataset['evt']!;
      const evt = this.groups.flatMap(g => g.events).find(e => e.name === evtName);
      if (evt) setupLongPress(btn, () => this.quickRun(evt));
    });
  }

  onInputFocus(e: FocusEvent): void {
    const el = e.target as HTMLTextAreaElement;
    if (!this.smartTapReady.has(el)) { this.smartTapReady.add(el); setupSmartTap(el); }
  }

  getInputStr(name: string): string { return this.inputs[name] || ''; }
  setInputStr(name: string, val: string): void { this.inputs[name] = val; }
  getLogsStr(name: string): string {
    const l = this.eventLogs[name] || [];
    return l.length ? l.join('\\n') : 'No logs yet.';
  }

  private getInputFor_(name: string): any {
    const v = (this.inputs[name] || '').trim();
    if (!v) return null;
    try { return JSON.parse(v); } catch { return null; }
  }

  quickRun(evt: EventInfo): void {
    const saved = localStorage.getItem(this.lsKey(evt.name));
    if (saved) { try { this.inputs[evt.name] = JSON.stringify(JSON.parse(saved), null, 2); } catch { this.inputs[evt.name] = saved; } }
    else if (evt.defaultData) this.inputs[evt.name] = JSON.stringify(JSON.parse(evt.defaultData), null, 2);
    this.runEvent(evt);
  }

  private registerFns(): void {
${registry.map(r => {
    if (r.hasParams) {
      const defaultJson = JSON.stringify(r.sample)
      return `    this.fns['${r.camel}'] = () => ${r.camel}(this.getInputFor_('${r.camel}') || ${defaultJson});`
    }
    return `    this.fns['${r.camel}'] = () => ${r.camel}();`
  }).join("\n")}
    this.fns['invoke'] = () => this.app.invoke(this.getInputFor_('invoke')?.event || 'GET_LOCATION', this.getInputFor_('invoke'));
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

  private logFor(name: string, msg: string, data?: any): void {
    const entry = data ? \`\${msg}: \${JSON.stringify(data, null, 2)}\` : msg;
    if (!this.eventLogs[name]) this.eventLogs[name] = [];
    this.eventLogs[name] = [\`[\${new Date().toLocaleTimeString()}] \${entry}\`, ...this.eventLogs[name]];
  }

  async runEvent(evt: EventInfo): Promise<void> {
    const fn = this.fns[evt.name];
    if (!fn) return;
    try {
      this.logFor(evt.name, \`> \${evt.name}...\`);
      const res = await fn();
      this.logFor(evt.name, \`OK \${evt.name}\`, res);
    } catch (err) {
      this.logFor(evt.name, \`ERR \${evt.name}\`, err);
    }
  }

  private lsKey(name: string): string { return \`webview_sdk_input_\${name}\`; }

  fillInput(evt: EventInfo): void {
    const saved = localStorage.getItem(this.lsKey(evt.name));
    if (saved) { try { this.inputs[evt.name] = JSON.stringify(JSON.parse(saved), null, 2); } catch { this.inputs[evt.name] = saved; } }
    else if (evt.defaultData) { this.inputs[evt.name] = JSON.stringify(JSON.parse(evt.defaultData), null, 2); }
  }

  saveInput(evt: EventInfo): void {
    const v = (this.inputs[evt.name] || '').trim();
    if (v) localStorage.setItem(this.lsKey(evt.name), v);
  }

  deleteInput(evt: EventInfo): void {
    localStorage.removeItem(this.lsKey(evt.name));
  }

  clearLog(name: string): void {
    this.eventLogs[name] = [];
  }

  showPopup(evt: EventInfo): void {
    this.popup = this.popup?.name === evt.name ? null : evt;
  }
}
`

  const html = `<div class="container">
    <h1>MiniApp SDK - Angular Demo</h1>

    <!-- Event groups -->
    <section *ngFor="let group of groups">
        <h3 class="section-title">{{ group.title }}</h3>
        <div class="btn-group">
            <div *ngFor="let evt of group.events" class="evt-wrap">
                <button class="btn" (click)="showPopup(evt)" [title]="evt.desc" [attr.data-evt]="evt.name">{{ evt.name }}</button>
            </div>
        </div>
    </section>

    <!-- Generic invoke -->
    <section>
        <h3 class="section-title">Generic invoke()</h3>
        <div class="btn-group">
            <button class="btn" (click)="showPopup({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: true, defaultData: null })">invoke(input)</button>
        </div>
    </section>
    <div style="padding: 50px"></div>

    <!-- Overlay -->
    <div class="popup-overlay" *ngIf="popup" (click)="popup = null"></div>

    <!-- Popup (bottom sheet) -->
    <div class="popup-custom" *ngIf="popup">
        <div class="popup-title">{{ popup.event }}</div>
        <div class="popup-desc" *ngIf="popup.desc">{{ popup.desc }}</div>
        <div class="popup-actions">
            <button class="btn btn-run" (click)="runEvent(popup)">Run</button>
            <button class="btn btn-fill" *ngIf="popup.hasParams" (click)="fillInput(popup)">Fill Input</button>
            <button class="btn btn-save" *ngIf="popup.hasParams" (click)="saveInput(popup)">Save</button>
            <button class="btn btn-delete" *ngIf="popup.hasParams" (click)="deleteInput(popup)">Delete</button>
            <button class="btn" (click)="clearLog(popup.name)" style="margin-left:auto">Clear Log</button>
        </div>
        <textarea *ngIf="popup.hasParams"
            class="input-area"
            rows="15"
            [value]="getInputStr(popup.name)"
            (input)="setInputStr(popup.name, $any($event.target).value)"
            (focus)="onInputFocus($event)"
            placeholder='{"key":"value"}'
        ></textarea>
        <pre class="popup-log">{{ getLogsStr(popup.name) }}</pre>
    </div>
</div>

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
      return `    '${r.camel}': () => ${r.camel}(getInputFor('${r.camel}') || ${defaultJson})`
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
import './App.css';
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

${SMART_TAP_UTILS_TS}
export default function App() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [eventLogs, setEventLogs] = useState<Record<string, string[]>>({});
  const [popup, setPopup] = useState<EventInfo | null>(null);
  const inputsRef = useRef(inputs);
  const smartTapReady = useRef(new WeakSet<HTMLTextAreaElement>());
  inputsRef.current = inputs;

  useEffect(() => { app.ready(); }, []);

  const lsKey = (name: string) => \`webview_sdk_input_\${name}\`;

  const getInputFor = useCallback((name: string): any => {
    const v = (inputsRef.current[name] || '').trim();
    if (!v) return null;
    try { return JSON.parse(v); } catch { return null; }
  }, []);

  const fns: Record<string, () => Promise<any>> = {
${fnEntries.join(",\n")},
    'invoke': () => app.invoke(getInputFor('invoke')?.event || 'GET_LOCATION', getInputFor('invoke')),
  };

  const logFor = useCallback((name: string, msg: string, data?: any) => {
    const entry = data ? \`\${msg}: \${JSON.stringify(data, null, 2)}\` : msg;
    setEventLogs(prev => ({ ...prev, [name]: [\`[\${new Date().toLocaleTimeString()}] \${entry}\`, ...(prev[name] || [])] }));
  }, []);

  const runEvent = useCallback(async (evt: EventInfo) => {
    const fn = fns[evt.name];
    if (!fn) return;
    try {
      logFor(evt.name, \`> \${evt.name}...\`);
      const res = await fn();
      logFor(evt.name, \`OK \${evt.name}\`, res);
    } catch (err: any) {
      logFor(evt.name, \`ERR \${evt.name}\`, err);
    }
  }, [logFor]);

  const fillInput = useCallback((evt: EventInfo) => {
    const saved = localStorage.getItem(lsKey(evt.name));
    if (saved) { try { setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(saved), null, 2) })); } catch { setInputs(p => ({ ...p, [evt.name]: saved })); } }
    else if (evt.defaultData) setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(evt.defaultData!), null, 2) }));
  }, []);

  const saveInput = useCallback((evt: EventInfo) => {
    const v = (inputsRef.current[evt.name] || '').trim();
    if (v) localStorage.setItem(lsKey(evt.name), v);
  }, []);

  const deleteInput = useCallback((evt: EventInfo) => {
    localStorage.removeItem(lsKey(evt.name));
  }, []);

  const clearLog = useCallback((name: string) => {
    setEventLogs(p => ({ ...p, [name]: [] }));
  }, []);

  const quickRun = useCallback((evt: EventInfo) => {
    const saved = localStorage.getItem(lsKey(evt.name));
    if (saved) { try { setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(saved), null, 2) })); } catch { setInputs(p => ({ ...p, [evt.name]: saved })); } }
    else if (evt.defaultData) setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(evt.defaultData!), null, 2) }));
    runEvent(evt);
  }, [runEvent]);

  const btnRef = useCallback((el: HTMLButtonElement | null, evt: EventInfo) => {
    if (el) setupLongPress(el, () => quickRun(evt));
  }, [quickRun]);

  const textareaRef = useCallback((el: HTMLTextAreaElement | null) => {
    if (el && !smartTapReady.current.has(el)) { smartTapReady.current.add(el); setupSmartTap(el); }
  }, []);

  const getLogsStr = (name: string) => {
    const l = eventLogs[name] || [];
    return l.length ? l.join('\\n') : 'No logs yet.';
  };

  return (
    <div className="container">
      <h1>MiniApp SDK - React Demo</h1>

      {groups.map(g => (
        <section key={g.title}>
          <h3 className="section-title">{g.title}</h3>
          <div className="btn-group">
            {g.events.map(evt => (
              <div key={evt.name} className="evt-wrap">
                <button ref={el => btnRef(el, evt)} className="btn" onClick={() => setPopup(popup?.name === evt.name ? null : evt)} title={evt.desc}>{evt.name}</button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Generic invoke */}
      <section>
        <h3 className="section-title">Generic invoke()</h3>
        <div className="btn-group">
          <button className="btn" onClick={() => setPopup({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: true, defaultData: null })}>invoke(input)</button>
        </div>
      </section>
      <div style={{ padding: '50px' }}></div>

      {/* Overlay */}
      {popup && <div className="popup-overlay" onClick={() => setPopup(null)} />}

      {/* Popup (bottom sheet) */}
      {popup && (
        <div className="popup-custom">
          <div className="popup-title">{popup.event}</div>
          {popup.desc && <div className="popup-desc">{popup.desc}</div>}
          <div className="popup-actions">
            <button className="btn btn-run" onClick={() => runEvent(popup)}>Run</button>
            {popup.hasParams && <button className="btn btn-fill" onClick={() => fillInput(popup)}>Fill Input</button>}
            {popup.hasParams && <button className="btn btn-save" onClick={() => saveInput(popup)}>Save</button>}
            {popup.hasParams && <button className="btn btn-delete" onClick={() => deleteInput(popup)}>Delete</button>}
            <button className="btn" style={{ marginLeft: 'auto' }} onClick={() => clearLog(popup.name)}>Clear Log</button>
          </div>
          {popup.hasParams && (
            <textarea
              ref={textareaRef}
              rows={15}
              value={inputs[popup.name] || ''}
              onChange={e => setInputs(p => ({ ...p, [popup.name]: e.target.value }))}
              placeholder='{"key":"value"}'
              className="input-area"
            />
          )}
          <pre className="popup-log">{getLogsStr(popup.name)}</pre>
        </div>
      )}
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
      return `  '${r.camel}': () => ${r.camel}(getInputFor('${r.camel}') || ${defaultJson})`
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
const inputs = ref<Record<string, string>>({});
const eventLogs = ref<Record<string, string[]>>({});
const popup = ref<any>(null);
const smartTapReady = new WeakSet<HTMLTextAreaElement>();

${SMART_TAP_UTILS_TS}

onMounted(() => { app.ready(); });

const lsKey = (name: string) => \`webview_sdk_input_\${name}\`;

function getInputFor(name: string): any {
  const v = (inputs.value[name] || '').trim();
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}

const fns: Record<string, () => Promise<any>> = {
${fnEntries.join(",\n")},
  'invoke': () => app.invoke(getInputFor('invoke')?.event || 'GET_LOCATION', getInputFor('invoke')),
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

function logFor(name: string, msg: string, data?: any) {
  const entry = data ? \`\${msg}: \${JSON.stringify(data, null, 2)}\` : msg;
  if (!eventLogs.value[name]) eventLogs.value[name] = [];
  eventLogs.value[name] = [\`[\${new Date().toLocaleTimeString()}] \${entry}\`, ...eventLogs.value[name]];
}

function getLogsStr(name: string): string {
  const l = eventLogs.value[name] || [];
  return l.length ? l.join('\\n') : 'No logs yet.';
}

async function runEvent(evt: EventInfo) {
  const fn = fns[evt.name];
  if (!fn) return;
  try {
    logFor(evt.name, \`> \${evt.name}...\`);
    const res = await fn();
    logFor(evt.name, \`OK \${evt.name}\`, res);
  } catch (err: any) {
    logFor(evt.name, \`ERR \${evt.name}\`, err);
  }
}

function fillInput(evt: EventInfo) {
  const saved = localStorage.getItem(lsKey(evt.name));
  if (saved) { try { inputs.value[evt.name] = JSON.stringify(JSON.parse(saved), null, 2); } catch { inputs.value[evt.name] = saved; } }
  else if (evt.defaultData) { try { inputs.value[evt.name] = JSON.stringify(JSON.parse(evt.defaultData), null, 2); } catch {} }
}

function saveInput(evt: EventInfo) {
  const v = (inputs.value[evt.name] || '').trim();
  if (v) localStorage.setItem(lsKey(evt.name), v);
}

function deleteInput(evt: EventInfo) {
  localStorage.removeItem(lsKey(evt.name));
}

function clearLog(name: string) {
  eventLogs.value[name] = [];
}

function quickRun(evt: EventInfo) {
  const saved = localStorage.getItem(lsKey(evt.name));
  if (saved) { try { inputs.value[evt.name] = JSON.stringify(JSON.parse(saved), null, 2); } catch { inputs.value[evt.name] = saved; } }
  else if (evt.defaultData) { try { inputs.value[evt.name] = JSON.stringify(JSON.parse(evt.defaultData), null, 2); } catch {} }
  runEvent(evt);
}

function showPopup(evt: EventInfo) {
  popup.value = popup.value?.name === evt.name ? null : evt;
}

function setupBtnRef(el: HTMLElement | null, evt: EventInfo) {
  if (el) setupLongPress(el, () => quickRun(evt));
}

function onInputFocus(e: FocusEvent) {
  const el = e.target as HTMLTextAreaElement;
  if (!smartTapReady.has(el)) { smartTapReady.add(el); setupSmartTap(el); }
}
</script>

<template>
  <div class="container">
    <h1>MiniApp SDK - Vue Demo</h1>

    <!-- Event groups -->
    <section v-for="group in groups" :key="group.title">
      <h3 class="section-title">{{ group.title }}</h3>
      <div class="btn-group">
        <div v-for="evt in group.events" :key="evt.name" class="evt-wrap">
          <button :ref="el => setupBtnRef(el as HTMLElement, evt)" class="btn" @click="showPopup(evt)" :title="evt.desc">{{ evt.name }}</button>
        </div>
      </div>
    </section>

    <!-- Generic invoke -->
    <section>
      <h3 class="section-title">Generic invoke()</h3>
      <div class="btn-group">
        <button class="btn" @click="showPopup({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: true, defaultData: '' })">invoke(input)</button>
      </div>
    </section>
    <div style="padding: 50px"></div>

    <!-- Overlay -->
    <div v-if="popup" class="popup-overlay" @click="popup = null"></div>

    <!-- Popup (bottom sheet) -->
    <div v-if="popup" class="popup-custom">
      <div class="popup-title">{{ popup.event }}</div>
      <div v-if="popup.desc" class="popup-desc">{{ popup.desc }}</div>
      <div class="popup-actions">
        <button class="btn btn-run" @click="runEvent(popup)">Run</button>
        <button v-if="popup.hasParams" class="btn btn-fill" @click="fillInput(popup)">Fill Input</button>
        <button v-if="popup.hasParams" class="btn btn-save" @click="saveInput(popup)">Save</button>
        <button v-if="popup.hasParams" class="btn btn-delete" @click="deleteInput(popup)">Delete</button>
        <button class="btn" style="margin-left:auto" @click="clearLog(popup.name)">Clear Log</button>
      </div>
      <textarea v-if="popup.hasParams"
        class="input-area"
        rows="15"
        :value="inputs[popup.name] || ''"
        @input="inputs[popup.name] = ($event.target as HTMLTextAreaElement).value"
        @focus="onInputFocus"
        placeholder='{"key":"value"}'
      ></textarea>
      <pre class="popup-log">{{ getLogsStr(popup.name) }}</pre>
    </div>
  </div>
</template>

<style>
${CSS_SHARED}
</style>
`
}

// ==================================================================
// Vanilla HTML Generator (uses dist/bundle.js directly)
// ==================================================================

function genVanillaHTML(events) {
  const groups = groupEvents(events)
  const registry = buildEventRegistry(events)

  // Build event data JSON for inline script
  const groupsData = Object.entries(groups).map(([group, evts]) => {
    const items = evts.map(evt => {
      const r = registry.find(x => x.event === evt.event)
      const defaultData = r.sample ? JSON.stringify(r.sample) : 'null'
      return `      { name: ${JSON.stringify(r.camel)}, event: ${JSON.stringify(r.event)}, desc: ${JSON.stringify(r.description)}, hasParams: ${r.hasParams}, defaultData: ${r.hasParams ? JSON.stringify(defaultData) : 'null'} }`
    })
    return `  { title: ${JSON.stringify(group)}, events: [\n${items.join(",\n")}\n  ] }`
  })

  // Build fns map entries
  const fnEntries = registry.map(r => {
    if (r.hasParams) {
      const defaultJson = JSON.stringify(r.sample)
      return `    '${r.camel}': function() { return WebviewSdk.${r.camel}(getInputFor('${r.camel}') || ${defaultJson}); }`
    }
    return `    '${r.camel}': function() { return WebviewSdk.${r.camel}(); }`
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>MiniApp SDK - Demo</title>
  <style>
${CSS_SHARED}
  </style>
</head>
<body>
  <div class="container" id="app"></div>

  <script src="bundle.js"></script>
  <script src="vconsole.min.js"></script>
  <script>
    var vConsole = new VConsole();
  </script>
  <script>
  (function() {
    'use strict';

    var app = WebviewSdk.getSharedMiniApp({ debug: true });
    app.ready();

    var inputs = {};
    var eventLogs = {};
    var currentPopup = null;

    var groups = [
${groupsData.join(",\n")}
    ];

    function lsKey(name) { return 'webview_sdk_input_' + name; }

    function getInputFor(name) {
      var v = (inputs[name] || '').trim();
      if (!v) return null;
      try { return JSON.parse(v); } catch(e) { return null; }
    }

    var fns = {
${fnEntries.join(",\n")},
      'invoke': function() { return app.invoke((getInputFor('invoke') || {}).event || 'GET_LOCATION', getInputFor('invoke')); }
    };

    function logFor(name, msg, data) {
      var entry = data ? msg + ': ' + JSON.stringify(data, null, 2) : msg;
      if (!eventLogs[name]) eventLogs[name] = [];
      eventLogs[name].unshift('[' + new Date().toLocaleTimeString() + '] ' + entry);
    }

    function getLogsStr(name) {
      var l = eventLogs[name] || [];
      return l.length ? l.join('\\n') : 'No logs yet.';
    }

    function runEvent(evt) {
      var fn = fns[evt.name];
      if (!fn) return;
      logFor(evt.name, '> ' + evt.name + '...');
      renderPopup();
      fn().then(function(res) {
        logFor(evt.name, 'OK ' + evt.name, res);
        renderPopup();
      }).catch(function(err) {
        logFor(evt.name, 'ERR ' + evt.name, err);
        renderPopup();
      });
    }

    function fillInput(evt) {
      var saved = localStorage.getItem(lsKey(evt.name));
      if (saved) { try { inputs[evt.name] = JSON.stringify(JSON.parse(saved), null, 2); } catch(e) { inputs[evt.name] = saved; } }
      else if (evt.defaultData) { inputs[evt.name] = JSON.stringify(JSON.parse(evt.defaultData), null, 2); }
      renderPopup();
    }

    function saveInput(evt) {
      var v = (inputs[evt.name] || '').trim();
      if (v) localStorage.setItem(lsKey(evt.name), v);
    }

    function deleteInput(evt) {
      localStorage.removeItem(lsKey(evt.name));
    }

    function clearLog(name) {
      eventLogs[name] = [];
      renderPopup();
    }

    function quickRun(evt) {
      var saved = localStorage.getItem(lsKey(evt.name));
      if (saved) { try { inputs[evt.name] = JSON.stringify(JSON.parse(saved), null, 2); } catch(e) { inputs[evt.name] = saved; } }
      else if (evt.defaultData) { inputs[evt.name] = JSON.stringify(JSON.parse(evt.defaultData), null, 2); }
      runEvent(evt);
    }

    // Long press
    function setupLongPress(el, onLongPress, duration) {
      duration = duration || 600;
      var timer = null;
      function start() {
        el.classList.add('long-pressing');
        timer = setTimeout(function() { timer = null; onLongPress(); el.classList.remove('long-pressing'); }, duration);
      }
      function cancel() { if (timer) { clearTimeout(timer); timer = null; } el.classList.remove('long-pressing'); }
      el.addEventListener('touchstart', start, { passive: true });
      el.addEventListener('touchend', cancel);
      el.addEventListener('touchmove', cancel);
    }

    // Triple-tap select between quotes
    function setupSmartTap(el) {
      var tapCount = 0, tapTimer = null;
      el.addEventListener('touchend', function() {
        tapCount++;
        if (tapTimer) clearTimeout(tapTimer);
        tapTimer = setTimeout(function() {
          if (tapCount >= 3) {
            var pos = el.selectionStart || 0;
            var text = el.value;
            var start = text.lastIndexOf('"', pos - 1);
            var end = text.indexOf('"', pos);
            if (start !== -1 && end !== -1) { el.focus(); el.setSelectionRange(start + 1, end); }
          }
          tapCount = 0;
        }, 300);
      });
    }

    // ---- Rendering ----

    function escapeHtml(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function renderApp() {
      var html = '<h1>MiniApp SDK - Demo</h1>';

      groups.forEach(function(g) {
        html += '<section><h3 class="section-title">' + escapeHtml(g.title) + '</h3><div class="btn-group">';
        g.events.forEach(function(evt) {
          html += '<div class="evt-wrap"><button class="btn" data-evt="' + escapeHtml(evt.name) + '" title="' + escapeHtml(evt.desc) + '">' + escapeHtml(evt.name) + '</button></div>';
        });
        html += '</div></section>';
      });

      html += '<section><h3 class="section-title">Generic invoke()</h3><div class="btn-group">';
      html += '<button class="btn" data-evt="invoke">invoke(input)</button>';
      html += '</div></section>';
      html += '<div style="padding:50px"></div>';

      document.getElementById('app').innerHTML = html;

      // Bind buttons
      var allEvts = groups.reduce(function(a, g) { return a.concat(g.events); }, []);
      allEvts.push({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: true, defaultData: null });

      document.querySelectorAll('.btn[data-evt]').forEach(function(btn) {
        var evtName = btn.getAttribute('data-evt');
        var evt = allEvts.find(function(e) { return e.name === evtName; });
        if (!evt) return;
        btn.addEventListener('click', function() {
          currentPopup = currentPopup && currentPopup.name === evt.name ? null : evt;
          renderPopup();
        });
        setupLongPress(btn, function() { quickRun(evt); });
      });
    }

    function renderPopup() {
      // Remove old
      var oldOverlay = document.querySelector('.popup-overlay');
      var oldPopup = document.querySelector('.popup-custom');
      if (oldOverlay) oldOverlay.remove();
      if (oldPopup) oldPopup.remove();

      if (!currentPopup) return;
      var evt = currentPopup;

      // Overlay
      var overlay = document.createElement('div');
      overlay.className = 'popup-overlay';
      overlay.addEventListener('click', function() { currentPopup = null; renderPopup(); });
      document.body.appendChild(overlay);

      // Popup
      var popup = document.createElement('div');
      popup.className = 'popup-custom';
      var h = '<div class="popup-title">' + escapeHtml(evt.event) + '</div>';
      if (evt.desc) h += '<div class="popup-desc">' + escapeHtml(evt.desc) + '</div>';
      h += '<div class="popup-actions">';
      h += '<button class="btn btn-run" id="popup-run">Run</button>';
      if (evt.hasParams) {
        h += '<button class="btn btn-fill" id="popup-fill">Fill Input</button>';
        h += '<button class="btn btn-save" id="popup-save">Save</button>';
        h += '<button class="btn btn-delete" id="popup-delete">Delete</button>';
      }
      h += '<button class="btn" id="popup-clear" style="margin-left:auto">Clear Log</button>';
      h += '</div>';
      if (evt.hasParams) {
        h += '<textarea class="input-area" id="popup-input" rows="15" placeholder="' + escapeHtml('{"key":"value"}') + '">' + escapeHtml(inputs[evt.name] || '') + '</textarea>';
      }
      h += '<pre class="popup-log" id="popup-log">' + escapeHtml(getLogsStr(evt.name)) + '</pre>';
      popup.innerHTML = h;
      document.body.appendChild(popup);

      // Bind popup buttons
      document.getElementById('popup-run').addEventListener('click', function() { runEvent(evt); });
      if (evt.hasParams) {
        var ta = document.getElementById('popup-input');
        ta.addEventListener('input', function() { inputs[evt.name] = ta.value; });
        setupSmartTap(ta);
        document.getElementById('popup-fill').addEventListener('click', function() { fillInput(evt); });
        document.getElementById('popup-save').addEventListener('click', function() { saveInput(evt); });
        document.getElementById('popup-delete').addEventListener('click', function() { deleteInput(evt); });
      }
      document.getElementById('popup-clear').addEventListener('click', function() { clearLog(evt.name); });
    }

    renderApp();
  })();
  </script>
</body>
</html>
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

// Vanilla HTML (standalone — uses dist/bundle.js directly)
const vanilla = genVanillaHTML(config.events)
const vanillaDir = path.join(__dirname, "vanilla")
if (!fs.existsSync(vanillaDir)) fs.mkdirSync(vanillaDir, { recursive: true })
fs.writeFileSync(path.join(vanillaDir, "index.html"), vanilla)
// Copy bundle.js alongside index.html
fs.copyFileSync(path.join(__dirname, "../dist/bundle.js"), path.join(vanillaDir, "bundle.js"))
console.log("Generated: vanilla/index.html")
console.log("Copied:    vanilla/bundle.js")

console.log("\nDone! All demos generated from events.json (Angular, React, Vue, Vanilla HTML)")
