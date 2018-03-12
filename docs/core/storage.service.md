---
Added: v2.0.0
Status: Active
---
# Storage service

Stores items in the form of key-value pairs.

## Methods

-   `getItem(key: string): string`  
    Gets an item.  
    -   `key` - Key to identify the item
-   `setItem(key: string, data: string)`  
    Stores an item  
    -   `key` - Key to identify the item
    -   `data` - Data to store
-   `clear()`  
    Removes all currently stored items.   

-   `removeItem(key: string)`  
    Removes a single item.  
    -   `key` - Key to identify the item
-   `hasItem(key: string): boolean`  
    Is any item currently stored under `key`?  
    -   `key` - Key identifying item to check

## Details

The service will check to see if
[web storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage)
is available on the browser. If it is available then the service will use it to
store the key-value items persistently. Web storage can be used in a similar way to
[cookies](cookie.service.md) but with a much higher size limit (several MB for
web storage compared to a few KB for cookies). However, cookies are
more widely supported by browsers and can be set to expire after a certain date.

If local storage is not available then non-persistent memory storage within the app is
used instead.

## See also

-   [Cookie service](cookie.service.md)
-   [Content service](content.service.md)
