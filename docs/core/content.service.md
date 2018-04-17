---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-13
---

# Content service

Accesses app-generated data objects via URLs and file downloads.

## Methods

-   `downloadBlob(blob: Blob, fileName: string)`  
    Invokes content download for a Blob with a file name.  
    -   `blob` - Content to download.
    -   `fileName` - Name of the resulting file.
-   `downloadData(data: any, fileName: string)`  
    Invokes content download for a data array with a file name.  
    -   `data` - Data to download.
    -   `fileName` - Name of the resulting file.
-   `downloadJSON(json: any, fileName)`  
    Invokes content download for a JSON object with a file name.  
    -   `json` - JSON object to download.
    -   `fileName` - Name of the resulting file.
-   `createTrustedUrl(blob: Blob): string`  
    Creates a trusted object URL from the Blob. WARNING: calling this method with untrusted user data exposes your application to XSS security risks!  
    -   `blob` - Data to wrap into object URL
-   `getDocumentThumbnailUrl(node: any, attachment?: boolean, ticket?: string): string`  
    Get thumbnail URL for the given document node.  
    -   `node` - Node to get URL for.
    -   `attachment` - (Optional) Retrieve content as an attachment for download
    -   `ticket` - (Optional) Custom ticket to use for authentication
-   `getContentUrl(node: any, attachment?: boolean, ticket?: string): string`  
    Get content URL for the given node.  
    -   `node` - nodeId or node to get URL for.
    -   `attachment` - (Optional) Retrieve content as an attachment for download
    -   `ticket` - (Optional) Custom ticket to use for authentication
-   `getNodeContent(nodeId: string): Observable<any>`  
    Get content for the given node.  
    -   `nodeId` - ID of the target node
-   `createFolder(relativePath: string, name: string, parentId?: string): Observable<FolderCreatedEvent>`  
    Create a folder  
    -   `relativePath` - Location to create the folder
    -   `name` - Folder name
    -   `parentId` - (Optional) Node ID of parent folder
-   `hasPermission(node: any, permission: PermissionsEnum | string): boolean`  
    Check if the user has permissions on that node  
    -   `node` - Node to check allowableOperations
    -   `permission` - Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
-   `hasAllowableOperations(node: any): boolean`  
    Check if the node has the properties allowableOperations  
    -   `node` - Node to check allowableOperations

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
