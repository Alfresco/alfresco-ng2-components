---
Title: Content User Info component
Added: v6.0.0
Status: Active
Last reviewed: 2023-01-24
---

# [Content User Info component](../../../lib/content-services/src/lib/content-user-info/content-user-info.component.ts "Defined in content-user-info.component.ts")

Shows user information for `CONTENT` and `CONTENT_SSO` mode.

## Basic usage

```html
<adf-content-user-info></adf-content-user-info>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| bpmBackgroundImage | `string` |  | Custom path for the background banner image for APS users. |
| ecmBackgroundImage | `string` |  | Custom path for the background banner image for ACS users. |
| ecmUser | [`EcmUserModel`](../../core/models/ecm-user.model.md) |  | ECM user info. |
| identityUser | [`IdentityUserModel`](../../../lib/process-services-cloud/src/lib/people/models/identity-user.model.ts) |  | Identity user info. |
| isLoggedIn | `boolean` |  | Determines if user is logged in. |
| menuPositionX | [`MenuPositionX`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "after" | Custom choice for opening the menu at the bottom. Can be `before` or `after`. |
| menuPositionY | [`MenuPositionY`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "below" | Custom choice for opening the menu at the bottom. Can be `above` or `below`. |
| mode | `UserInfoMode` |  | current mode. |
| namePosition | `string` | "right" | When the username is shown, this defines its position relative to the user info button. Can be `right` or `left`. |
| showName | `boolean` | true | Shows/hides the username next to the user info button. |

## Details

The component shows a round icon for the user and will show extra information about
the user when clicked.
