/** Thu lai ham async toi da retries lan, moi lan cach delay ms */
export function retry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const attempt = (remaining: number): void => {
      fn().then(resolve).catch((err) => {
        if (remaining === 0) {
          reject(err);
        } else {
          setTimeout(() => attempt(remaining - 1), delay);
        }
      });
    };
    attempt(retries);
  });
}
