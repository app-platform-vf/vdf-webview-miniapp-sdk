import type { MiniAppRequestBase, MiniAppResponseBase } from '../generated/types.generated';
import { Platform } from '../types';
import { Logger } from '../utils/logger';

declare global {
  interface Window {
    AndroidWebview?: { miniappWebviewToSdk(msg: string): void };
    webkit?: { messageHandlers: { miniappWebviewToSdk: { postMessage(msg: string): void } } };
  }
}

/** Phat hien nen tang hien tai */
export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'web';
  if (window.AndroidWebview) return 'android';
  if (window.webkit?.messageHandlers?.miniappWebviewToSdk) return 'ios';
  return 'web';
}

/** Gui message den native bridge */
export function sendToNative(message: MiniAppRequestBase): void {
  const json = JSON.stringify(message);
  const platform = detectPlatform();
  Logger.log('>>> sending to native platform:', platform, message);

  switch (platform) {
    case 'android':
      window.AndroidWebview!.miniappWebviewToSdk(json);
      break;
    case 'ios':
      window.webkit!.messageHandlers.miniappWebviewToSdk.postMessage(json);
      break;
    case 'web':
    default:
      window.postMessage(json, '*');
      break;
  }
}

/** Parse message tu native gui xuong */
export function parseNativeMessage(raw: any): MiniAppResponseBase | null {
  try {
    if (typeof raw === 'string') return JSON.parse(raw);
    if (typeof raw === 'object' && raw.event) return raw as MiniAppResponseBase;
    return null;
  } catch {
    return null;
  }
}
