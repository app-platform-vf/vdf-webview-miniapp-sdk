# Luong chay khi goi event trong SDK

## Cach 1: Dung truc tiep qua Core

```ts
import { createMiniApp, wireToMiniApp, getLocation, isSuccess } from '@webview-sdk/core'

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
send('GET_LOCATION', {})                     <-- api.generated.ts
    |  Tao request object:
    |  { event: 'GET_LOCATION', sender: 'MINIAPP_WEBVIEW', request_id: 'req_xxx' }
    |
    v
_sendMessage(request)                         <-- callback da wire qua wireToMiniApp()
    |  Chuyen tu generated format sang invoke:
    |  Tach { event, sender, request_id, ...payload }
    |
    v
app.invoke('GET_LOCATION', payload)           <-- MiniApp.invoke()
    |
    |-- requestManager.create(5000)           <-- Tao Promise + timeout 5s
    |       -> requestId: "1"
    |       -> promise: Promise<any>          (dang cho resolve)
    |
    |-- messageQueue.push(fn)                 <-- Day vao hang doi
    |       |
    |       |-- Neu chua ready() -> nam trong queue, cho flush
    |       |-- Neu da ready()   -> chay ngay:
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
    |                       |-- Detect platform:
    |                       |   Android:      window.AndroidBridge.postMessage(json)
    |                       |   iOS:          window.webkit.messageHandlers.bridge.postMessage(json)
    |                       |   React Native: window.ReactNativeWebView.postMessage(json)
    |                       |   Web:          window.postMessage(json, '*')
    |
    |-- return promise                        <-- Tra Promise cho caller
```

**JSON gui den Native:**

```json
{
  "type": "request",
  "event": "GET_LOCATION",
  "payload": {},
  "requestId": "1",
  "timestamp": 1710000000
}
```

### Native xu ly xong, tra response ve:

```
Native gui response ve WebView
    |
    v
window 'message' event                       <-- MiniApp.startListening()
    |
    v
parseNativeMessage(e.data)                   <-- bridge/Transport.ts
    |  Parse JSON string -> BridgeMessage object
    |  Neu parse loi -> return null, bo qua
    |
    v
handleMessage(msg)                            <-- MiniApp (private)
    |  Switch theo msg.type:
    |
    |-- type: "response" -> handleResponse()
    |       |
    |       v
    |   requestManager.resolve("1", payload)  <-- Match requestId "1"
    |       |
    |       |-- clearTimeout (huy timer 5s)
    |       |-- delete khoi pending map
    |       |-- resolve(payload)              <-- Promise RESOLVE!
    |       |
    |       v
    |   wireToMiniApp callback nhan raw response
    |       |
    |       |-- Neu raw.eventStatus ton tai -> tra ve nguyen
    |       |-- Neu khong -> wrap thanh format chuan:
    |       |   { event, sender, request_id, data, eventStatus: { errorCode: 'SDK000' } }
    |       |
    |       v
    |   getLocation() Promise RESOLVE voi MiniAppResponse<GetLocationResponse>
    |
    |-- type: "event" -> handleEvent()        (push event tu native, khong phai response)
    |       |
    |       |-- Check lifecycle event (show/hide/error/destroy)
    |       |   -> lifecycleBus.emit()
    |       |
    |       |-- eventBus.emit(event, payload)
    |           -> Goi tat ca listener da dang ky qua app.on()
    |
    |-- type: "batch" -> handleBatch()
            |
            |-- Loop tung item trong payload
            |-- Goi handleMessage() cho moi item
```

**JSON nhan tu Native:**

```json
{
  "type": "response",
  "event": "GET_LOCATION",
  "requestId": "1",
  "payload": {
    "event": "GET_LOCATION",
    "sender": "MINIAPP_SDK",
    "response_id": "res_xxx",
    "request_id": "1",
    "data": { "lat": 10.76, "lng": 106.66 },
    "eventStatus": { "errorCode": "SDK000", "errorMessageVN": "Thanh cong" }
  }
}
```

---

## Cach 2: Dung qua Framework Adapter (React / Vue / Angular)

### Khac biet duy nhat: khoi tao

