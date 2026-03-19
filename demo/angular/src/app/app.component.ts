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
  checkPermissionWithCode,
  getMultipleUserData,
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
  executeLocalAuthentication,
  getLocalAuthenticationStatus,
  getContacts,
  pickFile,
  saveStringValue,
  saveBooleanValue,
  saveIntegerValue,
  saveLongValue,
  saveFloatValue,
  getStringValue,
  getBooleanValue,
  getIntegerValue,
  getLongValue,
  getFloatValue,
  clearStorage,
  getLocation,
  setBackgroundStatusBarColor,
  setNavigationBarColor,
  updateStatusBarAppearance,
  updateNavigationBarAppearance,
  shareTextContent,
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
    this.fns['openMiniApp'] = () => openMiniApp(this.getInput() || {"data":{"route":{},"miniappKey":"Key của Mini App cần mở ","additional":{},"launchConfig":{},"navStyle":{},"tracking":{}}});
    this.fns['requestMultipleUserDataPermission'] = () => requestMultipleUserDataPermission(this.getInput() || {"data":{"permissionCodes":["example1","example2"],"useSameReason":true}});
    this.fns['checkMultipleUserDataPermission'] = () => checkMultipleUserDataPermission(this.getInput() || {"data":{"permissionCodes":["example1","example2"]}});
    this.fns['requestPermissionWithCode'] = () => requestPermissionWithCode(this.getInput() || {"data":{"permissionCode":"mã quyền"}});
    this.fns['checkPermissionWithCode'] = () => checkPermissionWithCode(this.getInput() || {"data":{"permissionCode":"Tham so 1"}});
    this.fns['getMultipleUserData'] = () => getMultipleUserData(this.getInput() || {"data":{"dataNames":["example1","example2"]}});
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
    this.fns['checkLocalAuthenticationPermission'] = () => checkLocalAuthenticationPermission();
    this.fns['executeLocalAuthentication'] = () => executeLocalAuthentication(this.getInput() || {"data":{"authOptionsParam":{}}});
    this.fns['getLocalAuthenticationStatus'] = () => getLocalAuthenticationStatus();
    this.fns['getContacts'] = () => getContacts(this.getInput() || {"data":{"filter":{},"pager":{}}});
    this.fns['pickFile'] = () => pickFile(this.getInput() || {"data":{"mimeType":["example1","example2"],"isCapture":true,"source":"IOS only: PhotoLibrary hoặc Folder"}});
    this.fns['saveStringValue'] = () => saveStringValue(this.getInput() || {"data":{"key":"Key lưu","value":"Giá trị lưu"}});
    this.fns['saveBooleanValue'] = () => saveBooleanValue(this.getInput() || {"data":{"key":"Key lưu","value":true}});
    this.fns['saveIntegerValue'] = () => saveIntegerValue(this.getInput() || {"data":{"key":"Key lưu","value":1}});
    this.fns['saveLongValue'] = () => saveLongValue(this.getInput() || {"data":{"key":"Key lưu","value":1}});
    this.fns['saveFloatValue'] = () => saveFloatValue(this.getInput() || {"data":{"key":"Key lưu","value":"example"}});
    this.fns['getStringValue'] = () => getStringValue(this.getInput() || {"data":{"key":"Key lưu","defaultValue":"Giá trị mặc định"}});
    this.fns['getBooleanValue'] = () => getBooleanValue(this.getInput() || {"data":{"key":"Key lưu","defaultValue":true}});
    this.fns['getIntegerValue'] = () => getIntegerValue(this.getInput() || {"data":{"key":"Key lưu","defaultValue":1}});
    this.fns['getLongValue'] = () => getLongValue(this.getInput() || {"data":{"key":"Key lưu","defaultValue":1}});
    this.fns['getFloatValue'] = () => getFloatValue(this.getInput() || {"data":{"key":"Key lưu","defaultValue":"example"}});
    this.fns['clearStorage'] = () => clearStorage();
    this.fns['getLocation'] = () => getLocation();
    this.fns['setBackgroundStatusBarColor'] = () => setBackgroundStatusBarColor(this.getInput() || {"data":{"color":"Mã màu"}});
    this.fns['setNavigationBarColor'] = () => setNavigationBarColor(this.getInput() || {"data":{"color":"Mã màu"}});
    this.fns['updateStatusBarAppearance'] = () => updateStatusBarAppearance(this.getInput() || {"data":{"appearance":"LIGHT hoặc DARK - Appearance mode cho st"}});
    this.fns['updateNavigationBarAppearance'] = () => updateNavigationBarAppearance(this.getInput() || {"data":{"appearance":"LIGHT hoặc DARK - Appearance mode cho st"}});
    this.fns['shareTextContent'] = () => shareTextContent(this.getInput() || {"data":{"content":"Text nội dung"}});
    this.fns['invoke'] = () => this.app.invoke(this.getInput()?.event || 'GET_LOCATION', this.getInput());
  }

  // Event groups
  groups: { title: string; events: EventInfo[] }[] = [
    { title: 'Routing', events: [
      { name: 'appOpenWebview', event: 'APP_OPEN_WEBVIEW', desc: 'Mở một WebView mới với URL và cấu hình tùy chỉnh.', hasParams: true, defaultData: '{"data":{"url":"URL của webview cần mở","serviceName":"Tiêu đề hiển thị trên app bar","isPaymentConfirm":true,"resourceType":"HTML = mở trong webview, khác = mở brows","returnUrl":"URL trả về khi thành công/thất bại/timeo","cancelUrl":"URL trả về khi người dùng cancel"}}' },
      { name: 'appOpenStore', event: 'APP_OPEN_STORE', desc: 'Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài.', hasParams: true, defaultData: '{"data":{"fallbackUrlAndroid":"URL android","fallbackUrlIos":"URL Ios"}}' },
      { name: 'exit', event: 'EXIT', desc: 'Đóng Mini App và điều hướng về màn hình khác.', hasParams: true, defaultData: '{"data":{"navigationAction":"Quay về trang chủ của host app; TH khác "}}' },
      { name: 'openExternalLink', event: 'OPEN_EXTERNAL_LINK', desc: 'Mở URL bằng browser mặc định của hệ thống.', hasParams: true, defaultData: '{"data":{"uri":"Link Ngoài"}}' },
      { name: 'openMiniApp', event: 'OPEN_MINI_APP', desc: 'Mở một Mini App khác từ Mini App hiện tại.', hasParams: true, defaultData: '{"data":{"route":{},"miniappKey":"Key của Mini App cần mở ","additional":{},"launchConfig":{},"navStyle":{},"tracking":{}}}' }
    ] },
    { title: 'UserData Permission', events: [
      { name: 'requestMultipleUserDataPermission', event: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION', desc: 'Yêu cầu nhiều quyền user data cùng một lúc.', hasParams: true, defaultData: '{"data":{"permissionCodes":["example1","example2"],"useSameReason":true}}' },
      { name: 'checkMultipleUserDataPermission', event: 'CHECK_MULTIPLE_USER_DATA_PERMISSION', desc: 'Kiểm tra trạng thái nhiều quyền user data cùng lúc.', hasParams: true, defaultData: '{"data":{"permissionCodes":["example1","example2"]}}' }
    ] },
    { title: 'Device Request Permission', events: [
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
      { name: 'requestLocalAuthenticationPermission', event: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION', desc: 'Yêu cầu xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: null },
      { name: 'executeLocalAuthentication', event: 'EXECUTE_LOCAL_AUTHENTICATION', desc: 'Thực hiện xác thực sinh trắc học (vân tay, Face ID).', hasParams: true, defaultData: '{"data":{"authOptionsParam":{}}}' }
    ] },
    { title: 'Device Check Permission', events: [
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
      { name: 'checkLocalAuthenticationPermission', event: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION', desc: 'kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: null }
    ] },
    { title: 'Other event', events: [
      { name: 'getMultipleUserData', event: 'GET_MULTIPLE_USER_DATA', desc: 'Lấy nhiều trường dữ liệu người dùng từ host app.', hasParams: true, defaultData: '{"data":{"dataNames":["example1","example2"]}}' },
      { name: 'clearPermissionCache', event: 'CLEAR_PERMISSION_CACHE', desc: 'Xóa tất cả quyền đã cache ở local.', hasParams: true, defaultData: '{"data":{}}' },
      { name: 'getLocalAuthenticationStatus', event: 'GET_LOCAL_AUTHENTICATION_STATUS', desc: ' lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: null },
      { name: 'getContacts', event: 'GET_CONTACTS', desc: 'Lấy danh sách contacts từ danh bạ hệ thống. ', hasParams: true, defaultData: '{"data":{"filter":{},"pager":{}}}' },
      { name: 'pickFile', event: 'PICK_FILE', desc: 'Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng:', hasParams: true, defaultData: '{"data":{"mimeType":["example1","example2"],"isCapture":true,"source":"IOS only: PhotoLibrary hoặc Folder"}}' },
      { name: 'shareTextContent', event: 'SHARE_TEXT_CONTENT', desc: 'Mở dialog chia sẻ nội dung text.', hasParams: true, defaultData: '{"data":{"content":"Text nội dung"}}' }
    ] },
    { title: 'Storage', events: [
      { name: 'saveStringValue', event: 'SAVE_STRING_VALUE', desc: 'Lưu giá trị kiểu string.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","value":"Giá trị lưu"}}' },
      { name: 'saveBooleanValue', event: 'SAVE_BOOLEAN_VALUE', desc: 'Lưu giá trị kiểu boolean.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","value":true}}' },
      { name: 'saveIntegerValue', event: 'SAVE_INTEGER_VALUE', desc: 'Lưu giá trị kiểu int.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","value":1}}' },
      { name: 'saveLongValue', event: 'SAVE_LONG_VALUE', desc: 'Lưu giá trị kiểu long.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","value":1}}' },
      { name: 'saveFloatValue', event: 'SAVE_FLOAT_VALUE', desc: 'Lưu giá trị kiểu float.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","value":"example"}}' },
      { name: 'getStringValue', event: 'GET_STRING_VALUE', desc: 'Lấy giá trị kiểu string.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","defaultValue":"Giá trị mặc định"}}' },
      { name: 'getBooleanValue', event: 'GET_BOOLEAN_VALUE', desc: 'Lấy giá trị kiểu boolean.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","defaultValue":true}}' },
      { name: 'getIntegerValue', event: 'GET_INTEGER_VALUE', desc: 'Lấy giá trị kiểu int.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","defaultValue":1}}' },
      { name: 'getLongValue', event: 'GET_LONG_VALUE', desc: 'Lấy giá trị kiểu long.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","defaultValue":1}}' },
      { name: 'getFloatValue', event: 'GET_FLOAT_VALUE', desc: 'Lấy giá trị kiểu float.', hasParams: true, defaultData: '{"data":{"key":"Key lưu","defaultValue":"example"}}' },
      { name: 'clearStorage', event: 'CLEAR_STORAGE', desc: 'Lấy giá trị kiểu float.', hasParams: false, defaultData: null }
    ] },
    { title: 'Location', events: [
      { name: 'getLocation', event: 'GET_LOCATION', desc: 'Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.', hasParams: false, defaultData: null }
    ] },
    { title: 'UI', events: [
      { name: 'setBackgroundStatusBarColor', event: 'SET_BACKGROUND_STATUS_BAR_COLOR', desc: 'Thay đổi màu nền status bar.', hasParams: true, defaultData: '{"data":{"color":"Mã màu"}}' },
      { name: 'setNavigationBarColor', event: 'SET_NAVIGATION_BAR_COLOR', desc: 'Thay đổi màu nền navigation bar.', hasParams: true, defaultData: '{"data":{"color":"Mã màu"}}' },
      { name: 'updateStatusBarAppearance', event: 'UPDATE_STATUS_BAR_APPEARANCE', desc: 'Chuyển đổi status bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{"appearance":"LIGHT hoặc DARK - Appearance mode cho st"}}' },
      { name: 'updateNavigationBarAppearance', event: 'UPDATE_NAVIGATION_BAR_APPEARANCE', desc: 'Chuyển đổi navigation bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{"appearance":"LIGHT hoặc DARK - Appearance mode cho st"}}' }
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
