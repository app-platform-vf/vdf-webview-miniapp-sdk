<script setup lang="ts">
import { ref } from 'vue';
import { useMiniApp } from '@webview-sdk/vue';
import {
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
  isSuccess,
} from '@webview-sdk/core';

const { invoke, storage, ui, navigator: nav, ready } = useMiniApp({ debug: true });
const logs = ref<string[]>([]);

function log(msg: string, data?: any) {
  const entry = data ? `${msg}: ${JSON.stringify(data)}` : msg;
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${entry}`);
}

async function run(label: string, fn: () => Promise<any>) {
  try {
    log(`▶ ${label}...`);
    const res = await fn();
    log(`✓ ${label}`, res);
  } catch (err: any) {
    log(`✗ ${label} ERROR: ${err.message}`);
  }
}
</script>

<template>
  <div style="font-family: system-ui; padding: 16px; max-width: 600px; margin: 0 auto">
    <h1 style="font-size: 20px">🚀 MiniApp SDK - Vue Demo</h1>

    <!-- Lifecycle -->
    <section>
      <h3 class="section-title">Lifecycle</h3>
      <div class="btn-group">
        <button class="btn" @click="ready(); log('SDK ready()')">ready()</button>
      </div>
    </section>

    <!-- Storage -->
    <section>
      <h3 class="section-title">Storage API</h3>
      <div class="btn-group">
        <button class="btn" @click="run('storage.set', () => storage.set('demo_key', { hello: 'world', ts: Date.now() }))">storage.set</button>
        <button class="btn" @click="run('storage.get', () => storage.get('demo_key'))">storage.get</button>
        <button class="btn" @click="run('storage.remove', () => storage.remove('demo_key'))">storage.remove</button>
        <button class="btn" @click="run('storage.clear', () => storage.clear())">storage.clear</button>
        <button class="btn" @click="run('storage.info', () => storage.info())">storage.info</button>
      </div>
    </section>

    <!-- UI -->
    <section>
      <h3 class="section-title">UI API</h3>
      <div class="btn-group">
        <button class="btn" @click="run('showToast', () => ui.showToast({ title: 'Hello from Vue!' }))">showToast</button>
        <button class="btn" @click="run('showLoading', () => ui.showLoading({ title: 'Loading...' }))">showLoading</button>
        <button class="btn" @click="run('hideLoading', () => ui.hideLoading())">hideLoading</button>
        <button class="btn" @click="run('showDialog', () => ui.showDialog({ title: 'Confirm', content: 'Are you sure?', showCancel: true }))">showDialog</button>
        <button class="btn" @click="run('showActionSheet', () => ui.showActionSheet({ itemList: ['Option A', 'Option B', 'Option C'] }))">showActionSheet</button>
      </div>
    </section>

    <!-- Navigator -->
    <section>
      <h3 class="section-title">Navigator API</h3>
      <div class="btn-group">
        <button class="btn" @click="run('navigator.push', () => nav.push('/detail', { id: 1 }))">push /detail</button>
        <button class="btn" @click="run('navigator.pop', () => nav.pop())">pop</button>
        <button class="btn" @click="run('navigator.redirect', () => nav.redirect('/home'))">redirect /home</button>
        <button class="btn" @click="run('navigator.switchTab', () => nav.switchTab('/tab2'))">switchTab</button>
      </div>
    </section>

    <!-- Data APIs -->
    <section>
      <h3 class="section-title">Data APIs (Generated)</h3>
      <div class="btn-group">
        <button class="btn" @click="run('getLocation', getLocation)">getLocation</button>
        <button class="btn" @click="run('getContacts', getContacts)">getContacts</button>
        <button class="btn" @click="run('getMultipleUserData', () => getMultipleUserData({ data: { dataNames: ['age', 'userName', 'fullName'] } }))">getMultipleUserData</button>
        <button class="btn" @click="run('getLocalAuthStatus', getLocalAuthenticationStatus)">getLocalAuthStatus</button>
      </div>
    </section>

    <!-- Request Permissions -->
    <section>
      <h3 class="section-title">Request Permissions (Generated)</h3>
      <div class="btn-group">
        <button class="btn" @click="run('requestCamera', requestCameraPermission)">Camera</button>
        <button class="btn" @click="run('requestLocation', requestLocationPermission)">Location</button>
        <button class="btn" @click="run('requestPhotos', requestPhotosPermission)">Photos</button>
        <button class="btn" @click="run('requestContacts', requestContactsPermission)">Contacts</button>
        <button class="btn" @click="run('requestLogin', requestLoginPermission)">Login</button>
        <button class="btn" @click="run('requestPayment', requestPaymentPermission)">Payment</button>
      </div>
    </section>

    <!-- Check Permissions -->
    <section>
      <h3 class="section-title">Check Permissions (Generated)</h3>
      <div class="btn-group">
        <button class="btn" @click="run('checkCamera', checkCameraPermission)">Camera</button>
        <button class="btn" @click="run('checkLocation', checkLocationPermission)">Location</button>
        <button class="btn" @click="run('checkLogin', checkLoginPermission)">Login</button>
        <button class="btn" @click="run('clearCache', () => clearPermissionCache({} as any))">clearCache</button>
      </div>
    </section>

    <!-- Navigation APIs -->
    <section>
      <h3 class="section-title">Navigation APIs (Generated)</h3>
      <div class="btn-group">
        <button class="btn" @click="run('appOpenWebview', () => appOpenWebview({ data: { url: 'https://example.com', serviceName: 'Demo' } }))">appOpenWebview</button>
        <button class="btn" @click="run('openExternalLink', () => openExternalLink({ data: { uri: 'https://example.com' } }))">openExternalLink</button>
        <button class="btn" @click="run('exit', () => exit({ data: { navigationAction: 'RETURN_HOME_APP' } }))">exit</button>
      </div>
    </section>

    <!-- UI Customization -->
    <section>
      <h3 class="section-title">UI Customization (Generated)</h3>
      <div class="btn-group">
        <button class="btn" @click="run('statusBarColor', () => setBackgroundStatusBarColor({ color: '#FF5722' }))">StatusBar Color</button>
        <button class="btn" @click="run('navBarColor', () => setNavigationBarColor({ color: '#2196F3' }))">NavBar Color</button>
        <button class="btn" @click="run('statusBarDark', () => updateStatusBarAppearance({ appearance: 'DARK' }))">StatusBar Dark</button>
        <button class="btn" @click="run('navBarLight', () => updateNavigationBarAppearance({ appearance: 'LIGHT' }))">NavBar Light</button>
      </div>
    </section>

    <!-- Other APIs -->
    <section>
      <h3 class="section-title">Other APIs (Generated)</h3>
      <div class="btn-group">
        <button class="btn" @click="run('shareText', () => shareTextContent({ content: 'Hello from MiniApp SDK!' }))">shareText</button>
        <button class="btn" @click="run('pickFile', () => pickFile({ data: { mimeType: ['image/*'] } }))">pickFile</button>
      </div>
    </section>

    <!-- Generic invoke -->
    <section>
      <h3 class="section-title">Generic invoke()</h3>
      <div class="btn-group">
        <button class="btn" @click="run('invoke GET_LOCATION', () => invoke('GET_LOCATION'))">invoke('GET_LOCATION')</button>
      </div>
    </section>

    <!-- Logs -->
    <div style="margin-top: 16px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h3 style="margin: 0">Logs</h3>
        <button class="btn" @click="logs = []">Clear</button>
      </div>
      <pre class="log-area">{{ logs.length ? logs.join('\n') : 'No logs yet. Click a button above.' }}</pre>
    </div>
  </div>
</template>

<style>
.section-title {
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 12px;
}
.btn:hover {
  background: #e8e8e8;
}
.log-area {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
  white-space: pre-wrap;
}
</style>
