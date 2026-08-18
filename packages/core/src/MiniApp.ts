import {
  MiniAppConfig,
  MiniAppPlugin,
  MiddlewareFn,
  EventCallback,
  LifecycleEvent,
  LifecycleCallback,
} from './types';

import type { MiniAppRequestBase, MiniAppResponseBase } from './generated/types.generated';
import { sendToNative, parseNativeMessage, detectPlatform } from './bridge/Transport';
import { EventBus } from './modules/EventBus';
import { RequestManager } from './modules/RequestManager';
import { MessageQueue } from './modules/MessageQueue';
import { MiddlewareManager } from './modules/MiddlewareManager';
import { PluginManager } from './plugins/PluginManager';
import { Logger } from './utils/logger';
import { isSuccess } from './generated/api.generated';

const SENDER = 'MINIAPP_WEBVIEW';

/**
 * MiniApp - Class chinh cua SDK
 *
 * Cung cap giao tiep 2 chieu giua WebView va Native:
 * - sendRaw(): gui MiniAppRequestBase truc tiep
 * - invoke(): wrapper tien loi cho sendRaw
 * - emit(): gui su kien khong cho response
 * - on(): lang nghe su kien tu native
 */
export class MiniApp {
  private eventBus = new EventBus();
  private requestManager = new RequestManager();
  private messageQueue = new MessageQueue();
  private middlewareManager = new MiddlewareManager();
  private pluginManager = new PluginManager();
  private lifecycleBus = new EventBus();
  private config: Required<MiniAppConfig>;
  private messageHandler: ((e: MessageEvent) => void) | null = null;

  constructor(config: MiniAppConfig = {}) {
    this.config = {
      appId: config.appId ?? '',
      debug: config.debug ?? false,
      token: config.token ?? '',
      timeout: config.timeout ?? 90000,
    };

    if (this.config.debug) {
      Logger.enabled = true;
    }

    // Lang nghe message tu native
    this.startListening();

    Logger.log('MiniApp created', { appId: this.config.appId, platform: detectPlatform() });
  }

  // ============================================================
  // Giao tiep voi Native
  // ============================================================

  /**
   * Gui MiniAppRequestBase truc tiep va cho response.
   * Day la core method — invoke() va wireToMiniApp() deu goi qua day.
   */
  sendRaw(msg: MiniAppRequestBase): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const { request_id, promise } = this.requestManager.create(this.config.timeout);

      const message: MiniAppRequestBase = {
        ...msg,
        sender: msg.sender || SENDER,
        request_id: msg.request_id || request_id,
        requestId: msg.request_id || request_id,
        token: this.config.token || undefined,
        timestamp: Date.now(),
      };

      this.messageQueue.push(() => {
        this.middlewareManager.run(message, () => {
          Logger.log('>>> send', message.event, message);
          sendToNative(message);
        });
      });

