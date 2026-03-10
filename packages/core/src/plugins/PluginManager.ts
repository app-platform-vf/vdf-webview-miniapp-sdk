import { MiniAppPlugin } from '../types';

/**
 * Quan ly va cai dat plugin
 * Moi plugin phai co name va install(app)
 */
export class PluginManager {
  private installed = new Map<string, MiniAppPlugin>();

  /** Cai dat plugin. Tranh cai trung lap */
  install(plugin: MiniAppPlugin, app: any): void {
    if (this.installed.has(plugin.name)) return;
    plugin.install(app);
    this.installed.set(plugin.name, plugin);
  }

  /** Kiem tra plugin da cai chua */
  has(name: string): boolean {
    return this.installed.has(name);
  }
}
