---
Title: Document List service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Document List service](../../../lib/content-services/src/lib/document-list/services/document-list.service.ts "Defined in document-list.service.ts")

Implements node operations used by the [Document List component](../components/document-list.component.md).

## Class members

### Methods

-   **copyNode**(nodeId: `string`, targetParentId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Copy a node to destination node
    -   _nodeId:_ `string`  - The id of the node to be copied
    -   _targetParentId:_ `string`  - The id of the folder where the node will be copied
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - NodeEntry for the copied node
-   **deleteNode**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes a node.
    -   _nodeId:_ `string`  - ID of the node to delete
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the operation is complete
-   **getFolder**(folder: `string`, opts?: `any`, includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets the folder node with the specified relative name path below the root node.
    -   _folder:_ `string`  - Path to folder.
    -   _opts:_ `any`  - (Optional) Options.
    -   _includeFields:_ `string[]`  - Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - Details of the folder
-   **getFolderNode**(nodeId: `string`, includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Gets a folder node via its node ID.
    -   _nodeId:_ `string`  - ID of the folder node
    -   _includeFields:_ `string[]`  - Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - Details of the folder
-   **getNode**(nodeId: `string`, includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`<br/>
    Gets a node via its node ID.
    -   _nodeId:_ `string`  - ID of the target node
    -   _includeFields:_ `string[]`  - Extra information to include (available options are "aspectNames", "isLink" and "association")
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>` - Details of the folder
-   **isCustomSourceService**(nodeId: `any`): `boolean`<br/>

    -   _nodeId:_ `any`  - 
    -   **Returns** `boolean` - 

-   **loadFolderByNodeId**(nodeId: `string`, pagination: [`PaginationModel`](../../../lib/core/src/lib/models/pagination.model.ts), includeFields: `string[]`, where?: `string`, orderBy?: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DocumentLoaderNode`](../../../lib/content-services/src/lib/document-list/models/document-folder.model.ts)`>`<br/>
    Load a folder by Node Id.
    -   _nodeId:_ `string`  - ID of the folder node
    -   _pagination:_ [`PaginationModel`](../../../lib/core/src/lib/models/pagination.model.ts)  - 
    -   _includeFields:_ `string[]`  - List of data field names to include in the results
    -   _where:_ `string`  - (Optional) Optionally filter the list
    -   _orderBy:_ `string[]`  - (Optional) order by node property
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DocumentLoaderNode`](../../../lib/content-services/src/lib/document-list/models/document-folder.model.ts)`>` - Details of the folder
-   **moveNode**(nodeId: `string`, targetParentId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Moves a node to destination node.
    -   _nodeId:_ `string`  - The id of the node to be moved
    -   _targetParentId:_ `string`  - The id of the folder where the node will be moved
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - NodeEntry for the moved node

## Details

This service makes extensive use of the Alfresco JS API. In particular,
see the
[Nodes API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getNodeChildren)
for further details of the types, options and the underlying REST architecture.

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

The `hasAllowableOperations` method reports whether or not the user has the specified permission for the
node. The Permissions enum contains the values DELETE, UPDATE, CREATE, UPDATEPERMISSIONS, NOT_DELETE, NOT_UPDATE, NOT_CREATE and NOT_UPDATEPERMISSIONS but you can also supply these
values via their string equivalents.

## See also

-   [Document list component](../components/document-list.component.md)
