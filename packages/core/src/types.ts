// ============================================================
// Giao thuc message giua WebView va Native
// ============================================================

/** Loai message trong bridge */
export type MessageType = 'event' | 'request' | 'response' | 'batch';

/** Message truyen qua bridge */
export interface BridgeMessage {
  type: MessageType;
  /** Ten su kien hoac API */
  event?: string;
  /** Du lieu dinh kem */
  payload?: any;
  /** ID ghep cap request/response */
  requestId?: string;
  /** Token bao mat */
  token?: string;
  /** Thoi gian gui */
  timestamp?: number;
  /** Ma loi (chi co trong response) */
  errorCode?: number;
  /** Thong bao loi */
  errorMessage?: string;
}

// ============================================================
// Cau hinh MiniApp
// ============================================================

export interface MiniAppConfig {
  /** ID ung dung miniapp */
  appId?: string;
  /** Bat che do debug */
  debug?: boolean;
  /** Token xac thuc */
  token?: string;
  /** Timeout mac dinh cho request (ms) */
  timeout?: number;
}

// ============================================================
// Lifecycle
// ============================================================

export type LifecycleEvent = 'ready' | 'show' | 'hide' | 'error' | 'destroy';

export type LifecycleCallback = (...args: any[]) => void;

// ============================================================
// Plugin
// ============================================================

export interface MiniAppPlugin {
  /** Ten plugin */
  name: string;
  /** Cai dat plugin vao MiniApp instance */
  install(app: any): void;
}

// ============================================================
// Middleware
// ============================================================

export type MiddlewareFn = (message: BridgeMessage, next: () => Promise<void>) => Promise<void> | void;

// ============================================================
// Event
// ============================================================

export type EventCallback = (data?: any) => void;

// ============================================================
// Storage API
// ============================================================

export interface StorageGetResult {
  data: any;
}

export interface StorageSetOptions {
  key: string;
  data: any;
}

export interface StorageRemoveOptions {
  key: string;
}

export interface StorageInfoResult {
  keys: string[];
  currentSize: number;
  limitSize: number;
}

// ============================================================
// UI API
// ============================================================

export interface ToastOptions {
  title: string;
  icon?: 'success' | 'error' | 'loading' | 'none';
  duration?: number;
}

export interface LoadingOptions {
  title?: string;
  mask?: boolean;
}

export interface DialogOptions {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export interface DialogResult {
  confirm: boolean;
  cancel: boolean;
}

export interface ActionSheetOptions {
  itemList: string[];
}

export interface ActionSheetResult {
  tapIndex: number;
}

// ============================================================
// Navigator API
// ============================================================

export interface NavigateOptions {
  url: string;
  params?: Record<string, any>;
}

export interface NavigateBackOptions {
  delta?: number;
}

export interface SwitchTabOptions {
  url: string;
}

// ============================================================
// Platform
// ============================================================

export type Platform = 'react-native' | 'android' | 'ios' | 'web';

// ============================================================
// Request Manager
// ============================================================

export interface PendingRequest {
  resolve: (data: any) => void;
  reject: (error: any) => void;
  timer?: ReturnType<typeof setTimeout>;
}
