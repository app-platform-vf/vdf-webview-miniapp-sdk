---
sidebar_label: 'UI'
sidebar_position: 9
hide_title: false
title: UI
---

### setBackgroundStatusBarColor()

**Event Code:** `SET_BACKGROUND_STATUS_BAR_COLOR`

Thay đổi màu nền status bar.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `color` | `string` | *optional* | Mã màu `#FF5722` |


**Response**

*No response data*

---

### setNavigationBarColor()

**Event Code:** `SET_NAVIGATION_BAR_COLOR`

Thay đổi màu nền navigation bar.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `color` | `string` | *optional* | Mã màu `#2196F3` |


**Response**

*No response data*

---

### updateStatusBarAppearance()

**Event Code:** `UPDATE_STATUS_BAR_APPEARANCE`

Chuyển đổi status bar giữa dark mode và light mode.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `appearance` | `string` | *optional* | LIGHT hoặc DARK - Appearance mode cho status bar `DARK` |


**Response**

*No response data*

---

### updateNavigationBarAppearance()

**Event Code:** `UPDATE_NAVIGATION_BAR_APPEARANCE`

Chuyển đổi navigation bar giữa dark mode và light mode.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `appearance` | `string` | *optional* | LIGHT hoặc DARK - Appearance mode cho status bar `LIGHT ` |


**Response**

*No response data*

---

