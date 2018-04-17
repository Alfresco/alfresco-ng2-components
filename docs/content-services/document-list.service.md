---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
---

# Document List service

Implements node operations used by the Document List component.

## Class members

### Methods

-   `copyNode(nodeId: string = null, targetParentId: string = null): any`<br/>
    Copy a node to destination node
    -   `nodeId: string = null` -  The id of the node to be copied
    -   `targetParentId: string = null` -  The id of the folder where the node will be copied
    -   **Returns** `any` - NodeEntry for the copied node
-   `createFolder(name: string = null, parentId: string = null): Observable<MinimalNodeEntity>`<br/>
    Create a new folder in the path.
    -   `name: string = null` -  Folder name
    -   `parentId: string = null` -  Parent folder ID
    -   **Returns** `Observable<MinimalNodeEntity>` - Details of the created folder node
-   `deleteNode(nodeId: string = null): Observable<any>`<br/>
    Deletes a node.
    -   `nodeId: string = null` -  ID of the node to delete
    -   **Returns** `Observable<any>` - Empty response when the operation is complete
-   `getDefaultMimeTypeIcon(): string`<br/>
    Gets a default icon for MIME types with no specific icon.
    -   **Returns** `string` - Path to the icon file
-   `getDocumentThumbnailUrl(node: MinimalNodeEntity = null): string`<br/>
    Get thumbnail URL for the given document node.
    -   `node: MinimalNodeEntity = null` -  Node to get URL for.
    -   **Returns** `string` - Thumbnail URL string
-   `getFolder(folder: string = null, opts?: any = null, includeFields: string[] =  []): Observable<NodePaging>`<br/>
    Gets the folder node with the specified relative name path below the root node.
    -   `folder: string = null` -  Path to folder.
    -   `opts?: any = null` - (Optional) Options.
    -   `includeFields: string[] =  []` -  Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** `Observable<NodePaging>` - Details of the folder
-   `getFolderNode(nodeId: string = null, includeFields: string[] =  []): Promise<MinimalNodeEntryEntity>`<br/>
    Gets a folder node via its node ID.
    -   `nodeId: string = null` -  ID of the folder node
    -   `includeFields: string[] =  []` -  Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** `Promise<MinimalNodeEntryEntity>` - Details of the folder
-   `getMimeTypeIcon(mimeType: string = null): string`<br/>
    Gets the icon that represents a MIME type.
    -   `mimeType: string = null` -  MIME type to get the icon for
    -   **Returns** `string` - Path to the icon file
-   `hasPermission(node: any = null, permission: PermissionsEnum | string = null): boolean`<br/>
    Checks if a node has the specified permission.
    -   `node: any = null` -  Target node
    -   `permission: PermissionsEnum | string = null` -  Permission level to query
    -   **Returns** `boolean` - True if the node has the permission, false otherwise
-   `moveNode(nodeId: string = null, targetParentId: string = null): any`<br/>
    Move a node to destination node
    -   `nodeId: string = null` -  The id of the node to be moved
    -   `targetParentId: string = null` -  The id of the folder where the node will be moved
    -   **Returns** `any` - NodeEntry for the moved node

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

## See also

-   [Document list component](document-list.component.md)
