<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

const app = getSharedMiniApp({ debug: true });
const logs = ref<string[]>([]);
const input = ref('');
const popup = ref<any>(null);

const formatLog = computed(() => {
  return logs.value.length ? logs.value.join('\n') : 'No logs yet.';
});

onMounted(() => { app.ready(); });

function getInput(): any {
  const v = input.value.trim();
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}

const fns: Record<string, () => Promise<any>> = {
  'appOpenWebview': () => appOpenWebview(getInput() || {'data':{'url':'https://example.com','serviceName':'Tên dịch vụ','isPaymentConfirm':false,'resourceType':'HTML','returnUrl':'https://example.com/return','cancelUrl':'https://example.com/cancel'}}),
  'appOpenStore': () => appOpenStore(getInput() || {'data':{'fallbackUrlAndroid':'market://details?id=com.example.app','fallbackUrlIos':'itms-apps://itunes.apple.com/app/id123456789'}}),
  'exit': () => exit(getInput() || {'data':{'navigationAction':'RETURN_HOME_APP'}}),
  'openExternalLink': () => openExternalLink(getInput() || {'data':{'uri':'https://google.com'}}),
  'openMiniApp': () => openMiniApp(getInput() || {'data':{'route':{'screenName':'home'},'miniappKey':'01K5FY191HP42SMMJXHWG545ZZ','additional':{'param1':'value1','param2':'value2'},'launchConfig':{'mode':'present'},'navStyle':{'color':'#FF0000','hidden':'false'},'tracking':{'campaign':'promotion','utmSource':'miniapp'}}}),
  'requestMultipleUserDataPermission': () => requestMultipleUserDataPermission(getInput() || {'data':{'permissionCodes':['USER_AGE_PERMISSION','USER_NAME_PERMISSION','USER_FULL_NAME_PERMISSION','USER_PHONE_NUMBER_PERMISSION','USER_AVATAR_PERMISSION'],'useSameReason':true}}),
  'checkMultipleUserDataPermission': () => checkMultipleUserDataPermission(getInput() || {'data':{'permissionCodes':['USER_AGE_PERMISSION','USER_NAME_PERMISSION','USER_FULL_NAME_PERMISSION','USER_PHONE_NUMBER_PERMISSION','USER_AVATAR_PERMISSION']}}),
  'requestPermissionWithCode': () => requestPermissionWithCode(getInput() || {'data':{'permissionCode':'USER_AGE_PERMISSION'}}),
  'checkPermissionWithCode': () => checkPermissionWithCode(getInput() || {'data':{'permissionCode':'USER_AGE_PERMISSION'}}),
  'getMultipleUserData': () => getMultipleUserData(getInput() || {'data':{'dataNames':['age','userName','fullName','phone','email','avatar']}}),
  'clearPermissionCache': () => clearPermissionCache(getInput() || {'data':{}}),
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
  'executeLocalAuthentication': () => executeLocalAuthentication(getInput() || {'data':{'authOptionsParam':{'sensitiveTransaction':true,'authClassification':['WEAK','STRONG','DEVICE'],'sticky':false,'isShowErrorDialog':true}}}),
  'getLocalAuthenticationStatus': () => getLocalAuthenticationStatus(),
  'getContacts': () => getContacts(getInput() || {'data':{'filter':{'contactName':'John'},'pager':{'pageNumber':1,'limitRow':100}}}),
  'pickFile': () => pickFile(getInput() || {'data':{'mimeType':['image/*','video/*'],'isCapture':true,'source':'PhotoLibrary'}}),
  'saveStringValue': () => saveStringValue(getInput() || {'data':{'key':'user_preference','value':'dark_mode'}}),
  'saveBooleanValue': () => saveBooleanValue(getInput() || {'data':{'key':'notifications_enabled','value':true}}),
  'saveIntegerValue': () => saveIntegerValue(getInput() || {'data':{'key':'login_count','value':5}}),
  'saveLongValue': () => saveLongValue(getInput() || {'data':{'key':'last_sync_timestamp','value':1234567890}}),
  'saveFloatValue': () => saveFloatValue(getInput() || {'data':{'key':'rating','value':4.5}}),
  'getStringValue': () => getStringValue(getInput() || {'data':{'key':'user_preference','defaultValue':'light_mode'}}),
  'getBooleanValue': () => getBooleanValue(getInput() || {'data':{'key':'notifications_enabled','defaultValue':false}}),
  'getIntegerValue': () => getIntegerValue(getInput() || {'data':{'key':'...','defaultValue':0}}),
  'getLongValue': () => getLongValue(getInput() || {'data':{'key':'...','defaultValue':0}}),
  'getFloatValue': () => getFloatValue(getInput() || {'data':{'key':'...','defaultValue':'...'}}),
  'clearStorage': () => clearStorage(),
  'getLocation': () => getLocation(),
  'setBackgroundStatusBarColor': () => setBackgroundStatusBarColor(getInput() || {'data':{'color':'#FF5722'}}),
  'setNavigationBarColor': () => setNavigationBarColor(getInput() || {'data':{'color':'#2196F3'}}),
  'updateStatusBarAppearance': () => updateStatusBarAppearance(getInput() || {'data':{'appearance':'DARK'}}),
  'updateNavigationBarAppearance': () => updateNavigationBarAppearance(getInput() || {'data':{'appearance':'LIGHT '}}),
  'shareTextContent': () => shareTextContent(getInput() || {'data':{'content':'Check out this amazing product!'}}),
  'invoke': () => app.invoke(getInput()?.event || 'GET_LOCATION', getInput()),
};

