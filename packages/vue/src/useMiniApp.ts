import { MiniApp, MiniAppConfig, EventCallback, wireToMiniApp } from '@webview-sdk/core';
import { onUnmounted } from 'vue';

let sharedInstance: MiniApp | null = null;

function getSharedInstance(config?: MiniAppConfig): MiniApp {
  if (!sharedInstance) {
    sharedInstance = new MiniApp(config);
    // Noi generated API vao instance nay — chi goi 1 lan
    wireToMiniApp(sharedInstance);
  }
  return sharedInstance;
}

/**
 * Vue 3 composable cho MiniApp SDK
 *
 * Su dung:
 *   const { invoke, on, emit, storage, ui, navigator } = useMiniApp()
 *   const result = await invoke('getLocation', { type: 'gcj02' })
 */
export function useMiniApp(config?: MiniAppConfig) {
  const app = getSharedInstance(config);

  // Tu dong huy listener khi component unmount
  const boundListeners: Array<{ event: string; cb: EventCallback }> = [];

  const on = (event: string, cb: EventCallback): void => {
    app.on(event, cb);
    boundListeners.push({ event, cb });
  };

  onUnmounted(() => {
    boundListeners.forEach(({ event, cb }) => app.off(event, cb));
  });

  return {
    /** Goi native API va cho response */
    invoke: app.invoke.bind(app),
    /** Gui su kien den native */
    emit: app.emit.bind(app),
    /** Lang nghe su kien tu native (tu dong cleanup khi unmount) */
    on,
    /** Huy lang nghe su kien */
    off: app.off.bind(app),
    /** Lang nghe su kien mot lan */
    once: app.once.bind(app),
    /** API luu tru */
    storage: app.storage,
    /** API giao dien native */
    ui: app.ui,
    /** API dieu huong */
    navigator: app.navigator,
    /** Danh dau SDK san sang */
    ready: app.ready.bind(app),
    /** Huy SDK */
    destroy: app.destroy.bind(app),
    /** Lifecycle hooks */
    onReady: app.onReady.bind(app),
    onShow: app.onShow.bind(app),
    onHide: app.onHide.bind(app),
    onError: app.onError.bind(app),
    /** Instance goc */
    app,
  };
}
