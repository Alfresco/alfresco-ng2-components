---
Title: Bpm User Info component
Added: v6.0.0
Status: Active
Last reviewed: 2023-01-24
---

# [Bpm User Info component](../../../lib/process-services/src/lib/bpm-user-info/bpm-user-info.component.ts "Defined in bpmuser-info.component.ts")

Shows user information for `PROCESS` and `ALL` mode.

## Basic usage

```html
<adf-bpm-user-info></adf-bpm-user-info>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| isLoggedIn | `boolean` | Is user logged in |
| bpmUser | `BpmUserModel` | Bpm user model. |
| ecmUser | `EpmUserModel` | Ecm user model. |
| mode | `UserInfoMode` | `UserInfoMode.PROCESS` | current mode. |
| bpmBackgroundImage | `string` |  | Custom path for the background banner image for APS users. |
| BpmBackgroundImage | `string` |  | Custom path for the background banner image for ACS users. |
| menuPositionX | [`MenuPositionX`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "after" | Custom choice for opening the menu at the bottom. Can be `before` or `after`. |
| menuPositionY | [`MenuPositionY`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "below" | Custom choice for opening the menu at the bottom. Can be `above` or `below`. |
| namePosition | `string` | "right" | When the username is shown, this defines its position relative to the user info button. Can be `right` or `left`. |
| showName | `boolean` | true | Shows/hides the username next to the user info button. |

## Details

The component shows a round icon for the user and will show extra information about
the user when clicked.
