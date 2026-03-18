import { Component } from '@angular/core';
import {
  getSharedMiniApp,
  MiniApp,
  appOpenWebview,
  appOpenStore,
  exit,
  openExternalLink,
  openMiniApp,
  requestMultipleUserDataPermission,
  checkMultipleUserDataPermission,
  requestPermissionWithCode,
  getMultipleUserData,
  checkPermissionWithCode,
  clearPermissionCache,
  requestCameraPermission,
  requestLocationPermission,
  requestPhotosPermission,
  requestVideosPermission,
  requestAudioPermission,
  requestRecordAudioPermission,
  requestContactsPermission,
  requestDocumentPermission,
  requestPhoneCallPermission,
  requestPaymentPermission,
  requestLoginPermission,
  requestLocalAuthenticationPermission,
  checkCameraPermission,
  checkLocationPermission,
  checkPhotosPermission,
  checkVideosPermission,
  checkAudioPermission,
  checkRecordAudioPermission,
  checkContactsPermission,
  checkDocumentPermission,
  checkPhoneCallPermission,
  checkPaymentPermission,
  checkLoginPermission,
  checkLocalAuthenticationPermission,
  getLocalAuthenticationStatus,
  getContacts,
  pickFile,
  getLocation,
  setBackgroundStatusBarColor,
  setNavigationBarColor,
  updateStatusBarAppearance,
  updateNavigationBarAppearance,
  shareTextContent,
  storageGet,
  storageSet,
  storageRemove,
  storageClear,
  storageInfo,
  uiShowToast,
  uiHideToast,
  uiShowLoading,
  uiHideLoading,
  uiShowDialog,
  uiShowActionSheet,
  navigatorPush,
  navigatorPop,
  navigatorSwitchTab,
  navigatorRedirect,
  navigatorReLaunch,
} from '@webview-sdk/core';

interface EventInfo {
  name: string;
  event: string;
  desc: string;
  hasParams: boolean;
  defaultData: string | null;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  logs: string[] = [];
  inputValue = '';
  popup: EventInfo | null = null;
  private app: MiniApp;

  // Event registry
  private fns: Record<string, () => Promise<any>> = {};

  constructor() {
    this.app = getSharedMiniApp({ debug: true });
    this.app.ready();
    this.registerFns();
  }

  get formatLog() {
    return this.logs.length ? this.logs.join('\n') : 'No logs yet.'
  }

  private getInput(): any {
    if (!this.inputValue.trim()) return null;
    try { return JSON.parse(this.inputValue); } catch { return null; }
  }

  private getDefault(evt: EventInfo): any {
    if (!evt.defaultData) return null;
    try { return JSON.parse(evt.defaultData); } catch { return null; }
  }

