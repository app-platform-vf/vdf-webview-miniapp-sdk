# Publish `vdf-webview-miniapp-sdk` lên npm (public)

Đơn vị publish: **`packages/core`** (`vdf-webview-miniapp-sdk`). Root repo là `private: true` —
KHÔNG publish root.

## Tiền điều kiện (1 lần)

1. **Điền TODO github** trong `packages/core/package.json` (`repository` / `homepage` / `bugs`)
   khi đã có repo github phục vụ github-page.
2. Đăng nhập npm: `npm login` (tài khoản có quyền publish).
3. Tên `vdf-webview-miniapp-sdk` là **unscoped** → public là mặc định; `publishConfig.access: public`
   đã khai sẵn (không cần cờ `--access`).
4. ⚠️ **License = UNLICENSED (proprietary)** nhưng đẩy lên registry **public**: ai cũng tải được
   nhưng không có quyền dùng ngoài phạm vi VDF cho phép. Xác nhận đây là chủ ý trước khi publish.

## Quy trình mỗi lần release

```bash
# từ ROOT repo
npm install                 # nếu chưa cài dep
npm run pack                # create-event (regen từ events.json) + build core + bundle + copy-core-lib
                            #   -> đảm bảo src/generated/* và packages/core/dist/* tươi

cd packages/core
npm version <patch|minor|major>   # BẮT BUỘC bump nếu 1.0.0 đã publish (npm cấm ghi đè version)
npm publish --dry-run       # kiểm gói: đúng 'files' (dist + README + LICENSE), không lẫn src
npm publish                 # prepublishOnly tự chạy `npm run build` (tsc) làm lưới an toàn
```

## Kiểm sau publish

- `npm view vdf-webview-miniapp-sdk version` khớp version vừa bump.
- Cài thử ở project trống: `npm i vdf-webview-miniapp-sdk` → `import { getSharedMiniApp } from 'vdf-webview-miniapp-sdk'` compile được (types kèm theo).

## Việc CÒN LẠI (chưa làm — cần trước khi coi là "chuẩn public")

1. **Lan tên đổi (`@webview-sdk/core` → `vdf-webview-miniapp-sdk`)**: alias dev `@webview-sdk/core`
   trong `tsconfig.json` (paths) + import trong `demo/*` + `README.md` root vẫn dùng tên cũ. Chúng
   resolve nội bộ khi dev nhưng **không khớp tên published** → demo không phản ánh cách consumer thật
   `import`. Cần propagate tên mới (hoặc giữ alias dev + đổi demo sang tên published).
2. **Đóng gói ESM/CJS**: core build ESM (tsc module ESNext, `main: dist/index.js`). Chạy tốt qua
   bundler (React/Vue/Angular/vanilla-bundle — các demo chứng minh). Consumer Node thuần (ESM/CJS)
   chưa được test — cân nhắc thêm `exports` map + build kép nếu cần hỗ trợ Node import trực tiếp.
3. **Chưa có test** trong `packages/core` — nên có bộ test trước khi public (uy tín + chống regression).
4. **CI publish** (GitHub Actions `npm publish` khi tag) — làm cùng lúc dựng github-page.
