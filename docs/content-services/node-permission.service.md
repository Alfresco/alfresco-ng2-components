---
Added: v2.0.0
Status: Active
Last reviewed: 2018-09-14
---

# Node Permission service

Manages role permissions for content nodes.

## Class members

### Methods

-   **getGroupMemberByGroupName**(groupName: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<GroupMemberPaging>`<br/>
    Gets all members related to a group name.
    -   _groupName:_ `string`  - Name of group to look for members
    -   _opts:_ `any`  - (Optional) Extra options supported by JSAPI
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<GroupMemberPaging>` - List of members
-   **getNodeRoles**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets a list of roles for the current node.
    -   _node:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - The target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - Array of strings representing the roles
-   **removePermission**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md), permissionToRemove: `PermissionElement`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>
    Removes a permission setting from a node.
    -   _node:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - ID of the target node
    -   _permissionToRemove:_ `PermissionElement`  - Permission setting to remove
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - Node with modified permissions
-   **updateLocallySetPermissions**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md), nodes: [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`, nodeRole: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>
    Updates the locally set permissions for a node.
    -   _node:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - ID of the target node
    -   _nodes:_ [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`  - Permission settings
    -   _nodeRole:_ `string[]`  - Permission role
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - Node with updated permissions
-   **updateNodePermissions**(nodeId: `string`, permissionList: [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>
    Update permissions for a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _permissionList:_ [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]`  - New permission settings
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - Node with updated permissions
-   **updatePermissionRole**(node: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md), updatedPermissionRole: `PermissionElement`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>
    Updates the permission role for a node.
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