interface EventInfo {
  name: string;
  event: string;
  desc: string;
  hasParams: boolean;
  defaultData: string;
}

const groups: { title: string; events: EventInfo[] }[] = [
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
      { name: 'requestCameraPermission', event: 'REQUEST_CAMERA_PERMISSION', desc: 'Yêu cầu mở camera', hasParams: false, defaultData: '' },
      { name: 'requestLocationPermission', event: 'REQUEST_LOCATION_PERMISSION', desc: 'Yêu cầu vị trí', hasParams: false, defaultData: '' },
      { name: 'requestPhotosPermission', event: 'REQUEST_PHOTOS_PERMISSION', desc: 'Yêu cầu truy cập ảnh trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'requestVideosPermission', event: 'REQUEST_VIDEOS_PERMISSION', desc: 'Yêu cầu truy cập video trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'requestAudioPermission', event: 'REQUEST_AUDIO_PERMISSION', desc: 'Yêu cầu truy cập audio trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'requestRecordAudioPermission', event: 'REQUEST_RECORD_AUDIO_PERMISSION', desc: 'Yêu cầu ghi âm trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'requestContactsPermission', event: 'REQUEST_CONTACTS_PERMISSION', desc: 'Yêu cầu truy cập danh bạ trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'requestDocumentPermission', event: 'REQUEST_DOCUMENT_PERMISSION', desc: 'Yêu cầu truy cập tài liệu trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'requestPhoneCallPermission', event: 'REQUEST_PHONE_CALL_PERMISSION', desc: 'Yêu cầu thực hiện cuộc gọi trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'requestPaymentPermission', event: 'REQUEST_PAYMENT_PERMISSION', desc: '', hasParams: false, defaultData: '' },
      { name: 'requestLoginPermission', event: 'REQUEST_LOGIN_PERMISSION', desc: '', hasParams: false, defaultData: '' },
      { name: 'requestLocalAuthenticationPermission', event: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION', desc: 'Yêu cầu xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: '' },
      { name: 'executeLocalAuthentication', event: 'EXECUTE_LOCAL_AUTHENTICATION', desc: 'Thực hiện xác thực sinh trắc học (vân tay, Face ID).', hasParams: true, defaultData: '{"data":{"authOptionsParam":{"sensitiveTransaction":true,"authClassification":["WEAK","STRONG","DEVICE"],"sticky":false,"isShowErrorDialog":true}}}' }
  ] },
  { title: 'Device Check Permission', events: [
      { name: 'checkPermissionWithCode', event: 'CHECK_PERMISSION_WITH_CODE', desc: 'Kiểm tra trạng thái quyền cụ thể.', hasParams: true, defaultData: '{"data":{"permissionCode":"USER_AGE_PERMISSION"}}' },
      { name: 'checkCameraPermission', event: 'CHECK_CAMERA_PERMISSION', desc: 'Kiểm tra quyền camera', hasParams: false, defaultData: '' },
      { name: 'checkLocationPermission', event: 'CHECK_LOCATION_PERMISSION', desc: 'Kiểm tra quyền vị trí', hasParams: false, defaultData: '' },
      { name: 'checkPhotosPermission', event: 'CHECK_PHOTOS_PERMISSION', desc: 'Kiểm tra quyền truy cập ảnh', hasParams: false, defaultData: '' },
      { name: 'checkVideosPermission', event: 'CHECK_VIDEOS_PERMISSION', desc: 'Kiểm tra quyền truy cập video', hasParams: false, defaultData: '' },
      { name: 'checkAudioPermission', event: 'CHECK_AUDIO_PERMISSION', desc: 'Kiểm tra quyền truy cập file audio', hasParams: false, defaultData: '' },
      { name: 'checkRecordAudioPermission', event: 'CHECK_RECORD_AUDIO_PERMISSION', desc: 'Kiểm tra quyền ghi âm trên thiết bị', hasParams: false, defaultData: '' },
      { name: 'checkContactsPermission', event: 'CHECK_CONTACTS_PERMISSION', desc: 'Kiểm tra quyền truy cập danh bạ', hasParams: false, defaultData: '' },
      { name: 'checkDocumentPermission', event: 'CHECK_DOCUMENT_PERMISSION', desc: 'Kiểm tra quyền truy cập file tài liệu', hasParams: false, defaultData: '' },
      { name: 'checkPhoneCallPermission', event: 'CHECK_PHONE_CALL_PERMISSION', desc: 'Kiểm tra quyền gọi điện', hasParams: false, defaultData: '' },
      { name: 'checkPaymentPermission', event: 'CHECK_PAYMENT_PERMISSION', desc: '', hasParams: false, defaultData: '' },
      { name: 'checkLoginPermission', event: 'CHECK_LOGIN_PERMISSION', desc: '', hasParams: false, defaultData: '' },
      { name: 'checkLocalAuthenticationPermission', event: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION', desc: 'kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: '' }
  ] },
  { title: 'Get data event', events: [
      { name: 'getMultipleUserData', event: 'GET_MULTIPLE_USER_DATA', desc: 'Lấy nhiều trường dữ liệu người dùng từ host app.', hasParams: true, defaultData: '{"data":{"dataNames":["age","userName","fullName","phone","email","avatar"]}}' },
      { name: 'clearPermissionCache', event: 'CLEAR_PERMISSION_CACHE', desc: 'Xóa tất cả quyền đã cache ở local.', hasParams: true, defaultData: '{"data":{}}' },
      { name: 'getLocalAuthenticationStatus', event: 'GET_LOCAL_AUTHENTICATION_STATUS', desc: ' lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: '' },
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
      { name: 'clearStorage', event: 'CLEAR_STORAGE', desc: 'Lấy giá trị kiểu float.', hasParams: false, defaultData: '' }
  ] },
  { title: 'Location', events: [
      { name: 'getLocation', event: 'GET_LOCATION', desc: 'Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.', hasParams: false, defaultData: '' }
  ] },
  { title: 'UI', events: [
      { name: 'setBackgroundStatusBarColor', event: 'SET_BACKGROUND_STATUS_BAR_COLOR', desc: 'Thay đổi màu nền status bar.', hasParams: true, defaultData: '{"data":{"color":"#FF5722"}}' },
      { name: 'setNavigationBarColor', event: 'SET_NAVIGATION_BAR_COLOR', desc: 'Thay đổi màu nền navigation bar.', hasParams: true, defaultData: '{"data":{"color":"#2196F3"}}' },
      { name: 'updateStatusBarAppearance', event: 'UPDATE_STATUS_BAR_APPEARANCE', desc: 'Chuyển đổi status bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{"appearance":"DARK"}}' },
      { name: 'updateNavigationBarAppearance', event: 'UPDATE_NAVIGATION_BAR_APPEARANCE', desc: 'Chuyển đổi navigation bar giữa dark mode và light mode.', hasParams: true, defaultData: '{"data":{"appearance":"LIGHT "}}' }
  ] }
];

