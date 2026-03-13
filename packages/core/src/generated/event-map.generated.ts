// ============================================================
// AUTO-GENERATED — DO NOT EDIT
// Event map: ten event -> { request, response } types
// ============================================================

import type {
  AppOpenWebviewRequest,
  AppOpenWebviewResponse,
  AppOpenStoreRequest,
  AppOpenStoreResponse,
  ExitRequest,
  ExitResponse,
  OpenExternalLinkRequest,
  OpenExternalLinkResponse,
  OpenMiniAppRequest,
  OpenMiniAppResponse,
  RequestMultipleUserDataPermissionRequest,
  RequestMultipleUserDataPermissionResponse,
  CheckMultipleUserDataPermissionRequest,
  CheckMultipleUserDataPermissionResponse,
  RequestPermissionWithCodeRequest,
  RequestPermissionWithCodeResponse,
  GetMultipleUserDataRequest,
  GetMultipleUserDataResponse,
  CheckPermissionWithCodeRequest,
  CheckPermissionWithCodeResponse,
  ClearPermissionCacheRequest,
  ClearPermissionCacheResponse,
  RequestCameraPermissionRequest,
  RequestCameraPermissionResponse,
  RequestLocationPermissionRequest,
  RequestLocationPermissionResponse,
  RequestPhotosPermissionRequest,
  RequestPhotosPermissionResponse,
  RequestVideosPermissionRequest,
  RequestVideosPermissionResponse,
  RequestAudioPermissionRequest,
  RequestAudioPermissionResponse,
  RequestRecordAudioPermissionRequest,
  RequestRecordAudioPermissionResponse,
  RequestContactsPermissionRequest,
  RequestContactsPermissionResponse,
  RequestDocumentPermissionRequest,
  RequestDocumentPermissionResponse,
  RequestPhoneCallPermissionRequest,
  RequestPhoneCallPermissionResponse,
  RequestPaymentPermissionRequest,
  RequestPaymentPermissionResponse,
  RequestLoginPermissionRequest,
  RequestLoginPermissionResponse,
  RequestLocalAuthenticationPermissionRequest,
  RequestLocalAuthenticationPermissionResponse,
  CheckCameraPermissionRequest,
  CheckCameraPermissionResponse,
  CheckLocationPermissionRequest,
  CheckLocationPermissionResponse,
  CheckPhotosPermissionRequest,
  CheckPhotosPermissionResponse,
  CheckVideosPermissionRequest,
  CheckVideosPermissionResponse,
  CheckAudioPermissionRequest,
  CheckAudioPermissionResponse,
  CheckRecordAudioPermissionRequest,
  CheckRecordAudioPermissionResponse,
  CheckContactsPermissionRequest,
  CheckContactsPermissionResponse,
  CheckDocumentPermissionRequest,
  CheckDocumentPermissionResponse,
  CheckPhoneCallPermissionRequest,
  CheckPhoneCallPermissionResponse,
  CheckPaymentPermissionRequest,
  CheckPaymentPermissionResponse,
  CheckLoginPermissionRequest,
  CheckLoginPermissionResponse,
  CheckLocalAuthenticationPermissionRequest,
  CheckLocalAuthenticationPermissionResponse,
  GetLocalAuthenticationStatusRequest,
  GetLocalAuthenticationStatusResponse,
  GetContactsRequest,
  GetContactsResponse,
  PickFileRequest,
  PickFileResponse,
  GetLocationRequest,
  GetLocationResponse,
  SetBackgroundStatusBarColorRequest,
  SetBackgroundStatusBarColorResponse,
  SetNavigationBarColorRequest,
  SetNavigationBarColorResponse,
  UpdateStatusBarAppearanceRequest,
  UpdateStatusBarAppearanceResponse,
  UpdateNavigationBarAppearanceRequest,
  UpdateNavigationBarAppearanceResponse,
  ShareTextContentRequest,
  ShareTextContentResponse,
  StorageGetRequest,
  StorageGetResponse,
  StorageSetRequest,
  StorageSetResponse,
  StorageRemoveRequest,
  StorageRemoveResponse,
  StorageClearRequest,
  StorageClearResponse,
  StorageInfoRequest,
  StorageInfoResponse,
  UiShowToastRequest,
  UiShowToastResponse,
  UiHideToastRequest,
  UiHideToastResponse,
  UiShowLoadingRequest,
  UiShowLoadingResponse,
  UiHideLoadingRequest,
  UiHideLoadingResponse,
  UiShowDialogRequest,
  UiShowDialogResponse,
  UiShowActionSheetRequest,
  UiShowActionSheetResponse,
  NavigatorPushRequest,
  NavigatorPushResponse,
  NavigatorPopRequest,
  NavigatorPopResponse,
  NavigatorSwitchTabRequest,
  NavigatorSwitchTabResponse,
  NavigatorRedirectRequest,
  NavigatorRedirectResponse,
  NavigatorReLaunchRequest,
  NavigatorReLaunchResponse
} from './types.generated';

