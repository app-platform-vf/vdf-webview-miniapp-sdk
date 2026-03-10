import { Injectable, OnDestroy } from '@angular/core';
import { MiniApp, MiniAppConfig, EventCallback, wireToMiniApp } from '@webview-sdk/core';

/**
 * Angular service cho MiniApp SDK
 *
 * Su dung:
 *   constructor(private miniapp: MiniAppService) {}
 *   const result = await this.miniapp.invoke('getLocation', { type: 'gcj02' })
 */
@Injectable({ providedIn: 'root' })
export class MiniAppService implements OnDestroy {
  private app: MiniApp;

  /** API luu tru */
  storage: MiniApp['storage'];
  /** API giao dien native */
  ui: MiniApp['ui'];
  /** API dieu huong */
  navigator: MiniApp['navigator'];

  constructor() {
    this.app = new MiniApp();
    this.storage = this.app.storage;
    this.ui = this.app.ui;
    this.navigator = this.app.navigator;
    // Noi generated API vao instance nay — chi goi 1 lan
    wireToMiniApp(this.app);
  }

  /** Khoi tao voi cau hinh tuy chinh */
  init(config: MiniAppConfig): void {
    this.app.destroy();
    this.app = new MiniApp(config);
    this.storage = this.app.storage;
    this.ui = this.app.ui;
    this.navigator = this.app.navigator;
    wireToMiniApp(this.app);
  }

  /** Goi native API va cho response */
  invoke(api: string, data?: any): Promise<any> {
    return this.app.invoke(api, data);
  }

  /** Gui su kien den native */
  emit(event: string, data?: any): void {
    this.app.emit(event, data);
  }

  /** Lang nghe su kien tu native */
  on(event: string, cb: EventCallback): void {
    this.app.on(event, cb);
  }

  /** Huy lang nghe su kien */
  off(event: string, cb?: EventCallback): void {
    this.app.off(event, cb);
  }

  /** Danh dau SDK san sang */
  ready(): void {
    this.app.ready();
  }

  /** Lifecycle hooks */
  onReady(cb: () => void): void { this.app.onReady(cb); }
  onShow(cb: () => void): void { this.app.onShow(cb); }
  onHide(cb: () => void): void { this.app.onHide(cb); }
  onError(cb: (err: any) => void): void { this.app.onError(cb); }

  /** Cai dat plugin */
  use(plugin: any): void {
    this.app.use(plugin);
  }

  /** Lay instance goc */
  getInstance(): MiniApp {
    return this.app;
  }

  ngOnDestroy(): void {
    this.app.destroy();
  }
}
