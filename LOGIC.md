# Luong chay khi goi event trong SDK

Tai lieu nay mo ta dung nhung gi code dang lam. Cac ten ham va ten truong o day
la ten that trong `packages/core/src` — doi chieu duoc bang cach mo tep tuong ung.

## Cach 1: Dung truc tiep qua Core

```ts
import { createMiniApp, wireToMiniApp, getLocation, isSuccess } from 'vdf-webview-miniapp-sdk'

const app = createMiniApp({ appId: 'com.example.miniapp' })
wireToMiniApp(app)
app.ready()

const res = await getLocation()
if (isSuccess(res)) console.log(res.data)
```

### Luong chay `getLocation()`

```
getLocation()
    |
    v
send('GET_LOCATION', payload)                 <-- generated/api.generated.ts
    |  Tao request object, sender va request_id de RONG:
    |  { event: 'GET_LOCATION', sender: '', request_id: '', ...payload }
    |  Hai truong rong do se duoc sendRaw dien o buoc sau.
    |
    v
_sendRaw(request)                             <-- callback da wire qua wireToMiniApp()
    |  Callback nay goi THANG app.sendRaw(request), khong di qua app.invoke().
    |
    v
app.sendRaw(message)                          <-- MiniApp.sendRaw()
    |
    |-- requestManager.create(timeout)        <-- Tao Promise + timer
    |       -> request_id: "req_<ms>_<random>"
    |       -> promise: Promise<any>          (dang cho resolve)
    |       Timeout mac dinh 90000ms, doi qua config.timeout.
    |
    |-- Dung message gui di:
    |       { ...msg,
    |         sender: msg.sender || 'MINIAPP_WEBVIEW',
    |         request_id: msg.request_id || <vua sinh>,
    |         requestId: <cung gia tri voi request_id>,
    |         token: config.token || undefined,
    |         timestamp: Date.now() }
    |       Khong co token thi JSON.stringify bo luon truong do.
    |
    |-- messageQueue.push(fn)                 <-- Day vao hang doi
    |       |
    |       |-- Chua goi ready() -> nam trong queue, cho flush
    |       |-- Da goi ready()   -> chay ngay:
    |               |
    |               v
    |       middlewareManager.run(message, done)   <-- Chay qua middleware pipeline
    |               |
    |               |-- middleware 1 -> next()
    |               |-- middleware 2 -> next()
    |               |-- ...
    |               |-- done():
    |                       |
    |                       v
    |               sendToNative(message)          <-- bridge/Transport.ts
    |                       |
    |                       |  json = JSON.stringify(message)
    |                       |  Chon nhanh theo detectPlatform():
    |                       |   android: window.AndroidWebview.miniappWebviewToSdk(json)
    |                       |   ios:     window.webkit.messageHandlers
    |                       |              .miniappWebviewToSdk.postMessage(json)
    |                       |   web:     window.miniappSdkToWebview?.(json)
    |
    |-- return promise                        <-- Tra Promise cho caller
```

`detectPlatform()` chon nhanh theo thu tu: co `window.AndroidWebview` thi la
android, co `window.webkit.messageHandlers.miniappWebviewToSdk` thi la ios,
con lai la web. Nhanh web goi nguoc chinh ham nhan — no la duong loopback de
tu thu tren trinh duyet, khong phai mot bridge that.

**JSON gui den Native** — object PHANG, khong boc trong `payload`:

```json
{
  "event": "GET_LOCATION",
  "sender": "MINIAPP_WEBVIEW",
  "request_id": "req_1710000000000_ab3xk",
  "requestId": "req_1710000000000_ab3xk",
  "timestamp": 1710000000000
}
```

Event co tham so thi cac truong cua payload nam ngay canh, cung mot cap:

```json
{
  "event": "APP_OPEN_WEBVIEW",
  "sender": "MINIAPP_WEBVIEW",
  "request_id": "req_1710000000000_ab3xk",
  "data": { "url": "https://example.com" },
  "requestId": "req_1710000000000_ab3xk",
  "timestamp": 1710000000000
}
```

