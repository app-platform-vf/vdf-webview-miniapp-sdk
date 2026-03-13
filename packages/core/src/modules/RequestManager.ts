import { PendingRequest } from '../types';

/**
 * Quan ly cac request dang cho response tu native
 * Moi request co ID duy nhat, tu dong tang
 */
export class RequestManager {
  private pending = new Map<string, PendingRequest>();
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).slice(8)}`;
  }

  /** Tao request moi, tra ve request_id */
  create(timeout: number): { request_id: string; promise: Promise<any> } {
    const request_id = this.generateRequestId();

    const promise = new Promise<any>((resolve, reject) => {
      const timer = timeout > 0
        ? setTimeout(() => {
            this.pending.delete(request_id);
            reject(new Error(`Request ${request_id} timeout after ${timeout}ms`));
          }, timeout)
        : undefined;

      this.pending.set(request_id, { resolve, reject, timer });
    });

    return { request_id, promise };
  }

  /** Resolve request khi nhan duoc response thanh cong */
  resolve(request_id: string, data: any): void {
    const req = this.pending.get(request_id);
    if (!req) return;
    if (req.timer) clearTimeout(req.timer);
    this.pending.delete(request_id);
    req.resolve(data);
  }

  /** Reject request khi nhan duoc response loi */
  reject(request_id: string, error: any): void {
    const req = this.pending.get(request_id);
    if (!req) return;
    if (req.timer) clearTimeout(req.timer);
    this.pending.delete(request_id);
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
