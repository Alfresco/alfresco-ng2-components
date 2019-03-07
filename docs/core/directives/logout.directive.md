---
Title: Logout directive
Added: v2.0.0
Status: Active
---

# [Logout directive](../../../lib/core/directives/logout.directive.ts "Defined in logout.directive.ts")

Logs the user out when the decorated element is clicked.

## Basic Usage

```html
<button adf-logout>Logout</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| enableRedirect | `boolean` | true | Enable redirecting after logout |
| redirectUri | `string` | "/login" | URI to redirect to after logging out. |

## See also

-   [Login component](login.component.md)
