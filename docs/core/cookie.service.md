---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-29
---

# Cookie service

Stores key-value data items as browser cookies.

## Class members

### Methods

-   `getItem(key: string = null): string | null`<br/>
    Retrieves a cookie by its key.
    -   `key: string = null` -  Key to identify the cookie
    -   **Returns** `string | null` - The cookie data or null if it is not found
-   `isEnabled(): boolean`<br/>
    Checks if cookies are enabled.
    -   **Returns** `boolean` - True if enabled, false otherwise
-   `setItem(key: string = null, data: string = null, expiration: Date | null = null, path: string | null = null)`<br/>
    Sets a cookie.
    -   `key: string = null` -  Key to identify the cookie
    -   `data: string = null` -  Data value to set for the cookie
    -   `expiration: Date | null = null` -  Expiration date of the data
    -   `path: string | null = null` -  "Pathname" to store the cookie

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
