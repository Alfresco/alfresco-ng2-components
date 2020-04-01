---
Title: Kerberos
Added: v3.6.0
---

# Kerberos
The configuration for Kerberos authentication will allow users to access ADF applications by entering their credentials only once when logging into their Windows environment.

To enable Kerberos SSO and bypass the normal login, set the `withCredentials` property to `true` in the `auth` section of the `app.config.json`:

```json
{
  "auth": {
    "withCredentials": true
  }
}
```

**Note**: You don't need to use the [login component](../../docs/core/components/login.component.md) and [logout directive](../../docs/core/directives/logout.directive.md) in your app when using Kerberos. 