function log(msg: string, data?: any) {
  const entry = data ? `${msg}: ${JSON.stringify(data, null, 2)}` : msg;
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${entry}`);
}

async function runEvent(evt: EventInfo) {
  popup.value = null;
  const fn = fns[evt.name];
  if (!fn) return;
  try {
    log(`> ${evt.name}...`);
    const res = await fn();
    log(`OK ${evt.name}`, res);
  } catch (err: any) {
    log(`ERR ${evt.name}`, err);
  }
}

function fillInput(evt: EventInfo) {
  if (evt.defaultData) {
    try { input.value = JSON.stringify(JSON.parse(evt.defaultData), null, 2); } catch {}
  }
  popup.value = null;
}

function showPopup(evt: EventInfo) {
  popup.value = popup.value?.name === evt.name ? null : evt;
}
</script>

<template>
  <div class="container">
    <h1>MiniApp SDK - Vue Demo</h1>

    <div class="sticky-top">
      <!-- Input -->
      <section>
        <h3 class="section-title">Input Data (JSON)</h3>
        <textarea
          rows="5"
          v-model="input"
          placeholder='{"data":{"url":"https://example.com"}}'
          class="input-area"
        ></textarea>
      </section>

      <!-- Logs -->
      <div style="margin-top: 16px">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <h3 style="margin: 0">Logs</h3>
          <button class="btn" @click="logs = []">Clear</button>
        </div>
        <pre class="log-area"><code style="width: 800px; display: block;">{{ formatLog }}</code></pre>
      </div>
    </div>

    <!-- Event groups -->
    <section v-for="group in groups" :key="group.title">
      <h3 class="section-title">{{ group.title }}</h3>
      <div class="btn-group">
        <div v-for="evt in group.events" :key="evt.name" class="evt-wrap">
          <button class="btn" @click="showPopup(evt)" :title="evt.desc">{{ evt.name }}</button>
          <div v-if="popup?.name === evt.name" class="popup-custom">
            <div class="popup-title">{{ evt.event }}</div>
            <div v-if="evt.desc" class="popup-desc">{{ evt.desc }}</div>
            <div class="popup-actions">
              <button class="btn btn-run" @click="runEvent(evt)">Run</button>
              <button v-if="evt.hasParams" class="btn btn-fill" @click="fillInput(evt)">Fill Input</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Generic invoke -->
    <section>
      <h3 class="section-title">Generic invoke()</h3>
      <div class="btn-group">
        <button class="btn" @click="runEvent({ name: 'invoke', event: 'INVOKE', desc: '', hasParams: false, defaultData: '' })">invoke(input)</button>
      </div>
    </section>
    <div style="padding: 50px"></div>
  </div>
</template>

<style>
.container { font-family: system-ui; top: 0; left: 0; padding: 16px; margin: 0 auto; position: fixed; width: 100vw; height: 100vh; overflow: auto; background: #f9f9f9; }
h1 { font-size: 20px; }
.sticky-top { position: sticky; top: -20px; background: white; z-index: 1; padding-right: 20px;}
.section-title { font-size: 14px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 4px; }
.btn-group { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; font-size: 12px; }
.btn:hover { background: #e8e8e8; }
.btn-run { background: #4CAF50; color: #fff; border-color: #4CAF50; }
.btn-run:hover { background: #45a049; }
.btn-fill { background: #2196F3; color: #fff; border-color: #2196F3; }
.btn-fill:hover { background: #1e88e5; }
.input-area { width: calc(100vw - 40px); min-height: 60px; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; }
.evt-wrap { position: relative; display: inline-block; }
.popup-custom { position: absolute; top: 100%; left: 0; z-index: 100; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px; min-width: 220px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.popup-title { font-weight: bold; font-size: 12px; margin-bottom: 4px; }
.popup-desc { font-size: 11px; color: #666; margin-bottom: 8px; }
.popup-actions { display: flex; gap: 6px; }
.overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 50; }
.log-area {
    margin-top: 10px;
    padding: 12px;
    background-color: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    border-radius: 6px;
    border: 1px solid #333;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}
.log-area::-webkit-scrollbar { width: 8px; height: 8px; }
.log-area::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
.log-area::-webkit-scrollbar-thumb:hover { background: #555; }

</style>
