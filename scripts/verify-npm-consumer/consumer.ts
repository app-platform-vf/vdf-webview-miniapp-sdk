// Doi tac gia lap: chi duoc dung nhung gi goi npm bay ra.
//
// Tep nay KHONG chay. No ton tai de `tsc --noEmit` doc, va no hong khi:
//   - `types` trong package.json tro sai cho
//   - mot ham dang le duoc xuat nhung khong co trong dist/index.d.ts
//   - kieu tai trong cua event lech so voi hop dong
//
// Import theo TEN GOI, khong theo duong dan tuong doi. Do la khac biet quan
// trong: duong dan tuong doi se doc thang ma nguon va bo qua toan bo phan
// phan giai goi — dung cai bay ma bon trang demo hien tai dang roi vao.
import {
    createMiniApp,
    wireToMiniApp,
    openSmsComposer,
    isSuccess,
} from "vdf-webview-miniapp-sdk"

export async function partnerFlow(): Promise<void> {
    const app = createMiniApp({ appId: "vn.example.partner" })
    wireToMiniApp(app)
    app.ready()

    // Nhip hai cua iOS KHONG den qua Promise. Doc lai mo ta event trong
    // events.json neu cho nay trong co la thua.
    app.on("OPEN_SMS_COMPOSER", (msg: unknown) => {
        void msg
    })

    try {
        const res = await openSmsComposer({
            data: { recipient: "+84987654321", body: "Xin chao tu mini-app" },
        })
        // Nhanh nay gan nhu khong bao gio chay: mo thanh cong tra SDK852 nen
        // isSuccess tra false va Promise bi reject. No N15 — da duoc chap nhan,
        // va da ghi trong mo ta event.
        void isSuccess(res)
    } catch (rejected) {
        void rejected
    }
}
