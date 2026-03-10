/**
 * Hang doi message truoc khi SDK ready
 * Tat ca message gui truoc ready() se duoc dem va xa khi ready
 */
export class MessageQueue {
  private queue: Array<() => void> = [];
  private isReady = false;

  /** Them ham vao hang doi. Neu da ready thi thuc thi ngay */
  push(fn: () => void): void {
    if (this.isReady) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  /** Danh dau ready va xa hang doi */
  flush(): void {
    this.isReady = true;
    const pending = this.queue;
    this.queue = [];
    pending.forEach(fn => fn());
  }

  /** Kiem tra trang thai ready */
  get ready(): boolean {
    return this.isReady;
  }
}
