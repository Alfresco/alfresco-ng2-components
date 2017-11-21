# Document List service

Implements node operations used by the Document List component.

## Methods

`deleteNode(nodeId: string): Observable<any>`<br/>
Deletes a node.

`copyNode(nodeId: string, targetParentId: string)`<br/>
Places a copy of an existing node under a new parent node.

`moveNode(nodeId: string, targetParentId: string)`<br/>
hasPermission(node: any, permission: PermissionsEnum|string): boolean.

`createFolder(name: string, parentId: string): Observable<MinimalNodeEntity>`<br/>
Creates a folder.

`getFolder(folder: string, opts?: any): Observable<NodePaging>`<br/>
Gets a folder node via its pathname from root.

`getFolderNode(nodeId: string): Promise<MinimalNodeEntryEntity>`<br/>
Gets a folder node via its node ID.

`getDocumentThumbnailUrl(node: MinimalNodeEntity): string`<br/>
Gets the thumbnail URL for a document node.

`getMimeTypeIcon(mimeType: string): string`<br/>
Gets the icon that represents a MIME type.

`getDefaultMimeTypeIcon(): string`<br/>
Gets a default icon for MIME types with no specific icon.

`hasPermission(node: any, permission: PermissionsEnum|string): boolean`<br/>
Gets a folder node via its pathname from root.

## Details

This service makes extensive use of the Alfresco JS API. In particular,
see the
[Nodes API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getNodeChildren)
for further details of the types, options and the underlying REST architecture.

Also, the [Document Library model](document-library.model.md) in the ADF docs has
more information about related classes.

### Moving, copying and deleting nodes

Both `moveNode` and `copyNode` create a copy of the existing node under a new
parent, but `moveNode` also deletes the original. The new node has the same
name as the original and if it is a folder then all its contents will be copied
in-place.

Use `deleteNode` to move a node from its original location into the trash (from
where it can be restored if necessary). If the deleted node is a folder then its
child items will also be moved to the trash.

### Folder operations

Use `getFolderNode` to get a folder node by its node ID and `getFolder` to access
the folder via its pathname from the root folder. Also, `getFolder` allows you to
specify extra options in the `opts` parameter; see the
[getNodeChildren](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getNodeChildren)
method in the Alfresco JS API for more information about the available options.

Use `createFolder` to add a new folder in a given parent folder node. You can
specify the well-known names "-my-" , "-shared-" and "-root-" as shortcuts for
the `parentId`.

### Permissions

The `hasPermission` method reports whether or not the user has the specified permission for the
node. The Permissions enum contains the values DELETE, UPDATE, CREATE, UPDATEPERMISSIONS, NOT_DELETE, NOT_UPDATE, NOT_CREATE and NOT_UPDATEPERMISSIONS but you can also supply these
values via their string equivalents.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Document list component](document-list.component.md)
<!-- seealso end -->



