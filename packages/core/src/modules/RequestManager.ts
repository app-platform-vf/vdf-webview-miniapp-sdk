import { PendingRequest } from '../types.js';

/**
 * Quan ly cac request dang cho response tu native
 * Moi request co ID duy nhat, tu dong tang
 */
export class RequestManager {
  private pending = new Map<string, PendingRequest>();
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).slice(8)}`;
  }

  /**
   * Cap MOT MA DINH DANH, KHONG dang ky muc cho nao.
   *
   * Danh cho duong MOT CHIEU: event khong khai `response` trong hop dong. Phong bi van
   * can mot ma de doc nhat ky va de native doi chieu, nhung KHONG duoc co mot muc cho
   * va mot cai hen gio di kem — vi se khong bao gio co cau tra loi nao goi ten no.
   *
   * 🔴 Truoc ban 2.1.2, `emit()` goi thang `create()`. Loi hua no de lai khong ai `await`
   * (ham sinh ra tra `void`), nen sau `timeout` no bi tu choi va thanh mot
   * UNHANDLED REJECTION — moi lan chuyen trang mot cai, trong im lang. Dem khong tang
   * len nhin thay duoc, khong loi bien dich, va tren may ranh thi moi thu van chay dep.
   * Do la ly do no song qua ca mot vong sua von DA nham dung cho nay: vong do sua BO
   * SINH MA (ham mot chieu tra `void`, khong `await`), nhung `emit()` ben duoi thi khong
   * ai dong toi. Trieu chung chi doi dang, tu "treo 90 giay" thanh "no am tham".
   */
  newId(): string {
    return this.generateRequestId();
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
