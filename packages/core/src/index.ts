// MiniApp - Class chinh va factory
export { MiniApp, createMiniApp } from './MiniApp';

// Types
export type {
  MiniAppConfig,
  MiniAppPlugin,
  MiddlewareFn,
  EventCallback,
  LifecycleEvent,
  LifecycleCallback,
  Platform,
} from './types';

// Transport
export { sendToNative, detectPlatform, parseNativeMessage } from './bridge/Transport';

// Modules noi bo (de mo rong / test)
export { EventBus } from './modules/EventBus';
export { RequestManager } from './modules/RequestManager';
export { MessageQueue } from './modules/MessageQueue';
export { MiddlewareManager } from './modules/MiddlewareManager';
export { PluginManager } from './plugins/PluginManager';

// Utils
export { Logger } from './utils/logger';
export { withTimeout } from './utils/timeout';
export { retry } from './utils/retry';

// Adapter — shared logic cho React/Vue/Angular
export { getSharedMiniApp, createMiniAppInterface } from './adapter';

// Generated API (tu dong sinh tu events.json bang event.js)
export * from './generated/api.generated';
export type {
  MiniAppRequestBase,
  MiniAppResponseBase,
  MiniAppRequest,
  MiniAppResponse,
  EventStatus,
  MiniAppEventName,
} from './generated/types.generated';
export { EVENT_LIST } from './generated/types.generated';
export { MINIAPP_EVENTS } from './generated/event-map.generated';
export type { MiniAppEventMap } from './generated/event-map.generated';

// Truc parity — khai bao ma HAI native phai mang y het nhau, di SDK -> APP CHU.
// KHONG phai event: trang mini-app khong goi duoc, khong nghe duoc. Xuat ra vi hop dong
// la noi hai nen tang doi chieu voi nhau, khong chi la noi trang tra cuu.
//
// `export *` co y: cac dong tren liet tung ten, nen mot truc parity them vao hop dong
// se bien dich sach ma khong ai xuat no ra.
export * from './generated/parity.generated';
