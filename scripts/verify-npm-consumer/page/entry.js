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
}
