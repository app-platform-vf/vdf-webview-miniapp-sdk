import { onUnmounted } from 'vue';
import { MiniAppConfig, EventCallback, getSharedMiniApp, createMiniAppInterface } from '@webview-sdk/core';

/**
 * Vue 3 composable cho MiniApp SDK
 *
 * Su dung:
 *   const { invoke, on, emit, storage, ui, navigator } = useMiniApp()
 *   const result = await invoke('getLocation', { type: 'gcj02' })
 *
 * Listener dang ky qua on() se tu dong huy khi component unmount.
 */
export function useMiniApp(config?: MiniAppConfig) {
  const app = getSharedMiniApp(config);
  const iface = createMiniAppInterface(app);

  // Tu dong huy listener khi component unmount
  const boundListeners: Array<{ event: string; cb: EventCallback }> = [];
  const on = (event: string, cb: EventCallback): void => {
    app.on(event, cb);
    boundListeners.push({ event, cb });
  };
  onUnmounted(() => {
    boundListeners.forEach(({ event, cb }) => app.off(event, cb));
  });

  return { ...iface, on };
}