Adapter thay the buoc `createMiniApp` + `wireToMiniApp` bang `getSharedMiniApp()`:

```
getSharedMiniApp(config?)                     <-- adapter.ts (trong core)
    |
    |-- Lan dau goi:
    |       sharedInstance = new MiniApp(config)
    |       wireToMiniApp(sharedInstance)      <-- Ket noi generated API
    |       return sharedInstance
    |
    |-- Lan sau: return sharedInstance         <-- Singleton, khong tao lai
```

Sau do, luong goi event **hoan toan giong** Cach 1.

### React

```ts
import { useMiniApp } from '@webview-sdk/react'
import { getLocation, isSuccess } from '@webview-sdk/core'

function App() {
  const { ready } = useMiniApp()
  useEffect(() => { ready() }, [])

  const handleClick = async () => {
    const res = await getLocation()     // Luong chay giong het Cach 1
    if (isSuccess(res)) console.log(res.data)
  }
}
```

```
useMiniApp()
    |
    v
useRef(getSharedMiniApp(config))              <-- Giu instance qua re-render
    |
    v
createMiniAppInterface(app)                   <-- Bind tat ca method
    |  { invoke, emit, on, off, once,
    |    storage, ui, navigator,
    |    ready, destroy, onReady, ... }
    |
    v
Component su dung                             <-- Goi getLocation() truc tiep
```

### Vue

```ts
import { useMiniApp } from '@webview-sdk/vue'
import { getLocation, isSuccess } from '@webview-sdk/core'

const { on, ready } = useMiniApp()
on('message', (data) => console.log(data))    // Tu dong cleanup khi unmount
onMounted(() => ready())

const res = await getLocation()               // Luong chay giong het Cach 1
```

```
useMiniApp()
    |
    v
getSharedMiniApp(config)                      <-- Singleton
    |
    v
createMiniAppInterface(app)                   <-- Bind tat ca method
    |
    |-- Override on(): theo doi listener trong boundListeners[]
    |
    |-- onUnmounted():                        <-- Vue lifecycle
    |       boundListeners.forEach(({ event, cb }) => app.off(event, cb))
    |       -> Tu dong huy tat ca listener cua component nay
    |
    v
Component su dung
```

### Angular

```ts
import { MiniAppService } from '@webview-sdk/angular'
import { getLocation, isSuccess } from '@webview-sdk/core'

@Component({ providers: [MiniAppService] })
export class AppComponent implements OnInit {
  constructor(private miniapp: MiniAppService) {}

  ngOnInit() { this.miniapp.ready() }

  async handleClick() {
    const res = await getLocation()           // Luong chay giong het Cach 1
  }
}
```

```
new MiniAppService()                          <-- Angular DI tao instance
    |
    v
getSharedMiniApp()                            <-- Singleton
    |
    v
this.storage = app.storage
this.ui = app.ui
this.navigator = app.navigator
    |
    v
Component su dung qua this.miniapp.invoke()
hoac import truc tiep: getLocation()
```

---

## Ket noi Generated API voi MiniApp (wireToMiniApp)

Day la buoc quan trong nhat, chi goi **1 lan** khi khoi tao:

```
wireToMiniApp(app)                            <-- api.generated.ts
    |
    v
initMiniAppAPI(sendFn)                        <-- Luu callback vao bien _sendMessage
    |
    |  sendFn = (request) => {
    |      // Tach cac field chung ra, giu lai payload
    |      const { event, sender, request_id, ...payload } = request
    |
    |      // Chuyen sang app.invoke()
    |      return app.invoke(event, payload)
    |          .then(raw => {
    |              if (raw.eventStatus) return raw     // Native tra day du
    |              return wrapResponse(raw)            // Wrap thanh format chuan
    |          })
    |  }
```

Sau khi wire, moi ham generated (getLocation, getContacts, ...) deu goi qua `_sendMessage` -> `app.invoke()`.

---

## Tom tat 1 dong

```
Generated API  -->  _sendMessage  -->  app.invoke()  -->  MessageQueue  -->  Middleware  -->  sendToNative()
                                                                                                    |
    Promise resolve  <--  requestManager.resolve()  <--  handleResponse()  <--  window.onMessage  <--+
```
