---
Title: Storage service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-14
---

# [Storage service](../../../lib/core/src/lib/common/services/storage.service.ts "Defined in storage.service.ts")

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

## Storage specific to an ADF app

If you are using multiple ADF apps, you might want to set the following configuration so that the apps have specific storages and are independent of others when setting and getting data from the local storage.

In order to achieve this, you will only need to set your app identifier under the `storagePrefix` property of the app in your `app.config.json` file.

```json
"application": {
    "storagePrefix": "ADF_Identifier",
    "name": "Your app name",
    "copyright": "Your copyright message"
}
```

**Important note**
This identifier must be unique to the app to guarantee that it has its own storage.

### SSO storagePrefix related scenario

The storagePrefix can allow you to login with multiple user in the same browser only if:
\- Or You don't use the implicit flow
\- Or You use implicit flow you use different AIMS instances for any app

## See also

-   [Cookie service](cookie.service.md)
-   [Content service](content.service.md)
