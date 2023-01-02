---
Title: App Config Pipe
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-24
---

# [App Config Pipe](../../../lib/core/src/lib/app-config/app-config.pipe.ts "Defined in app-config.pipe.ts")

Retrieves values from the application configuration file directly.

## Basic usage

```html
<adf-login
    copyrightText="{{ 'application.copyright' | adfAppConfig }}">
</adf-login>
```

## Details

### Fallback values

You can use the pipe parameter to pass a fallback value which will be
used if the property name is not found:

```html
<adf-login
    copyrightText="{{ 'application.copyright' | adfAppConfig:'Fallback Text' }}">
</adf-login>
```

### Chaining with other pipes

You can also chain values with other pipes such as the translation pipe:

```html
<adf-login
    copyrightText="{{ 'application.copyright' | adfAppConfig | translate }}">
</adf-login>
```

## See also

-   [App Config service](../services/app-config.service.md)
