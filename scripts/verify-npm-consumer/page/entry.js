// Diem vao cua trang tieu thu goi npm.
//
// Tep nay duoc CHEP vao sandbox roi moi bundle, nen node-resolve di len tu day se
// gap node_modules cua sandbox — tuc ban da CAI, khong phai packages/core. Do la
// khac biet duy nhat giua trang nay va bon trang demo co san.
//
// Mot dong, va co ly do phai la mot dong: rollup dong goi tep nay thanh IIFE ten
// `WebviewSdk`, dung ten ma `dist/bundle.js` cua demo/vanilla phoi ra. Nho vay
// trang HTML sinh boi demo/demo.js chay y nguyen o day, khong phai sua mot chu —
// va bat ky hang nao thieu trong goi da dong se hong ngay tai nut bam tuong ung
// thay vi vang mat trong im lang.
//
// `export *` con lam mot viec khac: no keo TOAN BO bang xuat cua gói. Neu ban
// dong goi thieu mot tep (vi du `files` trong package.json bo sot dist/generated)
// thi rollup bao loi o day, luc dung trang — khong phai luc nguoi dung tai ve.
export * from "vdf-webview-miniapp-sdk"
