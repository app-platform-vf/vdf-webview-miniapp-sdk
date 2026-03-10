import { BridgeMessage, Platform } from '../types';

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage(msg: string): void };
    AndroidBridge?: { postMessage(msg: string): void };
    webkit?: { messageHandlers: { bridge: { postMessage(msg: string): void } } };
  }
}

/** Phat hien nen tang hien tai */
export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'web';
  if (window.ReactNativeWebView) return 'react-native';
  if (window.AndroidBridge) return 'android';
  if (window.webkit?.messageHandlers?.bridge) return 'ios';
  return 'web';
}

/** Gui message den native bridge */
export function sendToNative(message: BridgeMessage): void {
  const json = JSON.stringify(message);
  const platform = detectPlatform();

  switch (platform) {
    case 'react-native':
      window.ReactNativeWebView!.postMessage(json);
      break;
    case 'android':
      window.AndroidBridge!.postMessage(json);
      break;
    case 'ios':
      window.webkit!.messageHandlers.bridge.postMessage(json);
      break;
    case 'web':
    default:
      window.postMessage(json, '*');
      break;
  }
}

/** Parse message tu native gui xuong */
export function parseNativeMessage(raw: any): BridgeMessage | null {
  try {
    if (typeof raw === 'string') return JSON.parse(raw);
    if (typeof raw === 'object' && raw.type) return raw as BridgeMessage;
    return null;
  } catch {
    return null;
  }
}