  private registerFns(): void {
    this.fns['appOpenWebview'] = () => appOpenWebview(this.getInput() || {"data":{"url":"URL của webview cần mở","serviceName":"Tiêu đề hiển thị trên app bar","isPaymentConfirm":true,"resourceType":"HTML = mở trong webview, khác = mở brows","returnUrl":"URL trả về khi thành công/thất bại/timeo","cancelUrl":"URL trả về khi người dùng cancel"}});
    this.fns['appOpenStore'] = () => appOpenStore(this.getInput() || {"data":{"fallbackUrlAndroid":"URL android","fallbackUrlIos":"URL Ios"}});
    this.fns['exit'] = () => exit(this.getInput() || {"data":{"navigationAction":"Quay về trang chủ của host app; TH khác "}});
    this.fns['openExternalLink'] = () => openExternalLink(this.getInput() || {"data":{"uri":"Link Ngoài"}});
    this.fns['openMiniApp'] = () => openMiniApp(this.getInput() || {"data":{"route":{},"miniappKey":"Key của Mini App cần mở - ","additional":{},"launchConfig":{},"navStyle":{},"tracking":{}}});
    this.fns['requestMultipleUserDataPermission'] = () => requestMultipleUserDataPermission(this.getInput() || {"data":{"permissionCodes":["example1","example2"],"useSameReason":true}});
    this.fns['checkMultipleUserDataPermission'] = () => checkMultipleUserDataPermission(this.getInput() || {"data":{"permissionCodes":["example1","example2"]}});
    this.fns['requestPermissionWithCode'] = () => requestPermissionWithCode(this.getInput() || {"data":{"permissionCode":"mã quyền"}});
    this.fns['getMultipleUserData'] = () => getMultipleUserData(this.getInput() || {"data":{"dataNames":["example1","example2"]}});
    this.fns['checkPermissionWithCode'] = () => checkPermissionWithCode(this.getInput() || {"data":{"permissionCode":"Tham so 1"}});
    this.fns['clearPermissionCache'] = () => clearPermissionCache(this.getInput() || {"data":{}});
    this.fns['requestCameraPermission'] = () => requestCameraPermission();
    this.fns['requestLocationPermission'] = () => requestLocationPermission();
    this.fns['requestPhotosPermission'] = () => requestPhotosPermission();
    this.fns['requestVideosPermission'] = () => requestVideosPermission();
    this.fns['requestAudioPermission'] = () => requestAudioPermission();
    this.fns['requestRecordAudioPermission'] = () => requestRecordAudioPermission();
    this.fns['requestContactsPermission'] = () => requestContactsPermission();
    this.fns['requestDocumentPermission'] = () => requestDocumentPermission();
    this.fns['requestPhoneCallPermission'] = () => requestPhoneCallPermission();
    this.fns['requestPaymentPermission'] = () => requestPaymentPermission();
    this.fns['requestLoginPermission'] = () => requestLoginPermission();
    this.fns['requestLocalAuthenticationPermission'] = () => requestLocalAuthenticationPermission();
    this.fns['checkCameraPermission'] = () => checkCameraPermission();
    this.fns['checkLocationPermission'] = () => checkLocationPermission();
    this.fns['checkPhotosPermission'] = () => checkPhotosPermission();
    this.fns['checkVideosPermission'] = () => checkVideosPermission();
    this.fns['checkAudioPermission'] = () => checkAudioPermission();
    this.fns['checkRecordAudioPermission'] = () => checkRecordAudioPermission();
    this.fns['checkContactsPermission'] = () => checkContactsPermission();
    this.fns['checkDocumentPermission'] = () => checkDocumentPermission();
    this.fns['checkPhoneCallPermission'] = () => checkPhoneCallPermission();
    this.fns['checkPaymentPermission'] = () => checkPaymentPermission();
    this.fns['checkLoginPermission'] = () => checkLoginPermission();
    this.fns['checkLocalAuthenticationPermission'] = () => checkLocalAuthenticationPermission(this.getInput() || {"data":{"authOptionsParam":{}}});
    this.fns['getLocalAuthenticationStatus'] = () => getLocalAuthenticationStatus();
    this.fns['getContacts'] = () => getContacts(this.getInput() || {"data":{"filter":{},"pager":{}}});
    this.fns['pickFile'] = () => pickFile(this.getInput() || {"data":{"mimeType":["example1","example2"],"isCapture":true}});
    this.fns['getLocation'] = () => getLocation();
    this.fns['setBackgroundStatusBarColor'] = () => setBackgroundStatusBarColor(this.getInput() || {"data":{},"color":"example"});
    this.fns['setNavigationBarColor'] = () => setNavigationBarColor(this.getInput() || {"data":{},"color":"example"});
    this.fns['updateStatusBarAppearance'] = () => updateStatusBarAppearance(this.getInput() || {"data":{},"appearance":"example"});
    this.fns['updateNavigationBarAppearance'] = () => updateNavigationBarAppearance(this.getInput() || {"data":{},"appearance":"example"});
    this.fns['shareTextContent'] = () => shareTextContent(this.getInput() || {"data":{},"content":"example"});
    this.fns['storageGet'] = () => storageGet(this.getInput() || {"key":"example"});
    this.fns['storageSet'] = () => storageSet(this.getInput() || {"key":"example","data":"example"});
    this.fns['storageRemove'] = () => storageRemove(this.getInput() || {"key":"example"});
    this.fns['storageClear'] = () => storageClear();
    this.fns['storageInfo'] = () => storageInfo();
    this.fns['uiShowToast'] = () => uiShowToast(this.getInput() || {"title":"example","icon":"example","duration":1});
    this.fns['uiHideToast'] = () => uiHideToast();
    this.fns['uiShowLoading'] = () => uiShowLoading(this.getInput() || {"title":"example","mask":true});
    this.fns['uiHideLoading'] = () => uiHideLoading();
    this.fns['uiShowDialog'] = () => uiShowDialog(this.getInput() || {"title":"example","content":"example","confirmText":"example","cancelText":"example","showCancel":true});
    this.fns['uiShowActionSheet'] = () => uiShowActionSheet(this.getInput() || {"itemList":[]});
    this.fns['navigatorPush'] = () => navigatorPush(this.getInput() || {"url":"example","params":{}});
    this.fns['navigatorPop'] = () => navigatorPop(this.getInput() || {"delta":1});
    this.fns['navigatorSwitchTab'] = () => navigatorSwitchTab(this.getInput() || {"url":"example"});
    this.fns['navigatorRedirect'] = () => navigatorRedirect(this.getInput() || {"url":"example","params":{}});
    this.fns['navigatorReLaunch'] = () => navigatorReLaunch(this.getInput() || {"url":"example"});
    this.fns['invoke'] = () => this.app.invoke(this.getInput()?.event || 'GET_LOCATION', this.getInput());
  }