      promise.then(resolve).catch(reject);
    });
  }

  /**
   * Goi native API va cho response
   * Tuong tu wx.request() / my.call()
   */
  invoke(event: string, data?: any): Promise<any> {
    return this.sendRaw({
      event: event,
      ...data,
    });
  }

  /**
   * Gui su kien den native (khong cho response)
   * Tuong tu postMessage mot chieu
   */
  emit(event: string, data?: any): void {
    const { request_id } = this.requestManager.create(this.config.timeout);
    const message: MiniAppRequestBase = {
      event,
      sender: SENDER,
      request_id: request_id,
      requestId: request_id,
      ...data,
      token: this.config.token || undefined,
      timestamp: Date.now(),
    };

    this.messageQueue.push(() => {
      this.middlewareManager.run(message, () => {
        Logger.log('>>> emit', event, message);
        sendToNative(message);
      });
    });
  }

  /**
   * Lang nghe su kien tu native
   */
  on(event: string, cb: EventCallback): void {
    this.eventBus.on(event, cb);
  }

  /** Lang nghe su kien mot lan */
  once(event: string, cb: EventCallback): void {
    this.eventBus.once(event, cb);
  }

  /** Huy lang nghe su kien */
  off(event: string, cb?: EventCallback): void {
    this.eventBus.off(event, cb);
  }

  // ============================================================
  // Lifecycle
  // ============================================================

  /** Dang ky callback khi SDK san sang */
  onReady(cb: LifecycleCallback): void {
    this.lifecycleBus.on('ready', cb);
  }

  /** Dang ky callback khi app hien thi */
  onShow(cb: LifecycleCallback): void {
    this.lifecycleBus.on('show', cb);
  }

  /** Dang ky callback khi app an */
  onHide(cb: LifecycleCallback): void {
    this.lifecycleBus.on('hide', cb);
  }

  /** Dang ky callback khi co loi */
  onError(cb: LifecycleCallback): void {
    this.lifecycleBus.on('error', cb);
  }

  /** Dang ky callback khi app bi huy */
  onDestroy(cb: LifecycleCallback): void {
    this.lifecycleBus.on('destroy', cb);
  }

  // ============================================================
  // Plugin & Middleware
  // ============================================================

  /** Cai dat plugin */
  use(plugin: MiniAppPlugin): void {
    this.pluginManager.install(plugin, this);
    Logger.log('Plugin installed:', plugin.name);
  }

  /** Them middleware vao pipeline xu ly message */
  useMiddleware(mw: MiddlewareFn): void {
    this.middlewareManager.use(mw);
  }

  // ============================================================
  // Lifecycle control
  // ============================================================

  /**
   * Danh dau SDK san sang
   * Xa tat ca message dang cho trong hang doi
   * Gui tin hieu handshake den native
   */
  ready(): void {
    this.messageQueue.flush();
    this.lifecycleBus.emit('ready');

    // Gui handshake den native
    // sendToNative({
    //   event: '__miniapp_ready',
    //   sender: SENDER,
    //   request_id: '',
    //   appId: this.config.appId,
    //   timestamp: Date.now(),
    // });

    Logger.log('MiniApp ready');
  }

  /**
   * Huy SDK, don dep tai nguyen
   */
  destroy(): void {
    this.lifecycleBus.emit('destroy');
    this.stopListening();
    this.eventBus.clear();
    this.lifecycleBus.clear();
    this.requestManager.clear();
    Logger.log('MiniApp destroyed');
  }

  // ============================================================
  // Xu ly message tu native
  // ============================================================

  private startListening(): void {
    window.miniappSdkToWebview = (data: any) => {
      Logger.log('Receiver raw =======' + data);
      const msg = parseNativeMessage(data);
      if (!msg) return;
      this.handleMessage(msg);
    };
  }

  private stopListening(): void {
    if (this.messageHandler) {
      window.miniappSdkToWebview = () => { Logger.log('Da stopListening')};
      this.messageHandler = null;
    }
  }

  private handleMessage(msg: MiniAppResponseBase): void {
    Logger.log('<<< received', msg.event, msg);

    // Response — co request_id de match
    if (msg.request_id || msg.requestd) {
      this.handleResponse(msg);
    }

    // Event — lifecycle hoac user event
    this.handleEvent(msg);
  }

  private handleEvent(msg: MiniAppRequestBase): void {
    if (!msg.event) return;

    // Xu ly lifecycle event dac biet
    const lifecycleEvents: LifecycleEvent[] = ['show', 'hide', 'error', 'destroy'];
    if (lifecycleEvents.includes(msg.event as LifecycleEvent)) {
      this.lifecycleBus.emit(msg.event, msg);
    }

    // Phat su kien cho listener
    this.eventBus.emit(msg.event, msg);
  }

  private handleResponse(msg: MiniAppResponseBase): void {

    if(isSuccess(msg)) {
      this.requestManager.resolve(msg.request_id || msg.requestd, msg)
    } else {
      this.requestManager.reject(msg.request_id || msg.requestd, msg)
    }
  }

  // ============================================================
  // Getters
  // ============================================================

  /** Lay nen tang hien tai */
  get platform() {
    return detectPlatform();
  }

  /** Lay cau hinh */
  getConfig() {
    return { ...this.config };
  }
}

/**
 * Factory function tao MiniApp instance
 */
export function createMiniApp(config?: MiniAppConfig): MiniApp {
  return new MiniApp(config);
}
