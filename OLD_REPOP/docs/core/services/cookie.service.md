---
Title: Cookie service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Cookie service](../../../lib/core/src/lib/common/services/cookie.service.ts "Defined in cookie.service.ts")

Stores key-value data items as browser cookies.

## Class members

### Methods

-   **clear**()<br/>
    Placeholder for testing purposes - do not use.
-   **deleteCookie**(key: `string`, path: `string|null` = `null`)<br/>
    Delete a cookie Key.
    -   _key:_ `string`  - Key to identify the cookie
    -   _path:_ `string|null`  - "Pathname" to store the cookie
-   **getItem**(key: `string`): `string|null`<br/>
    Retrieves a cookie by its key.
    -   _key:_ `string`  - Key to identify the cookie
    -   **Returns** `string|null` - The cookie data or null if it is not found
-   **isEnabled**(): `boolean`<br/>
    Checks if cookies are enabled.
    -   **Returns** `boolean` - True if enabled, false otherwise
-   **setItem**(key: `string`, data: `string`, expiration: `Date|null` = `null`, path: `string|null` = `null`)<br/>
    Sets a cookie.
    -   _key:_ `string`  - Key to identify the cookie
    -   _data:_ `string`  - Data value to set for the cookie
    -   _expiration:_ `Date|null`  - Expiration date of the data
    -   _path:_ `string|null`  - "Pathname" to store the cookie

## Details

This service uses browser [cookies](https://en.wikipedia.org/wiki/HTTP_cookie)
to store data in the form of key-value pairs. An optional `expiration` date can be
supplied for the cookie and a `path` can be used to reduce the chances of name
clashes with cookies from other sources.

Cookies have a storage size limit that varies between browsers but is often around
4KB. Consider using [web storage](storage.service.md) if you need to store data
beyond this size.

## See also

-   [Content service](content.service.md)
-   [Storage service](storage.service.md)
