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
