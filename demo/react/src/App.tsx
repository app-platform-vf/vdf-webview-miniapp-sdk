import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import './App.css';
import {
  getSharedMiniApp,
  appOpenWebview,
  appOpenStore,
  exit,
  openExternalLink,
  openMiniApp,
  requestMultipleUserDataPermission,
  checkMultipleUserDataPermission,
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
  shareTextContent,
  miniAppToken,
  updateMiniAppTheme,
  expiredSession,
} from '@webview-sdk/core';

const app = getSharedMiniApp({ debug: true });

interface EventInfo {
  name: string;
  event: string;
  desc: string;
  hasParams: boolean;
  defaultData: string | null;
}

const groups: { title: string; events: EventInfo[] }[] = [
  { title: "Routing", events: [
      { name: 'appOpenWebview', event: 'APP_OPEN_WEBVIEW', desc: "Mở một WebView mới với URL và cấu hình tùy chỉnh.", hasParams: true, defaultData: "{\"data\":{\"url\":\"https://example.com\",\"serviceName\":\"Tên dịch vụ\",\"isPaymentConfirm\":false,\"resourceType\":\"HTML\",\"returnUrl\":\"https://example.com/return\",\"cancelUrl\":\"https://example.com/cancel\"}}" },
      { name: 'appOpenStore', event: 'APP_OPEN_STORE', desc: "Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài.", hasParams: true, defaultData: "{\"data\":{\"fallbackUrlAndroid\":\"market://details?id=com.example.app\",\"fallbackUrlIos\":\"itms-apps://itunes.apple.com/app/id123456789\"}}" },
      { name: 'exit', event: 'EXIT', desc: "Đóng Mini App và điều hướng về màn hình khác.", hasParams: true, defaultData: "{\"data\":{\"navigationAction\":\"...\"}}" },
      { name: 'openExternalLink', event: 'OPEN_EXTERNAL_LINK', desc: "Mở URL bằng browser mặc định của hệ thống.", hasParams: true, defaultData: "{\"data\":{\"uri\":\"https://google.com\"}}" },
      { name: 'openMiniApp', event: 'OPEN_MINI_APP', desc: "Mở một Mini App khác từ Mini App hiện tại.", hasParams: true, defaultData: "{\"data\":{\"route\":{\"screenName\":\"home\"},\"miniappKey\":\"01K5FY191HP42SMMJXHWG545ZZ\",\"additional\":{\"param1\":\"value1\",\"param2\":\"value2\"},\"launchConfig\":{\"mode\":\"present\"},\"themeConfig\":{\"title\":\"My App\",\"headerColor\":\"#EE0033\",\"headerTitle\":\"Videos\",\"textColor\":\"white\",\"leftButton\":\"back\",\"actionButtonThemeType\":\"normal\",\"hideAndroidBottomNavigationBar\":true,\"hideIOSSafeAreaBottom\":true},\"tracking\":{\"campaign\":\"promotion\",\"utmSource\":\"miniapp\"}}}" }
  ] },
  { title: "UserData Permission", events: [
      { name: 'requestMultipleUserDataPermission', event: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION', desc: "Yêu cầu nhiều quyền user data cùng một lúc.", hasParams: true, defaultData: "{\"data\":{\"permissionCodes\":[\"USER_AGE_PERMISSION\",\"USER_NAME_PERMISSION\",\"USER_FULL_NAME_PERMISSION\",\"USER_PHONE_NUMBER_PERMISSION\",\"USER_AVATAR_PERMISSION\",\"USER_BIRTH_DATE_PERMISSION\",\"USER_GENDER_PERMISSION\",\"USER_NATIONAL_ID_PERMISSION\"],\"useSameReason\":true}}" },
      { name: 'checkMultipleUserDataPermission', event: 'CHECK_MULTIPLE_USER_DATA_PERMISSION', desc: "Kiểm tra trạng thái nhiều quyền user data cùng lúc.", hasParams: true, defaultData: "{\"data\":{\"permissionCodes\":[\"USER_AGE_PERMISSION\",\"USER_NAME_PERMISSION\",\"USER_FULL_NAME_PERMISSION\",\"USER_PHONE_NUMBER_PERMISSION\",\"USER_AVATAR_PERMISSION\",\"USER_BIRTH_DATE_PERMISSION\",\"USER_GENDER_PERMISSION\",\"USER_NATIONAL_ID_PERMISSION\"]}}" }
  ] },
  { title: "Get data event", events: [
      { name: 'getMultipleUserData', event: 'GET_MULTIPLE_USER_DATA', desc: "Lấy nhiều trường dữ liệu người dùng từ host app.", hasParams: true, defaultData: "{\"data\":{\"dataNames\":[\"age\",\"userName\",\"fullName\",\"phoneNumber\",\"avatar\",\"gender\",\"birthday\",\"idNo\"]}}" },
      { name: 'clearPermissionCache', event: 'CLEAR_PERMISSION_CACHE', desc: "Xóa tất cả quyền đã cache ở local.", hasParams: true, defaultData: "{\"data\":{}}" },
      { name: 'getLocalAuthenticationStatus', event: 'GET_LOCAL_AUTHENTICATION_STATUS', desc: " lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).", hasParams: false, defaultData: null },
      { name: 'getContacts', event: 'GET_CONTACTS', desc: "Lấy danh sách contacts từ danh bạ hệ thống. ", hasParams: true, defaultData: "{\"data\":{\"filter\":{\"contactName\":\"John\"},\"pager\":{\"pageNumber\":1,\"limitRow\":100}}}" },
      { name: 'pickFile', event: 'PICK_FILE', desc: "Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng:", hasParams: true, defaultData: "{\"data\":{\"mimeType\":[\"image/*\",\"video/*\"],\"isCapture\":true,\"source\":\"PhotoLibrary\"}}" },
      { name: 'shareTextContent', event: 'SHARE_TEXT_CONTENT', desc: "Mở dialog chia sẻ nội dung text.", hasParams: true, defaultData: "{\"data\":{\"content\":\"Check out this amazing product!\"}}" },
      { name: 'miniAppToken', event: 'MINI_APP_TOKEN', desc: "Get mini app token", hasParams: false, defaultData: null },
      { name: 'expiredSession', event: 'EXPIRED_SESSION', desc: "Session expiration event, Delegate cho host app xử lý", hasParams: false, defaultData: null }
  ] },
  { title: "Device Request Permission", events: [
      { name: 'requestCameraPermission', event: 'REQUEST_CAMERA_PERMISSION', desc: "Yêu cầu mở camera", hasParams: false, defaultData: null },
      { name: 'requestLocationPermission', event: 'REQUEST_LOCATION_PERMISSION', desc: "Yêu cầu vị trí", hasParams: false, defaultData: null },
      { name: 'requestPhotosPermission', event: 'REQUEST_PHOTOS_PERMISSION', desc: "Yêu cầu truy cập ảnh trên thiết bị", hasParams: false, defaultData: null },
      { name: 'requestVideosPermission', event: 'REQUEST_VIDEOS_PERMISSION', desc: "Yêu cầu truy cập video trên thiết bị", hasParams: false, defaultData: null },
      { name: 'requestAudioPermission', event: 'REQUEST_AUDIO_PERMISSION', desc: "Yêu cầu truy cập audio trên thiết bị", hasParams: false, defaultData: null },
      { name: 'requestRecordAudioPermission', event: 'REQUEST_RECORD_AUDIO_PERMISSION', desc: "Yêu cầu ghi âm trên thiết bị", hasParams: false, defaultData: null },
      { name: 'requestContactsPermission', event: 'REQUEST_CONTACTS_PERMISSION', desc: "Yêu cầu truy cập danh bạ trên thiết bị", hasParams: false, defaultData: null },
      { name: 'requestDocumentPermission', event: 'REQUEST_DOCUMENT_PERMISSION', desc: "Yêu cầu truy cập tài liệu trên thiết bị", hasParams: false, defaultData: null },
      { name: 'requestPhoneCallPermission', event: 'REQUEST_PHONE_CALL_PERMISSION', desc: "Yêu cầu thực hiện cuộc gọi trên thiết bị", hasParams: false, defaultData: null },
      { name: 'requestPaymentPermission', event: 'REQUEST_PAYMENT_PERMISSION', desc: "", hasParams: false, defaultData: null },
      { name: 'requestLoginPermission', event: 'REQUEST_LOGIN_PERMISSION', desc: "", hasParams: false, defaultData: null },
      { name: 'requestLocalAuthenticationPermission', event: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION', desc: "Yêu cầu xác thực sinh trắc học (vân tay, Face ID).", hasParams: false, defaultData: null },
      { name: 'executeLocalAuthentication', event: 'EXECUTE_LOCAL_AUTHENTICATION', desc: "Thực hiện xác thực sinh trắc học (vân tay, Face ID).", hasParams: true, defaultData: "{\"data\":{\"authOptionsParam\":{\"sensitiveTransaction\":true,\"authClassification\":[\"WEAK\",\"STRONG\",\"DEVICE\"],\"sticky\":false,\"isShowErrorDialog\":true}}}" }
  ] },
  { title: "Device Check Permission", events: [
      { name: 'checkCameraPermission', event: 'CHECK_CAMERA_PERMISSION', desc: "Kiểm tra quyền camera", hasParams: false, defaultData: null },
      { name: 'checkLocationPermission', event: 'CHECK_LOCATION_PERMISSION', desc: "Kiểm tra quyền vị trí", hasParams: false, defaultData: null },
      { name: 'checkPhotosPermission', event: 'CHECK_PHOTOS_PERMISSION', desc: "Kiểm tra quyền truy cập ảnh", hasParams: false, defaultData: null },
      { name: 'checkVideosPermission', event: 'CHECK_VIDEOS_PERMISSION', desc: "Kiểm tra quyền truy cập video", hasParams: false, defaultData: null },
      { name: 'checkAudioPermission', event: 'CHECK_AUDIO_PERMISSION', desc: "Kiểm tra quyền truy cập file audio", hasParams: false, defaultData: null },
      { name: 'checkRecordAudioPermission', event: 'CHECK_RECORD_AUDIO_PERMISSION', desc: "Kiểm tra quyền ghi âm trên thiết bị", hasParams: false, defaultData: null },
      { name: 'checkContactsPermission', event: 'CHECK_CONTACTS_PERMISSION', desc: "Kiểm tra quyền truy cập danh bạ", hasParams: false, defaultData: null },
      { name: 'checkDocumentPermission', event: 'CHECK_DOCUMENT_PERMISSION', desc: "Kiểm tra quyền truy cập file tài liệu", hasParams: false, defaultData: null },
      { name: 'checkPhoneCallPermission', event: 'CHECK_PHONE_CALL_PERMISSION', desc: "Kiểm tra quyền gọi điện", hasParams: false, defaultData: null },
      { name: 'checkPaymentPermission', event: 'CHECK_PAYMENT_PERMISSION', desc: "", hasParams: false, defaultData: null },
      { name: 'checkLoginPermission', event: 'CHECK_LOGIN_PERMISSION', desc: "", hasParams: false, defaultData: null },
      { name: 'checkLocalAuthenticationPermission', event: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION', desc: "kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).", hasParams: false, defaultData: null }
  ] },
  { title: "Storage", events: [
      { name: 'saveStringValue', event: 'SAVE_STRING_VALUE', desc: "Lưu giá trị kiểu string.", hasParams: true, defaultData: "{\"data\":{\"key\":\"user_preference\",\"value\":\"dark_mode\"}}" },
      { name: 'saveBooleanValue', event: 'SAVE_BOOLEAN_VALUE', desc: "Lưu giá trị kiểu boolean.", hasParams: true, defaultData: "{\"data\":{\"key\":\"notifications_enabled\",\"value\":true}}" },
      { name: 'saveIntegerValue', event: 'SAVE_INTEGER_VALUE', desc: "Lưu giá trị kiểu int.", hasParams: true, defaultData: "{\"data\":{\"key\":\"login_count\",\"value\":5}}" },
      { name: 'saveLongValue', event: 'SAVE_LONG_VALUE', desc: "Lưu giá trị kiểu long.", hasParams: true, defaultData: "{\"data\":{\"key\":\"last_sync_timestamp\",\"value\":1234567890}}" },
      { name: 'saveFloatValue', event: 'SAVE_FLOAT_VALUE', desc: "Lưu giá trị kiểu float.", hasParams: true, defaultData: "{\"data\":{\"key\":\"rating\",\"value\":4.5}}" },
      { name: 'getStringValue', event: 'GET_STRING_VALUE', desc: "Lấy giá trị kiểu string.", hasParams: true, defaultData: "{\"data\":{\"key\":\"user_preference\",\"defaultValue\":\"light_mode\"}}" },
      { name: 'getBooleanValue', event: 'GET_BOOLEAN_VALUE', desc: "Lấy giá trị kiểu boolean.", hasParams: true, defaultData: "{\"data\":{\"key\":\"notifications_enabled\",\"defaultValue\":false}}" },
      { name: 'getIntegerValue', event: 'GET_INTEGER_VALUE', desc: "Lấy giá trị kiểu int.", hasParams: true, defaultData: "{\"data\":{\"key\":\"...\",\"defaultValue\":0}}" },
      { name: 'getLongValue', event: 'GET_LONG_VALUE', desc: "Lấy giá trị kiểu long.", hasParams: true, defaultData: "{\"data\":{\"key\":\"...\",\"defaultValue\":0}}" },
      { name: 'getFloatValue', event: 'GET_FLOAT_VALUE', desc: "Lấy giá trị kiểu float.", hasParams: true, defaultData: "{\"data\":{\"key\":\"...\",\"defaultValue\":\"...\"}}" },
      { name: 'clearStorage', event: 'CLEAR_STORAGE', desc: "Lấy giá trị kiểu float.", hasParams: false, defaultData: null }
  ] },
  { title: "Location", events: [
      { name: 'getLocation', event: 'GET_LOCATION', desc: "Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.", hasParams: false, defaultData: null }
  ] },
  { title: "UI", events: [
      { name: 'updateMiniAppTheme', event: 'UPDATE_MINI_APP_THEME', desc: "Update mini app theme", hasParams: true, defaultData: "{\"data\":{\"headerColor\":\"#FFFFFF\",\"headerTitle\":\"Mini App\",\"textColor\":\"#EE0033\",\"leftButton\":\"back\",\"actionButtonThemeType\":\"light\",\"hideAndroidBottomNavigationBar\":false,\"hideIOSSafeAreaBottom\":false,\"toolbarMode\":\"normal\"}}" }
  ] }
];


function selectBetweenChar(el: HTMLTextAreaElement, char: string): void {
  const pos = el.selectionStart ?? 0;
  const text = el.value;
  const start = text.lastIndexOf(char, pos - 1);
  const end = text.indexOf(char, pos);
  if (start === -1 || end === -1) return;
  el.focus();
  el.setSelectionRange(start + 1, end);
}
function setupSmartTap(el: HTMLTextAreaElement): void {
  let tapCount = 0;
  let tapTimer: ReturnType<typeof setTimeout> | null = null;
  el.addEventListener('touchend', () => {
    tapCount++;
    if (tapTimer) clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      if (tapCount >= 3) selectBetweenChar(el, '"');
      tapCount = 0;
    }, 300);
  });
}
function setupLongPress(el: HTMLElement, onLongPress: () => void, duration = 600): void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const start = () => {
    el.classList.add('long-pressing');
    timer = setTimeout(() => { timer = null; onLongPress(); el.classList.remove('long-pressing'); }, duration);
  };
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } el.classList.remove('long-pressing'); };
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('touchend', cancel);
  el.addEventListener('touchmove', cancel);
}

