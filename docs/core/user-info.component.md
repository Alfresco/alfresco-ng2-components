---
Added: v2.0.0
Status: Active
---

# User Info component

Shows user information.

## Basic usage

```html
<adf-userinfo></adf-userinfo>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| bpmBackgroundImage | `string` |  | Custom path for the background banner image for APS users. |
| ecmBackgroundImage | `string` |  | Custom path for the background banner image for ACS users. |
| menuPositionX | `string` | "after" | Custom choice for opening the menu at the bottom. Can be `before` or `after`. |
| menuPositionY | `string` | "below" | Custom choice for opening the menu at the bottom. Can be `above` or `below`. |
| namePosition | `string` | "right" | When the username is shown, this defines its position relative to the user info button. Can be `right` or `left`. |
| showName | `boolean` | true | Shows/hides the username next to the user info button. |

## Details

This will show a round icon with user and on click some user information.
If user is logged in with both ACS and APS, the ACS image will be shown.
