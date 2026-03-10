import { EventCallback } from '../types';

/**
 * He thong pub/sub su kien
 * Ho tro on/off/once/emit
 */
export class EventBus {
  private listeners = new Map<string, EventCallback[]>();

  /** Dang ky lang nghe su kien */
  on(event: string, cb: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(cb);
  }

  /** Lang nghe su kien mot lan duy nhat */
  once(event: string, cb: EventCallback): void {
    const wrapper: EventCallback = (data) => {
      this.off(event, wrapper);
      cb(data);
    };
    this.on(event, wrapper);
  }

  /** Phat su kien */
  emit(event: string, data?: any): void {
    const list = this.listeners.get(event);
    if (!list) return;
    list.forEach(cb => cb(data));
  }

  /** Huy lang nghe. Neu khong truyen cb, huy tat ca listener cua event */
  off(event: string, cb?: EventCallback): void {
    if (!cb) {
      this.listeners.delete(event);
      return;
    }
    const list = this.listeners.get(event);
    if (!list) return;
    const idx = list.indexOf(cb);
    if (idx !== -1) list.splice(idx, 1);
    if (list.length === 0) this.listeners.delete(event);
  }

  /** Xoa tat ca listener */
  clear(): void {
    this.listeners.clear();
  }
}
