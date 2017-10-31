# Storage service

Stores items in the form of key-value pairs.

## Methods

`getItem(key: string): string | null` <br/>
Gets an item identified by `key`.

`setItem(key: string, data: string)` <br/>
Stores an item under `key`.

`clear()` <br/>
Removes all currently stored items.

`removeItem(key: string)` <br/>
Removes the item identified by `key`.

`hasItem(key: string): boolean` <br/>
Is any item currently stored under `key`?

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

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Cookie service](cookie.service.md)
<!-- seealso end -->