> Muon xem doan nay cho mot event bat ky, ke ca khi KHONG dung SDK: mo trang
> demo, bam vao event roi bam nut **Raw JSON**. No in ra dung JSON tren, kem
> cach gui xuong native va hinh dang JSON nhan ve.

### Native xu ly xong, tra response ve

Native khong ban mot `message` event vao window. No goi thang ham ma SDK da gan
len window luc khoi tao:

```
Native goi window.miniappSdkToWebview(data)   <-- MiniApp.startListening() gan ham nay
    |
    v
parseNativeMessage(data)                      <-- bridge/Transport.ts
    |  Chuoi -> JSON.parse
    |  Object co truong `event` -> giu nguyen
    |  Con lai -> null, bo qua
    |
    v
handleMessage(msg)                            <-- MiniApp (private)
    |
    |  KHONG phai switch. Hai nhanh duoi day chay NOI TIEP nhau, khong loai tru:
    |
    |-- Co request_id -> handleResponse(msg)
    |       |
    |       |-- isSuccess(msg) -> requestManager.resolve(request_id, msg)
    |       |-- nguoc lai      -> requestManager.reject(request_id, msg)
    |       |       isSuccess = eventStatus.errorCode === 'SDK000'
    |       |                   hoac errorCode === 'SDK000' o cap ngoai
    |       |
    |       |-- resolve/reject se: huy timer, xoa khoi bang dang cho,
    |       |   roi settle Promise. Khong con ban ghi nao dang cho ung voi
    |       |   request_id do thi buoc nay khong lam gi ca.
    |       |
    |       v
    |   wireToMiniApp callback nhan raw response
    |       |
    |       |-- raw.eventStatus ton tai -> tra ve nguyen
    |       |-- khong -> boc lai thanh format chuan:
    |       |   { event, sender: 'MINIAPP_SDK', response_id, request_id,
    |       |     ...data, eventStatus: { errorCode: 'SDK000', ... } }
    |       |
    |       v
    |   getLocation() Promise settle voi MiniAppResponse<GetLocationResponse>
    |
    |-- LUON LUON -> handleEvent(msg)
            |
            |-- event thuoc nhom lifecycle (show/hide/error/destroy)
            |   -> lifecycleBus.emit()
            |
            |-- eventBus.emit(msg.event, msg)
                -> Goi moi listener da dang ky qua app.on()
```

**Vi sao hai nhanh cung chay, va tai sao dieu do quan trong**

Promise cua mot lan goi settle DUNG MOT LAN roi bi xoa khoi `RequestManager`.
Nhip thu hai cua cung mot `request_id` se roi vao nhanh "khong con ban ghi nao
dang cho" va bi bo di trong im lang — nhung `handleEvent` thi van chay, nen ai
dang ky qua `app.on(<ten event>, ...)` van nhin thay no.

Co that hai nhip: `OPEN_SMS_COMPOSER` tren iOS tra `HANDED_OFF` luc man soan tin
mo ra, roi tra `SENT` / `CANCELLED` / `SEND_FAILED` khi nguoi dung xong viec.
Chi `await` ham generated thi ket cuc that khong bao gio toi tay ban.

**JSON nhan tu Native** — cung la object phang:

```json
{
  "event": "GET_LOCATION",
  "sender": "MINIAPP_SDK",
  "response_id": "res_...",
  "request_id": "req_1710000000000_ab3xk",
  "data": { "lat": 10.76, "lng": 106.66 },
  "eventStatus": {
    "errorCode": "SDK000",
    "errorMessageVN": "Thanh cong",
    "errorMessageEN": "Success",
    "realMsg": ""
  }
}
```

`errorCode` khac `SDK000` thi Promise bi **reject**, va gia tri nem ra chinh la
ca object response nay chu khong phai mot `Error`.

### Gui mot chieu, khong cho tra loi

`app.emit(event, data)` dung cung duong ong (hang doi, middleware, sendToNative)
nhung khong giu Promise nao, nen khong co gi de cho. `app.invoke(event, data)`
la loi tat cua `sendRaw({ event, ...data })` — dung khi muon goi mot event chua
co ham generated.

### Hang doi truoc khi ready

