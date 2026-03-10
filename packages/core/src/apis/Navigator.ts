import type { NavigateOptions, NavigateBackOptions, SwitchTabOptions } from '../types';

type InvokeFn = (api: string, data?: any) => Promise<any>;

/**
 * API dieu huong trang trong miniapp
 * Push, pop, switchTab, redirect
 */
export class NavigatorAPI {
  constructor(private invoke: InvokeFn) {}

  /** Mo trang moi (them vao stack) */
  async push(url: string, params?: Record<string, any>): Promise<void> {
    return this.invoke('navigator.push', { url, params } as NavigateOptions);
  }

  /** Quay lai trang truoc */
  async pop(delta = 1): Promise<void> {
    return this.invoke('navigator.pop', { delta } as NavigateBackOptions);
  }

  /** Chuyen tab */
  async switchTab(url: string): Promise<void> {
    return this.invoke('navigator.switchTab', { url } as SwitchTabOptions);
  }

  /** Redirect (thay the trang hien tai) */
  async redirect(url: string, params?: Record<string, any>): Promise<void> {
    return this.invoke('navigator.redirect', { url, params } as NavigateOptions);
  }

  /** Quay ve trang chu */
  async reLaunch(url: string): Promise<void> {
    return this.invoke('navigator.reLaunch', { url });
  }
}
