---
Title: Page Title service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Page Title service](../../../lib/core/src/lib/common/services/page-title.service.ts "Defined in page-title.service.ts")

Sets the page title.

## Class members

### Methods

-   **setTitle**(value: `string` = `""`)<br/>
    Sets the page title.
    -   _value:_ `string`  - The new title

## Details

If an application name is supplied in the app config file then this will
be concatenated with the `value` parameter when `setTitle` is called, giving
a result of the form "PageName - AppName" (see
[App Config service](app-config.service.md) for more information). If `value`
is not supplied then just the app name is used; this will default to
"Alfresco ADF [Application"](../../../lib/testing/src/lib/core/structure/application.ts) when no app name set in the config file.

## See also

-   [App config service](app-config.service.md)
