# vdf-webview-miniapp-sdk

SDK phía **WebView** cho Super MiniApp — giao tiếp giữa WebView (JavaScript / TypeScript)
và ứng dụng **Native (Android / iOS)** qua bridge event. API type-safe được **sinh tự động
từ `events.json`** (không viết tay). Dùng chung 1 package cho mọi framework (React, Vue,
Angular, vanilla JS).

## Cài đặt

```bash
npm install vdf-webview-miniapp-sdk
```

## Bắt đầu nhanh

```ts
import { getSharedMiniApp, getLocation, appOpenWebview, isSuccess } from 'vdf-webview-miniapp-sdk'

const app = getSharedMiniApp({ debug: true })
app.ready()

// Gọi API qua generated function (type-safe)
const res = await getLocation()
if (isSuccess(res)) {
  console.log(res.data)
}

// Gọi API có tham số
await appOpenWebview({ data: { url: 'https://example.com', serviceName: 'Demo' } })

// Gọi API động qua invoke
const res2 = await app.invoke('GET_LOCATION')
```

## Kiến trúc ngắn gọn

- `events.json` = **hợp đồng bridge** (nguồn sự thật). Sửa event ở đây rồi chạy code-gen —
  KHÔNG sửa tay `src/generated/*.generated.ts`.
- Đây là **twin phía web** của MiniAppSDK native (Android/iOS): hợp đồng event phải khớp cả
  ba nền tảng.

## License

Proprietary — © 2026 VDF. All rights reserved (UNLICENSED). Xem file [LICENSE](./LICENSE).
Publish lên npm registry chỉ để tiện phân phối, KHÔNG cấp quyền sử dụng ngoài phạm vi VDF cho phép.
