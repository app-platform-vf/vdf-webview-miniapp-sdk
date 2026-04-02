var WebviewSdk = (function (exports) {
    'use strict';

    /**
     * Logger toan cuc cho MiniApp SDK
     * Mac dinh tat, bat bang Logger.enabled = true
     */
    class Logger {
        static log(...args) {
            if (Logger.enabled) {
                console.log('[MiniApp]', ...args);
            }
        }
        static warn(...args) {
            if (Logger.enabled) {
                console.warn('[MiniApp]', ...args);
            }
        }
        static error(...args) {
            console.error('[MiniApp]', ...args);
        }
    }
    Logger.enabled = false;

    /** Phat hien nen tang hien tai */
    function detectPlatform() {
        var _a, _b;
        if (typeof window === 'undefined')
            return 'web';
        if (window.AndroidWebview)
            return 'android';
        if ((_b = (_a = window.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.miniappWebviewToSdk)
            return 'ios';
        return 'web';
    }
    /** Gui message den native bridge */
    function sendToNative(message) {
        var _a;
        const json = JSON.stringify(message);
        const platform = detectPlatform();
        Logger.log('>>> sending to native platform:', platform, message);
        switch (platform) {
            case 'android':
                window.AndroidWebview.miniappWebviewToSdk(json);
                break;
            case 'ios':
                window.webkit.messageHandlers.miniappWebviewToSdk.postMessage(json);
                break;
            case 'web':
            default:
                (_a = window.miniappSdkToWebview) === null || _a === void 0 ? void 0 : _a.call(window, json);
                break;
        }
    }
    /** Parse message tu native gui xuong */
    function parseNativeMessage(raw) {
        try {
            if (typeof raw === 'string')
                return JSON.parse(raw);
            if (typeof raw === 'object' && raw.event)
                return raw;
            return null;
        }
        catch (_a) {
            return null;
        }
    }

    /**
     * He thong pub/sub su kien
     * Ho tro on/off/once/emit
     */
    class EventBus {
        constructor() {
            this.listeners = new Map();
        }
        /** Dang ky lang nghe su kien */
        on(event, cb) {
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(cb);
        }
        /** Lang nghe su kien mot lan duy nhat */
        once(event, cb) {
            const wrapper = (data) => {
                this.off(event, wrapper);
                cb(data);
            };
            this.on(event, wrapper);
        }
        /** Phat su kien */
        emit(event, data) {
            const list = this.listeners.get(event);
            if (!list)
                return;
            list.forEach(cb => cb(data));
        }
        /** Huy lang nghe. Neu khong truyen cb, huy tat ca listener cua event */
        off(event, cb) {
            if (!cb) {
                this.listeners.delete(event);
                return;
            }
            const list = this.listeners.get(event);
            if (!list)
                return;
            const idx = list.indexOf(cb);
            if (idx !== -1)
                list.splice(idx, 1);
            if (list.length === 0)
                this.listeners.delete(event);
        }
        /** Xoa tat ca listener */
        clear() {
            this.listeners.clear();
        }
    }

    /**
     * Quan ly cac request dang cho response tu native
     * Moi request co ID duy nhat, tu dong tang
     */
    class RequestManager {
        constructor() {
            this.pending = new Map();
        }
        generateRequestId() {
            return `req_${Date.now()}_${Math.random().toString(36).slice(8)}`;
        }
        /** Tao request moi, tra ve request_id */
        create(timeout) {
            const request_id = this.generateRequestId();
            const promise = new Promise((resolve, reject) => {
                const timer = timeout > 0
                    ? setTimeout(() => {
                        this.pending.delete(request_id);
                        reject(new Error(`Request ${request_id} timeout after ${timeout}ms`));
                    }, timeout)
                    : undefined;
                this.pending.set(request_id, { resolve, reject, timer });
            });
            return { request_id, promise };
        }
        /** Resolve request khi nhan duoc response thanh cong */
        resolve(request_id, data) {
            const req = this.pending.get(request_id);
            if (!req)
                return;
            if (req.timer)
                clearTimeout(req.timer);
            this.pending.delete(request_id);
            req.resolve(data);
        }
        /** Reject request khi nhan duoc response loi */
        reject(request_id, error) {
            const req = this.pending.get(request_id);
            if (!req)
                return;
            if (req.timer)
                clearTimeout(req.timer);
            this.pending.delete(request_id);
            req.reject(error);
        }
        /** Kiem tra co request dang cho khong */
        hasPending() {
            return this.pending.size > 0;
        }
        /** Huy tat ca request dang cho */
        clear() {
            this.pending.forEach(req => {
                if (req.timer)
                    clearTimeout(req.timer);
                req.reject(new Error('All requests cleared'));
            });
            this.pending.clear();
        }
    }

    /**
     * Hang doi message truoc khi SDK ready
     * Tat ca message gui truoc ready() se duoc dem va xa khi ready
     */
    class MessageQueue {
        constructor() {
            this.queue = [];
            this.isReady = false;
        }
        /** Them ham vao hang doi. Neu da ready thi thuc thi ngay */
        push(fn) {
            if (this.isReady) {
                fn();
            }
            else {
                this.queue.push(fn);
            }
        }
        /** Danh dau ready va xa hang doi */
        flush() {
            this.isReady = true;
            const pending = this.queue;
            this.queue = [];
            pending.forEach(fn => fn());
        }
        /** Kiem tra trang thai ready */
        get ready() {
            return this.isReady;
        }
    }

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * Pipeline middleware kieu Koa
     * Moi middleware nhan (message, next) va co the thay doi message
     */
    class MiddlewareManager {
        constructor() {
            this.middlewares = [];
        }
        /** Them middleware vao pipeline */
        use(mw) {
            this.middlewares.push(mw);
        }
        /** Chay message qua pipeline, goi done() khi ket thuc */
        run(message, done) {
            return __awaiter$1(this, void 0, void 0, function* () {
                let index = 0;
                const next = () => __awaiter$1(this, void 0, void 0, function* () {
                    const mw = this.middlewares[index++];
                    if (mw) {
                        yield mw(message, next);
                    }
                    else {
                        done();
                    }
                });
                yield next();
            });
        }
    }

    /**
     * Quan ly va cai dat plugin
     * Moi plugin phai co name va install(app)
     */
    class PluginManager {
        constructor() {
            this.installed = new Map();
        }
        /** Cai dat plugin. Tranh cai trung lap */
        install(plugin, app) {
            if (this.installed.has(plugin.name))
                return;
            plugin.install(app);
            this.installed.set(plugin.name, plugin);
        }
        /** Kiem tra plugin da cai chua */
        has(name) {
            return this.installed.has(name);
        }
    }

    // ============================================================
    // AUTO-GENERATED — DO NOT EDIT
    // Generated by event.js from events.json
    // ============================================================
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /** Kiem tra response co thanh cong khong (errorCode === 'SDK000') */
    function isSuccess(response) {
        var _a;
        return ((_a = response.eventStatus) === null || _a === void 0 ? void 0 : _a.errorCode) === 'SDK000' || response.errorCode === 'SDK000';
    }
    let _sendRaw = null;
    /**
     * Khoi tao module API voi ham gui message
     * Goi 1 lan khi setup MiniApp SDK
     */
    function initMiniAppAPI(sendFn) {
        _sendRaw = sendFn;
    }
    function send(event, payload) {
        if (!_sendRaw)
            throw new Error('MiniApp API chua duoc khoi tao. Goi wireToMiniApp() truoc.');
        return _sendRaw(Object.assign({ event, sender: '', request_id: '' }, payload));
    }
    // ============================================================
    // API Functions - Tu dong sinh tu events.json
    // Ten ham = camelCase(event). VD: GET_USER_INFO -> getUserInfo()
    // ============================================================
    /**
     * Mở một WebView mới với URL và cấu hình tùy chỉnh.
     * Event: APP_OPEN_WEBVIEW
     * @param payload.data.url (required) URL của webview cần mở [default: "https://example.com"]
     * @param payload.data.serviceName (optional) Tiêu đề hiển thị trên app bar [default: "Tên dịch vụ"]
     * @param payload.data.isPaymentConfirm (optional) false = đóng mini app để sang gateway thanh toán [default: false]
     * @param payload.data.resourceType (optional) HTML = mở trong webview, khác = mở browser mặc định [default: "HTML"]
     * @param payload.data.returnUrl (optional) URL trả về khi thành công/thất bại/timeout [default: "https://example.com/return"]
     * @param payload.data.cancelUrl (optional) URL trả về khi người dùng cancel [default: "https://example.com/cancel"]
     */
    function appOpenWebview(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return send('APP_OPEN_WEBVIEW', payload);
        });
    }
    /**
     * Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài.
     * Event: APP_OPEN_STORE
     * @param payload.data.fallbackUrlAndroid (optional) URL android [default: "market://details?id=com.example.app"]
     * @param payload.data.fallbackUrlIos (optional) URL Ios [default: "itms-apps://itunes.apple.com/app/id123456789"]
     */
    function appOpenStore(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return send('APP_OPEN_STORE', payload);
        });
    }
    /**
     * Đóng Mini App và điều hướng về màn hình khác.
     * Event: EXIT
     * @param payload.data.navigationAction (optional) Quay về trang chủ của host app; TH khác - Chỉ đóng Mini App [default: "RETURN_HOME_APP"]
     */
    function exit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return send('EXIT', payload);
        });
    }
    /**
     * Mở URL bằng browser mặc định của hệ thống.
     * Event: OPEN_EXTERNAL_LINK
     * @param payload.data.uri (optional) Link Ngoài [default: "https://google.com"]
     */
    function openExternalLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return send('OPEN_EXTERNAL_LINK', payload);
        });
    }
    /**
     * Mở một Mini App khác từ Mini App hiện tại.
     * Event: OPEN_MINI_APP
     * @param payload.data.route (optional) Định tuyến màn hình trong Mini App  [default: "{       \"screenName\": \"home\"     }"]
     * @param payload.data.miniappKey (optional) Key của Mini App cần mở  [default: "01K5FY191HP42SMMJXHWG545ZZ"]
     * @param payload.data.additional (optional) Dữ liệu bổ sung truyền cho Mini App  [default: "{       \"param1\": \"value1\",       \"param2\": \"value2\"     }"]
     * @param payload.data.launchConfig (optional) Chế độ launchConfig.mode: present(Mở Mini App mới đè lên Mini App cũ) hoặc replace(Kill Mini App cũ trước khi mở Mini App mới)	;   [default: "{       \"mode\": \"present\"     }"]
     * @param payload.data.themeConfig (optional) Style cho navigation bar [default: "{       \"title\": \"My App\",       \"headerColor\": \"#EE0033\",       \"headerTitle\": \"Videos\",       \"textColor\": \"white\",       \"leftButton\": \"back\",       \"actionButtonThemeType\": \"normal\",       \"hideAndroidBottomNavigationBar\": true,       \"hideIOSSafeAreaBottom\": true     }"]
     * @param payload.data.tracking (optional) Thông tin tracking [default: "{       \"campaign\": \"promotion\",       \"utmSource\": \"miniapp\"     }"]
     */
    function openMiniApp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return send('OPEN_MINI_APP', payload);
        });
    }
    /**
     * Yêu cầu nhiều quyền user data cùng một lúc.
     * Event: REQUEST_MULTIPLE_USER_DATA_PERMISSION
     * @note data duoc JSON.stringify() truoc khi gui
     * @param payload.data.permissionCodes (required) Danh sách mã quyền [default: "[\"USER_AGE_PERMISSION\",\"USER_NAME_PERMISSION\",\"USER_FULL_NAME_PERMISSION\",\"USER_PHONE_NUMBER_PERMISSION\",\"USER_AVATAR_PERMISSION\",\"USER_BIRTH_DATE_PERMISSION\",\"USER_GENDER_PERMISSION\",\"USER_NATIONAL_ID_PERMISSION\"]"]
     * @param payload.data.useSameReason (optional) Các quyền dùng chung 1 mã lý do [default: true]
     */
    function requestMultipleUserDataPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const _p = Object.assign({}, payload);
            if (_p.data !== undefined)
                _p.data = JSON.stringify(_p.data);
            return send('REQUEST_MULTIPLE_USER_DATA_PERMISSION', _p);
        });
    }
    /**
     * Kiểm tra trạng thái nhiều quyền user data cùng lúc.
     * Event: CHECK_MULTIPLE_USER_DATA_PERMISSION
     * @note data duoc JSON.stringify() truoc khi gui
     * @param payload.data.permissionCodes (required) Danh sách mã quyền [default: "[\"USER_AGE_PERMISSION\",\"USER_NAME_PERMISSION\",\"USER_FULL_NAME_PERMISSION\",\"USER_PHONE_NUMBER_PERMISSION\",\"USER_AVATAR_PERMISSION\",\"USER_BIRTH_DATE_PERMISSION\",\"USER_GENDER_PERMISSION\",\"USER_NATIONAL_ID_PERMISSION\"]"]
     */
    function checkMultipleUserDataPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const _p = Object.assign({}, payload);
            if (_p.data !== undefined)
                _p.data = JSON.stringify(_p.data);
            return send('CHECK_MULTIPLE_USER_DATA_PERMISSION', _p);
        });
    }
    /**
     * Lấy nhiều trường dữ liệu người dùng từ host app.
     * Event: GET_MULTIPLE_USER_DATA
     * @note data duoc JSON.stringify() truoc khi gui
     * @param payload.data.dataNames (required) Danh sách data cần lấy [default: "[\"age\", \"userName\", \"fullName\", \"phoneNumber\", \"avatar\", \"gender\", \"birthday\", \"idNo\"]"]
     */
    function getMultipleUserData(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const _p = Object.assign({}, payload);
            if (_p.data !== undefined)
                _p.data = JSON.stringify(_p.data);
            return send('GET_MULTIPLE_USER_DATA', _p);
        });
    }
    /**
     * Xóa tất cả quyền đã cache ở local.
     * Event: CLEAR_PERMISSION_CACHE
     */
    function clearPermissionCache(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CLEAR_PERMISSION_CACHE', payload);
        });
    }
    /**
     * Yêu cầu mở camera
     * Event: REQUEST_CAMERA_PERMISSION
     */
    function requestCameraPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_CAMERA_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu vị trí
     * Event: REQUEST_LOCATION_PERMISSION
     */
    function requestLocationPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_LOCATION_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu truy cập ảnh trên thiết bị
     * Event: REQUEST_PHOTOS_PERMISSION
     */
    function requestPhotosPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_PHOTOS_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu truy cập video trên thiết bị
     * Event: REQUEST_VIDEOS_PERMISSION
     */
    function requestVideosPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_VIDEOS_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu truy cập audio trên thiết bị
     * Event: REQUEST_AUDIO_PERMISSION
     */
    function requestAudioPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_AUDIO_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu ghi âm trên thiết bị
     * Event: REQUEST_RECORD_AUDIO_PERMISSION
     */
    function requestRecordAudioPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_RECORD_AUDIO_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu truy cập danh bạ trên thiết bị
     * Event: REQUEST_CONTACTS_PERMISSION
     */
    function requestContactsPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_CONTACTS_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu truy cập tài liệu trên thiết bị
     * Event: REQUEST_DOCUMENT_PERMISSION
     */
    function requestDocumentPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_DOCUMENT_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu thực hiện cuộc gọi trên thiết bị
     * Event: REQUEST_PHONE_CALL_PERMISSION
     */
    function requestPhoneCallPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_PHONE_CALL_PERMISSION', {});
        });
    }
    /**
     *
     * Event: REQUEST_PAYMENT_PERMISSION
     */
    function requestPaymentPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_PAYMENT_PERMISSION', {});
        });
    }
    /**
     *
     * Event: REQUEST_LOGIN_PERMISSION
     */
    function requestLoginPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_LOGIN_PERMISSION', {});
        });
    }
    /**
     * Yêu cầu xác thực sinh trắc học (vân tay, Face ID).
     * Event: REQUEST_LOCAL_AUTHENTICATION_PERMISSION
     */
    function requestLocalAuthenticationPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('REQUEST_LOCAL_AUTHENTICATION_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền camera
     * Event: CHECK_CAMERA_PERMISSION
     */
    function checkCameraPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_CAMERA_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền vị trí
     * Event: CHECK_LOCATION_PERMISSION
     */
    function checkLocationPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_LOCATION_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền truy cập ảnh
     * Event: CHECK_PHOTOS_PERMISSION
     */
    function checkPhotosPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_PHOTOS_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền truy cập video
     * Event: CHECK_VIDEOS_PERMISSION
     */
    function checkVideosPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_VIDEOS_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền truy cập file audio
     * Event: CHECK_AUDIO_PERMISSION
     */
    function checkAudioPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_AUDIO_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền ghi âm trên thiết bị
     * Event: CHECK_RECORD_AUDIO_PERMISSION
     */
    function checkRecordAudioPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_RECORD_AUDIO_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền truy cập danh bạ
     * Event: CHECK_CONTACTS_PERMISSION
     */
    function checkContactsPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_CONTACTS_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền truy cập file tài liệu
     * Event: CHECK_DOCUMENT_PERMISSION
     */
    function checkDocumentPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_DOCUMENT_PERMISSION', {});
        });
    }
    /**
     * Kiểm tra quyền gọi điện
     * Event: CHECK_PHONE_CALL_PERMISSION
     */
    function checkPhoneCallPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_PHONE_CALL_PERMISSION', {});
        });
    }
    /**
     *
     * Event: CHECK_PAYMENT_PERMISSION
     */
    function checkPaymentPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_PAYMENT_PERMISSION', {});
        });
    }
    /**
     *
     * Event: CHECK_LOGIN_PERMISSION
     */
    function checkLoginPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_LOGIN_PERMISSION', {});
        });
    }
    /**
     * kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).
     * Event: CHECK_LOCAL_AUTHENTICATION_PERMISSION
     */
    function checkLocalAuthenticationPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CHECK_LOCAL_AUTHENTICATION_PERMISSION', {});
        });
    }
    /**
     * Thực hiện xác thực sinh trắc học (vân tay, Face ID).
     * Event: EXECUTE_LOCAL_AUTHENTICATION
     * @param payload.data.authOptionsParam (optional)  [default: "{       \"sensitiveTransaction\": true,       \"authClassification\": [\"WEAK\", \"STRONG\", \"DEVICE\"],       \"sticky\": false,       \"isShowErrorDialog\": true     }"]
     */
    function executeLocalAuthentication() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('EXECUTE_LOCAL_AUTHENTICATION', payload);
        });
    }
    /**
     *  lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).
     * Event: GET_LOCAL_AUTHENTICATION_STATUS
     */
    function getLocalAuthenticationStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('GET_LOCAL_AUTHENTICATION_STATUS', {});
        });
    }
    /**
     * Lấy danh sách contacts từ danh bạ hệ thống.
     * Event: GET_CONTACTS
     * @param payload.data.filter (optional)  [default: "{       \"contactName\": \"John\"     }"]
     * @param payload.data.pager (optional)  [default: "{       \"pageNumber\": 1,       \"limitRow\": 100     }"]
     */
    function getContacts() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('GET_CONTACTS', payload);
        });
    }
    /**
     * Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng:
     * Event: PICK_FILE
     * @note data duoc JSON.stringify() truoc khi gui
     * @param payload.data.mimeType (required) Mảng các MIME types cho phép [default: "[\"image/*\", \"video/*\"]"]
     * @param payload.data.isCapture (optional) true = Mở camera, false = Chọn từ thư viện [default: true]
     * @param payload.data.source (optional) IOS only: PhotoLibrary hoặc Folder [default: "PhotoLibrary"]
     */
    function pickFile() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            const _p = Object.assign({}, payload);
            if (_p.data !== undefined)
                _p.data = JSON.stringify(_p.data);
            return send('PICK_FILE', _p);
        });
    }
    /**
     * Lưu giá trị kiểu string.
     * Event: SAVE_STRING_VALUE
     * @param payload.data.key (required) Key lưu [default: "user_preference"]
     * @param payload.data.value (required) Giá trị lưu [default: "dark_mode"]
     */
    function saveStringValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('SAVE_STRING_VALUE', payload);
        });
    }
    /**
     * Lưu giá trị kiểu boolean.
     * Event: SAVE_BOOLEAN_VALUE
     * @param payload.data.key (required) Key lưu [default: "notifications_enabled"]
     * @param payload.data.value (required) Giá trị lưu [default: true]
     */
    function saveBooleanValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('SAVE_BOOLEAN_VALUE', payload);
        });
    }
    /**
     * Lưu giá trị kiểu int.
     * Event: SAVE_INTEGER_VALUE
     * @param payload.data.key (required) Key lưu [default: "login_count"]
     * @param payload.data.value (required) Giá trị lưu [default: 5]
     */
    function saveIntegerValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('SAVE_INTEGER_VALUE', payload);
        });
    }
    /**
     * Lưu giá trị kiểu long.
     * Event: SAVE_LONG_VALUE
     * @param payload.data.key (required) Key lưu [default: "last_sync_timestamp"]
     * @param payload.data.value (required) Giá trị lưu [default: 1234567890]
     */
    function saveLongValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('SAVE_LONG_VALUE', payload);
        });
    }
    /**
     * Lưu giá trị kiểu float.
     * Event: SAVE_FLOAT_VALUE
     * @param payload.data.key (required) Key lưu [default: "rating"]
     * @param payload.data.value (required) Giá trị lưu [default: 4.5]
     */
    function saveFloatValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('SAVE_FLOAT_VALUE', payload);
        });
    }
    /**
     * Lấy giá trị kiểu string.
     * Event: GET_STRING_VALUE
     * @param payload.data.key (required) Key lưu [default: "user_preference"]
     * @param payload.data.defaultValue (required) Giá trị mặc định [default: "light_mode"]
     */
    function getStringValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('GET_STRING_VALUE', payload);
        });
    }
    /**
     * Lấy giá trị kiểu boolean.
     * Event: GET_BOOLEAN_VALUE
     * @param payload.data.key (required) Key lưu [default: "notifications_enabled"]
     * @param payload.data.defaultValue (required) Giá trị mặc định [default: false]
     */
    function getBooleanValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('GET_BOOLEAN_VALUE', payload);
        });
    }
    /**
     * Lấy giá trị kiểu int.
     * Event: GET_INTEGER_VALUE
     * @param payload.data.key (required) Key lưu
     * @param payload.data.defaultValue (required) Giá trị mặc định
     */
    function getIntegerValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('GET_INTEGER_VALUE', payload);
        });
    }
    /**
     * Lấy giá trị kiểu long.
     * Event: GET_LONG_VALUE
     * @param payload.data.key (required) Key lưu
     * @param payload.data.defaultValue (required) Giá trị mặc định
     */
    function getLongValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('GET_LONG_VALUE', payload);
        });
    }
    /**
     * Lấy giá trị kiểu float.
     * Event: GET_FLOAT_VALUE
     * @param payload.data.key (required) Key lưu
     * @param payload.data.defaultValue (required) Giá trị mặc định
     */
    function getFloatValue() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            return send('GET_FLOAT_VALUE', payload);
        });
    }
    /**
     * Lấy giá trị kiểu float.
     * Event: CLEAR_STORAGE
     */
    function clearStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('CLEAR_STORAGE', {});
        });
    }
    /**
     * Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.
     * Event: GET_LOCATION
     */
    function getLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('GET_LOCATION', {});
        });
    }
    /**
     * Mở dialog chia sẻ nội dung text.
     * Event: SHARE_TEXT_CONTENT
     * @note data duoc JSON.stringify() truoc khi gui
     * @param payload.data.content (optional) Text nội dung [default: "Check out this amazing product!"]
     */
    function shareTextContent() {
        return __awaiter(this, arguments, void 0, function* (payload = {}) {
            const _p = Object.assign({}, payload);
            if (_p.data !== undefined)
                _p.data = JSON.stringify(_p.data);
            return send('SHARE_TEXT_CONTENT', _p);
        });
    }
    /**
     * Get mini app token
     * Event: MINI_APP_TOKEN
     */
    function miniAppToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return send('MINI_APP_TOKEN', {});
        });
    }
    /**
     * Update mini app theme
     * Event: UPDATE_MINI_APP_THEME
     * @param payload.data.headerColor (optional) Miniapp header background color [default: "#FFFFFF"]
     * @param payload.data.headerTitle (optional) Miniapp header title [default: "Mini App"]
     * @param payload.data.textColor (optional) Miniapp header text and button color  [default: "#EE0033"]
     * @param payload.data.leftButton (optional) back - back button, none - không có gì [default: "back"]
     * @param payload.data.actionButtonThemeType (optional) Mode hiển thị action: light - sáng , dark - tối  [default: "light"]
     * @param payload.data.hideAndroidBottomNavigationBar (optional) Ẩn hiện android bottom bar [default: false]
     * @param payload.data.hideIOSSafeAreaBottom (optional) Ẩn hiện ios bottom safe area [default: false]
     * @param payload.data.toolbarMode (optional) Mode hiển thị header: normal  - bình thường , hidden - ẩn, transparent - trong suốt [default: "normal"]
     */
    function updateMiniAppTheme(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return send('UPDATE_MINI_APP_THEME', payload);
        });
    }
    // ============================================================
    // wireToMiniApp — Goi 1 lan trong framework adapter (React/Vue/Angular)
    // ============================================================
    /**
     * Noi generated API voi MiniApp instance.
     * Goi 1 lan trong getSharedInstance() hoac constructor cua adapter.
     */
    function wireToMiniApp(app) {
        initMiniAppAPI((msg) => {
            return app.sendRaw(msg).then((raw) => {
                if (raw && raw.eventStatus)
                    return raw;
                const data = typeof raw === 'object' && raw !== null ? raw : { data: raw };
                return Object.assign(Object.assign({ event: msg.event || '', sender: 'MINIAPP_SDK', response_id: '', request_id: msg.request_id || '' }, data), { eventStatus: { errorCode: 'SDK000', errorMessageVN: 'Thanh cong', errorMessageEN: 'Success', realMsg: '' }, errorData: '', message: '' });
            });
        });
    }
    // ============================================================
    // Export tat ca API duoi dang object de dung: MiniAppAPI.getUserInfo()
    // ============================================================
    const MiniAppAPI = {
        /** Mở một WebView mới với URL và cấu hình tùy chỉnh. */
        appOpenWebview,
        /** Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài. */
        appOpenStore,
        /** Đóng Mini App và điều hướng về màn hình khác. */
        exit,
        /** Mở URL bằng browser mặc định của hệ thống. */
        openExternalLink,
        /** Mở một Mini App khác từ Mini App hiện tại. */
        openMiniApp,
        /** Yêu cầu nhiều quyền user data cùng một lúc. */
        requestMultipleUserDataPermission,
        /** Kiểm tra trạng thái nhiều quyền user data cùng lúc. */
        checkMultipleUserDataPermission,
        /** Lấy nhiều trường dữ liệu người dùng từ host app. */
        getMultipleUserData,
        /** Xóa tất cả quyền đã cache ở local. */
        clearPermissionCache,
        /** Yêu cầu mở camera */
        requestCameraPermission,
        /** Yêu cầu vị trí */
        requestLocationPermission,
        /** Yêu cầu truy cập ảnh trên thiết bị */
        requestPhotosPermission,
        /** Yêu cầu truy cập video trên thiết bị */
        requestVideosPermission,
        /** Yêu cầu truy cập audio trên thiết bị */
        requestAudioPermission,
        /** Yêu cầu ghi âm trên thiết bị */
        requestRecordAudioPermission,
        /** Yêu cầu truy cập danh bạ trên thiết bị */
        requestContactsPermission,
        /** Yêu cầu truy cập tài liệu trên thiết bị */
        requestDocumentPermission,
        /** Yêu cầu thực hiện cuộc gọi trên thiết bị */
        requestPhoneCallPermission,
        /**  */
        requestPaymentPermission,
        /**  */
        requestLoginPermission,
        /** Yêu cầu xác thực sinh trắc học (vân tay, Face ID). */
        requestLocalAuthenticationPermission,
        /** Kiểm tra quyền camera */
        checkCameraPermission,
        /** Kiểm tra quyền vị trí */
        checkLocationPermission,
        /** Kiểm tra quyền truy cập ảnh */
        checkPhotosPermission,
        /** Kiểm tra quyền truy cập video */
        checkVideosPermission,
        /** Kiểm tra quyền truy cập file audio */
        checkAudioPermission,
        /** Kiểm tra quyền ghi âm trên thiết bị */
        checkRecordAudioPermission,
        /** Kiểm tra quyền truy cập danh bạ */
        checkContactsPermission,
        /** Kiểm tra quyền truy cập file tài liệu */
        checkDocumentPermission,
        /** Kiểm tra quyền gọi điện */
        checkPhoneCallPermission,
        /**  */
        checkPaymentPermission,
        /**  */
        checkLoginPermission,
        /** kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID). */
        checkLocalAuthenticationPermission,
        /** Thực hiện xác thực sinh trắc học (vân tay, Face ID). */
        executeLocalAuthentication,
        /**  lấy trạng thái xác thực sinh trắc học (vân tay, Face ID). */
        getLocalAuthenticationStatus,
        /** Lấy danh sách contacts từ danh bạ hệ thống.  */
        getContacts,
        /** Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng: */
        pickFile,
        /** Lưu giá trị kiểu string. */
        saveStringValue,
        /** Lưu giá trị kiểu boolean. */
        saveBooleanValue,
        /** Lưu giá trị kiểu int. */
        saveIntegerValue,
        /** Lưu giá trị kiểu long. */
        saveLongValue,
        /** Lưu giá trị kiểu float. */
        saveFloatValue,
        /** Lấy giá trị kiểu string. */
        getStringValue,
        /** Lấy giá trị kiểu boolean. */
        getBooleanValue,
        /** Lấy giá trị kiểu int. */
        getIntegerValue,
        /** Lấy giá trị kiểu long. */
        getLongValue,
        /** Lấy giá trị kiểu float. */
        getFloatValue,
        /** Lấy giá trị kiểu float. */
        clearStorage,
        /** Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này. */
        getLocation,
        /** Mở dialog chia sẻ nội dung text. */
        shareTextContent,
        /** Get mini app token */
        miniAppToken,
        /** Update mini app theme */
        updateMiniAppTheme,
        /** Kiem tra response thanh cong */
        isSuccess,
        /** Khoi tao API module */
        init: initMiniAppAPI,
        /** Noi voi MiniApp instance (dung trong adapter) */
        wire: wireToMiniApp,
    };

    const SENDER = 'MINIAPP_WEBVIEW';
    /**
     * MiniApp - Class chinh cua SDK
     *
     * Cung cap giao tiep 2 chieu giua WebView va Native:
     * - sendRaw(): gui MiniAppRequestBase truc tiep
     * - invoke(): wrapper tien loi cho sendRaw
     * - emit(): gui su kien khong cho response
     * - on(): lang nghe su kien tu native
     */
    class MiniApp {
        constructor(config = {}) {
            var _a, _b, _c, _d;
            this.eventBus = new EventBus();
            this.requestManager = new RequestManager();
            this.messageQueue = new MessageQueue();
            this.middlewareManager = new MiddlewareManager();
            this.pluginManager = new PluginManager();
            this.lifecycleBus = new EventBus();
            this.messageHandler = null;
            this.config = {
                appId: (_a = config.appId) !== null && _a !== void 0 ? _a : '',
                debug: (_b = config.debug) !== null && _b !== void 0 ? _b : false,
                token: (_c = config.token) !== null && _c !== void 0 ? _c : '',
                timeout: (_d = config.timeout) !== null && _d !== void 0 ? _d : 90000,
            };
            if (this.config.debug) {
                Logger.enabled = true;
            }
            // Lang nghe message tu native
            this.startListening();
            Logger.log('MiniApp created', { appId: this.config.appId, platform: detectPlatform() });
        }
        // ============================================================
        // Giao tiep voi Native
        // ============================================================
        /**
         * Gui MiniAppRequestBase truc tiep va cho response.
         * Day la core method — invoke() va wireToMiniApp() deu goi qua day.
         */
        sendRaw(msg) {
            return new Promise((resolve, reject) => {
                const { request_id, promise } = this.requestManager.create(this.config.timeout);
                const message = Object.assign(Object.assign({}, msg), { sender: msg.sender || SENDER, request_id: msg.request_id || request_id, requestId: msg.request_id || request_id, token: this.config.token || undefined, timestamp: Date.now() });
                this.messageQueue.push(() => {
                    this.middlewareManager.run(message, () => {
                        Logger.log('>>> send', message.event, message);
                        sendToNative(message);
                    });
                });
                promise.then(resolve).catch(reject);
            });
        }
        /**
         * Goi native API va cho response
         * Tuong tu wx.request() / my.call()
         */
        invoke(event, data) {
            return this.sendRaw(Object.assign({ event: event }, data));
        }
        /**
         * Gui su kien den native (khong cho response)
         * Tuong tu postMessage mot chieu
         */
        emit(event, data) {
            const { request_id } = this.requestManager.create(this.config.timeout);
            const message = Object.assign(Object.assign({ event, sender: SENDER, request_id: request_id, requestId: request_id }, data), { token: this.config.token || undefined, timestamp: Date.now() });
            this.messageQueue.push(() => {
                this.middlewareManager.run(message, () => {
                    Logger.log('>>> emit', event, message);
                    sendToNative(message);
                });
            });
        }
        /**
         * Lang nghe su kien tu native
         */
        on(event, cb) {
            this.eventBus.on(event, cb);
        }
        /** Lang nghe su kien mot lan */
        once(event, cb) {
            this.eventBus.once(event, cb);
        }
        /** Huy lang nghe su kien */
        off(event, cb) {
            this.eventBus.off(event, cb);
        }
        // ============================================================
        // Lifecycle
        // ============================================================
        /** Dang ky callback khi SDK san sang */
        onReady(cb) {
            this.lifecycleBus.on('ready', cb);
        }
        /** Dang ky callback khi app hien thi */
        onShow(cb) {
            this.lifecycleBus.on('show', cb);
        }
        /** Dang ky callback khi app an */
        onHide(cb) {
            this.lifecycleBus.on('hide', cb);
        }
        /** Dang ky callback khi co loi */
        onError(cb) {
            this.lifecycleBus.on('error', cb);
        }
        /** Dang ky callback khi app bi huy */
        onDestroy(cb) {
            this.lifecycleBus.on('destroy', cb);
        }
        // ============================================================
        // Plugin & Middleware
        // ============================================================
        /** Cai dat plugin */
        use(plugin) {
            this.pluginManager.install(plugin, this);
            Logger.log('Plugin installed:', plugin.name);
        }
        /** Them middleware vao pipeline xu ly message */
        useMiddleware(mw) {
            this.middlewareManager.use(mw);
        }
        // ============================================================
        // Lifecycle control
        // ============================================================
        /**
         * Danh dau SDK san sang
         * Xa tat ca message dang cho trong hang doi
         * Gui tin hieu handshake den native
         */
        ready() {
            this.messageQueue.flush();
            this.lifecycleBus.emit('ready');
            // Gui handshake den native
            // sendToNative({
            //   event: '__miniapp_ready',
            //   sender: SENDER,
            //   request_id: '',
            //   appId: this.config.appId,
            //   timestamp: Date.now(),
            // });
            Logger.log('MiniApp ready');
        }
        /**
         * Huy SDK, don dep tai nguyen
         */
        destroy() {
            this.lifecycleBus.emit('destroy');
            this.stopListening();
            this.eventBus.clear();
            this.lifecycleBus.clear();
            this.requestManager.clear();
            Logger.log('MiniApp destroyed');
        }
        // ============================================================
        // Xu ly message tu native
        // ============================================================
        startListening() {
            window.miniappSdkToWebview = (data) => {
                Logger.log('Receiver raw =======' + data);
                const msg = parseNativeMessage(data);
                if (!msg)
                    return;
                this.handleMessage(msg);
            };
        }
        stopListening() {
            if (this.messageHandler) {
                window.miniappSdkToWebview = () => { Logger.log('Da stopListening'); };
                this.messageHandler = null;
            }
        }
        handleMessage(msg) {
            Logger.log('<<< received', msg.event, msg);
            // Response — co request_id de match
            if (msg.request_id || msg.requestd) {
                this.handleResponse(msg);
                return;
            }
            // Event — lifecycle hoac user event
            this.handleEvent(msg);
        }
        handleEvent(msg) {
            if (!msg.event)
                return;
            // Xu ly lifecycle event dac biet
            const lifecycleEvents = ['show', 'hide', 'error', 'destroy'];
            if (lifecycleEvents.includes(msg.event)) {
                this.lifecycleBus.emit(msg.event, msg);
            }
            // Phat su kien cho listener
            this.eventBus.emit(msg.event, msg);
        }
        handleResponse(msg) {
            if (isSuccess(msg)) {
                this.requestManager.resolve(msg.request_id || msg.requestd, msg);
            }
            else {
                this.requestManager.reject(msg.request_id || msg.requestd, msg);
            }
        }
        // ============================================================
        // Getters
        // ============================================================
        /** Lay nen tang hien tai */
        get platform() {
            return detectPlatform();
        }
        /** Lay cau hinh */
        getConfig() {
            return Object.assign({}, this.config);
        }
    }
    /**
     * Factory function tao MiniApp instance
     */
    function createMiniApp(config) {
        return new MiniApp(config);
    }

    /** Boc Promise voi timeout, reject neu qua thoi gian cho */
    function withTimeout(promise, ms) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout after ${ms}ms`));
            }, ms);
            promise.then((res) => { clearTimeout(timer); resolve(res); }, (err) => { clearTimeout(timer); reject(err); });
        });
    }

    /** Thu lai ham async toi da retries lan, moi lan cach delay ms */
    function retry(fn, retries = 3, delay = 500) {
        return new Promise((resolve, reject) => {
            const attempt = (remaining) => {
                fn().then(resolve).catch((err) => {
                    if (remaining === 0) {
                        reject(err);
                    }
                    else {
                        setTimeout(() => attempt(remaining - 1), delay);
                    }
                });
            };
            attempt(retries);
        });
    }

    let sharedInstance = null;
    /**
     * Lay hoac tao MiniApp singleton, tu dong wire generated API.
     * Dung chung cho React hook, Vue composable, Angular service.
     */
    function getSharedMiniApp(config) {
        if (!sharedInstance) {
            sharedInstance = new MiniApp(config);
            wireToMiniApp(sharedInstance);
        }
        return sharedInstance;
    }
    /**
     * Tao interface object tu MiniApp instance voi tat ca method da bind.
     * Tra ve object co the destructure truc tiep.
     */
    function createMiniAppInterface(app) {
        return {
            invoke: app.invoke.bind(app),
            emit: app.emit.bind(app),
            on: app.on.bind(app),
            off: app.off.bind(app),
            once: app.once.bind(app),
            ready: app.ready.bind(app),
            destroy: app.destroy.bind(app),
            onReady: app.onReady.bind(app),
            onShow: app.onShow.bind(app),
            onHide: app.onHide.bind(app),
            onError: app.onError.bind(app),
            onDestroy: app.onDestroy.bind(app),
            use: app.use.bind(app),
            useMiddleware: app.useMiddleware.bind(app),
            app,
        };
    }

    // ============================================================
    // AUTO-GENERATED — DO NOT EDIT
    // Generated by event.js from events.json
    // ============================================================
    /** Danh sach tat ca events voi metadata */
    const EVENT_LIST = [
        { event: 'APP_OPEN_WEBVIEW', method: 'appOpenWebview', description: 'Mở một WebView mới với URL và cấu hình tùy chỉnh.', requestType: 'AppOpenWebviewRequest', responseType: 'AppOpenWebviewResponse' },
        { event: 'APP_OPEN_STORE', method: 'appOpenStore', description: 'Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài.', requestType: 'AppOpenStoreRequest', responseType: 'AppOpenStoreResponse' },
        { event: 'EXIT', method: 'exit', description: 'Đóng Mini App và điều hướng về màn hình khác.', requestType: 'ExitRequest', responseType: 'ExitResponse' },
        { event: 'OPEN_EXTERNAL_LINK', method: 'openExternalLink', description: 'Mở URL bằng browser mặc định của hệ thống.', requestType: 'OpenExternalLinkRequest', responseType: 'OpenExternalLinkResponse' },
        { event: 'OPEN_MINI_APP', method: 'openMiniApp', description: 'Mở một Mini App khác từ Mini App hiện tại.', requestType: 'OpenMiniAppRequest', responseType: 'OpenMiniAppResponse' },
        { event: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION', method: 'requestMultipleUserDataPermission', description: 'Yêu cầu nhiều quyền user data cùng một lúc.', requestType: 'RequestMultipleUserDataPermissionRequest', responseType: 'RequestMultipleUserDataPermissionResponse' },
        { event: 'CHECK_MULTIPLE_USER_DATA_PERMISSION', method: 'checkMultipleUserDataPermission', description: 'Kiểm tra trạng thái nhiều quyền user data cùng lúc.', requestType: 'CheckMultipleUserDataPermissionRequest', responseType: 'CheckMultipleUserDataPermissionResponse' },
        { event: 'GET_MULTIPLE_USER_DATA', method: 'getMultipleUserData', description: 'Lấy nhiều trường dữ liệu người dùng từ host app.', requestType: 'GetMultipleUserDataRequest', responseType: 'GetMultipleUserDataResponse' },
        { event: 'CLEAR_PERMISSION_CACHE', method: 'clearPermissionCache', description: 'Xóa tất cả quyền đã cache ở local.', requestType: 'ClearPermissionCacheRequest', responseType: 'ClearPermissionCacheResponse' },
        { event: 'REQUEST_CAMERA_PERMISSION', method: 'requestCameraPermission', description: 'Yêu cầu mở camera', requestType: 'RequestCameraPermissionRequest', responseType: 'RequestCameraPermissionResponse' },
        { event: 'REQUEST_LOCATION_PERMISSION', method: 'requestLocationPermission', description: 'Yêu cầu vị trí', requestType: 'RequestLocationPermissionRequest', responseType: 'RequestLocationPermissionResponse' },
        { event: 'REQUEST_PHOTOS_PERMISSION', method: 'requestPhotosPermission', description: 'Yêu cầu truy cập ảnh trên thiết bị', requestType: 'RequestPhotosPermissionRequest', responseType: 'RequestPhotosPermissionResponse' },
        { event: 'REQUEST_VIDEOS_PERMISSION', method: 'requestVideosPermission', description: 'Yêu cầu truy cập video trên thiết bị', requestType: 'RequestVideosPermissionRequest', responseType: 'RequestVideosPermissionResponse' },
        { event: 'REQUEST_AUDIO_PERMISSION', method: 'requestAudioPermission', description: 'Yêu cầu truy cập audio trên thiết bị', requestType: 'RequestAudioPermissionRequest', responseType: 'RequestAudioPermissionResponse' },
        { event: 'REQUEST_RECORD_AUDIO_PERMISSION', method: 'requestRecordAudioPermission', description: 'Yêu cầu ghi âm trên thiết bị', requestType: 'RequestRecordAudioPermissionRequest', responseType: 'RequestRecordAudioPermissionResponse' },
        { event: 'REQUEST_CONTACTS_PERMISSION', method: 'requestContactsPermission', description: 'Yêu cầu truy cập danh bạ trên thiết bị', requestType: 'RequestContactsPermissionRequest', responseType: 'RequestContactsPermissionResponse' },
        { event: 'REQUEST_DOCUMENT_PERMISSION', method: 'requestDocumentPermission', description: 'Yêu cầu truy cập tài liệu trên thiết bị', requestType: 'RequestDocumentPermissionRequest', responseType: 'RequestDocumentPermissionResponse' },
        { event: 'REQUEST_PHONE_CALL_PERMISSION', method: 'requestPhoneCallPermission', description: 'Yêu cầu thực hiện cuộc gọi trên thiết bị', requestType: 'RequestPhoneCallPermissionRequest', responseType: 'RequestPhoneCallPermissionResponse' },
        { event: 'REQUEST_PAYMENT_PERMISSION', method: 'requestPaymentPermission', description: '', requestType: 'RequestPaymentPermissionRequest', responseType: 'RequestPaymentPermissionResponse' },
        { event: 'REQUEST_LOGIN_PERMISSION', method: 'requestLoginPermission', description: '', requestType: 'RequestLoginPermissionRequest', responseType: 'RequestLoginPermissionResponse' },
        { event: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION', method: 'requestLocalAuthenticationPermission', description: 'Yêu cầu xác thực sinh trắc học (vân tay, Face ID).', requestType: 'RequestLocalAuthenticationPermissionRequest', responseType: 'RequestLocalAuthenticationPermissionResponse' },
        { event: 'CHECK_CAMERA_PERMISSION', method: 'checkCameraPermission', description: 'Kiểm tra quyền camera', requestType: 'CheckCameraPermissionRequest', responseType: 'CheckCameraPermissionResponse' },
        { event: 'CHECK_LOCATION_PERMISSION', method: 'checkLocationPermission', description: 'Kiểm tra quyền vị trí', requestType: 'CheckLocationPermissionRequest', responseType: 'CheckLocationPermissionResponse' },
        { event: 'CHECK_PHOTOS_PERMISSION', method: 'checkPhotosPermission', description: 'Kiểm tra quyền truy cập ảnh', requestType: 'CheckPhotosPermissionRequest', responseType: 'CheckPhotosPermissionResponse' },
        { event: 'CHECK_VIDEOS_PERMISSION', method: 'checkVideosPermission', description: 'Kiểm tra quyền truy cập video', requestType: 'CheckVideosPermissionRequest', responseType: 'CheckVideosPermissionResponse' },
        { event: 'CHECK_AUDIO_PERMISSION', method: 'checkAudioPermission', description: 'Kiểm tra quyền truy cập file audio', requestType: 'CheckAudioPermissionRequest', responseType: 'CheckAudioPermissionResponse' },
        { event: 'CHECK_RECORD_AUDIO_PERMISSION', method: 'checkRecordAudioPermission', description: 'Kiểm tra quyền ghi âm trên thiết bị', requestType: 'CheckRecordAudioPermissionRequest', responseType: 'CheckRecordAudioPermissionResponse' },
        { event: 'CHECK_CONTACTS_PERMISSION', method: 'checkContactsPermission', description: 'Kiểm tra quyền truy cập danh bạ', requestType: 'CheckContactsPermissionRequest', responseType: 'CheckContactsPermissionResponse' },
        { event: 'CHECK_DOCUMENT_PERMISSION', method: 'checkDocumentPermission', description: 'Kiểm tra quyền truy cập file tài liệu', requestType: 'CheckDocumentPermissionRequest', responseType: 'CheckDocumentPermissionResponse' },
        { event: 'CHECK_PHONE_CALL_PERMISSION', method: 'checkPhoneCallPermission', description: 'Kiểm tra quyền gọi điện', requestType: 'CheckPhoneCallPermissionRequest', responseType: 'CheckPhoneCallPermissionResponse' },
        { event: 'CHECK_PAYMENT_PERMISSION', method: 'checkPaymentPermission', description: '', requestType: 'CheckPaymentPermissionRequest', responseType: 'CheckPaymentPermissionResponse' },
        { event: 'CHECK_LOGIN_PERMISSION', method: 'checkLoginPermission', description: '', requestType: 'CheckLoginPermissionRequest', responseType: 'CheckLoginPermissionResponse' },
        { event: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION', method: 'checkLocalAuthenticationPermission', description: 'kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).', requestType: 'CheckLocalAuthenticationPermissionRequest', responseType: 'CheckLocalAuthenticationPermissionResponse' },
        { event: 'EXECUTE_LOCAL_AUTHENTICATION', method: 'executeLocalAuthentication', description: 'Thực hiện xác thực sinh trắc học (vân tay, Face ID).', requestType: 'ExecuteLocalAuthenticationRequest', responseType: 'ExecuteLocalAuthenticationResponse' },
        { event: 'GET_LOCAL_AUTHENTICATION_STATUS', method: 'getLocalAuthenticationStatus', description: ' lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).', requestType: 'GetLocalAuthenticationStatusRequest', responseType: 'GetLocalAuthenticationStatusResponse' },
        { event: 'GET_CONTACTS', method: 'getContacts', description: 'Lấy danh sách contacts từ danh bạ hệ thống. ', requestType: 'GetContactsRequest', responseType: 'GetContactsResponse' },
        { event: 'PICK_FILE', method: 'pickFile', description: 'Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng:', requestType: 'PickFileRequest', responseType: 'PickFileResponse' },
        { event: 'SAVE_STRING_VALUE', method: 'saveStringValue', description: 'Lưu giá trị kiểu string.', requestType: 'SaveStringValueRequest', responseType: 'SaveStringValueResponse' },
        { event: 'SAVE_BOOLEAN_VALUE', method: 'saveBooleanValue', description: 'Lưu giá trị kiểu boolean.', requestType: 'SaveBooleanValueRequest', responseType: 'SaveBooleanValueResponse' },
        { event: 'SAVE_INTEGER_VALUE', method: 'saveIntegerValue', description: 'Lưu giá trị kiểu int.', requestType: 'SaveIntegerValueRequest', responseType: 'SaveIntegerValueResponse' },
        { event: 'SAVE_LONG_VALUE', method: 'saveLongValue', description: 'Lưu giá trị kiểu long.', requestType: 'SaveLongValueRequest', responseType: 'SaveLongValueResponse' },
        { event: 'SAVE_FLOAT_VALUE', method: 'saveFloatValue', description: 'Lưu giá trị kiểu float.', requestType: 'SaveFloatValueRequest', responseType: 'SaveFloatValueResponse' },
        { event: 'GET_STRING_VALUE', method: 'getStringValue', description: 'Lấy giá trị kiểu string.', requestType: 'GetStringValueRequest', responseType: 'GetStringValueResponse' },
        { event: 'GET_BOOLEAN_VALUE', method: 'getBooleanValue', description: 'Lấy giá trị kiểu boolean.', requestType: 'GetBooleanValueRequest', responseType: 'GetBooleanValueResponse' },
        { event: 'GET_INTEGER_VALUE', method: 'getIntegerValue', description: 'Lấy giá trị kiểu int.', requestType: 'GetIntegerValueRequest', responseType: 'GetIntegerValueResponse' },
        { event: 'GET_LONG_VALUE', method: 'getLongValue', description: 'Lấy giá trị kiểu long.', requestType: 'GetLongValueRequest', responseType: 'GetLongValueResponse' },
        { event: 'GET_FLOAT_VALUE', method: 'getFloatValue', description: 'Lấy giá trị kiểu float.', requestType: 'GetFloatValueRequest', responseType: 'GetFloatValueResponse' },
        { event: 'CLEAR_STORAGE', method: 'clearStorage', description: 'Lấy giá trị kiểu float.', requestType: 'ClearStorageRequest', responseType: 'ClearStorageResponse' },
        { event: 'GET_LOCATION', method: 'getLocation', description: 'Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.', requestType: 'GetLocationRequest', responseType: 'GetLocationResponse' },
        { event: 'SHARE_TEXT_CONTENT', method: 'shareTextContent', description: 'Mở dialog chia sẻ nội dung text.', requestType: 'ShareTextContentRequest', responseType: 'ShareTextContentResponse' },
        { event: 'MINI_APP_TOKEN', method: 'miniAppToken', description: 'Get mini app token', requestType: 'MiniAppTokenRequest', responseType: 'MiniAppTokenResponse' },
        { event: 'UPDATE_MINI_APP_THEME', method: 'updateMiniAppTheme', description: 'Update mini app theme', requestType: 'UpdateMiniAppThemeRequest', responseType: 'UpdateMiniAppThemeResponse' },
    ];

    // ============================================================
    // AUTO-GENERATED — DO NOT EDIT
    // Event map: ten event -> { request, response } types
    // ============================================================
    /** Danh sach event name constants */
    const MINIAPP_EVENTS = {
        /** Mở một WebView mới với URL và cấu hình tùy chỉnh. */
        appOpenWebview: 'APP_OPEN_WEBVIEW',
        /** Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài. */
        appOpenStore: 'APP_OPEN_STORE',
        /** Đóng Mini App và điều hướng về màn hình khác. */
        exit: 'EXIT',
        /** Mở URL bằng browser mặc định của hệ thống. */
        openExternalLink: 'OPEN_EXTERNAL_LINK',
        /** Mở một Mini App khác từ Mini App hiện tại. */
        openMiniApp: 'OPEN_MINI_APP',
        /** Yêu cầu nhiều quyền user data cùng một lúc. */
        requestMultipleUserDataPermission: 'REQUEST_MULTIPLE_USER_DATA_PERMISSION',
        /** Kiểm tra trạng thái nhiều quyền user data cùng lúc. */
        checkMultipleUserDataPermission: 'CHECK_MULTIPLE_USER_DATA_PERMISSION',
        /** Lấy nhiều trường dữ liệu người dùng từ host app. */
        getMultipleUserData: 'GET_MULTIPLE_USER_DATA',
        /** Xóa tất cả quyền đã cache ở local. */
        clearPermissionCache: 'CLEAR_PERMISSION_CACHE',
        /** Yêu cầu mở camera */
        requestCameraPermission: 'REQUEST_CAMERA_PERMISSION',
        /** Yêu cầu vị trí */
        requestLocationPermission: 'REQUEST_LOCATION_PERMISSION',
        /** Yêu cầu truy cập ảnh trên thiết bị */
        requestPhotosPermission: 'REQUEST_PHOTOS_PERMISSION',
        /** Yêu cầu truy cập video trên thiết bị */
        requestVideosPermission: 'REQUEST_VIDEOS_PERMISSION',
        /** Yêu cầu truy cập audio trên thiết bị */
        requestAudioPermission: 'REQUEST_AUDIO_PERMISSION',
        /** Yêu cầu ghi âm trên thiết bị */
        requestRecordAudioPermission: 'REQUEST_RECORD_AUDIO_PERMISSION',
        /** Yêu cầu truy cập danh bạ trên thiết bị */
        requestContactsPermission: 'REQUEST_CONTACTS_PERMISSION',
        /** Yêu cầu truy cập tài liệu trên thiết bị */
        requestDocumentPermission: 'REQUEST_DOCUMENT_PERMISSION',
        /** Yêu cầu thực hiện cuộc gọi trên thiết bị */
        requestPhoneCallPermission: 'REQUEST_PHONE_CALL_PERMISSION',
        /**  */
        requestPaymentPermission: 'REQUEST_PAYMENT_PERMISSION',
        /**  */
        requestLoginPermission: 'REQUEST_LOGIN_PERMISSION',
        /** Yêu cầu xác thực sinh trắc học (vân tay, Face ID). */
        requestLocalAuthenticationPermission: 'REQUEST_LOCAL_AUTHENTICATION_PERMISSION',
        /** Kiểm tra quyền camera */
        checkCameraPermission: 'CHECK_CAMERA_PERMISSION',
        /** Kiểm tra quyền vị trí */
        checkLocationPermission: 'CHECK_LOCATION_PERMISSION',
        /** Kiểm tra quyền truy cập ảnh */
        checkPhotosPermission: 'CHECK_PHOTOS_PERMISSION',
        /** Kiểm tra quyền truy cập video */
        checkVideosPermission: 'CHECK_VIDEOS_PERMISSION',
        /** Kiểm tra quyền truy cập file audio */
        checkAudioPermission: 'CHECK_AUDIO_PERMISSION',
        /** Kiểm tra quyền ghi âm trên thiết bị */
        checkRecordAudioPermission: 'CHECK_RECORD_AUDIO_PERMISSION',
        /** Kiểm tra quyền truy cập danh bạ */
        checkContactsPermission: 'CHECK_CONTACTS_PERMISSION',
        /** Kiểm tra quyền truy cập file tài liệu */
        checkDocumentPermission: 'CHECK_DOCUMENT_PERMISSION',
        /** Kiểm tra quyền gọi điện */
        checkPhoneCallPermission: 'CHECK_PHONE_CALL_PERMISSION',
        /**  */
        checkPaymentPermission: 'CHECK_PAYMENT_PERMISSION',
        /**  */
        checkLoginPermission: 'CHECK_LOGIN_PERMISSION',
        /** kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID). */
        checkLocalAuthenticationPermission: 'CHECK_LOCAL_AUTHENTICATION_PERMISSION',
        /** Thực hiện xác thực sinh trắc học (vân tay, Face ID). */
        executeLocalAuthentication: 'EXECUTE_LOCAL_AUTHENTICATION',
        /**  lấy trạng thái xác thực sinh trắc học (vân tay, Face ID). */
        getLocalAuthenticationStatus: 'GET_LOCAL_AUTHENTICATION_STATUS',
        /** Lấy danh sách contacts từ danh bạ hệ thống.  */
        getContacts: 'GET_CONTACTS',
        /** Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng: */
        pickFile: 'PICK_FILE',
        /** Lưu giá trị kiểu string. */
        saveStringValue: 'SAVE_STRING_VALUE',
        /** Lưu giá trị kiểu boolean. */
        saveBooleanValue: 'SAVE_BOOLEAN_VALUE',
        /** Lưu giá trị kiểu int. */
        saveIntegerValue: 'SAVE_INTEGER_VALUE',
        /** Lưu giá trị kiểu long. */
        saveLongValue: 'SAVE_LONG_VALUE',
        /** Lưu giá trị kiểu float. */
        saveFloatValue: 'SAVE_FLOAT_VALUE',
        /** Lấy giá trị kiểu string. */
        getStringValue: 'GET_STRING_VALUE',
        /** Lấy giá trị kiểu boolean. */
        getBooleanValue: 'GET_BOOLEAN_VALUE',
        /** Lấy giá trị kiểu int. */
        getIntegerValue: 'GET_INTEGER_VALUE',
        /** Lấy giá trị kiểu long. */
        getLongValue: 'GET_LONG_VALUE',
        /** Lấy giá trị kiểu float. */
        getFloatValue: 'GET_FLOAT_VALUE',
        /** Lấy giá trị kiểu float. */
        clearStorage: 'CLEAR_STORAGE',
        /** Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này. */
        getLocation: 'GET_LOCATION',
        /** Mở dialog chia sẻ nội dung text. */
        shareTextContent: 'SHARE_TEXT_CONTENT',
        /** Get mini app token */
        miniAppToken: 'MINI_APP_TOKEN',
        /** Update mini app theme */
        updateMiniAppTheme: 'UPDATE_MINI_APP_THEME',
    };

    exports.EVENT_LIST = EVENT_LIST;
    exports.EventBus = EventBus;
    exports.Logger = Logger;
    exports.MINIAPP_EVENTS = MINIAPP_EVENTS;
    exports.MessageQueue = MessageQueue;
    exports.MiddlewareManager = MiddlewareManager;
    exports.MiniApp = MiniApp;
    exports.MiniAppAPI = MiniAppAPI;
    exports.PluginManager = PluginManager;
    exports.RequestManager = RequestManager;
    exports.appOpenStore = appOpenStore;
    exports.appOpenWebview = appOpenWebview;
    exports.checkAudioPermission = checkAudioPermission;
    exports.checkCameraPermission = checkCameraPermission;
    exports.checkContactsPermission = checkContactsPermission;
    exports.checkDocumentPermission = checkDocumentPermission;
    exports.checkLocalAuthenticationPermission = checkLocalAuthenticationPermission;
    exports.checkLocationPermission = checkLocationPermission;
    exports.checkLoginPermission = checkLoginPermission;
    exports.checkMultipleUserDataPermission = checkMultipleUserDataPermission;
    exports.checkPaymentPermission = checkPaymentPermission;
    exports.checkPhoneCallPermission = checkPhoneCallPermission;
    exports.checkPhotosPermission = checkPhotosPermission;
    exports.checkRecordAudioPermission = checkRecordAudioPermission;
    exports.checkVideosPermission = checkVideosPermission;
    exports.clearPermissionCache = clearPermissionCache;
    exports.clearStorage = clearStorage;
    exports.createMiniApp = createMiniApp;
    exports.createMiniAppInterface = createMiniAppInterface;
    exports.detectPlatform = detectPlatform;
    exports.executeLocalAuthentication = executeLocalAuthentication;
    exports.exit = exit;
    exports.getBooleanValue = getBooleanValue;
    exports.getContacts = getContacts;
    exports.getFloatValue = getFloatValue;
    exports.getIntegerValue = getIntegerValue;
    exports.getLocalAuthenticationStatus = getLocalAuthenticationStatus;
    exports.getLocation = getLocation;
    exports.getLongValue = getLongValue;
    exports.getMultipleUserData = getMultipleUserData;
    exports.getSharedMiniApp = getSharedMiniApp;
    exports.getStringValue = getStringValue;
    exports.initMiniAppAPI = initMiniAppAPI;
    exports.isSuccess = isSuccess;
    exports.miniAppToken = miniAppToken;
    exports.openExternalLink = openExternalLink;
    exports.openMiniApp = openMiniApp;
    exports.parseNativeMessage = parseNativeMessage;
    exports.pickFile = pickFile;
    exports.requestAudioPermission = requestAudioPermission;
    exports.requestCameraPermission = requestCameraPermission;
    exports.requestContactsPermission = requestContactsPermission;
    exports.requestDocumentPermission = requestDocumentPermission;
    exports.requestLocalAuthenticationPermission = requestLocalAuthenticationPermission;
    exports.requestLocationPermission = requestLocationPermission;
    exports.requestLoginPermission = requestLoginPermission;
    exports.requestMultipleUserDataPermission = requestMultipleUserDataPermission;
    exports.requestPaymentPermission = requestPaymentPermission;
    exports.requestPhoneCallPermission = requestPhoneCallPermission;
    exports.requestPhotosPermission = requestPhotosPermission;
    exports.requestRecordAudioPermission = requestRecordAudioPermission;
    exports.requestVideosPermission = requestVideosPermission;
    exports.retry = retry;
    exports.saveBooleanValue = saveBooleanValue;
    exports.saveFloatValue = saveFloatValue;
    exports.saveIntegerValue = saveIntegerValue;
    exports.saveLongValue = saveLongValue;
    exports.saveStringValue = saveStringValue;
    exports.sendToNative = sendToNative;
    exports.shareTextContent = shareTextContent;
    exports.updateMiniAppTheme = updateMiniAppTheme;
    exports.wireToMiniApp = wireToMiniApp;
    exports.withTimeout = withTimeout;

    return exports;

})({});
