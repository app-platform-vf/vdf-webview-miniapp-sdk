import type { MiniAppRequestBase } from './generated/types.generated';

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

export type MiddlewareFn = (message: MiniAppRequestBase, next: () => Promise<void>) => Promise<void> | void;

// ============================================================
// Event
// ============================================================

export type EventCallback = (data?: any) => void;

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
