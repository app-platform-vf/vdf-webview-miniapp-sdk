import { BridgeMessage, MiddlewareFn } from '../types';

/**
 * Pipeline middleware kieu Koa
 * Moi middleware nhan (message, next) va co the thay doi message
 */
export class MiddlewareManager {
  private middlewares: MiddlewareFn[] = [];

  /** Them middleware vao pipeline */
  use(mw: MiddlewareFn): void {
    this.middlewares.push(mw);
  }

  /** Chay message qua pipeline, goi done() khi ket thuc */
  async run(message: BridgeMessage, done: () => void): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      const mw = this.middlewares[index++];
      if (mw) {
        await mw(message, next);
      } else {
        done();
      }
    };

    await next();
  }
}
