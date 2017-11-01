# Page Title service

Sets the page title.

## Methods

`setTitle(value: string = '')`<br/>
Sets the page title.

## Details

If an application name is supplied in the app config file then this will
be concatenated with the `value` parameter when `setTitle` is called, giving
a result of the form "PageName - AppName" (see
[App Config service](app-config.service.md) for more information). If `value`
is not supplied then just the app name is used; this will default to
"Alfresco ADF Application" when no app name set in the config file.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [App config service](app-config.service.md)
<!-- seealso end -->



