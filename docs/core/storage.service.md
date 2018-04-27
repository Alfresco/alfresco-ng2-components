---
Added: v2.0.0
Status: Active
---

# Storage service

Stores items in the form of key-value pairs.

## Class members

### Methods

-   `clear()`<br/>
    Removes all currently stored items.
    -   `getItem(key: string = null): string | null`<br/>
        Gets an item.
    -   `key: string = null` -  Key to identify the item
    -   **Returns** `string | null` - 
-   `hasItem(key: string = null): boolean`<br/>
    Is any item currently stored under \`key\`?
    -   `key: string = null` -  Key identifying item to check
    -   **Returns** `boolean` - 
-   `removeItem(key: string = null)`<br/>
    Removes a single item.
    -   `key: string = null` -  Key to identify the item
-   `setItem(key: string = null, data: string = null)`<br/>
    Stores an item
-   `key: string = null` -  Key to identify the item
-   `data: string = null` -  Data to store

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
