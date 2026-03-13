import { useRef } from 'react';
import { MiniAppConfig, getSharedMiniApp, createMiniAppInterface } from '@webview-sdk/core';

/**
 * React hook cho MiniApp SDK
 *
 * Su dung:
 *   const { invoke, on, emit, storage, ui, navigator } = useMiniApp()
 *   const result = await invoke('getLocation', { type: 'gcj02' })
 *
 * Su dung voi generated API (type-safe, co autocomplete):
 *   import { getLocation, isSuccess } from '@webview-sdk/core'
 *   const res = await getLocation()
 *   if (isSuccess(res)) console.log(res)
 */
export function useMiniApp(config?: MiniAppConfig) {
  const appRef = useRef(getSharedMiniApp(config));
  return createMiniAppInterface(appRef.current);
}
