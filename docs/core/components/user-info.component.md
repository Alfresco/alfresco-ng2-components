---
Title: User Info component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [User Info component](../../../lib/core/userinfo/components/user-info.component.ts "Defined in user-info.component.ts")

Shows user information.

## Basic usage

```html
<adf-userinfo></adf-userinfo>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| bpmBackgroundImage | `string` |  | Custom path for the background banner image for APS users. |
| ecmBackgroundImage | `string` |  | Custom path for the background banner image for ACS users. |
| menuPositionX | [`MenuPositionX`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "after" | Custom choice for opening the menu at the bottom. Can be `before` or `after`. |
| menuPositionY | [`MenuPositionY`](https://github.com/angular/components/blob/master/src/material/menu/menu-positions.ts) | "below" | Custom choice for opening the menu at the bottom. Can be `above` or `below`. |
| namePosition | `string` | "right" | When the username is shown, this defines its position relative to the user info button. Can be `right` or `left`. |
| showName | `boolean` | true | Shows/hides the username next to the user info button. |

## Details

The component shows a round icon for the user and will show extra information about
the user when clicked.
If user is logged in with both ACS and APS, the ACS image will be shown.
In case of SSO authentication, the information related to the user like firstname, lastname will be fetched using the Keycloak [`Api`](../../../lib/testing/src/lib/core/structure/api.ts)
