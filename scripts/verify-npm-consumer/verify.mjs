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
import { mkdtempSync, rmSync, cpSync, readFileSync, lstatSync, realpathSync, existsSync } from "node:fs"
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
