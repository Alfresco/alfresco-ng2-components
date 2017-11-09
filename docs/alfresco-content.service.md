# Alfresco Content service

Gets URLs and access info and creates folders in Content Services.

## Methods

`getDocumentThumbnailUrl(nodeId: any, attachment?: boolean, ticket?: string): string`<br/>
Gets a thumbnail URL for a node.

`getContentUrl(nodeId: any, attachment?: boolean, ticket?: string): string`<br/>
Gets the URL for a node's content.

`getNodeContent(nodeId: string): Observable<any>`<br/>
Gets a node's content.

`createFolder(relativePath: string, name: string, parentId?: string): Observable<FolderCreatedEvent>`<br/>
Creates a folder.

`hasPermission(node: any, permission: PermissionsEnum|string): boolean`<br/>
Checks if the user has the specified permissions for `node`.

`hasAllowableOperations(node: any): boolean `<br/>
Checks if the the node has the `allowableOperations` property.

## Details

The methods that take a `node` parameter can receive the node as either a node ID string
or as a [MinimalNode](document-library.model.md) object. You can obtain the `ticket` string,
if you need it, from the [Authentication service](authentication.service.md). If
`attachment` is false then the content can be viewed in the browser but not downloaded; the
default value of true allows a download to take place.

The `createFolder` method adds a folder with a given `name` within the folder at `parentId`,
if supplied. You can use the well-known names "-my-" , "-shared-" or "-root-" as the `parentId`.
The `relativePath` will create a sequence of folders within `parentId` with `name` as the last
element but you can use an empty string to make the folder a direct child of `parentId`.

The `hasPermission` method reports whether the node has the specified permission. (The
[Permissions](https://github.com/Alfresco/alfresco-ng2-components/blob/development/ng2-components/ng2-alfresco-core/src/models/permissions.enum.ts)
enum contains the values `DELETE`, `UPDATE`, `CREATE`, `UPDATEPERMISSIONS`, `NOT_DELETE`,
`NOT_UPDATE`, `NOT_CREATE` and `NOT_UPDATEPERMISSIONS`.

See the
[Alfresco JS API](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-core-rest-api)
for more information about the low-level REST API that these methods are based on.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->

<!-- seealso end -->



