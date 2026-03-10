/**
 * Logger toan cuc cho MiniApp SDK
 * Mac dinh tat, bat bang Logger.enabled = true
 */
export class Logger {
  static enabled = false;

  static log(...args: any[]): void {
    if (Logger.enabled) {
      console.log('[MiniApp]', ...args);
    }
  }

  static warn(...args: any[]): void {
    if (Logger.enabled) {
      console.warn('[MiniApp]', ...args);
    }
  }

  static error(...args: any[]): void {
    console.error('[MiniApp]', ...args);
  }
}
