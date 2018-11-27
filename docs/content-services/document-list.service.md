---
Title: Document List service
Added: v2.0.0
Status: Active
Last reviewed: 2018-09-13
---

# Document List service

Implements node operations used by the [Document List component](../content-services/document-list.component.md).

## Class members

### Methods

-   **copyNode**(nodeId: `string`, targetParentId: `string`): `any`<br/>
    Copy a node to destination node
    -   _nodeId:_ `string`  - The id of the node to be copied
    -   _targetParentId:_ `string`  - The id of the folder where the node will be copied
    -   **Returns** `any` - [NodeEntry](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md) for the copied node
-   **createFolder**(name: `string`, parentId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntity`](../content-services/document-library.model.md)`>`<br/>
    Creates a new folder in the path.
    -   _name:_ `string`  - Folder name
    -   _parentId:_ `string`  - Parent folder ID
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntity`](../content-services/document-library.model.md)`>` - Details of the created folder node
-   **deleteNode**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes a node.
    -   _nodeId:_ `string`  - ID of the node to delete
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the operation is complete
-   **getDefaultMimeTypeIcon**(): `string`<br/>
    Gets a default icon for MIME types with no specific icon.
    -   **Returns** `string` - Path to the icon file
-   **getDocumentThumbnailUrl**(node: [`MinimalNodeEntity`](../content-services/document-library.model.md)): `string`<br/>
    Get thumbnail URL for the given document node.
    -   _node:_ [`MinimalNodeEntity`](../content-services/document-library.model.md)  - Node to get URL for.
    -   **Returns** `string` - Thumbnail URL string
-   **getFolder**(folder: `string`, opts?: `any`, includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets the folder node with the specified relative name path below the root node.
    -   _folder:_ `string`  - Path to folder.
    -   _opts:_ `any`  - (Optional) Options.
    -   _includeFields:_ `string[]`  - Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - Details of the folder
-   **getFolderNode**(nodeId: `string`, includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>
    (**Deprecated:** 2.3.0) Gets a folder node via its node ID.
    -   _nodeId:_ `string`  - ID of the folder node
    -   _includeFields:_ `string[]`  - Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - Details of the folder
-   **getMimeTypeIcon**(mimeType: `string`): `string`<br/>
    Gets the icon that represents a MIME type.
    -   _mimeType:_ `string`  - MIME type to get the icon for
    -   **Returns** `string` - Path to the icon file
-   **getNode**(nodeId: `string`, includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Gets a node via its node ID.
    -   _nodeId:_ `string`  - ID of the target node
    -   _includeFields:_ `string[]`  - Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - Details of the folder
-   **hasPermission**(node: `any`, permission: [`PermissionsEnum`](../../lib/core/models/permissions.enum.ts)`|string`): `boolean`<br/>
    (**Deprecated:** 2.3.0 - use the equivalent in the content service) Checks if a node has the specified permission.
    -   _node:_ `any`  - Target node
    -   _permission:_ [`PermissionsEnum`](../../lib/core/models/permissions.enum.ts)`|string`  - Permission level to query
    -   **Returns** `boolean` - True if the node has the permission, false otherwise
-   **moveNode**(nodeId: `string`, targetParentId: `string`): `any`<br/>
    Moves a node to destination node.
    -   _nodeId:_ `string`  - The id of the node to be moved
    -   _targetParentId:_ `string`  - The id of the folder where the node will be moved
    -   **Returns** `any` - [NodeEntry](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md) for the moved node

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
