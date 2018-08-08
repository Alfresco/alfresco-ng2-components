---
Added: v2.0.0
Status: Active
---

# Storage service

Stores items in the form of key-value pairs.

## Class members

### Methods

-   **clear**()<br/>
    Removes all currently stored items.
-   **getItem**(key: `string`): `string|null`<br/>
    Gets an item.
    -   _key:_ `string`  - Key to identify the item
    -   **Returns** `string|null` - The item (if any) retrieved by the key
-   **hasItem**(key: `string`): `boolean`<br/>
    Is any item currently stored under `key`?
    -   _key:_ `string`  - Key identifying item to check
    -   **Returns** `boolean` - True if key retrieves an item, false otherwise
-   **removeItem**(key: `string`)<br/>
    Removes a single item.
    -   _key:_ `string`  - Key to identify the item
-   **setItem**(key: `string`, data: `string`)<br/>
    Stores an item
    -   _key:_ `string`  - Key to identify the item
    -   _data:_ `string`  - Data to store

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
