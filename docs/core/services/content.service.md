---
Title: Content service
Added: v2.0.0
Status: Active
Last reviewed: 2019-03-13
---

# [Content service](../../../lib/core/services/content.service.ts "Defined in content.service.ts")

Accesses app-generated data objects via URLs and file downloads.

## Class members

### Methods

*   **createTrustedUrl**(blob: [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)): `string`<br/>
    Creates a trusted object URL from the [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob). WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
    *   *blob:* [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)  - Data to wrap into object URL
    *   **Returns** `string` - URL string
*   **downloadBlob**(blob: [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob), fileName: `string`)<br/>
    (**Deprecated:** in 3.2.0, use [DownloadService](../../../lib/core/services/download.service.ts) instead. Invokes content download for a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) with a file name.)
    *   *blob:* [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)  - Content to download.
    *   *fileName:* `string`  - Name of the resulting file.
*   **downloadData**(data: `any`, fileName: `string`)<br/>
    (**Deprecated:** in 3.2.0, use [DownloadService](../../../lib/core/services/download.service.ts) instead. Invokes content download for a data array with a file name.)
    *   *data:* `any`  - Data to download.
    *   *fileName:* `string`  - Name of the resulting file.
*   **downloadJSON**(json: `any`, fileName: `string`)<br/>
    (**Deprecated:** in 3.2.0, use [DownloadService](../../../lib/core/services/download.service.ts) instead. Invokes content download for a JSON object with a file name.)
    *   *json:* `any`  - JSON object to download.
    *   *fileName:* `string`  - Name of the resulting file.
*   **getContentUrl**(node: [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`|string`, attachment?: `boolean`, ticket?: `string`): `string`<br/>
    Gets a content URL for the given node.
    *   *node:* [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`|string`  - Node or Node ID to get URL for.
    *   *attachment:* `boolean`  - (Optional) Toggles whether to retrieve content as an attachment for download
    *   *ticket:* `string`  - (Optional) Custom ticket to use for authentication
    *   **Returns** `string` - URL string or `null`
*   **getDocumentThumbnailUrl**(node: [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`|string`, attachment?: `boolean`, ticket?: `string`): `string`<br/>
    (**Deprecated:** in 3.2.0, use ThumbnailService instead. Gets a thumbnail URL for the given document node.)
    *   *node:* [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`|string`  - Node or Node ID to get URL for.
    *   *attachment:* `boolean`  - (Optional) Toggles whether to retrieve content as an attachment for download
    *   *ticket:* `string`  - (Optional) Custom ticket to use for authentication
    *   **Returns** `string` - URL string
*   **getNode**(nodeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Gets a Node via its node ID.
    *   *nodeId:* `string`  - ID of the target node
    *   *opts:* `any`  - (Optional) Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - Details of the folder
*   **getNodeContent**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets content for the given node.
    *   *nodeId:* `string`  - ID of the target node
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Content data
*   **hasAllowableOperations**(node: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), allowableOperation: [`AllowableOperationsEnum`](../../../lib/core/models/allowable-operations.enum.ts)`|string`): `boolean`<br/>
    Checks if the user has permissions on that node
    *   *node:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) to check allowableOperations
    *   *allowableOperation:* [`AllowableOperationsEnum`](../../../lib/core/models/allowable-operations.enum.ts)`|string`  - Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
    *   **Returns** `boolean` - True if the user has the required permissions, false otherwise
*   **hasPermissions**(node: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), permission: [`PermissionsEnum`](../../../lib/core/models/permissions.enum.ts)`|string`): `boolean`<br/>
    Checks if the user has permission on that node
    *   *node:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) to check permissions
    *   *permission:* [`PermissionsEnum`](../../../lib/core/models/permissions.enum.ts)`|string`  - Required permission type
    *   **Returns** `boolean` - True if the user has the required permissions, false otherwise

## Details

Use the [Content service](content.service.md) to deliver data to the user from [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) objects.

The [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) class
(implemented in the browser, not ADF) represents an array of bytes that you can
use to construct and store data in any binary format you choose.
The user can access a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) either by downloading the byte array as a file or in
some cases by viewing it directly in the browser via a special URL that references
the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). For example, you could use the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) interface to construct an image in the
[PNG format](https://en.wikipedia.org/wiki/Portable_Network_Graphics). Since
PNG is a format the browser can display, you could use the [Blob's](https://developer.mozilla.org/en-US/docs/Web/API/Blob) URL in an
\<img> element to view the image within the page. Alternatively, you could let
the user download it as a PNG file.

The `downloadBlob` method starts a download of the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) data to the `filename`
within the user's downloads folder. The other `downloadXXX` methods do the same
but first convert the supplied data to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) before downloading; see the
[Blob reference page](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
for details of how a [Blob's](https://developer.mozilla.org/en-US/docs/Web/API/Blob) contents are assembled from the constructor arguments.

Use `createdTrustedUrl` to generate a URL string for a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). The URL refers to
the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) as though it were a file but it is actually an object stored in memory,
so it does not persist across browser sessions. This URL can be used much like any
other, so you could use it for the `src` attribute of an \<img> element or the
`href` of a download link. Note that while the URL is 'trusted', the data it contains
is not necessarily trustworthy unless you can vouch for it yourself; be careful that
the data doesn't expose your app to
[Cross Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)
attacks.

## See also

*   [Cookie service](cookie.service.md)
*   [Storage service](storage.service.md)
