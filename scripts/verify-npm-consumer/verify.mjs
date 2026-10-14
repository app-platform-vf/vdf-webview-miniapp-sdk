#!/usr/bin/env node
// Kiem goi npm bang cach lam dung thu mot doi tac lam: CAI no, roi dung no.
//
// VI SAO TEP NAY TON TAI
// Bon trang demo trong repo khai `"vdf-webview-miniapp-sdk": "file:../../packages/core"`,
// va npm dung do thanh mot SYMLINK tro vao thu muc nguon. Chung khong dung goi — chung
// doc ma nguon. Nen chung khong bao gio phat hien duoc loi dong goi: thieu tep trong
// `files`, sai `main`/`module`/`types`, thieu `type`, import khong co duoi tep.
//
// Do la lop loi "chay ngon trong monorepo, hong khi cai tu npm", va no im lang tuyet doi.
//
// Cach chay:  node scripts/verify-npm-consumer/verify.mjs

import { execSync } from "node:child_process"
import { mkdtempSync, rmSync, cpSync, readFileSync, writeFileSync, lstatSync, realpathSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, "..", "..")
const CORE = join(REPO, "packages", "core")
const PKG_NAME = JSON.parse(readFileSync(join(CORE, "package.json"), "utf8")).name

const results = []
const record = (name, ok, detail) => {
    results.push({ name, ok, detail })
    console.log(`${ok ? "  PASS" : "  FAIL"}  ${name}${detail ? `\n        ${detail}` : ""}`)
}

const sandbox = mkdtempSync(join(tmpdir(), "npm-consumer-"))
let exitCode = 0

