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
 * Mot entry la MOT CHIEU khi no khong khai `response` trong hop dong.
 *
 * Day la dau hieu DUY NHAT, va no doc theo su VANG MAT cua mot khoa — nen no im
 * lang theo dung nghia den: go nham khoa `response` cua mot entry hai chieu se
 * bien no thanh mot chieu ma khong loi nao bao. Vi vay ham genAll in ra danh sach
 * event mot chieu moi lan sinh: cai gia cua mot dau hieu doc-theo-vang-mat la no
 * phai duoc NOI RA, khong duoc de im.
 *
 * `"response": {}` KHAC `khong co response`: cai dau la "co tra loi, khong truong
 * nao", cai sau la "khong tra loi". Hai thu do ra hai kieu API khac han nhau.
 */
function isOneWay(evt) {
  return !Object.prototype.hasOwnProperty.call(evt, "response")
}

/**
 * Truc parity — thu KHAI TRONG HOP DONG nhung KHONG PHAI EVENT.
 *
 * Mot truc parity la mot danh muc gia tri ma HAI native phai mang y het nhau. No di
 * SDK -> APP CHU, khong di xuong trang mini-app, nen no khong co entry trong `events`,
 * khong sinh ham API nao, va trang khong goi duoc no.
 *
 * Vi sao van khai o day, khi trang khong dung toi: vi "hop dong" la noi hai nen tang
 * doi chieu voi nhau, khong chi la noi trang tra cuu. Truc nay truoc day chi ton tai
 * trong hai enum native roi nhau, nen khong co MOT ban nao de so — va trang thai dung
 * cua no la CHUA DO, khong phai "khong lech". Khai ra day la dung mot ban de so.
 *
 * ⛔ Dung bien no thanh event bang cach chuyen sang mang `events`: lam vay la rao mot
 * nang luc ma khong nen tang nao cap cho trang — dung trang thai PROVIDER-ORPHAN ma du
 * an nay da mot lan phai go bang mot thay doi pha vo hop dong.
 */
function toScreamingSnake(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .toUpperCase()
}

/**
 * Kiem truc parity truoc khi sinh. Ba kiem, moi kiem chan mot loi im lang:
 *
 * 1. Truc rong / gia tri trung -> danh muc khong con la mot ban de so.
 * 2. `reachableFromPage: true` ma khong co event tuong ung -> hop dong rao mot duong
 *    khong ton tai. Day la PROVIDER-ORPHAN, va no chi lo ra o runtime cua doi tac.
 * 3. Ten truc trung ten kieu sinh tu event -> hai khai bao cung ten trong mot tep,
 *    TypeScript bao loi o TEP SINH RA chu khong tro ve hop dong.
 */
function validateParityAxes(config) {
  const axes = config.parityAxes || []
  const eventNames = new Set((config.events || []).map(e => e.event))
  const generatedTypeNames = new Set()
  ;(config.events || []).forEach(e => {
    generatedTypeNames.add(`${toPascalCase(e.event)}Request`)
    generatedTypeNames.add(`${toPascalCase(e.event)}Response`)
  })

  axes.forEach(axis => {
    const values = axis.values || []
    if (values.length === 0) {
      throw new Error(`Truc parity '${axis.axis}' khong co gia tri nao.`)
    }
    const seen = new Set()
    values.forEach(v => {
      if (seen.has(v.value)) {
        throw new Error(`Truc parity '${axis.axis}' co gia tri lap: '${v.value}'.`)
      }
      seen.add(v.value)
    })
    if (axis.reachableFromPage === true && !eventNames.has(axis.axis)) {
      throw new Error(
        `Truc parity '${axis.axis}' khai reachableFromPage: true nhung khong co event ` +
        `cung ten trong 'events'. Hop dong dang rao mot duong ma trang khong goi duoc.`
      )
    }
    if (generatedTypeNames.has(axis.axis)) {
      throw new Error(
        `Ten truc parity '${axis.axis}' trung voi mot kieu sinh tu event.`
      )
    }

    // `declaredIn` khong di vao ma sinh ra — doi tac khong can biet ten cu duoc khai o
    // tep native nao. No ton tai cho BO DO ben spec repo, va vi the no rat de bi quen
    // khi them mot dong moi: codegen van xanh, tai lieu van dung, chi co bo do la do —
    // va bo do thi chay o mot luc khac, tren mot may khac. Chan ngay o day.
    const requireDeclaredIn = (list, label) => {
      (list || []).forEach(d => {
        (d.platforms || []).forEach(p => {
          if (!(d.declaredIn || {})[p]) {
            throw new Error(
              `Truc '${axis.axis}': muc ${label} '${d.symbol}' thieu declaredIn['${p}']. ` +
              `Bo do parity can duong dan toi CHO KHAI de khoi dem nham cac ten trung.`
            )
          }
        })
      })
    }
    requireDeclaredIn(axis.deprecates, "deprecates")
    requireDeclaredIn(axis.explicitlyNotDeprecated, "explicitlyNotDeprecated")
  })

  return axes
}

