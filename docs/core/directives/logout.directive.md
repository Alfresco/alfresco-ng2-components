---
Title: Logout directive
Added: v2.0.0
Status: Active
Last reviewed: 2019-03-20
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
| --- | --- | --- | --- |
| enableRedirect | `boolean` | true | Enable redirecting after logout |
| redirectUri | `string` | "/login" | URI to redirect to after logging out. |

## Kerberos

The configuration for Kerberos authentication will allow users to access Alfresco products by entering their credentials only once when logging into their Windows environment.

**You don't need to use the [logout directive](../../core/directives/logout.directive.md) when Kerberos SSO is enabled in ADF**.

See [Kerberos Configuration](../../../docs/user-guide/kerberos.md) for instructions on configuring Kerberos for an ADF app.

## See also

*   [Login component](../components/login.component.md)
