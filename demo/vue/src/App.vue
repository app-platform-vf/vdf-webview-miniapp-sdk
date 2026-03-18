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
  'appOpenWebview': () => appOpenWebview(getInput() || {'data':{'url':'URL của webview cần mở','serviceName':'Tiêu đề hiển thị trên app bar','isPaymentConfirm':true,'resourceType':'HTML = mở trong webview, khác = mở brows','returnUrl':'URL trả về khi thành công/thất bại/timeo','cancelUrl':'URL trả về khi người dùng cancel'}}),
  'appOpenStore': () => appOpenStore(getInput() || {'data':{'fallbackUrlAndroid':'URL android','fallbackUrlIos':'URL Ios'}}),
  'exit': () => exit(getInput() || {'data':{'navigationAction':'Quay về trang chủ của host app; TH khác '}}),
  'openExternalLink': () => openExternalLink(getInput() || {'data':{'uri':'Link Ngoài'}}),
  'openMiniApp': () => openMiniApp(getInput() || {'data':{'route':{},'miniappKey':'Key của Mini App cần mở - ','additional':{},'launchConfig':{},'navStyle':{},'tracking':{}}}),
  'requestMultipleUserDataPermission': () => requestMultipleUserDataPermission(getInput() || {'data':{'permissionCodes':['example1','example2'],'useSameReason':true}}),
  'checkMultipleUserDataPermission': () => checkMultipleUserDataPermission(getInput() || {'data':{'permissionCodes':['example1','example2']}}),
  'requestPermissionWithCode': () => requestPermissionWithCode(getInput() || {'data':{'permissionCode':'mã quyền'}}),
  'getMultipleUserData': () => getMultipleUserData(getInput() || {'data':{'dataNames':['example1','example2']}}),
  'checkPermissionWithCode': () => checkPermissionWithCode(getInput() || {'data':{'permissionCode':'Tham so 1'}}),
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
  'checkLocalAuthenticationPermission': () => checkLocalAuthenticationPermission(getInput() || {'data':{'authOptionsParam':{}}}),
  'getLocalAuthenticationStatus': () => getLocalAuthenticationStatus(),
  'getContacts': () => getContacts(getInput() || {'data':{'filter':{},'pager':{}}}),
  'pickFile': () => pickFile(getInput() || {'data':{'mimeType':['example1','example2'],'isCapture':true}}),
  'getLocation': () => getLocation(),
  'setBackgroundStatusBarColor': () => setBackgroundStatusBarColor(getInput() || {'data':{},'color':'example'}),
  'setNavigationBarColor': () => setNavigationBarColor(getInput() || {'data':{},'color':'example'}),
  'updateStatusBarAppearance': () => updateStatusBarAppearance(getInput() || {'data':{},'appearance':'example'}),
  'updateNavigationBarAppearance': () => updateNavigationBarAppearance(getInput() || {'data':{},'appearance':'example'}),
  'shareTextContent': () => shareTextContent(getInput() || {'data':{},'content':'example'}),
  'storageGet': () => storageGet(getInput() || {'key':'example'}),
  'storageSet': () => storageSet(getInput() || {'key':'example','data':'example'}),
  'storageRemove': () => storageRemove(getInput() || {'key':'example'}),
  'storageClear': () => storageClear(),
  'storageInfo': () => storageInfo(),
  'uiShowToast': () => uiShowToast(getInput() || {'title':'example','icon':'example','duration':1}),
  'uiHideToast': () => uiHideToast(),
  'uiShowLoading': () => uiShowLoading(getInput() || {'title':'example','mask':true}),
  'uiHideLoading': () => uiHideLoading(),
  'uiShowDialog': () => uiShowDialog(getInput() || {'title':'example','content':'example','confirmText':'example','cancelText':'example','showCancel':true}),
  'uiShowActionSheet': () => uiShowActionSheet(getInput() || {'itemList':[]}),
  'navigatorPush': () => navigatorPush(getInput() || {'url':'example','params':{}}),
  'navigatorPop': () => navigatorPop(getInput() || {'delta':1}),
  'navigatorSwitchTab': () => navigatorSwitchTab(getInput() || {'url':'example'}),
  'navigatorRedirect': () => navigatorRedirect(getInput() || {'url':'example','params':{}}),
  'navigatorReLaunch': () => navigatorReLaunch(getInput() || {'url':'example'}),
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
      { name: 'requestLocalAuthenticationPermission', event: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION', desc: 'Yêu cầu xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: '' }
  ] },
  { title: 'Check Permissions', events: [
      { name: 'checkMultipleUserDataPermission', event: 'CHECK_MULTIPLE_USER_DATA_PERMISSION', desc: 'Kiểm tra trạng thái nhiều quyền user data cùng lúc.', hasParams: true, defaultData: '{"data":{"permissionCodes":["example1","example2"]}}' },
      { name: 'checkPermissionWithCode', event: 'CHECK_PERMISSION_WITH_CODE', desc: 'Kiểm tra trạng thái quyền cụ thể.', hasParams: true, defaultData: '{"data":{"permissionCode":"Tham so 1"}}' },
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
      { name: 'checkLocalAuthenticationPermission', event: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION', desc: 'kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).', hasParams: true, defaultData: '{"data":{"authOptionsParam":{}}}' }
  ] },
  { title: 'Data', events: [
      { name: 'getMultipleUserData', event: 'GET_MULTIPLE_USER_DATA', desc: 'Lấy nhiều trường dữ liệu người dùng từ host app.', hasParams: true, defaultData: '{"data":{"dataNames":["example1","example2"]}}' },
      { name: 'getLocalAuthenticationStatus', event: 'GET_LOCAL_AUTHENTICATION_STATUS', desc: ' lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).', hasParams: false, defaultData: '' },
      { name: 'getContacts', event: 'GET_CONTACTS', desc: 'Truy cập danh bạ', hasParams: true, defaultData: '{"data":{"filter":{},"pager":{}}}' },
      { name: 'getLocation', event: 'GET_LOCATION', desc: 'Lấy vị trí thiết bị', hasParams: false, defaultData: '' }
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
      { name: 'storageClear', event: 'STORAGE_CLEAR', desc: 'Xóa toàn bộ dữ liệu trong storage.', hasParams: false, defaultData: '' },
      { name: 'storageInfo', event: 'STORAGE_INFO', desc: 'Lấy thông tin dung lượng storage.', hasParams: false, defaultData: '' }
  ] },
  { title: 'UI', events: [
      { name: 'uiShowToast', event: 'UI_SHOW_TOAST', desc: 'Hiển thị toast notification.', hasParams: true, defaultData: '{"title":"example","icon":"example","duration":1}' },
      { name: 'uiHideToast', event: 'UI_HIDE_TOAST', desc: 'Ẩn toast hiện tại.', hasParams: false, defaultData: '' },
      { name: 'uiShowLoading', event: 'UI_SHOW_LOADING', desc: 'Hiển thị loading indicator.', hasParams: true, defaultData: '{"title":"example","mask":true}' },
      { name: 'uiHideLoading', event: 'UI_HIDE_LOADING', desc: 'Ẩn loading indicator.', hasParams: false, defaultData: '' },
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