/** Ho ma hop le trong catalog. Doi o day, dung sua rai rac. */
const ERROR_CODE_SHAPE = /^(SDK|MNA)\d+$/

/** Ma BAT BUOC phai co: `isSuccess()` so thang voi no. */
const SUCCESS_CODE = "SDK000"

const EMITTER_PLATFORMS = new Set(["android", "ios"])

/**
 * Kiem catalog ma ket qua truoc khi sinh.
 *
 * Catalog nay la ban chep thu BA cua mot danh muc von chi song trong hai enum native.
 * Bo do ben spec repo giu cho ba ban khong troi khoi nhau; cho nay chi giu cho CHINH
 * ban o day tu nhat quan — hai viec khac nhau, va gop lai thi ca hai deu lam do.
 *
 * Nam kiem, moi kiem chan mot loi im lang:
 *
 * 1. Ma lap -> ban ghi sau de ban ghi truoc trong Record, mot cau chu bien mat.
 * 2. Ma sai hinh dang -> khong phai ma, la mot dong go nham vao.
 * 3. Cau chu rong -> trang hien ra mot o trong, dung cai canh ma catalog nay sinh ra
 *    de tranh; `describeError` van tra ve mot object nen khong nhanh nao bat duoc.
 * 4. Thieu SDK000 -> `isSuccess()` so thang voi chuoi do, nen moi loi goi hoa that bai
 *    trong im lang ma khong loi bien dich nao bao.
 * 5. `emittedBy` sai -> hop dong khai mot su that ve nen tang ma khong ai kiem duoc.
 *    VANG MAT khoa nay nghia la CHUA DO, va do la mot trang thai hop le — dung tu dien
 *    thanh "ca hai deu phat".
 */
