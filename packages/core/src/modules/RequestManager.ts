import { PendingRequest } from '../types';

/**
 * Quan ly cac request dang cho response tu native
 * Moi request co ID duy nhat, tu dong tang
 */
export class RequestManager {
  private pending = new Map<string, PendingRequest>();
  private idCounter = 0;

  /** Tao request moi, tra ve requestId */
  create(timeout: number): { requestId: string; promise: Promise<any> } {
    const requestId = String(++this.idCounter);

    const promise = new Promise<any>((resolve, reject) => {
      const timer = timeout > 0
        ? setTimeout(() => {
            this.pending.delete(requestId);
            reject(new Error(`Request ${requestId} timeout after ${timeout}ms`));
          }, timeout)
        : undefined;

      this.pending.set(requestId, { resolve, reject, timer });
    });

    return { requestId, promise };
  }

  /** Resolve request khi nhan duoc response thanh cong */
  resolve(requestId: string, data: any): void {
    const req = this.pending.get(requestId);
    if (!req) return;
    if (req.timer) clearTimeout(req.timer);
    this.pending.delete(requestId);
    req.resolve(data);
  }

  /** Reject request khi nhan duoc response loi */
  reject(requestId: string, error: any): void {
    const req = this.pending.get(requestId);
    if (!req) return;
    if (req.timer) clearTimeout(req.timer);
    this.pending.delete(requestId);
    req.reject(error);
  }

  /** Kiem tra co request dang cho khong */
  hasPending(): boolean {
    return this.pending.size > 0;
  }

  /** Huy tat ca request dang cho */
  clear(): void {
    this.pending.forEach(req => {
      if (req.timer) clearTimeout(req.timer);
      req.reject(new Error('All requests cleared'));
    });
    this.pending.clear();
  }
}
