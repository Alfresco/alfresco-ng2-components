---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-13
---

# Content service

Accesses app-generated data objects via URLs and file downloads.

## Class members

### Methods

-   `createFolder(relativePath: string = null, name: string = null, parentId?: string = null): Observable<FolderCreatedEvent>`<br/>
    Create a folder
    -   `relativePath: string = null` -  Location to create the folder
    -   `name: string = null` -  Folder name
    -   `parentId?: string = null` - (Optional) Node ID of parent folder
    -   **Returns** `Observable<FolderCreatedEvent>` - 
-   `createTrustedUrl(blob: Blob = null): string`<br/>
    Creates a trusted object URL from the Blob. WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
    -   `blob: Blob = null` -  Data to wrap into object URL
    -   **Returns** `string` - 
-   `downloadBlob(blob: Blob = null, fileName: string = null)`<br/>
    Invokes content download for a Blob with a file name.
    -   `blob: Blob = null` -  Content to download.
    -   `fileName: string = null` -  Name of the resulting file.
-   `downloadData(data: any = null, fileName: string = null)`<br/>
    Invokes content download for a data array with a file name.
-   `data: any = null` -  Data to download.
-   `fileName: string = null` -  Name of the resulting file.
-   `downloadJSON(json: any = null, fileName: string = null)`<br/>
    Invokes content download for a JSON object with a file name.
-   `json: any = null` -  JSON object to download.
-   `fileName: string = null` -  Name of the resulting file.
-   `getContentUrl(node: any = null, attachment?: boolean = null, ticket?: string = null): string`<br/>
    Get content URL for the given node.
-   `node: any = null` -  
-   `attachment?: boolean = null` - (Optional) 
-   `ticket?: string = null` - (Optional) 
    -   **Returns** `string` - 
-   `getDocumentThumbnailUrl(node: any = null, attachment?: boolean = null, ticket?: string = null): string`<br/>
    Get thumbnail URL for the given document node.
    -   `node: any = null` -  Node to get URL for.
    -   `attachment?: boolean = null` - (Optional) 
    -   `ticket?: string = null` - (Optional) 
    -   **Returns** `string` - 
-   `getNode(nodeId: string = null, opts?: any = null): Observable<NodeEntry>`<br/>
    Gets a Node via its node ID.
    -   `nodeId: string = null` -  
    -   `opts?: any = null` - (Optional) 
    -   **Returns** `Observable<NodeEntry>` - Details of the folder
-   `getNodeContent(nodeId: string = null): Observable<any>`<br/>
    Get content for the given node.
    -   `nodeId: string = null` -  ID of the target node
    -   **Returns** `Observable<any>` - 
-   `hasAllowableOperations(node: any = null): boolean`<br/>
    Check if the node has the properties allowableOperations
    -   `node: any = null` -  Node to check allowableOperations
    -   **Returns** `boolean` - 
-   `hasPermission(node: Node = null, permission: PermissionsEnum | string = null): boolean`<br/>
    Check if the user has permissions on that node
    -   `node: Node = null` -  Node to check allowableOperations
    -   `permission: PermissionsEnum | string = null` -  Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
    -   **Returns** `boolean` -

## Details

Use the Content service to deliver data to the user from `Blob` objects.

The [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) class
(implemented in the browser, not ADF) represents an array of bytes that you can
use to construct and store data in any binary format you choose.
The user can access a Blob either by downloading the byte array as a file or in
some cases by viewing it directly in the browser via a special URL that references
the Blob. For example, you could use the Blob interface to construct an image in the
[PNG format](https://en.wikipedia.org/wiki/Portable_Network_Graphics). Since
PNG is a format the browser can display, you could use the Blob's URL in an
&lt;img> element to view the image within the page. Alternatively, you could let
the user download it as a PNG file.

The `downloadBlob` method starts a download of the Blob data to the `filename`
within the user's downloads folder. The other `downloadXXX` methods do the same
but first convert the supplied data to a Blob before downloading; see the
[Blob reference page](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
for details of how a Blob's contents are assembled from the constructor arguments.

Use `createdTrustedUrl` to generate a URL string for a Blob. The URL refers to
the Blob as though it were a file but it is actually an object stored in memory,
so it does not persist across browser sessions. This URL can be used much like any
other, so you could use it for the `src` attribute of an &lt;img> element or the
`href` of a download link. Note that while the URL is 'trusted', the data it contains
is not necessarily trustworthy unless you can vouch for it yourself; be careful that
the data doesn't expose your app to
[Cross Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)
attacks.

## See also

-   [Cookie service](cookie.service.md)
-   [Storage service](storage.service.md)
