---
Title: Kerberos
Added: v3.6.0
---

# Kerberos
The configuration for Kerberos authentication will allow users to access ADF applications by entering their credentials only once when logging into their Windows environment.

To correctly setup your ADF app to work with Kerberos you need to set `withCredentials` property to true in the `auth` section of
`app.config.json` this will enable Kerberos and bypass the normal login:

```json
{
  "auth": {
    "withCredentials": "true"
  }
}
```

You don't have to use the login component and logout directive in your app when use Kerberos. 
