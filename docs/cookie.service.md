# Cookie service

Stores key-value data items as browser cookies.

## Methods

`getItem(key: string): string | null` <br/>
Gets an item identified by `key`.

` setItem(key: string, data: string, expiration: Date | null, path: string | null): void ` <br/>
Stores an item under `key`.

## Details

This service uses browser [cookies](https://en.wikipedia.org/wiki/HTTP_cookie)
to store data in the form of key-value pairs. An optional `expiration` date can be
supplied for the cookie and a `path` can be used to reduce the chances of name
clashes with cookies from other sources.

Cookies have a storage size limit that varies between browsers but is often around
4KB. Consider using [web storage](storage.service.md) if you need to store data
beyond this size.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Storage service](storage.service.md)
<!-- seealso end -->