  // Event groups
  groups: { title: string; events: EventInfo[] }[] = [
    { title: 'Navigation', events: [
      { name: 'appOpenWebview', event: 'APP_OPEN_WEBVIEW', desc: 'Mở một WebView mới với URL và cấu hình tùy chỉnh.', hasParams: true, defaultData: '{"data":{"url":"URL của webview cần mở","serviceName":"Tiêu đề hiển thị trên app bar","isPaymentConfirm":true,"resourceType":"HTML = mở trong webview, khác = mở brows","returnUrl":"URL trả về khi thành công/thất bại/timeo","cancelUrl":"URL trả về khi người dùng cancel"}}' },
      { name: 'appOpenStore', event: 'APP_OPEN_STORE', desc: 'Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài.', hasParams: true, defaultData: '{"data":{"fallbackUrlAndroid":"URL android","fallbackUrlIos":"URL Ios"}}' },
      { name: 'exit', event: 'EXIT', desc: 'Đóng Mini App và điều hướng về màn hình khác.', hasParams: true, defaultData: '{"data":{"navigationAction":"Quay về trang chủ của host app; TH khác "}}' },
      { name: 'openExternalLink', event: 'OPEN_EXTERNAL_LINK', desc: 'Mở URL bằng browser mặc định của hệ thống.', hasParams: true, defaultData: '{"data":{"uri":"Link Ngoài"}}' },
      { name: 'openMiniApp', event: 'OPEN_MINI_APP', desc: 'Mở một Mini App khác từ Mini App hiện tại.', hasParams: true, defaultData: '{"data":{"route":{},"miniappKey":"Key của Mini App cần mở - ","additional":{},"launchConfig":{},"navStyle":{},"tracking":{}}}' }
    ] },
    { title: 'Request Permissions', events: [
      { name: 'requestMultipleUserDataPermission', event: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION', desc: 'Yêu cầu nhiều quyền user data cùng một lúc.', hasParams: true, defaultData: '{"data":{"permissionCodes":["example1","example2"],"useSameReason":true}}' },
      { name: 'requestPermissionWithCode', event: 'REQUEST_PERMISSION_WITH_CODE', desc: 'Yêu cầu quyền cụ thể theo permission code (cả SDK-level và device-level).', hasParams: true, defaultData: '{"data":{"permissionCode":"mã quyền"}}' },
      { name: 'requestCameraPermission', event: 'REQUEST_CAMERA_PERMISSION', desc: 'Yêu cầu mở camera', hasParams: false, defaultData: null },
      { name: 'requestLocationPermission', event: 'REQUEST_LOCATION_PERMISSION', desc: 'Yêu cầu vị trí', hasParams: false, defaultData: null },
      { name: 'requestPhotosPermission', event: 'REQUEST_PHOTOS_PERMISSION', desc: 'Yêu cầu truy cập ảnh trên thiết bị', hasParams: false, defaultData: null },
      { name: 'requestVideosPermission', event: 'REQUEST_VIDEOS_PERMISSION', desc: 'Yêu cầu truy cập video trên thiết bị', hasParams: false, defaultData: null },
      { name: 'requestAudioPermission', event: 'REQUEST_AUDIO_PERMISSION', desc: 'Yêu cầu truy cập audio trên thiết bị', hasParams: false, defaultData: null },
      { name: 'requestRecordAudioPermission', event: 'REQUEST_RECORD_AUDIO_PERMISSION', desc: 'Yêu cầu ghi âm trên thiết bị', hasParams: false, defaultData: null },
      { name: 'requestContactsPermission', event: 'REQUEST_CONTACTS_PERMISSION', desc: 'Yêu cầu truy cập danh bạ trên thiết bị', hasParams: false, defaultData: null },
      { name: 'requestDocumentPermission', event: 'REQUEST_DOCUMENT_PERMISSION', desc: 'Yêu cầu truy cập tài liệu trên thiết bị', hasParams: false, defaultData: null },
      { name: 'requestPhoneCallPermission', event: 'REQUEST_PHONE_CALL_PERMISSION', desc: 'Yêu cầu thực hiện cuộc gọi trên thiết bị', hasParams: false, defaultData: null },
      { name: 'requestPaymentPermission', event: 'REQUEST_PAYMENT_PERMISSION', desc: '', hasParams: false, defaultData: null },
      { name: 'requestLoginPermission', event: 'REQUEST_LOGIN_PERMISSION', desc: '', hasParams: false, defaultData: null },
      { name: 'requestLocalAuthenticationPermission', event: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION', desc: 'Yêu cầu xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: null }
    ] },
    { title: 'Check Permissions', events: [
      { name: 'checkMultipleUserDataPermission', event: 'CHECK_MULTIPLE_USER_DATA_PERMISSION', desc: 'Kiểm tra trạng thái nhiều quyền user data cùng lúc.', hasParams: true, defaultData: '{"data":{"permissionCodes":["example1","example2"]}}' },
      { name: 'checkPermissionWithCode', event: 'CHECK_PERMISSION_WITH_CODE', desc: 'Kiểm tra trạng thái quyền cụ thể.', hasParams: true, defaultData: '{"data":{"permissionCode":"Tham so 1"}}' },
      { name: 'checkCameraPermission', event: 'CHECK_CAMERA_PERMISSION', desc: 'Kiểm tra quyền camera', hasParams: false, defaultData: null },
      { name: 'checkLocationPermission', event: 'CHECK_LOCATION_PERMISSION', desc: 'Kiểm tra quyền vị trí', hasParams: false, defaultData: null },
      { name: 'checkPhotosPermission', event: 'CHECK_PHOTOS_PERMISSION', desc: 'Kiểm tra quyền truy cập ảnh', hasParams: false, defaultData: null },
      { name: 'checkVideosPermission', event: 'CHECK_VIDEOS_PERMISSION', desc: 'Kiểm tra quyền truy cập video', hasParams: false, defaultData: null },
      { name: 'checkAudioPermission', event: 'CHECK_AUDIO_PERMISSION', desc: 'Kiểm tra quyền truy cập file audio', hasParams: false, defaultData: null },
      { name: 'checkRecordAudioPermission', event: 'CHECK_RECORD_AUDIO_PERMISSION', desc: 'Kiểm tra quyền ghi âm trên thiết bị', hasParams: false, defaultData: null },
      { name: 'checkContactsPermission', event: 'CHECK_CONTACTS_PERMISSION', desc: 'Kiểm tra quyền truy cập danh bạ', hasParams: false, defaultData: null },
      { name: 'checkDocumentPermission', event: 'CHECK_DOCUMENT_PERMISSION', desc: 'Kiểm tra quyền truy cập file tài liệu', hasParams: false, defaultData: null },
      { name: 'checkPhoneCallPermission', event: 'CHECK_PHONE_CALL_PERMISSION', desc: 'Kiểm tra quyền gọi điện', hasParams: false, defaultData: null },
      { name: 'checkPaymentPermission', event: 'CHECK_PAYMENT_PERMISSION', desc: '', hasParams: false, defaultData: null },
      { name: 'checkLoginPermission', event: 'CHECK_LOGIN_PERMISSION', desc: '', hasParams: false, defaultData: null },
      { name: 'checkLocalAuthenticationPermission', event: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION', desc: 'kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).', hasParams: true, defaultData: '{"data":{"authOptionsParam":{}}}' }
    ] },
    { title: 'Data', events: [
      { name: 'getMultipleUserData', event: 'GET_MULTIPLE_USER_DATA', desc: 'Lấy nhiều trường dữ liệu người dùng từ host app.', hasParams: true, defaultData: '{"data":{"dataNames":["example1","example2"]}}' },
      { name: 'getLocalAuthenticationStatus', event: 'GET_LOCAL_AUTHENTICATION_STATUS', desc: ' lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: null },
      { name: 'getContacts', event: 'GET_CONTACTS', desc: 'Truy cập danh bạ', hasParams: true, defaultData: '{"data":{"filter":{},"pager":{}}}' },
      { name: 'getLocation', event: 'GET_LOCATION', desc: 'Lấy vị trí thiết bị', hasParams: false, defaultData: null }
    ] },
    { title: 'Other', events: [
      { name: 'clearPermissionCache', event: 'CLEAR_PERMISSION_CACHE', desc: 'Xóa tất cả quyền đã cache ở local.', hasParams: true, defaultData: '{"data":{}}' },
      { name: 'pickFile', event: 'PICK_FILE', desc: 'Mở file tài liệu', hasParams: true, defaultData: '{"data":{"mimeType":["example1","example2"],"isCapture":true}}' },
      { name: 'shareTextContent', event: 'SHARE_TEXT_CONTENT', desc: 'Mở dialog chia sẻ nội dung text.', hasParams: true, defaultData: '{"data":{},"content":"example"}' }
    ] },
    { title: 'UI Customization', events: [
      { name: 'setBackgroundStatusBarColor', event: 'SET_BACKGROUND_STATUS_BAR_COLOR', desc: 'Thay đổi màu nền status bar.', hasParams: true, defaultData: '{"data":{},"color":"example"}' },
      { name: 'setNavigationBarColor', event: 'SET_NAVIGATION_BAR_COLOR', desc: 'Thay đổi màu nền navigation bar.', hasParams: true, defaultData: '{"data":{},"color":"example"}' },
      { name: 'updateStatusBarAppearance', event: 'UPDATE_STATUS_BAR_APPEARANCE', desc: 'Chuyển đổi status bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{},"appearance":"example"}' },
      { name: 'updateNavigationBarAppearance', event: 'UPDATE_NAVIGATION_BAR_APPEARANCE', desc: 'Chuyển đổi navigation bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{},"appearance":"example"}' }
    ] },
    { title: 'Storage', events: [
      { name: 'storageGet', event: 'STORAGE_GET', desc: 'Lấy dữ liệu từ storage theo key.', hasParams: true, defaultData: '{"key":"example"}' },
      { name: 'storageSet', event: 'STORAGE_SET', desc: 'Lưu dữ liệu vào storage theo key.', hasParams: true, defaultData: '{"key":"example","data":"example"}' },
      { name: 'storageRemove', event: 'STORAGE_REMOVE', desc: 'Xóa dữ liệu từ storage theo key.', hasParams: true, defaultData: '{"key":"example"}' },
      { name: 'storageClear', event: 'STORAGE_CLEAR', desc: 'Xóa toàn bộ dữ liệu trong storage.', hasParams: false, defaultData: null },
      { name: 'storageInfo', event: 'STORAGE_INFO', desc: 'Lấy thông tin dung lượng storage.', hasParams: false, defaultData: null }
    ] },
    { title: 'UI', events: [
      { name: 'uiShowToast', event: 'UI_SHOW_TOAST', desc: 'Hiển thị toast notification.', hasParams: true, defaultData: '{"title":"example","icon":"example","duration":1}' },
      { name: 'uiHideToast', event: 'UI_HIDE_TOAST', desc: 'Ẩn toast hiện tại.', hasParams: false, defaultData: null },
      { name: 'uiShowLoading', event: 'UI_SHOW_LOADING', desc: 'Hiển thị loading indicator.', hasParams: true, defaultData: '{"title":"example","mask":true}' },
      { name: 'uiHideLoading', event: 'UI_HIDE_LOADING', desc: 'Ẩn loading indicator.', hasParams: false, defaultData: null },
      { name: 'uiShowDialog', event: 'UI_SHOW_DIALOG', desc: 'Hiển thị dialog xác nhận.', hasParams: true, defaultData: '{"title":"example","content":"example","confirmText":"example","cancelText":"example","showCancel":true}' },
      { name: 'uiShowActionSheet', event: 'UI_SHOW_ACTION_SHEET', desc: 'Hiển thị action sheet.', hasParams: true, defaultData: '{"itemList":[]}' }
    ] },
    { title: 'Navigator', events: [
      { name: 'navigatorPush', event: 'NAVIGATOR_PUSH', desc: 'Mở trang mới (thêm vào navigation stack).', hasParams: true, defaultData: '{"url":"example","params":{}}' },
      { name: 'navigatorPop', event: 'NAVIGATOR_POP', desc: 'Quay lại trang trước.', hasParams: true, defaultData: '{"delta":1}' },
      { name: 'navigatorSwitchTab', event: 'NAVIGATOR_SWITCH_TAB', desc: 'Chuyển sang tab khác.', hasParams: true, defaultData: '{"url":"example"}' },
      { name: 'navigatorRedirect', event: 'NAVIGATOR_REDIRECT', desc: 'Redirect (thay thế trang hiện tại).', hasParams: true, defaultData: '{"url":"example","params":{}}' },
      { name: 'navigatorReLaunch', event: 'NAVIGATOR_RE_LAUNCH', desc: 'Quay về trang chủ và xóa navigation stack.', hasParams: true, defaultData: '{"url":"example"}' }
    ] }
  ];

  log(msg: string, data?: any): void {
    const entry = data ? `${msg}: ${JSON.stringify(data, null, 2)}` : msg;
    this.logs.unshift(`[${new Date().toLocaleTimeString()}] ${entry}`);
  }

  async runEvent(evt: EventInfo): Promise<void> {
    this.popup = null;
    const fn = this.fns[evt.name];
    if (!fn) return;
    try {
      this.log(`> ${evt.name}...`);
      const res = await fn();
      this.log(`OK ${evt.name}`, res);
    } catch (err) {
      this.log(`ERR ${evt.name}`, err);
    }
  }

  fillInput(evt: EventInfo): void {
    if (evt.defaultData) {
      this.inputValue = JSON.stringify(JSON.parse(evt.defaultData), null, 2);
    }
    this.popup = null;
  }

  showPopup(evt: EventInfo): void {
    this.popup = this.popup?.name === evt.name ? null : evt;
  }
}
