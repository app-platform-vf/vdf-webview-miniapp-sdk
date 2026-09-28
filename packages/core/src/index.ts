// MiniApp - Class chinh va factory
export { MiniApp, createMiniApp } from './MiniApp.js';

// Types
export type {
  MiniAppConfig,
  MiniAppPlugin,
  MiddlewareFn,
  EventCallback,
  LifecycleEvent,
  LifecycleCallback,
  Platform,
} from './types.js';

// Transport
export { sendToNative, detectPlatform, parseNativeMessage } from './bridge/Transport.js';

// Modules noi bo (de mo rong / test)
export { EventBus } from './modules/EventBus.js';
export { RequestManager } from './modules/RequestManager.js';
export { MessageQueue } from './modules/MessageQueue.js';
export { MiddlewareManager } from './modules/MiddlewareManager.js';
export { PluginManager } from './plugins/PluginManager.js';

// Utils
export { Logger } from './utils/logger.js';
export { withTimeout } from './utils/timeout.js';
export { retry } from './utils/retry.js';

// Adapter — shared logic cho React/Vue/Angular
export { getSharedMiniApp, createMiniAppInterface } from './adapter.js';

// Generated API (tu dong sinh tu events.json bang event.js)
export * from './generated/api.generated.js';
export type {
  MiniAppRequestBase,
  MiniAppResponseBase,
  MiniAppRequest,
  MiniAppResponse,
  EventStatus,
  MiniAppEventName,
} from './generated/types.generated.js';
export { EVENT_LIST } from './generated/types.generated.js';
export { MINIAPP_EVENTS } from './generated/event-map.generated.js';
export type { MiniAppEventMap } from './generated/event-map.generated.js';

// Truc parity — khai bao ma HAI native phai mang y het nhau, di SDK -> APP CHU.
// KHONG phai event: trang mini-app khong goi duoc, khong nghe duoc. Xuat ra vi hop dong
// la noi hai nen tang doi chieu voi nhau, khong chi la noi trang tra cuu.
//
// `export *` co y: cac dong tren liet tung ten, nen mot truc parity them vao hop dong
// se bien dich sach ma khong ai xuat no ra.
export * from './generated/parity.generated.js';

// Catalog ma ket qua — 54 ma native tra ve trong `eventStatus.errorCode`.
//
// Truoc no, trang chi phan biet duoc thanh cong voi that bai: `isSuccess()` so dung mot
// chuoi. Moi ma con lai ve toi trang duoi dang mot chuoi khong tra cuu duoc o dau.
// `describeError(code)` bien dieu do thanh doc duoc.
//
// `export *` cung ly do voi dong tren.
export * from './generated/errors.generated.js';
