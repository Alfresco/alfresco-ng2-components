---
Added: v2.0.0
Status: Active
---
# Page Title service

Sets the page title.

## Class members

### Methods

-   `setTitle(value: string = '')`  
    Sets the page title.  
    -   `value` - The new title

## Details

If an application name is supplied in the app config file then this will
be concatenated with the `value` parameter when `setTitle` is called, giving
a result of the form "PageName - AppName" (see
[App Config service](app-config.service.md) for more information). If `value`
is not supplied then just the app name is used; this will default to
"Alfresco ADF Application" when no app name set in the config file.

## See also

-   [App config service](app-config.service.md)
