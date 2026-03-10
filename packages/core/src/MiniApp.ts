import {
  BridgeMessage,
  MiniAppConfig,
  MiniAppPlugin,
  MiddlewareFn,
  EventCallback,
  LifecycleEvent,
  LifecycleCallback,
} from './types';

import { sendToNative, parseNativeMessage, detectPlatform } from './bridge/Transport';
import { EventBus } from './modules/EventBus';
import { RequestManager } from './modules/RequestManager';
import { MessageQueue } from './modules/MessageQueue';
import { MiddlewareManager } from './modules/MiddlewareManager';
import { PluginManager } from './plugins/PluginManager';
import { StorageAPI } from './apis/Storage';
import { UIAPI } from './apis/UI';
import { NavigatorAPI } from './apis/Navigator';
import { Logger } from './utils/logger';

/**
 * MiniApp - Class chinh cua SDK
 *
 * Cung cap giao tiep 2 chieu giua WebView va Native:
 * - invoke(): goi native API va cho response
 * - emit(): gui su kien khong cho response
 * - on(): lang nghe su kien tu native
 * - storage / ui / navigator: API tien ich
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

  /** API luu tru du lieu */
  readonly storage: StorageAPI;
  /** API giao dien native */
  readonly ui: UIAPI;
  /** API dieu huong */
  readonly navigator: NavigatorAPI;

  constructor(config: MiniAppConfig = {}) {
    this.config = {
      appId: config.appId ?? '',
      debug: config.debug ?? false,
      token: config.token ?? '',
      timeout: config.timeout ?? 5000,
    };

    if (this.config.debug) {
      Logger.enabled = true;
    }

    // Khoi tao cac API module, bind invoke vao MiniApp
    const invokeFn = this.invoke.bind(this);
    this.storage = new StorageAPI(invokeFn);
    this.ui = new UIAPI(invokeFn);
    this.navigator = new NavigatorAPI(invokeFn);

    // Lang nghe message tu native
    this.startListening();

    Logger.log('MiniApp created', { appId: this.config.appId, platform: detectPlatform() });
  }

  // ============================================================
  // Giao tiep voi Native
  // ============================================================

  /**
   * Goi native API va cho response
   * Tuong tu wx.request() / my.call()
   */
  invoke(api: string, data?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const { requestId, promise } = this.requestManager.create(this.config.timeout);

      const message: BridgeMessage = {
        type: 'request',
        event: api,
        payload: data,
        requestId,
        token: this.config.token || undefined,
        timestamp: Date.now(),
      };

      this.messageQueue.push(() => {
        this.middlewareManager.run(message, () => {
          Logger.log('>>> invoke', api, data);
          sendToNative(message);
        });
      });

      promise.then(resolve).catch(reject);
    });
  }

  /**
   * Gui su kien den native (khong cho response)
   * Tuong tu postMessage mot chieu
   */
  emit(event: string, data?: any): void {
    const message: BridgeMessage = {
      type: 'event',
      event,
      payload: data,
      token: this.config.token || undefined,
      timestamp: Date.now(),
    };

    this.messageQueue.push(() => {
      this.middlewareManager.run(message, () => {
        Logger.log('>>> emit', event, data);
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
    sendToNative({
      type: 'event',
      event: '__miniapp_ready',
      payload: { appId: this.config.appId },
      timestamp: Date.now(),
    });

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
    this.messageHandler = (e: MessageEvent) => {
      const msg = parseNativeMessage(e.data);
      if (!msg) return;
      this.handleMessage(msg);
    };
    window.addEventListener('message', this.messageHandler);
  }

  private stopListening(): void {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }
  }

  private handleMessage(msg: BridgeMessage): void {
    Logger.log('<<< received', msg.type, msg.event, msg.payload);

    switch (msg.type) {
      case 'event':
        this.handleEvent(msg);
        break;
      case 'response':
        this.handleResponse(msg);
        break;
      case 'batch':
        this.handleBatch(msg);
        break;
    }
  }

  private handleEvent(msg: BridgeMessage): void {
    if (!msg.event) return;

    // Xu ly lifecycle event dac biet
    const lifecycleEvents: LifecycleEvent[] = ['show', 'hide', 'error', 'destroy'];
    if (lifecycleEvents.includes(msg.event as LifecycleEvent)) {
      this.lifecycleBus.emit(msg.event, msg.payload);
    }

    // Phat su kien cho listener
    this.eventBus.emit(msg.event, msg.payload);
  }

  private handleResponse(msg: BridgeMessage): void {
    if (!msg.requestId) return;

    if (msg.errorCode || msg.errorMessage) {
      this.requestManager.reject(msg.requestId, {
        code: msg.errorCode,
        message: msg.errorMessage,
      });
    } else {
      this.requestManager.resolve(msg.requestId, msg.payload);
    }
  }

  private handleBatch(msg: BridgeMessage): void {
    if (!Array.isArray(msg.payload)) return;
    msg.payload.forEach((item: BridgeMessage) => this.handleMessage(item));
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
