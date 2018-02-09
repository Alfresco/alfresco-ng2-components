# Cookie service

Stores key-value data items as browser cookies.

## Methods

-   `isEnabled(): boolean`  
    Checks if cookies are enabled.  

-   `getItem(key: string): string`  
    Retrieves a cookie by its key.  
    -   `key` - Key to identify the cookie
-   `setItem(key: string, data: string, expiration: Date | null, path: string | null)`  
    Set a cookie.  
    -   `key` - Key to identify the cookie
    -   `data` - Data value to set for the cookie
    -   `expiration` - Expiration date of the data
    -   `path` - "Pathname" to store the cookie

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