function validateErrorCodes(config) {
  const block = config.errorCodes
  if (!block) return []
  if (typeof block !== "object" || !Array.isArray(block.codes)) {
    throw new Error("Khoa 'errorCodes' phai la object co 'description' va mang 'codes'.")
  }

  const rows = block.codes
  if (rows.length === 0) {
    throw new Error("Catalog 'errorCodes' khong co ma nao.")
  }

  const seen = new Set()
  rows.forEach(row => {
    const code = row.code
    if (!ERROR_CODE_SHAPE.test(code || "")) {
      throw new Error(`Ma ket qua '${code}' sai hinh dang (cho doi SDK<so> hoac MNA<so>).`)
    }
    if (seen.has(code)) {
      throw new Error(`Catalog 'errorCodes' co ma lap: '${code}'.`)
    }
    seen.add(code)

    if (!String(row.messageVN || "").trim() || !String(row.messageEN || "").trim()) {
      throw new Error(
        `Ma '${code}' thieu cau chu. Catalog ton tai de trang doc duoc NGHIA cua ma; ` +
        `mot dong khong co cau chu la mot dong khong lam duoc viec do.`
      )
    }

    if (Object.prototype.hasOwnProperty.call(row, "emittedBy")) {
      const ds = row.emittedBy
      if (!Array.isArray(ds) || ds.length === 0 || ds.some(p => !EMITTER_PLATFORMS.has(p))) {
        throw new Error(
          `Ma '${code}': 'emittedBy' phai la danh sach khong rong trong ` +
          `[${[...EMITTER_PLATFORMS].join(", ")}], dang la ${JSON.stringify(ds)}.`
        )
      }
    }
  })

  if (!seen.has(SUCCESS_CODE)) {
    throw new Error(
      `Catalog thieu '${SUCCESS_CODE}'. 'isSuccess()' so thang voi chuoi do, nen thieu no ` +
      `bien moi loi goi thanh cong thanh that bai ma khong loi bien dich nao bao.`
    )
  }

  return rows
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
    // description di vao mot chuoi nhay don, nen phai escape. Truoc day no duoc noi
    // thang: bat ky mo ta nao chua dau nhay don deu ket thuc chuoi som va lam ca tep
    // sinh ra khong bien dich duoc, voi thong bao loi tro vao dong sinh ra chu khong tro
    // vao events.json — tuc nguoi sua hop dong khong nhin ra minh vua lam gi.
    lines.push(`  { event: '${evt.event}', method: '${toCamelCase(evt.event)}', description: ${JSON.stringify(evt.description || "")}, requestType: '${pascal}Request', responseType: '${pascal}Response' },`)
  })
  lines.push("] as const;")
  lines.push("")

  return lines.join("\n")
}

// ==================================================================
// Gen parity.generated.ts
// ==================================================================

/**
 * Truc parity di ra MOT TEP RIENG, khong nam chung voi kieu cua event.
 *
 * Hai ly do, ly do thu hai moi la ly do that:
 *
 * 1. No khong phai kieu cua mot event, nen de chung la tron hai loai khai bao.
 * 2. `index.ts` liet TUNG TEN mot khi xuat tu `types.generated.ts`. Them mot truc moi
 *    vao hop dong se sinh ra kieu, bien dich sach, va KHONG AI XUAT NO RA — doi tac
 *    cai ban npm moi khong thay gi, khong loi nao bao. Tep rieng cho phep `index.ts`
 *    dung `export *`, nen truc thu hai tu no di ra ngoai.
 */
