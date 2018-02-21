---
Added: v2.0.0
Status: Active
---
# Document List service

Implements node operations used by the Document List component.

## Methods

-   `deleteNode(nodeId: string): Observable<any>`  
    Deletes a node.  
    -   `nodeId` - ID of the node to delete
-   `copyNode(nodeId: string, targetParentId: string): any`  
    Copy a node to destination node  
    -   `nodeId` - The id of the node to be copied
    -   `targetParentId` - The id of the folder where the node will be copied
-   `moveNode(nodeId: string, targetParentId: string): any`  
    Move a node to destination node  
    -   `nodeId` - The id of the node to be moved
    -   `targetParentId` - The id of the folder where the node will be moved
-   `createFolder(name: string, parentId: string): Observable<MinimalNodeEntity>`  
    Create a new folder in the path.  
    -   `name` - Folder name
    -   `parentId` - Parent folder ID
-   `getFolder(folder: string, opts?: any): any`  
    Gets the folder node with the specified relative name path below the root node.  
    -   `folder` - Path to folder.
    -   `opts` - (Optional) Options.
-   `getFolderNode(nodeId: string): Promise<MinimalNodeEntryEntity>`  
    Gets a folder node via its node ID.  
    -   `nodeId` - ID of the folder node
-   `getDocumentThumbnailUrl(node: MinimalNodeEntity): any`  
    Get thumbnail URL for the given document node.  
    -   `node` - Node to get URL for.
-   `getMimeTypeIcon(mimeType: string): string`  
    Gets the icon that represents a MIME type.  
    -   `mimeType` - MIME type to get the icon for
-   `getDefaultMimeTypeIcon(): string`  
    Gets a default icon for MIME types with no specific icon.  

-   `hasPermission(node: any, permission: PermissionsEnum|string): boolean`  
    Checks if a node has the specified permission.  
    -   `node` - Target node
    -   `permission` - Permission level to query

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
