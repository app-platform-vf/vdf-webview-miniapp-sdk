import type { ToastOptions, LoadingOptions, DialogOptions, DialogResult, ActionSheetOptions, ActionSheetResult } from '../types';

type InvokeFn = (api: string, data?: any) => Promise<any>;

/**
 * API giao dien native
 * Toast, Loading, Dialog, ActionSheet
 */
export class UIAPI {
  constructor(private invoke: InvokeFn) {}

  /** Hien thi toast */
  async showToast(options: ToastOptions): Promise<void> {
    return this.invoke('ui.showToast', options);
  }

  /** An toast */
  async hideToast(): Promise<void> {
    return this.invoke('ui.hideToast');
  }

  /** Hien thi loading */
  async showLoading(options?: LoadingOptions): Promise<void> {
    return this.invoke('ui.showLoading', options);
  }

  /** An loading */
  async hideLoading(): Promise<void> {
    return this.invoke('ui.hideLoading');
  }

  /** Hien thi dialog xac nhan */
  async showDialog(options: DialogOptions): Promise<DialogResult> {
    return this.invoke('ui.showDialog', options);
  }

  /** Hien thi action sheet */
  async showActionSheet(options: ActionSheetOptions): Promise<ActionSheetResult> {
    return this.invoke('ui.showActionSheet', options);
  }
}