function genParity(config) {
  const lines = []
  const axes = config.parityAxes || []

  lines.push("// ============================================================")
  lines.push("// AUTO-GENERATED — DO NOT EDIT")
  lines.push("// Generated by event.js from events.json (khoa 'parityAxes')")
  lines.push("// ============================================================")
  lines.push("")

  if (axes.length === 0) {
    lines.push("export {};")
    lines.push("")
    return lines.join("\n")
  }

  lines.push("// --- Truc parity (KHAI BAO, KHONG phai event) ---")
  lines.push("")

  {
    axes.forEach(axis => {
      const constBase = toScreamingSnake(axis.axis)

      lines.push("/**")
      lines.push(` * ${axis.description}`)
      lines.push(" *")
      lines.push(` * Chieu: ${axis.direction}. Trang mini-app goi duoc: ${axis.reachableFromPage ? "CO" : "KHONG"}.`)
      if ((axis.semanticsCaveats || []).length > 0) {
        lines.push(" *")
        axis.semanticsCaveats.forEach(c => lines.push(` * - ${c}`))
      }
      if ((axis.notes || []).length > 0) {
        lines.push(" *")
        axis.notes.forEach(n => lines.push(` * ${n}`))
      }
      lines.push(" */")
      const valueUnion = axis.values.map(v => `  | '${v.value}'`)
      lines.push(`export type ${axis.axis} =\n${valueUnion.join("\n")};`)
      lines.push("")

      lines.push(`/** Nam gia tri cua truc, theo dung thu tu hop dong khai — ban de doi chieu hai native. */`)
      lines.push(`export const ${constBase}_VALUES = [`)
      axis.values.forEach(v => {
        lines.push(`  { value: '${v.value}', description: ${JSON.stringify(v.description || "")} },`)
      })
      lines.push("] as const;")
      lines.push("")

      if ((axis.deprecates || []).length > 0) {
        lines.push("/**")
        lines.push(" * Cac ten CU bi danh dau phe thai vi truc nay. Chung O LAI, KHONG ten nao bi go —")
        lines.push(" * phe thai la canh bao luc bien dich, hanh vi khong doi.")
        lines.push(" *")
        lines.push(" * `replacement: null` nghia la KHONG co duong thay: doc `note` truoc khi bo.")
        lines.push(" */")
        lines.push(`export const ${constBase}_DEPRECATES = [`)
        axis.deprecates.forEach(d => {
          const platforms = (d.platforms || []).map(p => `'${p}'`).join(", ")
          const replacement = d.replacement ? `'${d.replacement}'` : "null"
          lines.push(
            `  { symbol: ${JSON.stringify(d.symbol)}, kind: '${d.kind}', platforms: [${platforms}] as const, ` +
            `replacement: ${replacement}, note: ${JSON.stringify(d.note || "")} },`
          )
        })
        lines.push("] as const;")
        lines.push("")
      }

      if ((axis.explicitlyNotDeprecated || []).length > 0) {
        lines.push("/**")
        lines.push(" * Cac ten TRONG GIA DINH la se bi phe thai nhung KHONG — ghi ra de khong ai")
        lines.push(" * 'don dep' chung o luot sau. Moi dong kem ly do.")
        lines.push(" */")
        lines.push(`export const ${constBase}_NOT_DEPRECATED = [`)
        axis.explicitlyNotDeprecated.forEach(d => {
          const platforms = (d.platforms || []).map(p => `'${p}'`).join(", ")
          lines.push(
            `  { symbol: ${JSON.stringify(d.symbol)}, platforms: [${platforms}] as const, ` +
            `reason: ${JSON.stringify(d.reason || "")} },`
          )
        })
        lines.push("] as const;")
        lines.push("")
      }
    })
  }

  return lines.join("\n")
}

// ==================================================================
// Gen errors.generated.ts
// ==================================================================

/**
 * Catalog ma ket qua di ra MOT TEP RIENG, cung ly do voi truc parity: `index.ts` liet
 * tung ten khi xuat tu `types.generated.ts`, nen mot thu them vao se bien dich sach ma
 * KHONG AI XUAT NO RA. Tep rieng cho phep `export *`.
 *
 * Thu tep nay giai quyet: truoc no, trang mini-app chi phan biet duoc thanh cong voi
 * that bai — `isSuccess()` so mot chuoi duy nhat. Moi ma con lai ve toi trang duoi dang
 * mot chuoi khong tra cuu duoc o dau. `describeError` la ham bien dieu do thanh doc duoc,
 * va no la mot ham THUAN TUY tren mot bang huu han — nen no CHUNG MINH DUOC BANG MAY,
 * khong can ai kich du tung ay loi that.
 */
