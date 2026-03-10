import type { StorageGetResult, StorageInfoResult } from '../types';

type InvokeFn = (api: string, data?: any) => Promise<any>;

/**
 * API luu tru du lieu qua native
 * Tuong tu wx.setStorage / wx.getStorage
 */
export class StorageAPI {
  constructor(private invoke: InvokeFn) {}

  /** Lay du lieu theo key */
  async get(key: string): Promise<StorageGetResult> {
    return this.invoke('storage.get', { key });
  }

  /** Luu du lieu theo key */
  async set(key: string, data: any): Promise<void> {
    return this.invoke('storage.set', { key, data });
  }

  /** Xoa du lieu theo key */
  async remove(key: string): Promise<void> {
    return this.invoke('storage.remove', { key });
  }

  /** Xoa toan bo du lieu */
  async clear(): Promise<void> {
    return this.invoke('storage.clear');
  }

  /** Lay thong tin bo nho */
  async info(): Promise<StorageInfoResult> {
    return this.invoke('storage.info');
  }
}