export default function App() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [eventLogs, setEventLogs] = useState<Record<string, string[]>>({});
  const [popup, setPopup] = useState<EventInfo | null>(null);
  const inputsRef = useRef(inputs);
  const smartTapReady = useRef(new WeakSet<HTMLTextAreaElement>());
  inputsRef.current = inputs;

  useEffect(() => { app.ready(); }, []);

  const lsKey = (name: string) => `webview_sdk_input_${name}`;

  const getInputFor = useCallback((name: string): any => {
    const v = (inputsRef.current[name] || '').trim();
    if (!v) return null;
    try { return JSON.parse(v); } catch { return null; }
  }, []);

  const fns: Record<string, () => Promise<any>> = {
    'appOpenWebview': () => appOpenWebview(getInputFor('appOpenWebview') || {"data":{"url":"https://example.com","serviceName":"Tên dịch vụ","isPaymentConfirm":false,"resourceType":"HTML","returnUrl":"https://example.com/return","cancelUrl":"https://example.com/cancel"}}),
    'appOpenStore': () => appOpenStore(getInputFor('appOpenStore') || {"data":{"fallbackUrlAndroid":"market://details?id=com.example.app","fallbackUrlIos":"itms-apps://itunes.apple.com/app/id123456789"}}),
    'exit': () => exit(getInputFor('exit') || {"data":{"navigationAction":"..."}}),
    'openExternalLink': () => openExternalLink(getInputFor('openExternalLink') || {"data":{"uri":"https://google.com"}}),
    'openMiniApp': () => openMiniApp(getInputFor('openMiniApp') || {"data":{"route":{"screenName":"home"},"miniappKey":"01K5FY191HP42SMMJXHWG545ZZ","additional":{"param1":"value1","param2":"value2"},"launchConfig":{"mode":"present"},"themeConfig":{"title":"My App","headerColor":"#EE0033","headerTitle":"Videos","textColor":"white","leftButton":"back","actionButtonThemeType":"normal","hideAndroidBottomNavigationBar":true,"hideIOSSafeAreaBottom":true},"tracking":{"campaign":"promotion","utmSource":"miniapp"}}}),
    'requestMultipleUserDataPermission': () => requestMultipleUserDataPermission(getInputFor('requestMultipleUserDataPermission') || {"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION","USER_BIRTH_DATE_PERMISSION","USER_GENDER_PERMISSION","USER_NATIONAL_ID_PERMISSION"],"useSameReason":true}}),
    'checkMultipleUserDataPermission': () => checkMultipleUserDataPermission(getInputFor('checkMultipleUserDataPermission') || {"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION","USER_BIRTH_DATE_PERMISSION","USER_GENDER_PERMISSION","USER_NATIONAL_ID_PERMISSION"]}}),
    'getMultipleUserData': () => getMultipleUserData(getInputFor('getMultipleUserData') || {"data":{"dataNames":["age","userName","fullName","phoneNumber","avatar","gender","birthday","idNo"]}}),
    'clearPermissionCache': () => clearPermissionCache(getInputFor('clearPermissionCache') || {"data":{}}),
    'requestCameraPermission': () => requestCameraPermission(),
    'requestLocationPermission': () => requestLocationPermission(),
    'requestPhotosPermission': () => requestPhotosPermission(),
    'requestVideosPermission': () => requestVideosPermission(),
    'requestAudioPermission': () => requestAudioPermission(),
    'requestRecordAudioPermission': () => requestRecordAudioPermission(),
    'requestContactsPermission': () => requestContactsPermission(),
    'requestDocumentPermission': () => requestDocumentPermission(),
    'requestPhoneCallPermission': () => requestPhoneCallPermission(),
    'requestPaymentPermission': () => requestPaymentPermission(),
    'requestLoginPermission': () => requestLoginPermission(),
    'requestLocalAuthenticationPermission': () => requestLocalAuthenticationPermission(),
    'checkCameraPermission': () => checkCameraPermission(),
    'checkLocationPermission': () => checkLocationPermission(),
    'checkPhotosPermission': () => checkPhotosPermission(),
    'checkVideosPermission': () => checkVideosPermission(),
    'checkAudioPermission': () => checkAudioPermission(),
    'checkRecordAudioPermission': () => checkRecordAudioPermission(),
    'checkContactsPermission': () => checkContactsPermission(),
    'checkDocumentPermission': () => checkDocumentPermission(),
    'checkPhoneCallPermission': () => checkPhoneCallPermission(),
    'checkPaymentPermission': () => checkPaymentPermission(),
    'checkLoginPermission': () => checkLoginPermission(),
    'checkLocalAuthenticationPermission': () => checkLocalAuthenticationPermission(),
    'executeLocalAuthentication': () => executeLocalAuthentication(getInputFor('executeLocalAuthentication') || {"data":{"authOptionsParam":{"sensitiveTransaction":true,"authClassification":["WEAK","STRONG","DEVICE"],"sticky":false,"isShowErrorDialog":true}}}),
    'getLocalAuthenticationStatus': () => getLocalAuthenticationStatus(),
    'getContacts': () => getContacts(getInputFor('getContacts') || {"data":{"filter":{"contactName":"John"},"pager":{"pageNumber":1,"limitRow":100}}}),
    'pickFile': () => pickFile(getInputFor('pickFile') || {"data":{"mimeType":["image/*","video/*"],"isCapture":true,"source":"PhotoLibrary"}}),
    'saveStringValue': () => saveStringValue(getInputFor('saveStringValue') || {"data":{"key":"user_preference","value":"dark_mode"}}),
    'saveBooleanValue': () => saveBooleanValue(getInputFor('saveBooleanValue') || {"data":{"key":"notifications_enabled","value":true}}),
    'saveIntegerValue': () => saveIntegerValue(getInputFor('saveIntegerValue') || {"data":{"key":"login_count","value":5}}),
    'saveLongValue': () => saveLongValue(getInputFor('saveLongValue') || {"data":{"key":"last_sync_timestamp","value":1234567890}}),
    'saveFloatValue': () => saveFloatValue(getInputFor('saveFloatValue') || {"data":{"key":"rating","value":4.5}}),
    'getStringValue': () => getStringValue(getInputFor('getStringValue') || {"data":{"key":"user_preference","defaultValue":"light_mode"}}),
    'getBooleanValue': () => getBooleanValue(getInputFor('getBooleanValue') || {"data":{"key":"notifications_enabled","defaultValue":false}}),
    'getIntegerValue': () => getIntegerValue(getInputFor('getIntegerValue') || {"data":{"key":"...","defaultValue":0}}),
    'getLongValue': () => getLongValue(getInputFor('getLongValue') || {"data":{"key":"...","defaultValue":0}}),
    'getFloatValue': () => getFloatValue(getInputFor('getFloatValue') || {"data":{"key":"...","defaultValue":"..."}}),
    'clearStorage': () => clearStorage(),
    'getLocation': () => getLocation(),
    'shareTextContent': () => shareTextContent(getInputFor('shareTextContent') || {"data":{"content":"Check out this amazing product!"}}),
    'miniAppToken': () => miniAppToken(),
    'updateMiniAppTheme': () => updateMiniAppTheme(getInputFor('updateMiniAppTheme') || {"data":{"headerColor":"#FFFFFF","headerTitle":"Mini App","textColor":"#EE0033","leftButton":"back","actionButtonThemeType":"light","hideAndroidBottomNavigationBar":false,"hideIOSSafeAreaBottom":false,"toolbarMode":"normal"}}),
    'expiredSession': () => expiredSession(),
    'invoke': () => app.invoke(getInputFor('invoke')?.event || 'GET_LOCATION', getInputFor('invoke')),
  };

  const logFor = useCallback((name: string, msg: string, data?: any) => {
    const entry = data ? `${msg}: ${JSON.stringify(data, null, 2)}` : msg;
    setEventLogs(prev => ({ ...prev, [name]: [`[${new Date().toLocaleTimeString()}] ${entry}`, ...(prev[name] || [])] }));
  }, []);

  const runEvent = useCallback(async (evt: EventInfo) => {
    const fn = fns[evt.name];
    if (!fn) return;
    try {
      logFor(evt.name, `> ${evt.name}...`);
      const res = await fn();
      logFor(evt.name, `OK ${evt.name}`, res);
    } catch (err: any) {
      logFor(evt.name, `ERR ${evt.name}`, err);
    }
  }, [logFor]);

  const fillInput = useCallback((evt: EventInfo) => {
    const saved = localStorage.getItem(lsKey(evt.name));
    if (saved) { try { setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(saved), null, 2) })); } catch { setInputs(p => ({ ...p, [evt.name]: saved })); } }
    else if (evt.defaultData) setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(evt.defaultData!), null, 2) }));
  }, []);

  const saveInput = useCallback((evt: EventInfo) => {
    const v = (inputsRef.current[evt.name] || '').trim();
    if (v) localStorage.setItem(lsKey(evt.name), v);
  }, []);

  const deleteInput = useCallback((evt: EventInfo) => {
    localStorage.removeItem(lsKey(evt.name));
  }, []);

  const clearLog = useCallback((name: string) => {
    setEventLogs(p => ({ ...p, [name]: [] }));
  }, []);

  const quickRun = useCallback((evt: EventInfo) => {
    const saved = localStorage.getItem(lsKey(evt.name));
    if (saved) { try { setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(saved), null, 2) })); } catch { setInputs(p => ({ ...p, [evt.name]: saved })); } }
    else if (evt.defaultData) setInputs(p => ({ ...p, [evt.name]: JSON.stringify(JSON.parse(evt.defaultData!), null, 2) }));
    runEvent(evt);
  }, [runEvent]);

  const btnRef = useCallback((el: HTMLButtonElement | null, evt: EventInfo) => {
    if (el) setupLongPress(el, () => quickRun(evt));
  }, [quickRun]);

  const textareaRef = useCallback((el: HTMLTextAreaElement | null) => {
    if (el && !smartTapReady.current.has(el)) { smartTapReady.current.add(el); setupSmartTap(el); }
  }, []);

  const getLogsStr = (name: string) => {
    const l = eventLogs[name] || [];
    return l.length ? l.join('\n') : 'No logs yet.';
  };

  return (
    <div className="container">
      <h1>MiniApp SDK - React Demo</h1>

      {groups.map(g => (
        <section key={g.title}>
          <h3 className="section-title">{g.title}</h3>
          <div className="btn-group">
            {g.events.map(evt => (
              <div key={evt.name} className="evt-wrap">
                <button ref={el => btnRef(el, evt)} className="btn" onClick={() => setPopup(popup?.name === evt.name ? null : evt)} title={evt.desc}>{evt.name}</button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Generic invoke */}
      <section>
        <h3 className="section-title">Generic invoke()</h3>
        <div className="btn-group">
          <button className="btn" onClick={() => setPopup({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: true, defaultData: null })}>invoke(input)</button>
        </div>
      </section>
      <div style={{ padding: '50px' }}></div>

      {/* Overlay */}
      {popup && <div className="popup-overlay" onClick={() => setPopup(null)} />}

      {/* Popup (bottom sheet) */}
      {popup && (
        <div className="popup-custom">
          <div className="popup-title">{popup.event}</div>
          {popup.desc && <div className="popup-desc">{popup.desc}</div>}
          <div className="popup-actions">
            <button className="btn btn-run" onClick={() => runEvent(popup)}>Run</button>
            {popup.hasParams && <button className="btn btn-fill" onClick={() => fillInput(popup)}>Fill Input</button>}
            {popup.hasParams && <button className="btn btn-save" onClick={() => saveInput(popup)}>Save</button>}
            {popup.hasParams && <button className="btn btn-delete" onClick={() => deleteInput(popup)}>Delete</button>}
            <button className="btn" style={{ marginLeft: 'auto' }} onClick={() => clearLog(popup.name)}>Clear Log</button>
          </div>
          {popup.hasParams && (
            <textarea
              ref={textareaRef}
              rows={15}
              value={inputs[popup.name] || ''}
              onChange={e => setInputs(p => ({ ...p, [popup.name]: e.target.value }))}
              placeholder='{"key":"value"}'
              className="input-area"
            />
          )}
          <pre className="popup-log">{getLogsStr(popup.name)}</pre>
        </div>
      )}
    </div>
  );
}
