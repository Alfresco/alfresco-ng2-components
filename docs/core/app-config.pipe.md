---
Added: v2.4.0
Status: Active
---

# App Config Pipe

Retrieves values from the application configuration file directly.

## Examples

```html
<adf-login
    copyrightText="{{ 'application.copyright' | adfAppConfig }}">
</adf-login>
```

You can also chain values with other pipes, for example `translation` one:

```html
<adf-login
    copyrightText="{{ 'application.copyright' | adfAppConfig | translate }}">
</adf-login>
```

## See also

- [App Config service](app-config.service.md)
