import { useRef } from 'react';
import { MiniApp, MiniAppConfig, EventCallback, wireToMiniApp } from '@webview-sdk/core';

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
 * React hook cho MiniApp SDK
 *
 * Su dung:
 *   const { invoke, on, emit, storage, ui, navigator } = useMiniApp()
 *   const result = await invoke('getLocation', { type: 'gcj02' })
 *
 * Su dung voi generated API (type-safe, co autocomplete):
 *   import { getUserInfo, getLocation, isSuccess } from '@webview-sdk/core'
 *   const res = await getUserInfo({ user_id: '123' })
 *   if (isSuccess(res)) console.log(res.data.full_name)
 */
export function useMiniApp(config?: MiniAppConfig) {
  const appRef = useRef<MiniApp>(getSharedInstance(config));
  const app = appRef.current;

  return {
    /** Goi native API va cho response */
    invoke: app.invoke.bind(app),
    /** Gui su kien den native */
    emit: app.emit.bind(app),
    /** Lang nghe su kien tu native */
    on: app.on.bind(app) as (event: string, cb: EventCallback) => void,
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
