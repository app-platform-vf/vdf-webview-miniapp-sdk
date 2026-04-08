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
  GetMultipleUserDataRequest,
  GetMultipleUserDataResponse,
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
  ExecuteLocalAuthenticationRequest,
  ExecuteLocalAuthenticationResponse,
  GetLocalAuthenticationStatusRequest,
  GetLocalAuthenticationStatusResponse,
  GetContactsRequest,
  GetContactsResponse,
  PickFileRequest,
  PickFileResponse,
  SaveStringValueRequest,
  SaveStringValueResponse,
  SaveBooleanValueRequest,
  SaveBooleanValueResponse,
  SaveIntegerValueRequest,
  SaveIntegerValueResponse,
  SaveLongValueRequest,
  SaveLongValueResponse,
  SaveFloatValueRequest,
  SaveFloatValueResponse,
  GetStringValueRequest,
  GetStringValueResponse,
  GetBooleanValueRequest,
  GetBooleanValueResponse,
  GetIntegerValueRequest,
  GetIntegerValueResponse,
  GetLongValueRequest,
  GetLongValueResponse,
  GetFloatValueRequest,
  GetFloatValueResponse,
  ClearStorageRequest,
  ClearStorageResponse,
  GetLocationRequest,
  GetLocationResponse,
  ShareTextContentRequest,
  ShareTextContentResponse,
  MiniAppTokenRequest,
  MiniAppTokenResponse,
  UpdateMiniAppThemeRequest,
  UpdateMiniAppThemeResponse,
  ExpiredSessionRequest,
  ExpiredSessionResponse
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
  'GET_MULTIPLE_USER_DATA': [GetMultipleUserDataRequest, GetMultipleUserDataResponse];
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
  'EXECUTE_LOCAL_AUTHENTICATION': [ExecuteLocalAuthenticationRequest, ExecuteLocalAuthenticationResponse];
  'GET_LOCAL_AUTHENTICATION_STATUS': [GetLocalAuthenticationStatusRequest, GetLocalAuthenticationStatusResponse];
  'GET_CONTACTS': [GetContactsRequest, GetContactsResponse];
  'PICK_FILE': [PickFileRequest, PickFileResponse];
  'SAVE_STRING_VALUE': [SaveStringValueRequest, SaveStringValueResponse];
  'SAVE_BOOLEAN_VALUE': [SaveBooleanValueRequest, SaveBooleanValueResponse];
  'SAVE_INTEGER_VALUE': [SaveIntegerValueRequest, SaveIntegerValueResponse];
  'SAVE_LONG_VALUE': [SaveLongValueRequest, SaveLongValueResponse];
  'SAVE_FLOAT_VALUE': [SaveFloatValueRequest, SaveFloatValueResponse];
  'GET_STRING_VALUE': [GetStringValueRequest, GetStringValueResponse];
  'GET_BOOLEAN_VALUE': [GetBooleanValueRequest, GetBooleanValueResponse];
  'GET_INTEGER_VALUE': [GetIntegerValueRequest, GetIntegerValueResponse];
  'GET_LONG_VALUE': [GetLongValueRequest, GetLongValueResponse];
  'GET_FLOAT_VALUE': [GetFloatValueRequest, GetFloatValueResponse];
  'CLEAR_STORAGE': [ClearStorageRequest, ClearStorageResponse];
  'GET_LOCATION': [GetLocationRequest, GetLocationResponse];
  'SHARE_TEXT_CONTENT': [ShareTextContentRequest, ShareTextContentResponse];
  'MINI_APP_TOKEN': [MiniAppTokenRequest, MiniAppTokenResponse];
  'UPDATE_MINI_APP_THEME': [UpdateMiniAppThemeRequest, UpdateMiniAppThemeResponse];
  'EXPIRED_SESSION': [ExpiredSessionRequest, ExpiredSessionResponse];
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
  /** Lấy nhiều trường dữ liệu người dùng từ host app. */
  getMultipleUserData: 'GET_MULTIPLE_USER_DATA' as const,
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
  /** Thực hiện xác thực sinh trắc học (vân tay, Face ID). */
  executeLocalAuthentication: 'EXECUTE_LOCAL_AUTHENTICATION' as const,
  /**  lấy trạng thái xác thực sinh trắc học (vân tay, Face ID). */
  getLocalAuthenticationStatus: 'GET_LOCAL_AUTHENTICATION_STATUS' as const,
  /** Lấy danh sách contacts từ danh bạ hệ thống.  */
  getContacts: 'GET_CONTACTS' as const,
  /** Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng: */
  pickFile: 'PICK_FILE' as const,
  /** Lưu giá trị kiểu string. */
  saveStringValue: 'SAVE_STRING_VALUE' as const,
  /** Lưu giá trị kiểu boolean. */
  saveBooleanValue: 'SAVE_BOOLEAN_VALUE' as const,
  /** Lưu giá trị kiểu int. */
  saveIntegerValue: 'SAVE_INTEGER_VALUE' as const,
  /** Lưu giá trị kiểu long. */
  saveLongValue: 'SAVE_LONG_VALUE' as const,
  /** Lưu giá trị kiểu float. */
  saveFloatValue: 'SAVE_FLOAT_VALUE' as const,
  /** Lấy giá trị kiểu string. */
  getStringValue: 'GET_STRING_VALUE' as const,
  /** Lấy giá trị kiểu boolean. */
  getBooleanValue: 'GET_BOOLEAN_VALUE' as const,
  /** Lấy giá trị kiểu int. */
  getIntegerValue: 'GET_INTEGER_VALUE' as const,
  /** Lấy giá trị kiểu long. */
  getLongValue: 'GET_LONG_VALUE' as const,
  /** Lấy giá trị kiểu float. */
  getFloatValue: 'GET_FLOAT_VALUE' as const,
  /** Lấy giá trị kiểu float. */
  clearStorage: 'CLEAR_STORAGE' as const,
  /** Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này. */
  getLocation: 'GET_LOCATION' as const,
  /** Mở dialog chia sẻ nội dung text. */
  shareTextContent: 'SHARE_TEXT_CONTENT' as const,
  /** Get mini app token */
  miniAppToken: 'MINI_APP_TOKEN' as const,
  /** Update mini app theme */
  updateMiniAppTheme: 'UPDATE_MINI_APP_THEME' as const,
  /** Session expiration event, Delegate cho host app xử lý */
  expiredSession: 'EXPIRED_SESSION' as const,
};
