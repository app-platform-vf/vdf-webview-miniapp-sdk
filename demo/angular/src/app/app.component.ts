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
    this.fns['appOpenWebview'] = () => appOpenWebview(this.getInput() || {"data":{"url":"https://example.com","serviceName":"Tên dịch vụ","isPaymentConfirm":false,"resourceType":"HTML","returnUrl":"https://example.com/return","cancelUrl":"https://example.com/cancel"}});
    this.fns['appOpenStore'] = () => appOpenStore(this.getInput() || {"data":{"fallbackUrlAndroid":"market://details?id=com.example.app","fallbackUrlIos":"itms-apps://itunes.apple.com/app/id123456789"}});
    this.fns['exit'] = () => exit(this.getInput() || {"data":{"navigationAction":"RETURN_HOME_APP"}});
    this.fns['openExternalLink'] = () => openExternalLink(this.getInput() || {"data":{"uri":"https://google.com"}});
    this.fns['openMiniApp'] = () => openMiniApp(this.getInput() || {"data":{"route":{"screenName":"home"},"miniappKey":"01K5FY191HP42SMMJXHWG545ZZ","additional":{"param1":"value1","param2":"value2"},"launchConfig":{"mode":"present"},"navStyle":{"color":"#FF0000","hidden":"false"},"tracking":{"campaign":"promotion","utmSource":"miniapp"}}});
    this.fns['requestMultipleUserDataPermission'] = () => requestMultipleUserDataPermission(this.getInput() || {"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"],"useSameReason":true}});
    this.fns['checkMultipleUserDataPermission'] = () => checkMultipleUserDataPermission(this.getInput() || {"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"]}});
    this.fns['requestPermissionWithCode'] = () => requestPermissionWithCode(this.getInput() || {"data":{"permissionCode":"USER_AGE_PERMISSION"}});
    this.fns['checkPermissionWithCode'] = () => checkPermissionWithCode(this.getInput() || {"data":{"permissionCode":"USER_AGE_PERMISSION"}});
    this.fns['getMultipleUserData'] = () => getMultipleUserData(this.getInput() || {"data":{"dataNames":["age","userName","fullName","phone","email","avatar"]}});
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
    this.fns['executeLocalAuthentication'] = () => executeLocalAuthentication(this.getInput() || {"data":{"authOptionsParam":{"sensitiveTransaction":true,"authClassification":["WEAK","STRONG","DEVICE"],"sticky":false,"isShowErrorDialog":true}}});
    this.fns['getLocalAuthenticationStatus'] = () => getLocalAuthenticationStatus();
    this.fns['getContacts'] = () => getContacts(this.getInput() || {"data":{"filter":{"contactName":"John"},"pager":{"pageNumber":1,"limitRow":100}}});
    this.fns['pickFile'] = () => pickFile(this.getInput() || {"data":{"mimeType":["image/*","video/*"],"isCapture":true,"source":"PhotoLibrary"}});
    this.fns['saveStringValue'] = () => saveStringValue(this.getInput() || {"data":{"key":"user_preference","value":"dark_mode"}});
    this.fns['saveBooleanValue'] = () => saveBooleanValue(this.getInput() || {"data":{"key":"notifications_enabled","value":true}});
    this.fns['saveIntegerValue'] = () => saveIntegerValue(this.getInput() || {"data":{"key":"login_count","value":5}});
    this.fns['saveLongValue'] = () => saveLongValue(this.getInput() || {"data":{"key":"last_sync_timestamp","value":1234567890}});
    this.fns['saveFloatValue'] = () => saveFloatValue(this.getInput() || {"data":{"key":"rating","value":4.5}});
    this.fns['getStringValue'] = () => getStringValue(this.getInput() || {"data":{"key":"user_preference","defaultValue":"light_mode"}});
    this.fns['getBooleanValue'] = () => getBooleanValue(this.getInput() || {"data":{"key":"notifications_enabled","defaultValue":false}});
    this.fns['getIntegerValue'] = () => getIntegerValue(this.getInput() || {"data":{"key":"...","defaultValue":0}});
    this.fns['getLongValue'] = () => getLongValue(this.getInput() || {"data":{"key":"...","defaultValue":0}});
    this.fns['getFloatValue'] = () => getFloatValue(this.getInput() || {"data":{"key":"...","defaultValue":"..."}});
    this.fns['clearStorage'] = () => clearStorage();
    this.fns['getLocation'] = () => getLocation();
    this.fns['setBackgroundStatusBarColor'] = () => setBackgroundStatusBarColor(this.getInput() || {"data":{"color":"#FF5722"}});
    this.fns['setNavigationBarColor'] = () => setNavigationBarColor(this.getInput() || {"data":{"color":"#2196F3"}});
    this.fns['updateStatusBarAppearance'] = () => updateStatusBarAppearance(this.getInput() || {"data":{"appearance":"DARK"}});
    this.fns['updateNavigationBarAppearance'] = () => updateNavigationBarAppearance(this.getInput() || {"data":{"appearance":"LIGHT "}});
    this.fns['shareTextContent'] = () => shareTextContent(this.getInput() || {"data":{"content":"Check out this amazing product!"}});
    this.fns['invoke'] = () => this.app.invoke(this.getInput()?.event || 'GET_LOCATION', this.getInput());
  }

  // Event groups
  groups: { title: string; events: EventInfo[] }[] = [
    { title: 'Routing', events: [
      { name: 'appOpenWebview', event: 'APP_OPEN_WEBVIEW', desc: 'Mở một WebView mới với URL và cấu hình tùy chỉnh.', hasParams: true, defaultData: '{"data":{"url":"https://example.com","serviceName":"Tên dịch vụ","isPaymentConfirm":false,"resourceType":"HTML","returnUrl":"https://example.com/return","cancelUrl":"https://example.com/cancel"}}' },
      { name: 'appOpenStore', event: 'APP_OPEN_STORE', desc: 'Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài.', hasParams: true, defaultData: '{"data":{"fallbackUrlAndroid":"market://details?id=com.example.app","fallbackUrlIos":"itms-apps://itunes.apple.com/app/id123456789"}}' },
      { name: 'exit', event: 'EXIT', desc: 'Đóng Mini App và điều hướng về màn hình khác.', hasParams: true, defaultData: '{"data":{"navigationAction":"RETURN_HOME_APP"}}' },
      { name: 'openExternalLink', event: 'OPEN_EXTERNAL_LINK', desc: 'Mở URL bằng browser mặc định của hệ thống.', hasParams: true, defaultData: '{"data":{"uri":"https://google.com"}}' },
      { name: 'openMiniApp', event: 'OPEN_MINI_APP', desc: 'Mở một Mini App khác từ Mini App hiện tại.', hasParams: true, defaultData: '{"data":{"route":{"screenName":"home"},"miniappKey":"01K5FY191HP42SMMJXHWG545ZZ","additional":{"param1":"value1","param2":"value2"},"launchConfig":{"mode":"present"},"navStyle":{"color":"#FF0000","hidden":"false"},"tracking":{"campaign":"promotion","utmSource":"miniapp"}}}' }
    ] },
    { title: 'UserData Permission', events: [
      { name: 'requestMultipleUserDataPermission', event: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION', desc: 'Yêu cầu nhiều quyền user data cùng một lúc.', hasParams: true, defaultData: '{"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"],"useSameReason":true}}' },
      { name: 'checkMultipleUserDataPermission', event: 'CHECK_MULTIPLE_USER_DATA_PERMISSION', desc: 'Kiểm tra trạng thái nhiều quyền user data cùng lúc.', hasParams: true, defaultData: '{"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"]}}' }
    ] },
    { title: 'Device Request Permission', events: [
      { name: 'requestPermissionWithCode', event: 'REQUEST_PERMISSION_WITH_CODE', desc: 'Yêu cầu quyền cụ thể theo permission code (cả SDK-level và device-level).', hasParams: true, defaultData: '{"data":{"permissionCode":"USER_AGE_PERMISSION"}}' },
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
      { name: 'executeLocalAuthentication', event: 'EXECUTE_LOCAL_AUTHENTICATION', desc: 'Thực hiện xác thực sinh trắc học (vân tay, Face ID).', hasParams: true, defaultData: '{"data":{"authOptionsParam":{"sensitiveTransaction":true,"authClassification":["WEAK","STRONG","DEVICE"],"sticky":false,"isShowErrorDialog":true}}}' }
    ] },
    { title: 'Device Check Permission', events: [
      { name: 'checkPermissionWithCode', event: 'CHECK_PERMISSION_WITH_CODE', desc: 'Kiểm tra trạng thái quyền cụ thể.', hasParams: true, defaultData: '{"data":{"permissionCode":"USER_AGE_PERMISSION"}}' },
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
    { title: 'Get data event', events: [
      { name: 'getMultipleUserData', event: 'GET_MULTIPLE_USER_DATA', desc: 'Lấy nhiều trường dữ liệu người dùng từ host app.', hasParams: true, defaultData: '{"data":{"dataNames":["age","userName","fullName","phone","email","avatar"]}}' },
      { name: 'clearPermissionCache', event: 'CLEAR_PERMISSION_CACHE', desc: 'Xóa tất cả quyền đã cache ở local.', hasParams: true, defaultData: '{"data":{}}' },
      { name: 'getLocalAuthenticationStatus', event: 'GET_LOCAL_AUTHENTICATION_STATUS', desc: ' lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: null },
      { name: 'getContacts', event: 'GET_CONTACTS', desc: 'Lấy danh sách contacts từ danh bạ hệ thống. ', hasParams: true, defaultData: '{"data":{"filter":{"contactName":"John"},"pager":{"pageNumber":1,"limitRow":100}}}' },
      { name: 'pickFile', event: 'PICK_FILE', desc: 'Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng:', hasParams: true, defaultData: '{"data":{"mimeType":["image/*","video/*"],"isCapture":true,"source":"PhotoLibrary"}}' },
      { name: 'shareTextContent', event: 'SHARE_TEXT_CONTENT', desc: 'Mở dialog chia sẻ nội dung text.', hasParams: true, defaultData: '{"data":{"content":"Check out this amazing product!"}}' }
    ] },
    { title: 'Storage', events: [
      { name: 'saveStringValue', event: 'SAVE_STRING_VALUE', desc: 'Lưu giá trị kiểu string.', hasParams: true, defaultData: '{"data":{"key":"user_preference","value":"dark_mode"}}' },
      { name: 'saveBooleanValue', event: 'SAVE_BOOLEAN_VALUE', desc: 'Lưu giá trị kiểu boolean.', hasParams: true, defaultData: '{"data":{"key":"notifications_enabled","value":true}}' },
      { name: 'saveIntegerValue', event: 'SAVE_INTEGER_VALUE', desc: 'Lưu giá trị kiểu int.', hasParams: true, defaultData: '{"data":{"key":"login_count","value":5}}' },
      { name: 'saveLongValue', event: 'SAVE_LONG_VALUE', desc: 'Lưu giá trị kiểu long.', hasParams: true, defaultData: '{"data":{"key":"last_sync_timestamp","value":1234567890}}' },
      { name: 'saveFloatValue', event: 'SAVE_FLOAT_VALUE', desc: 'Lưu giá trị kiểu float.', hasParams: true, defaultData: '{"data":{"key":"rating","value":4.5}}' },
      { name: 'getStringValue', event: 'GET_STRING_VALUE', desc: 'Lấy giá trị kiểu string.', hasParams: true, defaultData: '{"data":{"key":"user_preference","defaultValue":"light_mode"}}' },
      { name: 'getBooleanValue', event: 'GET_BOOLEAN_VALUE', desc: 'Lấy giá trị kiểu boolean.', hasParams: true, defaultData: '{"data":{"key":"notifications_enabled","defaultValue":false}}' },
      { name: 'getIntegerValue', event: 'GET_INTEGER_VALUE', desc: 'Lấy giá trị kiểu int.', hasParams: true, defaultData: '{"data":{"key":"...","defaultValue":0}}' },
      { name: 'getLongValue', event: 'GET_LONG_VALUE', desc: 'Lấy giá trị kiểu long.', hasParams: true, defaultData: '{"data":{"key":"...","defaultValue":0}}' },
      { name: 'getFloatValue', event: 'GET_FLOAT_VALUE', desc: 'Lấy giá trị kiểu float.', hasParams: true, defaultData: '{"data":{"key":"...","defaultValue":"..."}}' },
      { name: 'clearStorage', event: 'CLEAR_STORAGE', desc: 'Lấy giá trị kiểu float.', hasParams: false, defaultData: null }
    ] },
    { title: 'Location', events: [
      { name: 'getLocation', event: 'GET_LOCATION', desc: 'Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.', hasParams: false, defaultData: null }
    ] },
    { title: 'UI', events: [
      { name: 'setBackgroundStatusBarColor', event: 'SET_BACKGROUND_STATUS_BAR_COLOR', desc: 'Thay đổi màu nền status bar.', hasParams: true, defaultData: '{"data":{"color":"#FF5722"}}' },
      { name: 'setNavigationBarColor', event: 'SET_NAVIGATION_BAR_COLOR', desc: 'Thay đổi màu nền navigation bar.', hasParams: true, defaultData: '{"data":{"color":"#2196F3"}}' },
      { name: 'updateStatusBarAppearance', event: 'UPDATE_STATUS_BAR_APPEARANCE', desc: 'Chuyển đổi status bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{"appearance":"DARK"}}' },
      { name: 'updateNavigationBarAppearance', event: 'UPDATE_NAVIGATION_BAR_APPEARANCE', desc: 'Chuyển đổi navigation bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{"appearance":"LIGHT "}}' }
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
