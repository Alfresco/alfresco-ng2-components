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

## Fallback values

You can use pipe parameters to pass fallback value:

```html
<adf-login
    copyrightText="{{ 'application.copyright' | adfAppConfig:'Fallback Text' }}">
</adf-login>
```

## Chaining with other pipes

You can also chain values with other pipes, for example `translation` one:

```html
<adf-login
    copyrightText="{{ 'application.copyright' | adfAppConfig | translate }}">
</adf-login>
```

## See also

-   [App Config service](app-config.service.md)