/** Map event name -> [RequestType, ResponseType] */
export interface MiniAppEventMap {
  'APP_OPEN_WEBVIEW': [AppOpenWebviewRequest, AppOpenWebviewResponse];
  'APP_OPEN_STORE': [AppOpenStoreRequest, AppOpenStoreResponse];
  'EXIT': [ExitRequest, ExitResponse];
  'OPEN_EXTERNAL_LINK': [OpenExternalLinkRequest, OpenExternalLinkResponse];
  'OPEN_MINI_APP': [OpenMiniAppRequest, OpenMiniAppResponse];
  'REQUEST_MULTIPLE_USER_DATA_PERMISSION': [RequestMultipleUserDataPermissionRequest, RequestMultipleUserDataPermissionResponse];
  'CHECK_MULTIPLE_USER_DATA_PERMISSION': [CheckMultipleUserDataPermissionRequest, CheckMultipleUserDataPermissionResponse];
  'REQUEST_PERMISSION_WITH_CODE': [RequestPermissionWithCodeRequest, RequestPermissionWithCodeResponse];
  'GET_MULTIPLE_USER_DATA': [GetMultipleUserDataRequest, GetMultipleUserDataResponse];
  'CHECK_PERMISSION_WITH_CODE': [CheckPermissionWithCodeRequest, CheckPermissionWithCodeResponse];
  'CLEAR_PERMISSION_CACHE': [ClearPermissionCacheRequest, ClearPermissionCacheResponse];
  'REQUEST_CAMERA_PERMISSION': [RequestCameraPermissionRequest, RequestCameraPermissionResponse];
  'REQUEST_LOCATION_PERMISSION': [RequestLocationPermissionRequest, RequestLocationPermissionResponse];
  'REQUEST_PHOTOS_PERMISSION': [RequestPhotosPermissionRequest, RequestPhotosPermissionResponse];
  'REQUEST_VIDEOS_PERMISSION': [RequestVideosPermissionRequest, RequestVideosPermissionResponse];
  'REQUEST_AUDIO_PERMISSION': [RequestAudioPermissionRequest, RequestAudioPermissionResponse];
  'REQUEST_RECORD_AUDIO_PERMISSION': [RequestRecordAudioPermissionRequest, RequestRecordAudioPermissionResponse];
  'REQUEST_CONTACTS_PERMISSION': [RequestContactsPermissionRequest, RequestContactsPermissionResponse];
  'REQUEST_DOCUMENT_PERMISSION': [RequestDocumentPermissionRequest, RequestDocumentPermissionResponse];
  'REQUEST_PHONE_CALL_PERMISSION': [RequestPhoneCallPermissionRequest, RequestPhoneCallPermissionResponse];
  'REQUEST_PAYMENT_PERMISSION': [RequestPaymentPermissionRequest, RequestPaymentPermissionResponse];
  'REQUEST_LOGIN_PERMISSION': [RequestLoginPermissionRequest, RequestLoginPermissionResponse];
  'REQUEST_LOCAL_AUTHENTICATION_PERMISSION': [RequestLocalAuthenticationPermissionRequest, RequestLocalAuthenticationPermissionResponse];
  'CHECK_CAMERA_PERMISSION': [CheckCameraPermissionRequest, CheckCameraPermissionResponse];
  'CHECK_LOCATION_PERMISSION': [CheckLocationPermissionRequest, CheckLocationPermissionResponse];
  'CHECK_PHOTOS_PERMISSION': [CheckPhotosPermissionRequest, CheckPhotosPermissionResponse];
  'CHECK_VIDEOS_PERMISSION': [CheckVideosPermissionRequest, CheckVideosPermissionResponse];
  'CHECK_AUDIO_PERMISSION': [CheckAudioPermissionRequest, CheckAudioPermissionResponse];
  'CHECK_RECORD_AUDIO_PERMISSION': [CheckRecordAudioPermissionRequest, CheckRecordAudioPermissionResponse];
  'CHECK_CONTACTS_PERMISSION': [CheckContactsPermissionRequest, CheckContactsPermissionResponse];
  'CHECK_DOCUMENT_PERMISSION': [CheckDocumentPermissionRequest, CheckDocumentPermissionResponse];
  'CHECK_PHONE_CALL_PERMISSION': [CheckPhoneCallPermissionRequest, CheckPhoneCallPermissionResponse];
  'CHECK_PAYMENT_PERMISSION': [CheckPaymentPermissionRequest, CheckPaymentPermissionResponse];
  'CHECK_LOGIN_PERMISSION': [CheckLoginPermissionRequest, CheckLoginPermissionResponse];
  'CHECK_LOCAL_AUTHENTICATION_PERMISSION': [CheckLocalAuthenticationPermissionRequest, CheckLocalAuthenticationPermissionResponse];
  'GET_LOCAL_AUTHENTICATION_STATUS': [GetLocalAuthenticationStatusRequest, GetLocalAuthenticationStatusResponse];
  'GET_CONTACTS': [GetContactsRequest, GetContactsResponse];
  'PICK_FILE': [PickFileRequest, PickFileResponse];
  'GET_LOCATION': [GetLocationRequest, GetLocationResponse];
  'SET_BACKGROUND_STATUS_BAR_COLOR': [SetBackgroundStatusBarColorRequest, SetBackgroundStatusBarColorResponse];
  'SET_NAVIGATION_BAR_COLOR': [SetNavigationBarColorRequest, SetNavigationBarColorResponse];
  'UPDATE_STATUS_BAR_APPEARANCE': [UpdateStatusBarAppearanceRequest, UpdateStatusBarAppearanceResponse];
  'UPDATE_NAVIGATION_BAR_APPEARANCE': [UpdateNavigationBarAppearanceRequest, UpdateNavigationBarAppearanceResponse];
  'SHARE_TEXT_CONTENT': [ShareTextContentRequest, ShareTextContentResponse];
  'STORAGE_GET': [StorageGetRequest, StorageGetResponse];
  'STORAGE_SET': [StorageSetRequest, StorageSetResponse];
  'STORAGE_REMOVE': [StorageRemoveRequest, StorageRemoveResponse];
  'STORAGE_CLEAR': [StorageClearRequest, StorageClearResponse];
  'STORAGE_INFO': [StorageInfoRequest, StorageInfoResponse];
  'UI_SHOW_TOAST': [UiShowToastRequest, UiShowToastResponse];
  'UI_HIDE_TOAST': [UiHideToastRequest, UiHideToastResponse];
  'UI_SHOW_LOADING': [UiShowLoadingRequest, UiShowLoadingResponse];
  'UI_HIDE_LOADING': [UiHideLoadingRequest, UiHideLoadingResponse];
  'UI_SHOW_DIALOG': [UiShowDialogRequest, UiShowDialogResponse];
  'UI_SHOW_ACTION_SHEET': [UiShowActionSheetRequest, UiShowActionSheetResponse];
  'NAVIGATOR_PUSH': [NavigatorPushRequest, NavigatorPushResponse];
  'NAVIGATOR_POP': [NavigatorPopRequest, NavigatorPopResponse];
  'NAVIGATOR_SWITCH_TAB': [NavigatorSwitchTabRequest, NavigatorSwitchTabResponse];
  'NAVIGATOR_REDIRECT': [NavigatorRedirectRequest, NavigatorRedirectResponse];
  'NAVIGATOR_RE_LAUNCH': [NavigatorReLaunchRequest, NavigatorReLaunchResponse];
}