Moi thu gui truoc `app.ready()` nam trong `MessageQueue` chu khong mat di.
`ready()` bat co ready roi chay het nhung viec da xep hang, theo dung thu tu.
Tu do tro di message di thang, khong qua hang doi nua.

---

## Cach 2: Dung singleton trong React / Vue / Angular

Goi phat hanh chi co MOT: `vdf-webview-miniapp-sdk`. **Khong co** goi rieng cho
tung framework, va cung khong co `useMiniApp` hay `MiniAppService` — ca ba
framework dung chung mot duong: `getSharedMiniApp()`.

### Khac biet duy nhat: khoi tao

`getSharedMiniApp()` thay hai buoc `createMiniApp` + `wireToMiniApp`:

```
getSharedMiniApp(config?)                     <-- adapter.ts (trong core)
    |
    |-- Lan dau goi:
    |       sharedInstance = new MiniApp(config)
    |       wireToMiniApp(sharedInstance)      <-- Ket noi generated API
    |       return sharedInstance
    |
    |-- Lan sau: return sharedInstance         <-- Singleton, khong tao lai
                                                  (config lan sau bi BO QUA)
```

Sau do, luong goi event **hoan toan giong** Cach 1. Cac ham generated
(`getLocation`, `getContacts`, ...) la ham tu do — import roi goi thang, khong
can cam gi vao component.

### React

```ts
import { getSharedMiniApp, getLocation, isSuccess } from 'vdf-webview-miniapp-sdk'

const app = getSharedMiniApp({ debug: true })   // dat NGOAI component

function App() {
  useEffect(() => { app.ready() }, [])

  const handleClick = async () => {
    const res = await getLocation()             // Luong chay giong het Cach 1
    if (isSuccess(res)) console.log(res.data)
  }
}
```

### Vue

```ts
import { getSharedMiniApp, getLocation, isSuccess } from 'vdf-webview-miniapp-sdk'

const app = getSharedMiniApp({ debug: true })
onMounted(() => app.ready())

app.on('OPEN_SMS_COMPOSER', (msg) => console.log(msg))
onUnmounted(() => app.off('OPEN_SMS_COMPOSER'))   // KHONG tu dong, phai tu go

const res = await getLocation()
```

### Angular

```ts
import { getSharedMiniApp, getLocation, isSuccess } from 'vdf-webview-miniapp-sdk'

@Component({ /* ... */ })
export class AppComponent implements OnInit {
  private app = getSharedMiniApp({ debug: true })

  ngOnInit() { this.app.ready() }

  async handleClick() {
    const res = await getLocation()             // Luong chay giong het Cach 1
  }
}
```

### `createMiniAppInterface(app)` — tuy chon

Tra ve mot object da bind san method, de destructure:

```
{ invoke, emit, on, off, once, ready, destroy,
  onReady, onShow, onHide, onError, onDestroy,
  use, useMiddleware, app }
```

No **khong** tu huy listener theo vong doi component — go listener la viec cua
ban, qua `off()`.

---

## Ket noi Generated API voi MiniApp (wireToMiniApp)

Day la buoc quan trong nhat, chi goi **1 lan** khi khoi tao:

```
wireToMiniApp(app)                            <-- generated/api.generated.ts
    |
    v
initMiniAppAPI(sendFn)                        <-- Luu callback vao bien _sendRaw
    |
    |  sendFn = (msg) => app.sendRaw(msg).then(raw => {
    |      if (raw.eventStatus) return raw      // Native tra day du
    |      return { ...boc lai thanh format chuan... }
    |  })
```

Sau khi wire, moi ham generated (`getLocation`, `getContacts`, ...) deu di qua
`_sendRaw` -> `app.sendRaw()`. Chua wire ma goi ham generated thi no nem loi
"MiniApp API chua duoc khoi tao".

---

## Tom tat 1 dong

```
Generated API  -->  _sendRaw  -->  app.sendRaw()  -->  MessageQueue  -->  Middleware  -->  sendToNative()
                                                                                                 |
  Promise settle  <--  requestManager.resolve/reject  <--  handleResponse()  <--+                 |
  app.on(...)     <--  eventBus.emit()                <--  handleEvent()    <--+-- window.miniappSdkToWebview
```
