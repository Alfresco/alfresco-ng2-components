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
| ---- | ---- | ------------- | ----------- |
| enableRedirect | `boolean` | true | Enable redirecting after logout |
| redirectUri | `string` | "/login" | URI to redirect to after logging out. |


## Kerberos

You don't have to use the logout directive when enable the Kerberos SSO in ADF. The configuration for Kerberos authentication will allow users to access Alfresco products by entering their credentials only once when logging into their Windows environment.

[Kerberos Configuration](../../../lib/docs/core/directives/logout.directive.md)

## See also

-   [Login component](../components/login.component.md)
