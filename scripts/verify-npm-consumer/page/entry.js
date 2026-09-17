// Diem vao cua trang tieu thu. Import theo TEN GOI.
//
// Tep nay duoc CHEP vao sandbox roi moi bundle, nen node-resolve di len tu day se
// gap node_modules cua sandbox — tuc ban da CAI, khong phai packages/core. Do la
// khac biet duy nhat giua trang nay va bon trang demo co san.
import {
    createMiniApp,
    wireToMiniApp,
    openSmsComposer,
    isSuccess,
} from "vdf-webview-miniapp-sdk"

const app = createMiniApp({ appId: "vn.example.npm-consumer", debug: true })
wireToMiniApp(app)
app.ready()

// Nhip thu hai cua iOS (SENT / CANCELLED / SEND_FAILED) KHONG den qua Promise:
// Promise da settle o nhip mot va bi xoa khoi hang doi. Khong nghe o day thi ket
// cuc that cua iOS khong bao gio hien ra.
app.on("OPEN_SMS_COMPOSER", (msg) => {
    window.__log("<- native day len", msg)
})

/** Ten wire cua event demo do APP CHU xu ly. Trung voi hang so trong hai app demo. */
const HOST_HANDLED_EVENT = "HOST_APP_PING"

/** Event co y KHONG ton tai o bat ky dau: khong SDK, khong app chu. */
const UNKNOWN_EVENT = "KHONG_CO_THAT"

/**
 * Doc mot phong bi tra ve thanh mot dong nguoi doc duoc.
 *
 * Promise cua SDK reject voi moi ma khac SDK000, nen ca duong thanh cong lan duong
 * loi deu di qua day — ta doc MA, khong doc nhanh nao bat duoc no.
 */
function describe(envelope) {
    const code = envelope && envelope.eventStatus && envelope.eventStatus.errorCode
    return code || "(khong co eventStatus)"
}

window.__sdk = {
    isSuccess,

    async sendSms(recipient, body) {
        window.__log("-> openSmsComposer", { recipient, body })
        try {
            const res = await openSmsComposer({ data: { recipient, body } })
            // Nhanh nay gan nhu khong chay: mo thanh cong tra SDK852 nen isSuccess
            // tra false va Promise bi reject. No N15, da duoc chap nhan va da ghi
            // trong mo ta event.
            window.__log(`Promise resolve (isSuccess=${isSuccess(res)})`, res)
        } catch (rejected) {
            window.__log("Promise REJECT — day la duong di BINH THUONG cua SDK852", rejected)
        }
    },

    /**
     * Event khong nam trong bang dinh tuyen cua SDK VA khong app chu nao nhan.
     *
     * Ky vong: SDK100. Truoc dot sua dinh tuyen, cho nay KHONG tra ve gi ca va
     * trang treo den het han cho (90 giay) — do la ca ly do SDK100 ra doi.
     */
    async probeUnknown() {
        window.__log(`-> sendRaw ${UNKNOWN_EVENT} (ky vong SDK100)`)
        try {
            const res = await app.sendRaw({ event: UNKNOWN_EVENT })
            window.__log(`Promise resolve — ma ${describe(res)}`, res)
        } catch (rejected) {
            window.__log(`Promise REJECT — ma ${describe(rejected)}`, rejected)
        }
    },

    /**
     * Event app chu tu nhan.
     *
     * Ky vong: SDK000 kem `data.handled_by = "host-app"`, va KHONG co SDK100 di kem.
     * Do la toan bo noi dung cua dot sua intercept: truoc no, app chu co xu ly dung
     * thi VAN an them mot SDK100, tuc mot cau tra loi sai cho moi event ma diem mo
     * rong nay xu ly dung.
     */
    async probeHostHandled() {
        window.__log(`-> sendRaw ${HOST_HANDLED_EVENT} (ky vong SDK000 tu app chu)`)
        try {
            const res = await app.sendRaw({ event: HOST_HANDLED_EVENT })
            window.__log(`Promise resolve — ma ${describe(res)}`, res)
        } catch (rejected) {
            window.__log(
                `Promise REJECT — ma ${describe(rejected)}. Nhan SDK100 o day nghia la `
                + `app chu CHUA cai dat ban intercept tra ve tri gia.`,
                rejected
            )
        }
    },
}