try {
    console.log(`\nSandbox: ${sandbox}\n`)

    // 1. Dong goi dung nhu luc publish.
    console.log("Dong goi va cai dat...")
    const tgzName = execSync(`npm pack --workspace packages/core --pack-destination "${sandbox}"`, {
        cwd: REPO,
        encoding: "utf8",
    }).trim().split("\n").pop().trim()
    const tgz = join(sandbox, tgzName)

    // 2. Cai vao mot du an RONG, ngoai workspace glob `packages/*`.
    execSync(`npm init -y`, { cwd: sandbox, stdio: "ignore" })
    execSync(`npm install "${tgz}" --no-audit --no-fund`, { cwd: sandbox, stdio: "ignore" })
    const installed = join(sandbox, "node_modules", PKG_NAME)
    console.log(`Da cai: ${tgzName}\n`)

    console.log("Kiem:")

    // 3. CHOT CHONG TU LUA. Neu cho nay la symlink tro ve packages/core thi moi
    //    phep kiem ben duoi deu do ma khong chung minh gi ca — dung cai bay ma
    //    `is_maven=true` da giang ben Android trong cung ngay.
    const isLink = lstatSync(installed).isSymbolicLink()
    const realPath = realpathSync(installed)
    record(
        "goi duoc CAI that, khong phai symlink ve ma nguon",
        !isLink && !realPath.startsWith(CORE),
        `resolved -> ${realPath}`,
    )
    if (isLink || realPath.startsWith(CORE)) {
        throw new Error("Dang doc ma nguon — moi ket qua ben duoi vo nghia.")
    }

    // 4. Nhung tep goi THUC SU bay ra.
    const pkgJson = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"))
    for (const field of ["main", "module", "types"]) {
        const rel = pkgJson[field]
        record(
            `${field} tro vao mot tep co that (${rel ?? "(khong khai)"})`,
            Boolean(rel) && existsSync(join(installed, rel)),
        )
    }

    // 5. Ba duong tieu thu, ba ket qua co the khac nhau.
    let cjsOk = true, cjsErr = ""
    try {
        execSync(`node -e "require('${PKG_NAME}')"`, { cwd: sandbox, stdio: "pipe" })
    } catch (e) {
        cjsOk = false
        cjsErr = String(e.stderr || e.message).split("\n").find((l) => /Error|error/.test(l)) ?? ""
    }
    record("dung duoc tu CommonJS — require()", cjsOk, cjsErr)

    let esmOk = true, esmErr = ""
    try {
        execSync(`node --input-type=module -e "await import('${PKG_NAME}')"`, { cwd: sandbox, stdio: "pipe" })
    } catch (e) {
        esmOk = false
        esmErr = String(e.stderr || e.message).split("\n").find((l) => /Error|ERR_/.test(l)) ?? ""
    }
    record("dung duoc tu ESM thuan cua Node — import()", esmOk, esmErr)

    // 6. Kieu: doi tac gia lap phai bien dich duoc.
    cpSync(join(HERE, "consumer.ts"), join(sandbox, "consumer.ts"))
    cpSync(join(HERE, "tsconfig.consumer.json"), join(sandbox, "tsconfig.json"))
    let tsOk = true, tsErr = ""
    try {
        execSync(`"${join(REPO, "node_modules", ".bin", "tsc")}" --noEmit -p tsconfig.json`, {
            cwd: sandbox,
            stdio: "pipe",
        })
    } catch (e) {
        tsOk = false
        tsErr = String(e.stdout || e.message).split("\n").slice(0, 3).join("\n        ")
    }
    record("API co kieu dung duoc tu ben ngoai — tsc --noEmit", tsOk, tsErr)

    // 6b. Catalog ma ket qua: tra duoc DU moi ma, tu chinh goi da cai.
    //
    // Day la nua bang may cua cau hoi "trang co tra duoc nghia cua 54 ma khong".
    // Khong ai kich duoc 54 loi that, va cung khong can: tra cuu la mot HAM THUAN TUY
    // tren mot bang huu han, nen duyet het bang la mot phep chung minh day du.
    //
    // Hai chieu deu phai dung, va chieu thu hai moi la chieu de quen:
    //   - moi ma trong catalog PHAI tra ra cau chu khong rong (ca VN lan EN);
    //   - mot ma LA PHAI tra `undefined`, khong duoc nuot thanh mot cau chu chung.
    //     Thieu ve nay thi mot ham `describeError` tra ve "Loi khong xac dinh" cho moi
    //     dau vao van di qua sach, va no vo dung dung luc can nhat.
    //
    // ⚠️ HAI dieu phep kiem nay KHONG lam, noi ra vi ca hai deu de bi doc rong hon that:
    //
    //   1. No KHONG so catalog voi hai native — no khong voi toi hai repo do. Viec so
    //      ba nguon thuoc `extract_error_catalog_parity.py` ben spec repo.
    //   2. No nhap THANG tep catalog chu khong qua diem vao cua goi, vi `import` tu
    //      diem vao dang HONG tren Node ESM thuan: `dist/index.js` phat `from './MiniApp'`
    //      khong co duoi `.js`. Do la mot loi DONG GOI co san, khong lien quan catalog,
    //      va no da nam trong ban 2.1.0 tren registry. Bo dong goi cua webpack/vite nuot
    //      duoc duong thieu duoi nen doi tac dung bundler khong thay — do la ly do no
    //      song lau. Muc "dung duoc tu ESM thuan cua Node" ngay tren la cho ghi nhan no.
    const CATALOG_SUBPATH = `${PKG_NAME}/dist/generated/errors.generated.js`
    const probe = [
        `import * as sdk from '${CATALOG_SUBPATH}';`,
        "const { SDK_ERROR_CODES, describeError, errorCodesEmittedOnlyBy } = sdk;",
        "const hong = [];",
        "for (const c of SDK_ERROR_CODES) {",
        "  const i = describeError(c);",
        "  if (!i || i.code !== c || !String(i.messageVN || '').trim() || !String(i.messageEN || '').trim()) hong.push(c);",
        "}",
        "if (hong.length) { console.error('KHONG tra duoc: ' + hong.join(' ')); process.exit(1); }",
        "if (describeError('SDK999999') !== undefined) { console.error('ma la KHONG tra ve undefined'); process.exit(1); }",
        "if (describeError('') !== undefined || describeError(null) !== undefined) { console.error('dau vao rong KHONG tra ve undefined'); process.exit(1); }",
        "console.log(SDK_ERROR_CODES.length + '|' + errorCodesEmittedOnlyBy('ios').join(' '));",
    ].join("\n")

    // Ghi ra TEP roi chay, khong nhet qua `-e`: `-e` phai di qua shell, va o do moi lan
    // xuong dong trong doan ma bien thanh hai ky tu `\` `n` — Node nhan ve ma sai cu phap
    // va bao mot dong loi khong noi len dieu gi.
    const probeFile = join(sandbox, "probe-catalog.mjs")
    writeFileSync(probeFile, probe, "utf8")

    let catOk = true, catDetail = ""
    try {
        const out = execSync(`node probe-catalog.mjs`, {
            cwd: sandbox, stdio: "pipe", encoding: "utf8",
        }).trim()
        const [n, chiIos] = out.split("|")
        catDetail = `${n}/${n} ma tra ra cau chu VN+EN; ma la tra undefined`
            + (chiIos ? `; chi iOS phat: ${chiIos}` : "")
    } catch (e) {
        catOk = false
        catDetail = String(e.stderr || e.stdout || e.message).trim().split("\n")[0]
    }
    record("tra cuu duoc DU moi ma ket qua trong catalog", catOk, catDetail)

    // 6c. Event MOT CHIEU khong duoc de lai mot yeu cau dang cho.
    //
    // Do dung TRIEU CHUNG NGUOI DUNG THAY, khong do noi bo: dat han cho that ngan roi
    // goi mot ham mot chieu, doi qua han, va bat unhandledRejection. Do noi bo (dem muc
    // cho) se doi bo dem thanh mot API cong khai chi de phuc vu phep kiem, va van khong
    // chung minh duoc dieu ma nguoi dung thuc su gap.
    //
    // 🔴 Ban 2.1.1 va truoc do DO o cho nay: `emit()` goi `requestManager.create()`, de
    //    lai mot loi hua khong ai `await` (ham sinh ra tra `void`) nen het han la mot
    //    unhandled rejection — MOI LAN CHUYEN TRANG mot cai, trong im lang.
    //
    //    Vong sua truoc do da nham dung cho nay nhung sua NUA TREN: bo sinh ma cho ra
    //    ham `void` di bang `emit`. Nua duoi (`emit` tu no) khong ai dong toi, nen
    //    trieu chung chi doi dang tu "treo 90 giay" thanh "no am tham". Do la ly do
    //    chot chan nay do o TANG NGOAI CUNG thay vi tin vao mot dong ma da sua.
    // Di qua ROLLUP chu khong `import` thang, va ly do la mot rang buoc cua chinh goi
    // chu khong phai mot so thich: diem vao cua goi KHONG nhap duoc tu Node ESM thuan
    // (muc ngay tren ghi nhan). Bundler thi phan giai duoc duong thieu duoi, va do cung
    // la cach MOI doi tac that dang tieu thu goi nay hom nay. Cung ky thuat build-page.mjs
    // dung, cung lay plugin tu node_modules cua repo.
    writeFileSync(join(sandbox, "entry-oneway.js"), [
        `import { createMiniApp, wireToMiniApp, setCurrentPage } from '${PKG_NAME}';`,
        "const no = [];",
        "process.on('unhandledRejection', e => no.push(String((e && e.message) || e)));",
        "globalThis.window = globalThis;",
        "globalThis.AndroidWebview = { miniappWebviewToSdk() {} };",
        // Han cho 150ms: du ngan de phep kiem chay nhanh, du dai de khong bat nham mot
        // nhip dat lich binh thuong.
        "const app = createMiniApp({ appId: 'probe', timeout: 150 });",
        "wireToMiniApp(app);",
        "setCurrentPage({ data: { pageId: 'p', pageName: 'P' } });",
        "setTimeout(() => {",
        "  if (no.length) { console.error('CO ' + no.length + ' loi hua bi tu choi ma khong ai bat: ' + no[0]); process.exit(1); }",
        "  console.log('sach');",
        "}, 600);",
    ].join("\n"), "utf8")

    const owCfg = join(sandbox, "rollup.oneway.cjs")
    writeFileSync(owCfg, `
const resolvePlugin = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-node-resolve"))});
const commonjs = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-commonjs"))});
module.exports = {
  input: ${JSON.stringify(join(sandbox, "entry-oneway.js"))},
  context: "this",
  output: { file: ${JSON.stringify(join(sandbox, "probe-oneway.cjs"))}, format: "cjs" },
  plugins: [resolvePlugin(), commonjs()]
};
`, "utf8")

    let owOk = true, owDetail = ""
    try {
        execSync(`"${join(REPO, "node_modules", ".bin", "rollup")}" -c "${owCfg}"`, {
            cwd: sandbox, stdio: "pipe",
        })
        execSync(`node probe-oneway.cjs`, { cwd: sandbox, stdio: "pipe", encoding: "utf8" })
        owDetail = "goi setCurrentPage voi han cho 150ms, doi 600ms: 0 loi hua bi tu choi"
    } catch (e) {
        owOk = false
        owDetail = String(e.stderr || e.stdout || e.message).trim().split("\n").filter(Boolean).pop() || ""
    }
    record("event MOT CHIEU khong de lai yeu cau dang cho", owOk, owDetail)

    // 6d. Event HAI CHIEU moi (SUBSCRIBE_TOPIC · UNSUBSCRIBE_TOPIC · CHECK_NOTIFICATION_PERMISSION):
    //     phong bi RA dung, va Promise resolve/reject dung theo cau tra loi.
    //
    // Cung ky thuat 6c va cung ly do: do o TANG NGOAI CUNG (goi da cai + rollup), dong vai
    // native bang mot `AndroidWebview.miniappWebviewToSdk` gia ghi lai phong bi, roi tra
    // loi qua `window.miniappSdkToWebview` voi dung `request_id` vua ghi.
    //
    // Hai dieu phep kiem nay CO Y chot, noi ra vi ca hai de bi doc nham thanh loi:
    //   - Phong bi `invoke('SUBSCRIBE_TOPIC', { sender: 'EVIL' })` DI RA voi `sender: EVIL`.
    //     Web KHONG ghim `sender`; cong chan nam o native (`SDK001` "Invalid sender for …").
    //     Mot ban sua "ghim sender o web" se lam ca nay do — do la dung y.
    //   - Ma do APP CHU dat (vd. HOST_TOPIC_404) di thang ve `reject` va `describeError`
    //     tra `undefined` cho no. Catalog khong duoc nuot ma la.
    //
    // Ca kieu: `subscribeTopic({ data: {}, sender: 'X' })` PHAI khong bien dich (excess
    // property) — duong co kieu khong cho mini-app ghi de `sender`. Tep TS sinh ngay trong
    // sandbox, khong dung chung consumer.ts, de muc 6 ben tren giu nguyen nghia cua no.
    const twCases = [
        // [id, ham, doi so (null = goi KHONG doi so), tra loi (null = khong tra)]
        ["tc01", "subscribeTopic", { data: { topic_id: "topic_id_001", user_id: "user_id_001", miniapp_key: "demo_miniapp_key" } },
            { event: "SUBSCRIBE_TOPIC", data: { topic_id: "topic_id_001", subscribed: true, subscribed_at: 1791429300512 }, errorData: null, message: null, eventStatus: { errorCode: "SDK000", errorMessageVN: "Thành công", errorMessageEN: "Success" } }],
        ["tc02", "unsubscribeTopic", { data: { topic_id: "topic_id_001" } },
            { event: "UNSUBSCRIBE_TOPIC", data: { topic_id: "topic_id_001", subscribed: false }, errorData: null, message: null, eventStatus: { errorCode: "SDK000", errorMessageVN: "Thành công", errorMessageEN: "Success" } }],
        ["tc03", "checkNotificationPermission", null,
            { event: "CHECK_NOTIFICATION_PERMISSION", permissionCode: "NOTIFICATION_PERMISSION", result: "Granted", eventStatus: { errorCode: "SDK000", errorMessageVN: "Thành công", errorMessageEN: "Success" } }],
        ["tc04", "subscribeTopic", null,
            { event: "SUBSCRIBE_TOPIC", eventStatus: { errorCode: "SDK000" } }],
        ["tc05", "subscribeTopic", { data: { a: { b: { c: [1, { d: "Tiếng Việt 🎉 \"q\" \\ \n" }] } }, e: "" } },
            { event: "SUBSCRIBE_TOPIC", eventStatus: { errorCode: "SDK000" } }],
        ["tc06", "invoke:SUBSCRIBE_TOPIC", { sender: "EVIL", data: {} },
            { event: "SUBSCRIBE_TOPIC", message: "Invalid sender for SUBSCRIBE_TOPIC", errorData: null, eventStatus: { errorCode: "SDK001", errorMessageVN: "Lỗi", errorMessageEN: "Failure" } }],
        ["tc07", "subscribeTopic", { data: {} }, { event: "SUBSCRIBE_TOPIC", eventStatus: { errorCode: "SDK801" } }],
        ["tc08", "subscribeTopic", { data: {} }, { event: "SUBSCRIBE_TOPIC", result: "PermanentlyDenied", eventStatus: { errorCode: "SDK802" } }],
        ["tc09", "unsubscribeTopic", { data: {} }, { event: "UNSUBSCRIBE_TOPIC", eventStatus: { errorCode: "SDK100" } }],
        ["tc13", "subscribeTopic", { data: {} }, { event: "SUBSCRIBE_TOPIC", result: "ServiceNotApplicable", eventStatus: { errorCode: "SDK001" } }],
        ["tc11", "subscribeTopic", { data: {} }, { event: "SUBSCRIBE_TOPIC", eventStatus: { errorCode: "HOST_TOPIC_404" } }],
        ["tc12", "checkNotificationPermission", null, { event: "CHECK_NOTIFICATION_PERMISSION", eventStatus: { errorCode: "SDK002" } }],
        ["tc14", "subscribeTopic", { data: {} }, { event: "SUBSCRIBE_TOPIC", message: "Event is not routable", eventStatus: { errorCode: "SDK100" } }],
        // tc10 de CUOI: khong tra loi, cho het han.
        ["tc10", "checkNotificationPermission", null, null],
    ]

    writeFileSync(join(sandbox, "entry-twoway.js"), [
        `import * as sdk from '${PKG_NAME}';`,
        "const CASES = " + JSON.stringify(twCases) + ";",
        "const no = [];",
        "process.on('unhandledRejection', e => no.push(String((e && e.message) || e)));",
        "globalThis.window = globalThis;",
        "const sent = [];",
        "globalThis.AndroidWebview = { miniappWebviewToSdk(json) { sent.push(JSON.parse(json)); } };",
        "const app = sdk.createMiniApp({ appId: 'probe', timeout: 150 });",
        "sdk.wireToMiniApp(app);",
        "app.ready();",
        "const same = (a, b) => {",
        "  if (a === b) return true;",
        "  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;",
        "  if (Array.isArray(a) !== Array.isArray(b)) return false;",
        "  const ka = Object.keys(a), kb = Object.keys(b);",
        "  return ka.length === kb.length && ka.every(k => same(a[k], b[k]));",
        "};",
        "const EVENT = { subscribeTopic: 'SUBSCRIBE_TOPIC', unsubscribeTopic: 'UNSUBSCRIBE_TOPIC', checkNotificationPermission: 'CHECK_NOTIFICATION_PERMISSION', 'invoke:SUBSCRIBE_TOPIC': 'SUBSCRIBE_TOPIC' };",
        "const hong = [];",
        "const missing = ['subscribeTopic', 'unsubscribeTopic', 'checkNotificationPermission'].filter(n => typeof sdk[n] !== 'function');",
        "if (missing.length) hong.push('ham chua co trong goi da cai: ' + missing.join(', '));",
        "if (typeof sdk.describeError !== 'function') hong.push('describeError khong co trong goi');",
        "const tick = () => new Promise(r => setTimeout(r, 0));",
        "(async () => {",
        "  for (const [id, fn, arg, reply] of CASES) {",
        "    const bad = m => hong.push(id + ' ' + fn + ': ' + m);",
        "    let p;",
        "    const before = sent.length;",
        "    try {",
        "      if (fn.startsWith('invoke:')) p = app.invoke(fn.slice(7), arg);",
        "      else if (typeof sdk[fn] !== 'function') { bad('ham chua ton tai'); continue; }",
        "      else p = arg === null ? sdk[fn]() : sdk[fn](arg);",
        "    } catch (e) { bad('nem loi dong bo: ' + ((e && e.message) || e)); continue; }",
        "    const settled = Promise.resolve(p).then(v => ({ ok: true, v }), e => ({ ok: false, e }));",
        "    await tick();",
        "    const env = sent[before];",
        "    if (sent.length !== before + 1 || !env) { bad('khong co dung 1 phong bi ra (' + (sent.length - before) + ')'); }",
        "    else {",
        "      if (env.event !== EVENT[fn]) bad('event ra = ' + env.event);",
        "      const wantSender = id === 'tc06' ? 'EVIL' : 'MINIAPP_WEBVIEW';",
        "      if (env.sender !== wantSender) bad('sender ra = ' + env.sender + ', can ' + wantSender);",
        "      if (typeof env.request_id !== 'string' || !env.request_id) bad('request_id rong');",
        "      if (env.requestId !== env.request_id) bad('requestId khac request_id');",
        "      if (arg === null || !('data' in arg)) { if ('data' in env) bad('phong bi co khoa data trong khi dau vao khong co'); }",
        "      else if (!same(env.data, arg.data)) bad('data ra KHONG nguyen van: ' + JSON.stringify(env.data));",
        "      if (reply) globalThis.miniappSdkToWebview(JSON.stringify({ ...reply, request_id: env.request_id }));",
        "    }",
        "    const r = await settled;",
        "    const code = reply && reply.eventStatus.errorCode;",
        "    if (!reply) {",
        "      if (r.ok) bad('resolve du khong ai tra loi');",
        "      else if (!/timeout/i.test(String((r.e && r.e.message) || r.e))) bad('reject khong phai timeout: ' + ((r.e && r.e.message) || r.e));",
        "      continue;",
        "    }",
        "    if (code === 'SDK000') {",
        "      if (!r.ok) { bad('reject du SDK000: ' + JSON.stringify(r.e && (r.e.message || r.e.eventStatus))); continue; }",
        "      if (id === 'tc01' && !(r.v.data && r.v.data.subscribed === true)) bad('res.data.subscribed != true');",
        "      if (id === 'tc02' && !(r.v.data && r.v.data.subscribed === false)) bad('res.data.subscribed != false');",
        "      if (id === 'tc03' && !(r.v.result === 'Granted' && r.v.permissionCode === 'NOTIFICATION_PERMISSION')) bad('result/permissionCode sai');",
        "      continue;",
        "    }",
        "    if (r.ok) { bad('resolve du ma ' + code); continue; }",
        "    const e = r.e || {};",
        "    if (!env || e.request_id !== env.request_id || !e.eventStatus || e.eventStatus.errorCode !== code) bad('ly do reject KHONG phai nguyen phong bi tra ve');",
        "    if (reply.message && e.message !== reply.message) bad('message reject = ' + e.message);",
        "    if (reply.result && e.result !== reply.result) bad('reject mat result');",
        "    if (typeof sdk.describeError === 'function') {",
        "      const known = sdk.describeError(code) !== undefined;",
        "      if (code === 'HOST_TOPIC_404' ? known : !known) bad('describeError(' + code + ') ' + (known ? 'KHONG tra undefined' : 'tra undefined'));",
        "    }",
        "  }",
        "  setTimeout(() => {",
        "    if (no.length) hong.push('CO ' + no.length + ' loi hua bi tu choi ma khong ai bat: ' + no[0]);",
        "    if (hong.length) { console.error(hong.length + ' loi | ' + hong.join(' | ')); process.exit(1); }",
        "    console.log(CASES.length);",
        "  }, 600);",
        "})().catch(e => { console.error('probe vo giua chung: ' + ((e && e.message) || e)); process.exit(1); });",
    ].join("\n"), "utf8")

    const twCfg = join(sandbox, "rollup.twoway.cjs")
    writeFileSync(twCfg, `
const resolvePlugin = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-node-resolve"))});
const commonjs = require(${JSON.stringify(join(REPO, "node_modules", "@rollup", "plugin-commonjs"))});
module.exports = {
  input: ${JSON.stringify(join(sandbox, "entry-twoway.js"))},
  context: "this",
  output: { file: ${JSON.stringify(join(sandbox, "probe-twoway.cjs"))}, format: "cjs" },
  plugins: [resolvePlugin(), commonjs()]
};
`, "utf8")

    // Ca kieu: duong co kieu dung duoc, va KHONG cho ghi de `sender`.
    writeFileSync(join(sandbox, "consumer-topic.ts"), [
        `import { subscribeTopic, unsubscribeTopic, checkNotificationPermission } from "${PKG_NAME}"`,
        "export async function topicFlow(): Promise<void> {",
        "    const a = await subscribeTopic({ data: { topic_id: \"topic_id_001\" } })",
        "    const subscribed: unknown = a.data?.subscribed",
        "    void subscribed",
        "    await subscribeTopic()",
        "    await unsubscribeTopic({ data: {} })",
        "    const c = await checkNotificationPermission()",
        "    const result: string | undefined = c.result",
        "    const permissionCode: string | undefined = c.permissionCode",
        "    void result, permissionCode",
        "    // @ts-expect-error — `sender` khong thuoc tai trong co kieu: mini-app khong ghi de duoc",
        "    await subscribeTopic({ data: {}, sender: \"X\" })",
        "}",
    ].join("\n"), "utf8")
    const twTsCfg = JSON.parse(readFileSync(join(HERE, "tsconfig.consumer.json"), "utf8"))
    twTsCfg.files = ["consumer-topic.ts"]
    writeFileSync(join(sandbox, "tsconfig.topic.json"), JSON.stringify(twTsCfg), "utf8")

    const twFail = []
    let twN = 0
    try {
        execSync(`"${join(REPO, "node_modules", ".bin", "rollup")}" -c "${twCfg}"`, {
            cwd: sandbox, stdio: "pipe",
        })
        const twOut = execSync(`node probe-twoway.cjs`, { cwd: sandbox, stdio: "pipe", encoding: "utf8" })
        twN = Number(twOut.trim().split("\n").pop()) || 0
        // Chot chong do rong: probe phai DI HET moi ca, khong duoc thoat som ma van "xanh".
        if (twN !== twCases.length) twFail.push(`probe chi bao ${twN}/${twCases.length} ca: ${twOut.trim().slice(-200)}`)
    } catch (e) {
        twFail.push(String(e.stderr || e.stdout || e.message).trim().split("\n").filter(Boolean).pop() || "")
    }
    try {
        execSync(`"${join(REPO, "node_modules", ".bin", "tsc")}" --noEmit -p tsconfig.topic.json`, {
            cwd: sandbox, stdio: "pipe",
        })
    } catch (e) {
        twFail.push("kieu: " + String(e.stdout || e.message).split("\n").filter(Boolean).slice(0, 3).join(" / "))
    }
    record(
        "event HAI CHIEU moi: phong bi + resolve/reject",
        twFail.length === 0,
        twFail.length
            ? twFail.join("\n        ")
            : `${twN} ca (tc01..tc14): phong bi ra dung, resolve/reject dung, 0 loi hua khong ai bat; sender khong ghi de duoc qua duong co kieu`,
    )

    // 7. Ban bundle cho trinh duyet: co hay khong, noi ro ra.
    const hasBundle = existsSync(join(installed, "dist", "bundle.js"))
    record(
        "co ban bundle san cho trinh duyet",
        hasBundle,
        hasBundle ? "" : "khong co — doi tac PHAI tu bundle. Day la mot lua chon, khong phai loi, nhung phai duoc noi ra trong tai lieu.",
    )
} catch (err) {
    console.error(`\nDUNG: ${err.message}`)
    exitCode = 1
} finally {
    const failed = results.filter((r) => !r.ok)
    console.log(`\n${results.length - failed.length}/${results.length} dat.`)
    if (failed.length) {
        console.log("\nKhong dat:")
        for (const f of failed) console.log(`  - ${f.name}`)
        exitCode = 1
    }
    rmSync(sandbox, { recursive: true, force: true })
    void pathToFileURL
    process.exit(exitCode)
}
