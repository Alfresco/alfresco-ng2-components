---
Title: Identity User Info component
Added: v5.1.0
Status: Active
Last reviewed: 2023-01-24
---

# [Identity User Info component](../../../lib/core/src/lib/identity-user-info/identity-user-info.component.ts "Defined in identityuser-info.component.ts")

Shows user information for SSO mode.

## Basic usage

```html
<adf-identity-user-info></adf-identity-user-info>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| isLoggedIn | `boolean` | Is user logged in |
| identityUser | `IdentityUserModel` | Identity user model. |
| bpmBackgroundImage | `string` |  | Custom path for the background banner image for APS users. |
| ecmBackgroundImage | `string` |  | Custom path for the background banner image for ACS users. |
| menuPositionX | [`MenuPositionX`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "after" | Custom choice for opening the menu at the bottom. Can be `before` or `after`. |
| menuPositionY | [`MenuPositionY`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "below" | Custom choice for opening the menu at the bottom. Can be `above` or `below`. |
| namePosition | `string` | "right" | When the username is shown, this defines its position relative to the user info button. Can be `right` or `left`. |
| showName | `boolean` | true | Shows/hides the username next to the user info button. |

## Details

The component shows a round icon for the user and will show extra information about
the user when clicked.
