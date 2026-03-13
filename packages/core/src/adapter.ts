import { MiniApp } from './MiniApp';
import { MiniAppConfig, EventCallback } from './types';
import { wireToMiniApp } from './generated/api.generated';

let sharedInstance: MiniApp | null = null;

/**
 * Lay hoac tao MiniApp singleton, tu dong wire generated API.
 * Dung chung cho React hook, Vue composable, Angular service.
 */
export function getSharedMiniApp(config?: MiniAppConfig): MiniApp {
  if (!sharedInstance) {
    sharedInstance = new MiniApp(config);
    wireToMiniApp(sharedInstance);
  }
  return sharedInstance;
}

/**
 * Tao interface object tu MiniApp instance voi tat ca method da bind.
 * Tra ve object co the destructure truc tiep.
 */
export function createMiniAppInterface(app: MiniApp) {
  return {
    invoke: app.invoke.bind(app),
    emit: app.emit.bind(app),
    on: app.on.bind(app) as (event: string, cb: EventCallback) => void,
    off: app.off.bind(app),
    once: app.once.bind(app),
    ready: app.ready.bind(app),
    destroy: app.destroy.bind(app),
    onReady: app.onReady.bind(app),
    onShow: app.onShow.bind(app),
    onHide: app.onHide.bind(app),
    onError: app.onError.bind(app),
    onDestroy: app.onDestroy.bind(app),
    use: app.use.bind(app),
    useMiddleware: app.useMiddleware.bind(app),
    app,
  };
}