function genErrors(config) {
  const lines = []
  const block = config.errorCodes
  const rows = (block && block.codes) || []

  lines.push("// ============================================================")
  lines.push("// AUTO-GENERATED — DO NOT EDIT")
  lines.push("// Generated by event.js from events.json (khoa 'errorCodes')")
  lines.push("// ============================================================")
  lines.push("")

  if (rows.length === 0) {
    lines.push("export {};")
    lines.push("")
    return lines.join("\n")
  }

  lines.push("/**")
  String(block.description || "").split("\n").forEach(l => lines.push(` * ${l}`))
  lines.push(" */")
  lines.push(`export type SdkErrorCode =\n${rows.map(r => `  | '${r.code}'`).join("\n")};`)
  lines.push("")

  lines.push("/** Mot dong cua catalog. */")
  lines.push("export interface SdkErrorInfo {")
  lines.push("  code: SdkErrorCode;")
  lines.push("  messageVN: string;")
  lines.push("  messageEN: string;")
  lines.push("  /**")
  lines.push("   * Nen tang DA DO duoc la co phat ra ma nay.")
  lines.push("   *")
  lines.push("   * VANG MAT khoa nay nghia la CHUA DO theo nen tang — KHONG phai 'ca hai deu")
  lines.push("   * phat'. Doc nguoc lai la tu cap cho minh mot bao dam khong ai dua ra.")
  lines.push("   */")
  lines.push("  emittedBy?: ReadonlyArray<'android' | 'ios'>;")
  lines.push("}")
  lines.push("")

  lines.push("/** Tra cuu mot ma ra cau chu. Khoa la ma, nen tra cuu la O(1). */")
  lines.push("export const SDK_ERROR_CATALOG: Readonly<Record<SdkErrorCode, SdkErrorInfo>> = {")
  rows.forEach(r => {
    const emit = r.emittedBy
      ? `, emittedBy: [${r.emittedBy.map(p => `'${p}'`).join(", ")}]`
      : ""
    lines.push(
      `  ${r.code}: { code: '${r.code}', messageVN: ${JSON.stringify(r.messageVN)}, ` +
      `messageEN: ${JSON.stringify(r.messageEN)}${emit} },`
    )
  })
  lines.push("} as const;")
  lines.push("")

  lines.push("/** Toan bo ma, theo thu tu hop dong khai. */")
  lines.push("export const SDK_ERROR_CODES = [")
  rows.forEach(r => lines.push(`  '${r.code}',`))
  lines.push("] as const satisfies ReadonlyArray<SdkErrorCode>;")
  lines.push("")

  lines.push("/** Chuoi bat ky co phai mot ma trong catalog khong. */")
  lines.push("export function isSdkErrorCode(code: string): code is SdkErrorCode {")
  lines.push("  return Object.prototype.hasOwnProperty.call(SDK_ERROR_CATALOG, code);")
  lines.push("}")
  lines.push("")

  lines.push("/**")
  lines.push(" * Tra cuu nghia cua mot ma bat ky nhan duoc tu native.")
  lines.push(" *")
  lines.push(" * Tra `undefined` khi ma khong thuoc catalog, va do la mot ket qua CO NGHIA:")
  lines.push(" * no noi rang ban SDK tren may dang moi hon ban hop dong trang dang cam. Dung")
  lines.push(" * nuot no thanh mot cau chu chung — hai tinh huong do can hai cach xu ly khac nhau.")
  lines.push(" */")
  lines.push("export function describeError(code: string | null | undefined): SdkErrorInfo | undefined {")
  lines.push("  if (!code) return undefined;")
  lines.push("  return isSdkErrorCode(code) ? SDK_ERROR_CATALOG[code] : undefined;")
  lines.push("}")
  lines.push("")

  lines.push("/**")
  lines.push(" * Cac ma DA DO duoc la chi mot nen tang phat ra.")
  lines.push(" *")
  lines.push(" * Day la ngoai le CO Y voi chinh nguyen tac 'mot hop dong, hai nen tang' ma SDK")
  lines.push(" * ban ra. Hop dong noi no ra thay vi de doi tac phat hien bang cach gap loi.")
  lines.push(" */")
  lines.push("export function errorCodesEmittedOnlyBy(platform: 'android' | 'ios'): SdkErrorCode[] {")
  lines.push("  return SDK_ERROR_CODES.filter(c => {")
  lines.push("    const e = SDK_ERROR_CATALOG[c].emittedBy;")
  lines.push("    return e !== undefined && e.length === 1 && e[0] === platform;")
  lines.push("  });")
  lines.push("}")
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
  lines.push("type EmitRawFn = (event: string, payload: Record<string, any>) => void;")
  lines.push("")
  lines.push("let _sendRaw: SendRawFn | null = null;")
  lines.push("let _emitRaw: EmitRawFn | null = null;")
  lines.push("")
  lines.push("/**")
  lines.push(" * Khoi tao module API voi ham gui message")
  lines.push(" * Goi 1 lan khi setup MiniApp SDK")
  lines.push(" *")
  lines.push(" * emitFn la duong MOT CHIEU, danh cho event khong co `response` trong hop dong.")
  lines.push(" * Khong truyen no thi cac ham mot chieu se nem loi thay vi treo im lang.")
  lines.push(" */")
  lines.push("export function initMiniAppAPI(sendFn: SendRawFn, emitFn?: EmitRawFn): void {")
  lines.push("  _sendRaw = sendFn;")
  lines.push("  _emitRaw = emitFn || null;")
  lines.push("}")
  lines.push("")

  // Internal send helper — creates MiniAppRequestBase directly (flat)
  lines.push("function send<TRes>(event: string, payload: Record<string, any>): Promise<MiniAppResponse<TRes>> {")
  lines.push("  if (!_sendRaw) throw new Error('MiniApp API chua duoc khoi tao. Goi wireToMiniApp() truoc.');")
  lines.push("  return _sendRaw({ event, sender: '', request_id: '', ...payload }) as Promise<MiniAppResponse<TRes>>;")
  lines.push("}")
  lines.push("")

  // Internal emit helper — duong MOT CHIEU
  lines.push("/**")
  lines.push(" * Gui mot event MOT CHIEU: khong tao yeu cau dang cho, khong co gi de doi.")
  lines.push(" *")
  lines.push(" * Vi sao khong dung chung `send`: `send` di qua `sendRaw`, va `sendRaw` dang ky")
  lines.push(" * mot yeu cau dang cho kem han cho. Mot event khong co `response` thi khong")
  lines.push(" * bao gio co ai tra loi, nen no se treo het han roi bi tu choi — o MOI lan goi.")
  lines.push(" * Build van xanh, kieu van xanh; chi luc chay moi hong.")
  lines.push(" */")
  lines.push("function emitOneWay(event: string, payload: Record<string, any>): void {")
  lines.push("  if (!_emitRaw) {")
  lines.push("    throw new Error(")
  lines.push("      `MiniApp API chua co duong mot chieu. Event '${event}' khong co response trong hop dong ` +")
  lines.push("      'nen no phai di bang emit. Goi wireToMiniApp() (da noi san), hoac initMiniAppAPI(send, emit).'")
  lines.push("    );")
  lines.push("  }")
  lines.push("  _emitRaw(event, payload);")
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
    const oneWay = isOneWay(evt)

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
    if (oneWay) {
      lines.push(" *")
      lines.push(" * @note MOT CHIEU — entry nay KHONG khai `response` trong hop dong, nen native")
      lines.push(" *       khong tra loi gi. Ham tra ve `void`, khong co gi de `await`.")
    }
    lines.push(" */")

    // Function signature
    const signatureReturn = oneWay ? "void" : `Promise<MiniAppResponse<${returnType}>>`
    const asyncKeyword = oneWay ? "" : "async "
    if (hasReqFields) {
      const optional = hasRequired ? "" : " = {} as any"
      lines.push(`export ${asyncKeyword}function ${camel}(payload: ${paramType}${optional}): ${signatureReturn} {`)
    } else {
      lines.push(`export ${asyncKeyword}function ${camel}(): ${signatureReturn} {`)
    }

    if (oneWay) {
      if (reqStringify.length > 0) {
        lines.push("  const _p: any = { ...payload };")
        reqStringify.forEach(f => {
          lines.push(`  if (_p.${f} !== undefined) _p.${f} = JSON.stringify(_p.${f});`)
        })
        lines.push(`  emitOneWay('${evt.event}', _p);`)
      } else {
        lines.push(`  emitOneWay('${evt.event}', ${hasReqFields ? "payload" : "{}"});`)
      }
      lines.push("}")
      lines.push("")
      return
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
  lines.push("export function wireToMiniApp(app: {")
  lines.push("  sendRaw(msg: MiniAppRequestBase): Promise<any>;")
  lines.push("  emit?(event: string, data?: any): void;")
  lines.push("}): void {")
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
  lines.push("  }, app.emit ? (event, payload) => app.emit!(event, payload) : undefined);")
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

  // Event mot chieu duoc nhan ra bang su VANG MAT cua khoa `response`, nen phai in
  // ra — go nham mot khoa se doi kieu API tu Promise sang void ma khong loi nao bao.
  // Doc danh sach nay moi lan sinh la cach duy nhat thay dieu do bang mat.
  const oneWayEvents = config.events.filter(isOneWay).map(e => e.event)
  if (oneWayEvents.length > 0) {
    console.log(
      `MOT CHIEU (khong co 'response' -> tra void, di bang emit): ${oneWayEvents.length} event`
    )
    oneWayEvents.forEach(name => console.log(`  - ${name}`))
    console.log("")
  }

  // Truc parity: kiem truoc khi sinh, roi in ra. In la co y — mot truc khai trong hop
  // dong ma khong ai doi chieu voi native thi no chi la van ban, va van ban thi khong
  // biet minh da cu.
  const axes = validateParityAxes(config)
  if (axes.length > 0) {
    console.log(`TRUC PARITY (khai bao, KHONG sinh ham): ${axes.length} truc`)
    axes.forEach(a => {
      const names = a.values.map(v => v.value).join(" ")
      console.log(`  - ${a.axis} [${a.direction}] ${a.values.length} gia tri: ${names}`)
      console.log(`      phe thai ${(a.deprecates || []).length} ten, giu lai co y ${(a.explicitlyNotDeprecated || []).length} ten`)
      console.log(`      ⚠ doi chieu voi hai native la viec CHUA CO CONG MAY NAO LAM`)
    })
    console.log("")
  }

  // Catalog ma ket qua: kiem truoc khi sinh, roi in ra. In la co y, cung ly do voi truc
  // parity — mot catalog khai trong hop dong ma khong ai doi chieu voi native thi no chi
  // la van ban, va van ban thi khong biet minh da cu.
  const errorRows = validateErrorCodes(config)
  if (errorRows.length > 0) {
    const sdk = errorRows.filter(r => r.code.startsWith("SDK")).length
    console.log(
      `CATALOG MA KET QUA: ${errorRows.length} ma = ${sdk} SDK* + ${errorRows.length - sdk} MNA*`
    )
    const onlyIos = errorRows.filter(r => (r.emittedBy || []).join() === "ios").map(r => r.code)
    const onlyAnd = errorRows.filter(r => (r.emittedBy || []).join() === "android").map(r => r.code)
    const chuaDo = errorRows.filter(r => !r.emittedBy).length
    if (onlyIos.length) console.log(`  - chi iOS phat    : ${onlyIos.join(" ")}`)
    if (onlyAnd.length) console.log(`  - chi Android phat: ${onlyAnd.join(" ")}`)
    console.log(`  - CHUA DO theo nen tang: ${chuaDo} ma (khong phai "ca hai deu phat")`)
    console.log(`  ⚠ doi chieu voi hai native: spec repo, extract_error_catalog_parity.py`)
    console.log("")
  }

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

  // Gen parity axes
  const parityContent = genParity(config)
  const parityFile = path.join(OUTPUT_DIR, "parity.generated.ts")
  fs.writeFileSync(parityFile, parityContent)
  console.log(`Generated: ${path.relative(process.cwd(), parityFile)}`)

  // Gen error catalog
  const errorsContent = genErrors(config)
  const errorsFile = path.join(OUTPUT_DIR, "errors.generated.ts")
  fs.writeFileSync(errorsFile, errorsContent)
  console.log(`Generated: ${path.relative(process.cwd(), errorsFile)}`)

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
