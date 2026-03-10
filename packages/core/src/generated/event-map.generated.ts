// ============================================================
// AUTO-GENERATED — DO NOT EDIT
// Event map: ten event -> { request, response } types
// ============================================================

import type {
  GetUserInfoRequest,
  GetUserInfoResponse,
  GetLocationRequest,
  GetLocationResponse,
  ScanQrCodeRequest,
  ScanQrCodeResponse,
  GetSystemInfoRequest,
  GetSystemInfoResponse,
  SetStorageRequest,
  SetStorageResponse,
  GetStorageRequest,
  GetStorageResponse,
  RemoveStorageRequest,
  RemoveStorageResponse,
  ShowToastRequest,
  ShowToastResponse,
  ShowLoadingRequest,
  ShowLoadingResponse,
  HideLoadingRequest,
  HideLoadingResponse,
  ShowDialogRequest,
  ShowDialogResponse,
  NavigateToRequest,
  NavigateToResponse,
  NavigateBackRequest,
  NavigateBackResponse,
  GetAccessTokenRequest,
  GetAccessTokenResponse,
  OpenDeepLinkRequest,
  OpenDeepLinkResponse,
  ShareRequest,
  ShareResponse,
  CloseMiniappRequest,
  CloseMiniappResponse
} from './types.generated';

/** Map event name -> [RequestType, ResponseType] */
export interface MiniAppEventMap {
  'GET_USER_INFO': [GetUserInfoRequest, GetUserInfoResponse];
  'GET_LOCATION': [GetLocationRequest, GetLocationResponse];
  'SCAN_QR_CODE': [ScanQrCodeRequest, ScanQrCodeResponse];
  'GET_SYSTEM_INFO': [GetSystemInfoRequest, GetSystemInfoResponse];
  'SET_STORAGE': [SetStorageRequest, SetStorageResponse];
  'GET_STORAGE': [GetStorageRequest, GetStorageResponse];
  'REMOVE_STORAGE': [RemoveStorageRequest, RemoveStorageResponse];
  'SHOW_TOAST': [ShowToastRequest, ShowToastResponse];
  'SHOW_LOADING': [ShowLoadingRequest, ShowLoadingResponse];
  'HIDE_LOADING': [HideLoadingRequest, HideLoadingResponse];
  'SHOW_DIALOG': [ShowDialogRequest, ShowDialogResponse];
  'NAVIGATE_TO': [NavigateToRequest, NavigateToResponse];
  'NAVIGATE_BACK': [NavigateBackRequest, NavigateBackResponse];
  'GET_ACCESS_TOKEN': [GetAccessTokenRequest, GetAccessTokenResponse];
  'OPEN_DEEP_LINK': [OpenDeepLinkRequest, OpenDeepLinkResponse];
  'SHARE': [ShareRequest, ShareResponse];
  'CLOSE_MINIAPP': [CloseMiniappRequest, CloseMiniappResponse];
}

/** Danh sach event name constants */
export const MINIAPP_EVENTS = {
  /** Lay thong tin nguoi dung */
  getUserInfo: 'GET_USER_INFO' as const,
  /** Lay vi tri hien tai */
  getLocation: 'GET_LOCATION' as const,
  /** Mo camera quet ma QR */
  scanQrCode: 'SCAN_QR_CODE' as const,
  /** Lay thong tin thiet bi va he dieu hanh */
  getSystemInfo: 'GET_SYSTEM_INFO' as const,
  /** Luu du lieu vao storage native */
  setStorage: 'SET_STORAGE' as const,
  /** Doc du lieu tu storage native */
  getStorage: 'GET_STORAGE' as const,
  /** Xoa du lieu theo key trong storage */
  removeStorage: 'REMOVE_STORAGE' as const,
  /** Hien thi thong bao toast */
  showToast: 'SHOW_TOAST' as const,
  /** Hien thi loading */
  showLoading: 'SHOW_LOADING' as const,
  /** An loading */
  hideLoading: 'HIDE_LOADING' as const,
  /** Hien thi hop thoai xac nhan */
  showDialog: 'SHOW_DIALOG' as const,
  /** Chuyen trang (them vao stack) */
  navigateTo: 'NAVIGATE_TO' as const,
  /** Quay lai trang truoc */
  navigateBack: 'NAVIGATE_BACK' as const,
  /** Lay access token cua nguoi dung */
  getAccessToken: 'GET_ACCESS_TOKEN' as const,
  /** Mo deep link trong app native */
  openDeepLink: 'OPEN_DEEP_LINK' as const,
  /** Chia se noi dung */
  share: 'SHARE' as const,
  /** Dong miniapp va quay ve app native */
  closeMiniapp: 'CLOSE_MINIAPP' as const,
};
