import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  getSharedMiniApp,
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
import './App.css';

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
      { name: 'exit', event: 'EXIT', desc: "Đóng Mini App và điều hướng về màn hình khác.", hasParams: true, defaultData: "{\"data\":{\"navigationAction\":\"RETURN_HOME_APP\"}}" },
      { name: 'openExternalLink', event: 'OPEN_EXTERNAL_LINK', desc: "Mở URL bằng browser mặc định của hệ thống.", hasParams: true, defaultData: "{\"data\":{\"uri\":\"https://google.com\"}}" },
      { name: 'openMiniApp', event: 'OPEN_MINI_APP', desc: "Mở một Mini App khác từ Mini App hiện tại.", hasParams: true, defaultData: "{\"data\":{\"route\":{\"screenName\":\"home\"},\"miniappKey\":\"01K5FY191HP42SMMJXHWG545ZZ\",\"additional\":{\"param1\":\"value1\",\"param2\":\"value2\"},\"launchConfig\":{\"mode\":\"present\"},\"navStyle\":{\"color\":\"#FF0000\",\"hidden\":\"false\"},\"tracking\":{\"campaign\":\"promotion\",\"utmSource\":\"miniapp\"}}}" }
  ] },
  { title: "UserData Permission", events: [
      { name: 'requestMultipleUserDataPermission', event: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION', desc: "Yêu cầu nhiều quyền user data cùng một lúc.", hasParams: true, defaultData: "{\"data\":{\"permissionCodes\":[\"USER_AGE_PERMISSION\",\"USER_NAME_PERMISSION\",\"USER_FULL_NAME_PERMISSION\",\"USER_PHONE_NUMBER_PERMISSION\",\"USER_AVATAR_PERMISSION\"],\"useSameReason\":true}}" },
      { name: 'checkMultipleUserDataPermission', event: 'CHECK_MULTIPLE_USER_DATA_PERMISSION', desc: "Kiểm tra trạng thái nhiều quyền user data cùng lúc.", hasParams: true, defaultData: "{\"data\":{\"permissionCodes\":[\"USER_AGE_PERMISSION\",\"USER_NAME_PERMISSION\",\"USER_FULL_NAME_PERMISSION\",\"USER_PHONE_NUMBER_PERMISSION\",\"USER_AVATAR_PERMISSION\"]}}" }
  ] },
  { title: "Device Request Permission", events: [
      { name: 'requestPermissionWithCode', event: 'REQUEST_PERMISSION_WITH_CODE', desc: "Yêu cầu quyền cụ thể theo permission code (cả SDK-level và device-level).", hasParams: true, defaultData: "{\"data\":{\"permissionCode\":\"USER_AGE_PERMISSION\"}}" },
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
      { name: 'checkPermissionWithCode', event: 'CHECK_PERMISSION_WITH_CODE', desc: "Kiểm tra trạng thái quyền cụ thể.", hasParams: true, defaultData: "{\"data\":{\"permissionCode\":\"USER_AGE_PERMISSION\"}}" },
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
  { title: "Get data event", events: [
      { name: 'getMultipleUserData', event: 'GET_MULTIPLE_USER_DATA', desc: "Lấy nhiều trường dữ liệu người dùng từ host app.", hasParams: true, defaultData: "{\"data\":{\"dataNames\":[\"age\",\"userName\",\"fullName\",\"phone\",\"email\",\"avatar\"]}}" },
      { name: 'clearPermissionCache', event: 'CLEAR_PERMISSION_CACHE', desc: "Xóa tất cả quyền đã cache ở local.", hasParams: true, defaultData: "{\"data\":{}}" },
      { name: 'getLocalAuthenticationStatus', event: 'GET_LOCAL_AUTHENTICATION_STATUS', desc: " lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).", hasParams: false, defaultData: null },
      { name: 'getContacts', event: 'GET_CONTACTS', desc: "Lấy danh sách contacts từ danh bạ hệ thống. ", hasParams: true, defaultData: "{\"data\":{\"filter\":{\"contactName\":\"John\"},\"pager\":{\"pageNumber\":1,\"limitRow\":100}}}" },
      { name: 'pickFile', event: 'PICK_FILE', desc: "Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng:", hasParams: true, defaultData: "{\"data\":{\"mimeType\":[\"image/*\",\"video/*\"],\"isCapture\":true,\"source\":\"PhotoLibrary\"}}" },
      { name: 'shareTextContent', event: 'SHARE_TEXT_CONTENT', desc: "Mở dialog chia sẻ nội dung text.", hasParams: true, defaultData: "{\"data\":{\"content\":\"Check out this amazing product!\"}}" }
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
      { name: 'setBackgroundStatusBarColor', event: 'SET_BACKGROUND_STATUS_BAR_COLOR', desc: "Thay đổi màu nền status bar.", hasParams: true, defaultData: "{\"data\":{\"color\":\"#FF5722\"}}" },
      { name: 'setNavigationBarColor', event: 'SET_NAVIGATION_BAR_COLOR', desc: "Thay đổi màu nền navigation bar.", hasParams: true, defaultData: "{\"data\":{\"color\":\"#2196F3\"}}" },
      { name: 'updateStatusBarAppearance', event: 'UPDATE_STATUS_BAR_APPEARANCE', desc: "Chuyển đổi status bar giữa dark mode và light mode.", hasParams: true, defaultData: "{\"data\":{\"appearance\":\"DARK\"}}" },
      { name: 'updateNavigationBarAppearance', event: 'UPDATE_NAVIGATION_BAR_APPEARANCE', desc: "Chuyển đổi navigation bar giữa dark mode và light mode.", hasParams: true, defaultData: "{\"data\":{\"appearance\":\"LIGHT \"}}" }
  ] }
];

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [popup, setPopup] = useState<EventInfo | null>(null);
  const inputRef = useRef(input);
  inputRef.current = input;

  useEffect(() => { app.ready(); }, []);

  const formatLog = useMemo(() => {
    return logs.length ? logs.join('\n') : 'No logs yet.';
  }, [logs]);

  const getInput = useCallback((): any => {
    const v = inputRef.current.trim();
    if (!v) return null;
    try { return JSON.parse(v); } catch { return null; }
  }, []);

  const fns: Record<string, () => Promise<any>> = {
    'appOpenWebview': () => appOpenWebview(getInput() || {"data":{"url":"https://example.com","serviceName":"Tên dịch vụ","isPaymentConfirm":false,"resourceType":"HTML","returnUrl":"https://example.com/return","cancelUrl":"https://example.com/cancel"}}),
    'appOpenStore': () => appOpenStore(getInput() || {"data":{"fallbackUrlAndroid":"market://details?id=com.example.app","fallbackUrlIos":"itms-apps://itunes.apple.com/app/id123456789"}}),
    'exit': () => exit(getInput() || {"data":{"navigationAction":"RETURN_HOME_APP"}}),
    'openExternalLink': () => openExternalLink(getInput() || {"data":{"uri":"https://google.com"}}),
    'openMiniApp': () => openMiniApp(getInput() || {"data":{"route":{"screenName":"home"},"miniappKey":"01K5FY191HP42SMMJXHWG545ZZ","additional":{"param1":"value1","param2":"value2"},"launchConfig":{"mode":"present"},"navStyle":{"color":"#FF0000","hidden":"false"},"tracking":{"campaign":"promotion","utmSource":"miniapp"}}}),
    'requestMultipleUserDataPermission': () => requestMultipleUserDataPermission(getInput() || {"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"],"useSameReason":true}}),
    'checkMultipleUserDataPermission': () => checkMultipleUserDataPermission(getInput() || {"data":{"permissionCodes":["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"]}}),
    'requestPermissionWithCode': () => requestPermissionWithCode(getInput() || {"data":{"permissionCode":"USER_AGE_PERMISSION"}}),
    'checkPermissionWithCode': () => checkPermissionWithCode(getInput() || {"data":{"permissionCode":"USER_AGE_PERMISSION"}}),
    'getMultipleUserData': () => getMultipleUserData(getInput() || {"data":{"dataNames":["age","userName","fullName","phone","email","avatar"]}}),
    'clearPermissionCache': () => clearPermissionCache(getInput() || {"data":{}}),
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
    'executeLocalAuthentication': () => executeLocalAuthentication(getInput() || {"data":{"authOptionsParam":{"sensitiveTransaction":true,"authClassification":["WEAK","STRONG","DEVICE"],"sticky":false,"isShowErrorDialog":true}}}),
    'getLocalAuthenticationStatus': () => getLocalAuthenticationStatus(),
    'getContacts': () => getContacts(getInput() || {"data":{"filter":{"contactName":"John"},"pager":{"pageNumber":1,"limitRow":100}}}),
    'pickFile': () => pickFile(getInput() || {"data":{"mimeType":["image/*","video/*"],"isCapture":true,"source":"PhotoLibrary"}}),
    'saveStringValue': () => saveStringValue(getInput() || {"data":{"key":"user_preference","value":"dark_mode"}}),
    'saveBooleanValue': () => saveBooleanValue(getInput() || {"data":{"key":"notifications_enabled","value":true}}),
    'saveIntegerValue': () => saveIntegerValue(getInput() || {"data":{"key":"login_count","value":5}}),
    'saveLongValue': () => saveLongValue(getInput() || {"data":{"key":"last_sync_timestamp","value":1234567890}}),
    'saveFloatValue': () => saveFloatValue(getInput() || {"data":{"key":"rating","value":4.5}}),
    'getStringValue': () => getStringValue(getInput() || {"data":{"key":"user_preference","defaultValue":"light_mode"}}),
    'getBooleanValue': () => getBooleanValue(getInput() || {"data":{"key":"notifications_enabled","defaultValue":false}}),
    'getIntegerValue': () => getIntegerValue(getInput() || {"data":{"key":"...","defaultValue":0}}),
    'getLongValue': () => getLongValue(getInput() || {"data":{"key":"...","defaultValue":0}}),
    'getFloatValue': () => getFloatValue(getInput() || {"data":{"key":"...","defaultValue":"..."}}),
    'clearStorage': () => clearStorage(),
    'getLocation': () => getLocation(),
    'setBackgroundStatusBarColor': () => setBackgroundStatusBarColor(getInput() || {"data":{"color":"#FF5722"}}),
    'setNavigationBarColor': () => setNavigationBarColor(getInput() || {"data":{"color":"#2196F3"}}),
    'updateStatusBarAppearance': () => updateStatusBarAppearance(getInput() || {"data":{"appearance":"DARK"}}),
    'updateNavigationBarAppearance': () => updateNavigationBarAppearance(getInput() || {"data":{"appearance":"LIGHT "}}),
    'shareTextContent': () => shareTextContent(getInput() || {"data":{"content":"Check out this amazing product!"}}),
    'invoke': () => app.invoke(getInput()?.event || 'GET_LOCATION', getInput()),
  };

  const log = useCallback((msg: string, data?: any) => {
    const entry = data ? `${msg}: ${JSON.stringify(data, null, 2)}` : msg;
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${entry}`, ...prev]);
  }, []);

  const runEvent = useCallback(async (evt: EventInfo) => {
    setPopup(null);
    const fn = fns[evt.name];
    if (!fn) return;
    try {
      log(`> ${evt.name}...`);
      const res = await fn();
      log(`OK ${evt.name}`, res);
    } catch (err: any) {
      log(`ERR ${evt.name}`, err);
    }
  }, [log]);

  const fillInput = useCallback((evt: EventInfo) => {
    if (evt.defaultData) {
      setInput(JSON.stringify(JSON.parse(evt.defaultData), null, 2));
    }
    setPopup(null);
  }, []);

  return (
    <div className="container">
      <h1>MiniApp SDK - React Demo</h1>

      <div className="sticky-top">
        {/* Input */}
        <section>
          <h3 className="section-title">Input Data (JSON)</h3>
          <textarea
            rows={5}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"data":{"url":"https://example.com"}}'
            className="input-area"
          />
        </section>

        {/* Logs */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Logs</h3>
            <button className="btn" onClick={() => setLogs([])}>Clear</button>
          </div>
          <pre className="log-area"><code style={{ width: 800, display: 'block' }}>{formatLog}</code></pre>
        </div>
      </div>

      {groups.map(g => (
        <section key={g.title}>
          <h3 className="section-title">{g.title}</h3>
          <div className="btn-group">
            {g.events.map(evt => (
              <div key={evt.name} className="evt-wrap">
                <button className="btn" onClick={() => setPopup(popup?.name === evt.name ? null : evt)} title={evt.desc}>{evt.name}</button>
                {popup?.name === evt.name && (
                  <div className="popup-custom">
                    <div className="popup-title">{evt.event}</div>
                    {evt.desc && <div className="popup-desc">{evt.desc}</div>}
                    <div className="popup-actions">
                      <button className="btn btn-run" onClick={() => runEvent(evt)}>Run</button>
                      {evt.hasParams && <button className="btn btn-fill" onClick={() => fillInput(evt)}>Fill Input</button>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Generic invoke */}
      <section>
        <h3 className="section-title">Generic invoke()</h3>
        <div className="btn-group">
          <button className="btn" onClick={() => runEvent({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: false, defaultData: null })}>invoke(input)</button>
        </div>
      </section>
      <div style={{ padding: '50px' }}></div>
    </div>
  );
}
