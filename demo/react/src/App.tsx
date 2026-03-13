import { useState, useCallback } from 'react';
import { useMiniApp } from '@webview-sdk/react';
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

export default function App() {
  const { invoke, storage, ui, navigator: nav, ready, on, off } = useMiniApp({ debug: true });
  const [logs, setLogs] = useState<string[]>([]);

  const log = useCallback((msg: string, data?: any) => {
    const entry = data ? `${msg}: ${JSON.stringify(data)}` : msg;
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${entry}`, ...prev]);
  }, []);

  const run = useCallback(async (label: string, fn: () => Promise<any>) => {
    try {
      log(`▶ ${label}...`);
      const res = await fn();
      log(`✓ ${label}`, res);
    } catch (err: any) {
      log(`✗ ${label} ERROR: ${err.message}`);
    }
  }, [log]);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20 }}>🚀 MiniApp SDK - React Demo</h1>

      {/* Lifecycle */}
      <Section title="Lifecycle">
        <Btn onClick={() => { ready(); log('SDK ready()'); }}>ready()</Btn>
      </Section>

      {/* Storage */}
      <Section title="Storage API">
        <Btn onClick={() => run('storage.set', () => storage.set('demo_key', { hello: 'world', ts: Date.now() }))}>
          storage.set
        </Btn>
        <Btn onClick={() => run('storage.get', () => storage.get('demo_key'))}>storage.get</Btn>
        <Btn onClick={() => run('storage.remove', () => storage.remove('demo_key'))}>storage.remove</Btn>
        <Btn onClick={() => run('storage.clear', () => storage.clear())}>storage.clear</Btn>
        <Btn onClick={() => run('storage.info', () => storage.info())}>storage.info</Btn>
      </Section>

      {/* UI */}
      <Section title="UI API">
        <Btn onClick={() => run('showToast', () => ui.showToast({ title: 'Hello from React!' }))}>showToast</Btn>
        <Btn onClick={() => run('showLoading', () => ui.showLoading({ title: 'Loading...' }))}>showLoading</Btn>
        <Btn onClick={() => run('hideLoading', () => ui.hideLoading())}>hideLoading</Btn>
        <Btn onClick={() => run('showDialog', () => ui.showDialog({ title: 'Confirm', content: 'Are you sure?', showCancel: true }))}>showDialog</Btn>
        <Btn onClick={() => run('showActionSheet', () => ui.showActionSheet({ itemList: ['Option A', 'Option B', 'Option C'] }))}>showActionSheet</Btn>
      </Section>

      {/* Navigator */}
      <Section title="Navigator API">
        <Btn onClick={() => run('navigator.push', () => nav.push('/detail', { id: 1 }))}>push /detail</Btn>
        <Btn onClick={() => run('navigator.pop', () => nav.pop())}>pop</Btn>
        <Btn onClick={() => run('navigator.redirect', () => nav.redirect('/home'))}>redirect /home</Btn>
        <Btn onClick={() => run('navigator.switchTab', () => nav.switchTab('/tab2'))}>switchTab</Btn>
      </Section>

      {/* Generated API - Data */}
      <Section title="Data APIs (Generated)">
        <Btn onClick={() => run('getLocation', getLocation)}>getLocation</Btn>
        <Btn onClick={() => run('getContacts', getContacts)}>getContacts</Btn>
        <Btn onClick={() => run('getMultipleUserData', () => getMultipleUserData({ data: { dataNames: ['age', 'userName', 'fullName'] } }))}>getMultipleUserData</Btn>
        <Btn onClick={() => run('getLocalAuthenticationStatus', getLocalAuthenticationStatus)}>getLocalAuthStatus</Btn>
      </Section>

      {/* Generated API - Permissions Request */}
      <Section title="Request Permissions (Generated)">
        <Btn onClick={() => run('requestCamera', requestCameraPermission)}>Camera</Btn>
        <Btn onClick={() => run('requestLocation', requestLocationPermission)}>Location</Btn>
        <Btn onClick={() => run('requestPhotos', requestPhotosPermission)}>Photos</Btn>
        <Btn onClick={() => run('requestContacts', requestContactsPermission)}>Contacts</Btn>
        <Btn onClick={() => run('requestLogin', requestLoginPermission)}>Login</Btn>
        <Btn onClick={() => run('requestPayment', requestPaymentPermission)}>Payment</Btn>
      </Section>

      {/* Generated API - Permissions Check */}
      <Section title="Check Permissions (Generated)">
        <Btn onClick={() => run('checkCamera', checkCameraPermission)}>Camera</Btn>
        <Btn onClick={() => run('checkLocation', checkLocationPermission)}>Location</Btn>
        <Btn onClick={() => run('checkLogin', checkLoginPermission)}>Login</Btn>
        <Btn onClick={() => run('clearCache', () => clearPermissionCache({} as any))}>clearCache</Btn>
      </Section>

      {/* Generated API - Navigation */}
      <Section title="Navigation APIs (Generated)">
        <Btn onClick={() => run('appOpenWebview', () => appOpenWebview({ data: { url: 'https://example.com', serviceName: 'Demo' } }))}>appOpenWebview</Btn>
        <Btn onClick={() => run('openExternalLink', () => openExternalLink({ data: { uri: 'https://example.com' } }))}>openExternalLink</Btn>
        <Btn onClick={() => run('exit', () => exit({ data: { navigationAction: 'RETURN_HOME_APP' } }))}>exit</Btn>
      </Section>

      {/* Generated API - UI Customization */}
      <Section title="UI Customization (Generated)">
        <Btn onClick={() => run('statusBarColor', () => setBackgroundStatusBarColor({ color: '#FF5722' }))}>StatusBar Color</Btn>
        <Btn onClick={() => run('navBarColor', () => setNavigationBarColor({ color: '#2196F3' }))}>NavBar Color</Btn>
        <Btn onClick={() => run('statusBarDark', () => updateStatusBarAppearance({ appearance: 'DARK' }))}>StatusBar Dark</Btn>
        <Btn onClick={() => run('navBarLight', () => updateNavigationBarAppearance({ appearance: 'LIGHT' }))}>NavBar Light</Btn>
      </Section>

      {/* Generated API - Others */}
      <Section title="Other APIs (Generated)">
        <Btn onClick={() => run('shareText', () => shareTextContent({ content: 'Hello from MiniApp SDK!' }))}>shareText</Btn>
        <Btn onClick={() => run('pickFile', () => pickFile({ data: { mimeType: ['image/*'] } }))}>pickFile</Btn>
      </Section>

      {/* Generic invoke */}
      <Section title="Generic invoke()">
        <Btn onClick={() => run('invoke GET_LOCATION', () => invoke('GET_LOCATION'))}>invoke('GET_LOCATION')</Btn>
      </Section>

      {/* Log area */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Logs</h3>
          <Btn onClick={() => setLogs([])}>Clear</Btn>
        </div>
        <pre style={{
          background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 8,
          fontSize: 12, maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap',
        }}>
          {logs.length ? logs.join('\n') : 'No logs yet. Click a button above.'}
        </pre>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 14, color: '#666', borderBottom: '1px solid #eee', paddingBottom: 4 }}>{title}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>{children}</div>
    </div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd',
        background: '#f5f5f5', cursor: 'pointer', fontSize: 12,
      }}
    >
      {children}
    </button>
  );
}
