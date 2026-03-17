/**
 * Event Code Generator
 *
 * Doc events.json va sinh ra file TypeScript:
 * - generated/api.generated.ts — Cac ham invoke API tu dong theo event
 * - generated/types.generated.ts — Interfaces cho request/response
 * - generated/event-map.generated.ts — Map event name -> [request, response]
 *
 * Format events.json:
 *   request/response la object chua cac truong dong, moi truong co "meta_data":
 *   - "object"    : object voi fields (gui nguyen)
 *   - "stringify"  : object voi fields (JSON.stringify truoc khi gui)
 *   - "string"/"number"/"boolean"/"any" : kieu don
 *
 * Chay: node packages/core/src/event.js
 */

const fs = require("fs")
const path = require("path")

const EVENTS_FILE = path.join(__dirname, "events.json")
const OUTPUT_DIR = path.join(__dirname, "generated")

// ==================================================================
// Helpers
// ==================================================================

/** SNAKE_CASE -> camelCase: GET_USER_INFO -> getUserInfo */
function toCamelCase(str) {
  return str.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

/** SNAKE_CASE -> PascalCase: GET_USER_INFO -> GetUserInfo */
function toPascalCase(str) {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/** Map type tu JSON sang TypeScript (kieu don, khong co items) */
function toTsType(jsonType) {
  const map = { string: "string", number: "number", boolean: "boolean", object: "Record<string, any>", array: "any[]", any: "any" }
  return map[jsonType] || "any"
}

/**
 * Gen TypeScript type cho mang: dua vao items va fields
 * - items: "string" -> string[]
 * - items: "object" + fields -> { ... }[]
 * - items: "number" -> number[]
 * - khong co items -> any[]
 */
function genArrayType(def, indent) {
  const items = def.items || "any"
  if (items === "object" && def.fields && Object.keys(def.fields).length > 0) {
    return genInlineType(def.fields, indent || 2) + "[]"
  }
  return toTsType(items) + "[]"
}

/** Gen inline object type tu nested fields (de quy) */
function genInlineType(fields, indent) {
  if (!fields || Object.keys(fields).length === 0) return "Record<string, any>"
  const pad = " ".repeat(indent)
  const lines = Object.entries(fields).map(([key, def]) => {
    const optional = def.required === false ? "?" : ""
    let tsType
    if (def.type === "array") {
      tsType = genArrayType(def, indent + 2)
    } else if (def.type === "object" && def.fields && Object.keys(def.fields).length > 0) {
      tsType = genInlineType(def.fields, indent + 2)
    } else {
      tsType = toTsType(def.type)
    }
    const comment = def.description ? ` // ${def.description}` : ""
    return `${pad}  ${key}${optional}: ${tsType};${comment}`
  })
  return `{\n${lines.join("\n")}\n${pad}}`
}

/**
 * Gen interface tu section definition (request hoac response).
 * Moi truong co meta_data dinh nghia kieu.
 *
 * meta_data:
 *   "object"    -> object voi fields
 *   "stringify"  -> object/array voi fields, JSON.stringify khi gui
 *     + co items -> mang (VD: stringify array of objects)
 *     + khong items -> object (VD: stringify object)
 *   "array"     -> mang, items dinh nghia kieu phan tu
 *   "string"/"number"/"boolean"/"any" -> kieu don
 */
function genInterface(name, sectionDef) {
  const entries = Object.entries(sectionDef || {})
  if (entries.length === 0) return `export interface ${name} {}`

  const lines = entries.map(([key, def]) => {
    const meta = def.meta_data || "any"
    const optional = def.required === false ? "?" : ""
    const comment = def.description ? ` // ${def.description}` : ""

    let tsType
    if (meta === "array") {
      // Mang: items dinh nghia kieu phan tu
      tsType = genArrayType(def, 2)
    } else if (meta === "object") {
      // Object voi fields
      if (def.fields && Object.keys(def.fields).length > 0) {
        tsType = genInlineType(def.fields, 2)
      } else {
        tsType = "Record<string, any>"
      }
    } else if (meta === "stringify") {
      // Stringify: co the la object hoac array
      if (def.items) {
        // Stringify mang
        tsType = genArrayType(def, 2)
      } else if (def.fields && Object.keys(def.fields).length > 0) {
        // Stringify object
        tsType = genInlineType(def.fields, 2)
      } else {
        tsType = "Record<string, any>"
      }
    } else {
      tsType = toTsType(meta)
    }

    return `  ${key}${optional}: ${tsType};${comment}`
  })

  return `export interface ${name} {\n${lines.join("\n")}\n}`
}

// ==================================================================
// Doc events.json
// ==================================================================

function loadEvents() {
  const raw = fs.readFileSync(EVENTS_FILE, "utf8")
  return JSON.parse(raw)
}

// ==================================================================
// Gen types.generated.ts
// ==================================================================

function genTypes(config) {
  const lines = []

  lines.push("// ============================================================")
  lines.push("// AUTO-GENERATED — DO NOT EDIT")
  lines.push("// Generated by event.js from events.json")
  lines.push("// ============================================================")
  lines.push("")

  // Base protocol types
  lines.push("// --- Giao thuc chung ---")
  lines.push("")
  lines.push("export interface MiniAppRequestBase {")
  lines.push("  event: string;")
  lines.push("  sender: string;")
  lines.push("  request_id: string;")
  lines.push("  [key: string]: any;")
  lines.push("}")
  lines.push("")
  lines.push("export interface EventStatus {")
  lines.push("  errorCode: string;")
  lines.push("  errorMessageVN: string;")
  lines.push("  errorMessageEN: string;")
  lines.push("  realMsg: string;")
  lines.push("}")
  lines.push("")
  lines.push("export interface MiniAppResponseBase {")
  lines.push("  event: string;")
  lines.push("  sender: string;")
  lines.push("  response_id: string;")
  lines.push("  request_id: string;")
  lines.push("  eventStatus: EventStatus;")
  lines.push("  errorData: string;")
  lines.push("  message: string;")
  lines.push("  [key: string]: any;")
  lines.push("}")
  lines.push("")
  lines.push("/** Request day du = base + custom fields */")
  lines.push("export type MiniAppRequest<T = Record<string, any>> = MiniAppRequestBase & T;")
  lines.push("")
  lines.push("/** Response day du = base + custom fields */")
  lines.push("export type MiniAppResponse<T = Record<string, any>> = MiniAppResponseBase & T;")
  lines.push("")

  // Per-event interfaces
  lines.push("// --- Request / Response cho tung event ---")
  lines.push("")

  config.events.forEach(evt => {
    const pascal = toPascalCase(evt.event)
    lines.push(`/** ${evt.description} */`)
    lines.push(genInterface(`${pascal}Request`, evt.request))
    lines.push("")
    lines.push(genInterface(`${pascal}Response`, evt.response))
    lines.push("")
  })

  // Event name union
  lines.push("// --- Event name constants ---")
  lines.push("")
  const eventNames = config.events.map(e => `  | '${e.event}'`)
  lines.push(`export type MiniAppEventName =\n${eventNames.join("\n")};`)
  lines.push("")

  // Event list
  lines.push("/** Danh sach tat ca events voi metadata */")
  lines.push("export const EVENT_LIST = [")
  config.events.forEach(evt => {
    const pascal = toPascalCase(evt.event)
    lines.push(`  { event: '${evt.event}', method: '${toCamelCase(evt.event)}', description: '${evt.description}', requestType: '${pascal}Request', responseType: '${pascal}Response' },`)
  })
  lines.push("] as const;")
  lines.push("")

  return lines.join("\n")
}

// ==================================================================
// Gen api.generated.ts
// ==================================================================

function genApi(config) {
  const lines = []

  lines.push("// ============================================================")
  lines.push("// AUTO-GENERATED — DO NOT EDIT")
  lines.push("// Generated by event.js from events.json")
  lines.push("// ============================================================")
  lines.push("")
  lines.push("import type {")

  const imports = ["MiniAppRequestBase", "MiniAppResponseBase", "MiniAppResponse"]
  config.events.forEach(evt => {
    const pascal = toPascalCase(evt.event)
    imports.push(`${pascal}Request`)
    imports.push(`${pascal}Response`)
  })
  lines.push("  " + imports.join(",\n  "))
  lines.push("} from './types.generated';")
  lines.push("")

  // Check response success
  lines.push("/** Kiem tra response co thanh cong khong (errorCode === 'SDK000') */")
  lines.push("export function isSuccess(response: MiniAppResponseBase): boolean {")
  lines.push("  return response.eventStatus?.errorCode === 'SDK000' || response.errorCode === 'SDK000';")
  lines.push("}")
  lines.push("")

  // SendRaw function type — accepts MiniAppRequestBase directly
  lines.push("type SendRawFn = (message: MiniAppRequestBase) => Promise<any>;")
  lines.push("")
  lines.push("let _sendRaw: SendRawFn | null = null;")
  lines.push("")
  lines.push("/**")
  lines.push(" * Khoi tao module API voi ham gui message")
  lines.push(" * Goi 1 lan khi setup MiniApp SDK")
  lines.push(" */")
  lines.push("export function initMiniAppAPI(sendFn: SendRawFn): void {")
  lines.push("  _sendRaw = sendFn;")
  lines.push("}")
  lines.push("")

  // Internal send helper — creates MiniAppRequestBase directly (flat)
  lines.push("function send<TRes>(event: string, payload: Record<string, any>): Promise<MiniAppResponse<TRes>> {")
  lines.push("  if (!_sendRaw) throw new Error('MiniApp API chua duoc khoi tao. Goi wireToMiniApp() truoc.');")
  lines.push("  return _sendRaw({ event, sender: '', request_id: '', ...payload }) as Promise<MiniAppResponse<TRes>>;")
  lines.push("}")
  lines.push("")

  // Gen API function cho tung event
  lines.push("// ============================================================")
  lines.push("// API Functions - Tu dong sinh tu events.json")
  lines.push("// Ten ham = camelCase(event). VD: GET_USER_INFO -> getUserInfo()")
  lines.push("// ============================================================")
  lines.push("")

  config.events.forEach(evt => {
    const camel = toCamelCase(evt.event)
    const pascal = toPascalCase(evt.event)
    const paramType = `${pascal}Request`
    const returnType = `${pascal}Response`

    const reqEntries = Object.entries(evt.request || {})
    const resEntries = Object.entries(evt.response || {})
    const hasReqFields = reqEntries.length > 0
    const hasRequired = reqEntries.some(([_, d]) => d.required !== false)

    // Collect stringify fields
    const reqStringify = reqEntries.filter(([_, d]) => d.meta_data === "stringify").map(([n]) => n)
    const resStringify = resEntries.filter(([_, d]) => d.meta_data === "stringify").map(([n]) => n)

    // JSDoc
    lines.push("/**")
    lines.push(` * ${evt.description}`)
    lines.push(` * Event: ${evt.event}`)
    reqEntries.forEach(([fieldName, fieldDef]) => {
      const meta = fieldDef.meta_data || "any"
      if (meta === "stringify") {
        lines.push(` * @note ${fieldName} duoc JSON.stringify() truoc khi gui`)
      }
      if (meta === "object" || meta === "stringify") {
        if (fieldDef.fields) {
          Object.entries(fieldDef.fields).forEach(([k, v]) => {
            const req = v.required === false ? "(optional)" : "(required)"
            const dflt = v.default !== undefined ? ` [default: ${JSON.stringify(v.default)}]` : ""
            lines.push(` * @param payload.${fieldName}.${k} ${req} ${v.description || ""}${dflt}`)
          })
        }
      } else {
        lines.push(` * @param payload.${fieldName} (${meta}) ${fieldDef.description || ""}`)
      }
    })
    resStringify.forEach(f => {
      lines.push(` * @note response.${f} duoc JSON.parse() tu string`)
    })
    lines.push(" */")

    // Function signature
    if (hasReqFields) {
      const optional = hasRequired ? "" : " = {} as any"
      lines.push(`export async function ${camel}(payload: ${paramType}${optional}): Promise<MiniAppResponse<${returnType}>> {`)
    } else {
      lines.push(`export async function ${camel}(): Promise<MiniAppResponse<${returnType}>> {`)
    }

    // Function body
    const needsReqTransform = reqStringify.length > 0
    const needsResTransform = resStringify.length > 0

    if (needsReqTransform || needsResTransform) {
      // Build payload with stringify transforms
      if (needsReqTransform) {
        lines.push("  const _p: any = { ...payload };")
        reqStringify.forEach(f => {
          lines.push(`  if (_p.${f} !== undefined) _p.${f} = JSON.stringify(_p.${f});`)
        })
      }
      const sendPayload = needsReqTransform ? "_p" : (hasReqFields ? "payload" : "{}")

      if (needsResTransform) {
        lines.push(`  const res = await send<any>('${evt.event}', ${sendPayload});`)
        resStringify.forEach(f => {
          lines.push(`  if (typeof res.${f} === 'string') { try { res.${f} = JSON.parse(res.${f}); } catch (_) {} }`)
        })
        lines.push(`  return res as MiniAppResponse<${returnType}>;`)
      } else {
        lines.push(`  return send<${returnType}>('${evt.event}', ${sendPayload});`)
      }
    } else {
      lines.push(`  return send<${returnType}>('${evt.event}', ${hasReqFields ? "payload" : "{}"});`)
    }

    lines.push("}")
    lines.push("")
  })

  // wireToMiniApp
  lines.push("// ============================================================")
  lines.push("// wireToMiniApp — Goi 1 lan trong framework adapter (React/Vue/Angular)")
  lines.push("// ============================================================")
  lines.push("")
  lines.push("/**")
  lines.push(" * Noi generated API voi MiniApp instance.")
  lines.push(" * Goi 1 lan trong getSharedInstance() hoac constructor cua adapter.")
  lines.push(" */")
  lines.push("export function wireToMiniApp(app: { sendRaw(msg: MiniAppRequestBase): Promise<any> }): void {")
  lines.push("  initMiniAppAPI((msg) => {")
  lines.push("    return app.sendRaw(msg).then((raw): MiniAppResponseBase & Record<string, any> => {")
  lines.push("      if (raw && raw.eventStatus) return raw;")
  lines.push("      const data = typeof raw === 'object' && raw !== null ? raw : { data: raw };")
  lines.push("      return {")
  lines.push("        event: msg.event || '',")
  lines.push("        sender: 'MINIAPP_SDK',")
  lines.push("        response_id: '',")
  lines.push("        request_id: msg.request_id || '',")
  lines.push("        ...data,")
  lines.push("        eventStatus: { errorCode: 'SDK000', errorMessageVN: 'Thanh cong', errorMessageEN: 'Success', realMsg: '' },")
  lines.push("        errorData: '',")
  lines.push("        message: '',")
  lines.push("      };")
  lines.push("    });")
  lines.push("  });")
  lines.push("}")
  lines.push("")

  // Export object
  lines.push("// ============================================================")
  lines.push("// Export tat ca API duoi dang object de dung: MiniAppAPI.getUserInfo()")
  lines.push("// ============================================================")
  lines.push("")
  lines.push("export const MiniAppAPI = {")
  config.events.forEach(evt => {
    lines.push(`  /** ${evt.description} */`)
    lines.push(`  ${toCamelCase(evt.event)},`)
  })
  lines.push("  /** Kiem tra response thanh cong */")
  lines.push("  isSuccess,")
  lines.push("  /** Khoi tao API module */")
  lines.push("  init: initMiniAppAPI,")
  lines.push("  /** Noi voi MiniApp instance (dung trong adapter) */")
  lines.push("  wire: wireToMiniApp,")
  lines.push("};")
  lines.push("")

  return lines.join("\n")
}

// ==================================================================
// Gen event-map.generated.ts
// ==================================================================

function genEventMap(config) {
  const lines = []

  lines.push("// ============================================================")
  lines.push("// AUTO-GENERATED — DO NOT EDIT")
  lines.push("// Event map: ten event -> { request, response } types")
  lines.push("// ============================================================")
  lines.push("")
  lines.push("import type {")
  const imports = []
  config.events.forEach(evt => {
    const pascal = toPascalCase(evt.event)
    imports.push(`${pascal}Request`)
    imports.push(`${pascal}Response`)
  })
  lines.push("  " + imports.join(",\n  "))
  lines.push("} from './types.generated';")
  lines.push("")

  lines.push("/** Map event name -> [RequestType, ResponseType] */")
  lines.push("export interface MiniAppEventMap {")
  config.events.forEach(evt => {
    const pascal = toPascalCase(evt.event)
    lines.push(`  '${evt.event}': [${pascal}Request, ${pascal}Response];`)
  })
  lines.push("}")
  lines.push("")

  lines.push("/** Danh sach event name constants */")
  lines.push("export const MINIAPP_EVENTS = {")
  config.events.forEach(evt => {
    lines.push(`  /** ${evt.description} */`)
    lines.push(`  ${toCamelCase(evt.event)}: '${evt.event}' as const,`)
  })
  lines.push("};")
  lines.push("")

  return lines.join("\n")
}

// ==================================================================
// Main
// ==================================================================

function main() {
  console.log("Reading events.json...")
  const config = loadEvents()
  console.log(`Found ${config.events.length} events\n`)

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Gen types
  const typesContent = genTypes(config)
  const typesFile = path.join(OUTPUT_DIR, "types.generated.ts")
  fs.writeFileSync(typesFile, typesContent)
  console.log(`Generated: ${path.relative(process.cwd(), typesFile)}`)

  // Gen API
  const apiContent = genApi(config)
  const apiFile = path.join(OUTPUT_DIR, "api.generated.ts")
  fs.writeFileSync(apiFile, apiContent)
  console.log(`Generated: ${path.relative(process.cwd(), apiFile)}`)

  // Gen event map
  const mapContent = genEventMap(config)
  const mapFile = path.join(OUTPUT_DIR, "event-map.generated.ts")
  fs.writeFileSync(mapFile, mapContent)
  console.log(`Generated: ${path.relative(process.cwd(), mapFile)}`)

  // Summary
  console.log("\n=== Generated API summary ===")
  config.events.forEach(evt => {
    const camel = toCamelCase(evt.event)
    const reqFields = Object.entries(evt.request || {})
    const resFields = Object.entries(evt.response || {})
    const reqInfo = reqFields.map(([n, d]) => {
      const m = d.meta_data || "?"
      const sf = (m === "object" || m === "stringify") ? `(${Object.keys(d.fields || {}).length}f)` : ""
      return `${n}:${m}${sf}`
    }).join(", ") || "(none)"
    const resInfo = resFields.map(([n, d]) => {
      const m = d.meta_data || "?"
      const sf = (m === "object" || m === "stringify") ? `(${Object.keys(d.fields || {}).length}f)` : ""
      return `${n}:${m}${sf}`
    }).join(", ") || "(none)"
    console.log(`  ${camel}()  req: [${reqInfo}]  res: [${resInfo}]`)
  })
  console.log("\nDone!")
}

main()