/** Danh sach event name constants */
export const MINIAPP_EVENTS = {
  /** Mở một WebView mới với URL và cấu hình tùy chỉnh. */
  appOpenWebview: 'APP_OPEN_WEBVIEW' as const,
  /** Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài. */
  appOpenStore: 'APP_OPEN_STORE' as const,
  /** Đóng Mini App và điều hướng về màn hình khác. */
  exit: 'EXIT' as const,
  /** Mở URL bằng browser mặc định của hệ thống. */
  openExternalLink: 'OPEN_EXTERNAL_LINK' as const,
  /** Mở một Mini App khác từ Mini App hiện tại. */
  openMiniApp: 'OPEN_MINI_APP' as const,
  /** Yêu cầu nhiều quyền user data cùng một lúc. */
  requestMultipleUserDataPermission: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION' as const,
  /** Kiểm tra trạng thái nhiều quyền user data cùng lúc. */
  checkMultipleUserDataPermission: 'CHECK_MULTIPLE_USER_DATA_PERMISSION' as const,
  /** Yêu cầu quyền cụ thể theo permission code (cả SDK-level và device-level). */
  requestPermissionWithCode: 'REQUEST_PERMISSION_WITH_CODE' as const,
  /** Lấy nhiều trường dữ liệu người dùng từ host app. */
  getMultipleUserData: 'GET_MULTIPLE_USER_DATA' as const,
  /** Kiểm tra trạng thái quyền cụ thể. */
  checkPermissionWithCode: 'CHECK_PERMISSION_WITH_CODE' as const,
  /** Xóa tất cả quyền đã cache ở local. */
  clearPermissionCache: 'CLEAR_PERMISSION_CACHE' as const,
  /** Yêu cầu mở camera */
  requestCameraPermission: 'REQUEST_CAMERA_PERMISSION' as const,
  /** Yêu cầu vị trí */
  requestLocationPermission: 'REQUEST_LOCATION_PERMISSION' as const,
  /** Yêu cầu truy cập ảnh trên thiết bị */
  requestPhotosPermission: 'REQUEST_PHOTOS_PERMISSION' as const,
  /** Yêu cầu truy cập video trên thiết bị */
  requestVideosPermission: 'REQUEST_VIDEOS_PERMISSION' as const,
  /** Yêu cầu truy cập audio trên thiết bị */
  requestAudioPermission: 'REQUEST_AUDIO_PERMISSION' as const,
  /** Yêu cầu ghi âm trên thiết bị */
  requestRecordAudioPermission: 'REQUEST_RECORD_AUDIO_PERMISSION' as const,
  /** Yêu cầu truy cập danh bạ trên thiết bị */
  requestContactsPermission: 'REQUEST_CONTACTS_PERMISSION' as const,
  /** Yêu cầu truy cập tài liệu trên thiết bị */
  requestDocumentPermission: 'REQUEST_DOCUMENT_PERMISSION' as const,
  /** Yêu cầu thực hiện cuộc gọi trên thiết bị */
  requestPhoneCallPermission: 'REQUEST_PHONE_CALL_PERMISSION' as const,
  /**  */
  requestPaymentPermission: 'REQUEST_PAYMENT_PERMISSION' as const,
  /**  */
  requestLoginPermission: 'REQUEST_LOGIN_PERMISSION' as const,
  /** Yêu cầu xác thực sinh trắc học (vân tay, Face ID). */
  requestLocalAuthenticationPermission: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION' as const,
  /** Kiểm tra quyền camera */
  checkCameraPermission: 'CHECK_CAMERA_PERMISSION' as const,
  /** Kiểm tra quyền vị trí */
  checkLocationPermission: 'CHECK_LOCATION_PERMISSION' as const,
  /** Kiểm tra quyền truy cập ảnh */
  checkPhotosPermission: 'CHECK_PHOTOS_PERMISSION' as const,
  /** Kiểm tra quyền truy cập video */
  checkVideosPermission: 'CHECK_VIDEOS_PERMISSION' as const,
  /** Kiểm tra quyền truy cập file audio */
  checkAudioPermission: 'CHECK_AUDIO_PERMISSION' as const,
  /** Kiểm tra quyền ghi âm trên thiết bị */
  checkRecordAudioPermission: 'CHECK_RECORD_AUDIO_PERMISSION' as const,
  /** Kiểm tra quyền truy cập danh bạ */
  checkContactsPermission: 'CHECK_CONTACTS_PERMISSION' as const,
  /** Kiểm tra quyền truy cập file tài liệu */
  checkDocumentPermission: 'CHECK_DOCUMENT_PERMISSION' as const,
  /** Kiểm tra quyền gọi điện */
  checkPhoneCallPermission: 'CHECK_PHONE_CALL_PERMISSION' as const,
  /**  */
  checkPaymentPermission: 'CHECK_PAYMENT_PERMISSION' as const,
  /**  */
  checkLoginPermission: 'CHECK_LOGIN_PERMISSION' as const,
  /** kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID). */
  checkLocalAuthenticationPermission: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION' as const,
  /**  lấy trạng thái xác thực sinh trắc học (vân tay, Face ID). */
  getLocalAuthenticationStatus: 'GET_LOCAL_AUTHENTICATION_STATUS' as const,
  /** Truy cập danh bạ */
  getContacts: 'GET_CONTACTS' as const,
  /** Mở file tài liệu */
  pickFile: 'PICK_FILE' as const,
  /** Lấy vị trí thiết bị */
  getLocation: 'GET_LOCATION' as const,
  /** Thay đổi màu nền status bar. */
  setBackgroundStatusBarColor: 'SET_BACKGROUND_STATUS_BAR_COLOR' as const,
  /** Thay đổi màu nền navigation bar. */
  setNavigationBarColor: 'SET_NAVIGATION_BAR_COLOR' as const,
  /** Chuyển đổi status bar giữa dark mode và light mode. */
  updateStatusBarAppearance: 'UPDATE_STATUS_BAR_APPEARANCE' as const,
  /** Chuyển đổi navigation bar giữa dark mode và light mode. */
  updateNavigationBarAppearance: 'UPDATE_NAVIGATION_BAR_APPEARANCE' as const,
  /** Mở dialog chia sẻ nội dung text. */
  shareTextContent: 'SHARE_TEXT_CONTENT' as const,
  /** Lấy dữ liệu từ storage theo key. */
  storageGet: 'STORAGE_GET' as const,
  /** Lưu dữ liệu vào storage theo key. */
  storageSet: 'STORAGE_SET' as const,
  /** Xóa dữ liệu từ storage theo key. */
  storageRemove: 'STORAGE_REMOVE' as const,
  /** Xóa toàn bộ dữ liệu trong storage. */
  storageClear: 'STORAGE_CLEAR' as const,
  /** Lấy thông tin dung lượng storage. */
  storageInfo: 'STORAGE_INFO' as const,
  /** Hiển thị toast notification. */
  uiShowToast: 'UI_SHOW_TOAST' as const,
  /** Ẩn toast hiện tại. */
  uiHideToast: 'UI_HIDE_TOAST' as const,
  /** Hiển thị loading indicator. */
  uiShowLoading: 'UI_SHOW_LOADING' as const,
  /** Ẩn loading indicator. */
  uiHideLoading: 'UI_HIDE_LOADING' as const,
  /** Hiển thị dialog xác nhận. */
  uiShowDialog: 'UI_SHOW_DIALOG' as const,
  /** Hiển thị action sheet. */
  uiShowActionSheet: 'UI_SHOW_ACTION_SHEET' as const,
  /** Mở trang mới (thêm vào navigation stack). */
  navigatorPush: 'NAVIGATOR_PUSH' as const,
  /** Quay lại trang trước. */
  navigatorPop: 'NAVIGATOR_POP' as const,
  /** Chuyển sang tab khác. */
  navigatorSwitchTab: 'NAVIGATOR_SWITCH_TAB' as const,
  /** Redirect (thay thế trang hiện tại). */
  navigatorRedirect: 'NAVIGATOR_REDIRECT' as const,
  /** Quay về trang chủ và xóa navigation stack. */
  navigatorReLaunch: 'NAVIGATOR_RE_LAUNCH' as const,
};
