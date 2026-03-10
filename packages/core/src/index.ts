// MiniApp - Class chinh va factory
export { MiniApp, createMiniApp } from './MiniApp';

// Types
export type {
  BridgeMessage,
  MessageType,
  MiniAppConfig,
  MiniAppPlugin,
  MiddlewareFn,
  EventCallback,
  LifecycleEvent,
  LifecycleCallback,
  Platform,
  // Storage
  StorageGetResult,
  StorageSetOptions,
  StorageRemoveOptions,
  StorageInfoResult,
  // UI
  ToastOptions,
  LoadingOptions,
  DialogOptions,
  DialogResult,
  ActionSheetOptions,
  ActionSheetResult,
  // Navigator
  NavigateOptions,
  NavigateBackOptions,
  SwitchTabOptions,
} from './types';

// API modules (de su dung doc lap neu can)
export { StorageAPI } from './apis/Storage';
export { UIAPI } from './apis/UI';
export { NavigatorAPI } from './apis/Navigator';

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

// Generated API (tu dong sinh tu events.json bang event.js)
export { MiniAppAPI, wireToMiniApp, initMiniAppAPI, isSuccess } from './generated/api.generated';
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
