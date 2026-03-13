import { Component } from '@angular/core';
import {
  getSharedMiniApp,
  MiniApp,
  getLocation,
  getContacts,
  getMultipleUserData,
  getLocalAuthenticationStatus,
  requestCameraPermission,
  requestLocationPermission,
  requestPhotosPermission,
  requestContactsPermission,
  requestLoginPermission,
  requestPaymentPermission,
  checkCameraPermission,
  checkLocationPermission,
  checkLoginPermission,
  appOpenWebview,
  openExternalLink,
  exit,
  shareTextContent,
  pickFile,
  setBackgroundStatusBarColor,
  setNavigationBarColor,
  updateStatusBarAppearance,
  updateNavigationBarAppearance,
  clearPermissionCache,
} from '@webview-sdk/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  logs: string[] = [];
  inputValue: string = '';

  private app: MiniApp;

  constructor() {
    this.app = getSharedMiniApp({
      appId: 'demo-angular',
      debug: true,
      timeout: 10000,
      token: 'demo-token',
    });
    this.app.useMiddleware(async (message: any, next: any) => {
      console.log('Sending:', message);
      await next();
      console.log('Sent:', message);
    });
  }

  log(msg: string, data?: any): void {
    const entry = data ? `${msg}: ${JSON.stringify(data)}` : msg;
    this.logs.unshift(`[${new Date().toLocaleTimeString()}] ${entry}`);
  }

  async run(label: string, fn: () => Promise<any>): Promise<void> {
    try {
      this.log(`> ${label}...`);
      const res = await fn();
      this.log(`OK ${label}`, res);
    } catch (err) {
      this.log(`ERR ${label}: ${(err as any).message}`);
    }
  }

  get inputValueDisplay(): any {
    return this.inputValue ? JSON.parse(this.inputValue) : false;
  }

  onReady(): void { this.app.ready(); this.log('SDK ready()'); }

  // Storage
  storageSet = () => this.app.storage.set('demo_key', this.inputValueDisplay || { hello: 'world', ts: Date.now() });
  storageGet = () => this.app.storage.get('demo_key');
  storageRemove = () => this.app.storage.remove('demo_key');
  storageClear = () => this.app.storage.clear();
  storageInfo = () => this.app.storage.info();

  // UI
  showToast = () => this.app.ui.showToast({ title: 'Hello from Angular!' });
  showLoading = () => this.app.ui.showLoading({ title: 'Loading...' });
  hideLoading = () => this.app.ui.hideLoading();
  showDialog = () => this.app.ui.showDialog({ title: 'Confirm', content: 'Are you sure?', showCancel: true });
  showActionSheet = () => this.app.ui.showActionSheet({ itemList: ['Option A', 'Option B', 'Option C'] });

  // Navigator
  navPush = () => this.app.navigator.push('/detail', { id: 1 });
  navPop = () => this.app.navigator.pop();
  navRedirect = () => this.app.navigator.redirect('/home');
  navSwitchTab = () => this.app.navigator.switchTab('/tab2');

  // Generated APIs (type-safe)
  fnGetLocation = () => getLocation();
  fnGetContacts = () => getContacts();
  fnGetUserData = () => getMultipleUserData(this.inputValueDisplay || { data: { dataNames: ['age', 'userName', 'fullName'] } });
  fnGetLocalAuth = () => getLocalAuthenticationStatus();

  fnReqCamera = () => requestCameraPermission();
  fnReqLocation = () => requestLocationPermission();
  fnReqPhotos = () => requestPhotosPermission();
  fnReqContacts = () => requestContactsPermission();
  fnReqLogin = () => requestLoginPermission();
  fnReqPayment = () => requestPaymentPermission();

  fnChkCamera = () => checkCameraPermission();
  fnChkLocation = () => checkLocationPermission();
  fnChkLogin = () => checkLoginPermission();
  fnClearCache = () => clearPermissionCache({} as any);

  fnOpenWebview = () => appOpenWebview(this.inputValueDisplay || { data: { url: 'https://example.com', serviceName: 'Demo' } });
  fnOpenExtLink = () => openExternalLink(this.inputValueDisplay || { data: { uri: 'https://example.com' } });
  fnExit = () => exit(this.inputValueDisplay || { data: { navigationAction: 'RETURN_HOME_APP' } });

  fnStatusBarColor = () => setBackgroundStatusBarColor(this.inputValueDisplay || { color: '#FF5722' });
  fnNavBarColor = () => setNavigationBarColor(this.inputValueDisplay || { color: '#2196F3' });
  fnStatusBarDark = () => updateStatusBarAppearance(this.inputValueDisplay || { appearance: 'DARK' });
  fnNavBarLight = () => updateNavigationBarAppearance(this.inputValueDisplay || { appearance: 'LIGHT' });

  fnShareText = () => shareTextContent(this.inputValueDisplay || { content: 'Hello from MiniApp SDK!' });
  fnPickFile = () => pickFile(this.inputValueDisplay || { data: { mimeType: ['image/*'] } });
}
