---
sidebar_label: 'Tổng quan'
sidebar_position: 0
slug: /
title: Tổng quan
---

# Tổng quan

`vdf-webview-miniapp-sdk` là SDK phía **WebView** cho Super MiniApp — giao tiếp giữa
WebView (JavaScript/TypeScript) và ứng dụng **Native (Android / iOS)** qua hệ thống
**bridge event**. Toàn bộ API type-safe được **sinh tự động từ `events.json`**.

## Nền tảng hỗ trợ
- **iOS / Android** (Native & React Native)
- **Web** (qua `window.postMessage` — để test trên browser)

## Điều hướng
- **Getting Started** — cài đặt & gọi API đầu tiên.
- **Giao thức chung** — cấu trúc request/response chung của mọi event.
- **Danh sách API** — chi tiết từng nhóm event (Routing, Storage, UI, Location, Permission…).
- **API Reference** — tra type/interface tự động (typedoc).

```bash
npm install vdf-webview-miniapp-sdk
```
