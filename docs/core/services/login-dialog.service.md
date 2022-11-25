---
Title: Login Dialog service
Added: v2.6.0
Status: Active
Last reviewed: 2019-02-08
---

# [Login Dialog service](../../../lib/core/src/lib/services/login-dialog.service.ts "Defined in login-dialog.service.ts")

Manages login dialogs.

## Methods

-   **openLogin**(actionName: `string`, title: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string>`<br/>
    Opens a login dialog.
    -   _actionName:_ `string`  - Text to show in the main action button
    -   _title:_ `string`  - Title for the login dialog
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string>` - Confirmation of login from the dialog
-   **close**(): `<void>`<br/>
    Closes the currently open login dialog.

## Details

Use the methods of this service to manage login dialogs from code. As an alternative, you may
find it easier to use the [Login dialog component](../components/login-dialog.component.md) to display the
dialog directly from HTML.

## See also

-   [Login dialog component](../components/login-dialog.component.md)
-   [Login component](../components/login.component.md)
