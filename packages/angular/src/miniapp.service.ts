import { MiniApp, MiniAppConfig, EventCallback, getSharedMiniApp, wireToMiniApp } from '@webview-sdk/core';

/**
 * MiniApp Service — plain class, khong phu thuoc Angular decorator.
 *
 * Consumer tu provide trong app:
 *   providers: [MiniAppService]
 *
 * Su dung:
 *   constructor(private miniapp: MiniAppService) {}
 *   const result = await this.miniapp.invoke('getLocation', { type: 'gcj02' })
 */
export class MiniAppService {
  private app: MiniApp;

  storage: MiniApp['storage'];
  ui: MiniApp['ui'];
  navigator: MiniApp['navigator'];

  constructor() {
    this.app = getSharedMiniApp();
    this.storage = this.app.storage;
    this.ui = this.app.ui;
    this.navigator = this.app.navigator;
  }

  init(config: MiniAppConfig): void {
    this.app.destroy();
    this.app = new MiniApp(config);
    this.storage = this.app.storage;
    this.ui = this.app.ui;
    this.navigator = this.app.navigator;
    wireToMiniApp(this.app);
  }

  invoke(api: string, data?: any): Promise<any> { return this.app.invoke(api, data); }
  emit(event: string, data?: any): void { this.app.emit(event, data); }
  on(event: string, cb: EventCallback): void { this.app.on(event, cb); }
  off(event: string, cb?: EventCallback): void { this.app.off(event, cb); }
  ready(): void { this.app.ready(); }
  onReady(cb: () => void): void { this.app.onReady(cb); }
  onShow(cb: () => void): void { this.app.onShow(cb); }
  onHide(cb: () => void): void { this.app.onHide(cb); }
  onError(cb: (err: any) => void): void { this.app.onError(cb); }
  use(plugin: any): void { this.app.use(plugin); }
  useMiddleware(mw: any): void { this.app.useMiddleware(mw); }
  getInstance(): MiniApp { return this.app; }
  destroy(): void { this.app.destroy(); }
}
