---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-08
---

# Node Permission service

Manages role permissions for content nodes.

## Class members

### Methods

-   **getGroupMemeberByGroupName**(groupName: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<GroupMemberPaging>`<br/>
    Gets all members related to a group name.
    -   _groupName:_ `string`  - Name of group to look for members
    -   _opts:_ `any`  - (Optional) Extra options supported by JSAPI
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<GroupMemberPaging>` - List of members
-   **getNodeRoles**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets a list of roles for the current node.
    -   _node:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - The target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - Array of strings representing the roles
-   **removePermission**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md), permissionToRemove: `PermissionElement`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>

    -   _node:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - 
    -   _permissionToRemove:_ `PermissionElement`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - 

-   **updateLocallySetPermissions**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md), nodes: [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`, nodeRole: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>

    -   _node:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - 
    -   _nodes:_ [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`  - 
    -   _nodeRole:_ `string[]`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - 

-   **updateNodePermissions**(nodeId: `string`, permissionList: [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>

    -   _nodeId:_ `string`  - 
    -   _permissionList:_ [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - 

-   **updatePermissionRole**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md), updatedPermissionRole: `PermissionElement`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>
    Updates the permission for a node.
    -   _node:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - Target node
    -   _updatedPermissionRole:_ `PermissionElement`  - Permission role to update or add
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - Node with updated permission

## Details

This service requires the Content Services Groups API, which is available from version 5.2.1.

See the
[Groups API docs](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/GroupssApi.md)
in the Alfresco JS API for more information about the types returned by
the methods and for the implementation of the REST API the service is
based on.

## See also

-   [Permission list component](permission-list.component.md)
