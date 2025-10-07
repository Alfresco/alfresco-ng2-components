---
Title: Node Permission service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Node Permission service](../../../lib/content-services/src/lib/permission-manager/services/node-permission.service.ts "Defined in node-permission.service.ts")

Manages role permissions for content nodes.

## Class members

### Methods

-   **getGroupMemberByGroupName**(groupName: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/GroupMemberPaging.md)`>`<br/>
    Gets all members related to a group name.
    -   _groupName:_ `string`  - Name of group to look for members
    -   _opts:_ `any`  - (Optional) Extra options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/GroupMemberPaging.md)`>` - List of members
-   **getInheritedPermission**(node: `Node`): [`PermissionDisplayModel`](../../../lib/content-services/src/lib/permission-manager/models/permission.model.ts)`[]`<br/>

    -   _node:_ `Node`  - 
    -   **Returns** [`PermissionDisplayModel`](../../../lib/content-services/src/lib/permission-manager/models/permission.model.ts)`[]` - 

-   **getLocalPermissions**(node: `Node`): [`PermissionDisplayModel`](../../../lib/content-services/src/lib/permission-manager/models/permission.model.ts)`[]`<br/>

    -   _node:_ `Node`  - 
    -   **Returns** [`PermissionDisplayModel`](../../../lib/content-services/src/lib/permission-manager/models/permission.model.ts)`[]` - 

-   **getNodePermissions**(node: `Node`): [`PermissionDisplayModel`](../../../lib/content-services/src/lib/permission-manager/models/permission.model.ts)`[]`<br/>

    -   _node:_ `Node`  - 
    -   **Returns** [`PermissionDisplayModel`](../../../lib/content-services/src/lib/permission-manager/models/permission.model.ts)`[]` - 

-   **getNodeRoles**(node: `Node`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets a list of roles for the current node.
    -   _node:_ `Node`  - The target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - Array of strings representing the roles
-   **getNodeWithRoles**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<Function>`<br/>
    Gets all node detail for nodeId along with settable permissions.
    -   _nodeId:_ `string`  - Id of the node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Function>` - node and it's associated roles { node: Node; roles: RoleModel\[] }
-   **removePermission**(node: `Node`, permissionToRemove: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>`<br/>
    Removes a permission setting from a node.
    -   _node:_ `Node`  - ID of the target node
    -   _permissionToRemove:_ [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)  - Permission setting to remove
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>` - Node with modified permissions
-   **removePermissions**(node: `Node`, permissions: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>`<br/>
    Removes permissions setting from a node.
    -   _node:_ `Node`  - target node with permission
    -   _permissions:_ [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`  - Permissions to remove
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>` - Node with modified permissions
-   **transformNodeToUserPerson**(node: `Node`): `Function`<br/>

    -   _node:_ `Node`  - 
    -   **Returns** `Function` - 

-   **updateLocallySetPermissions**(node: `Node`, permissions: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>`<br/>
    Updates the locally set permissions for a node.
    -   _node:_ `Node`  - ID of the target node
    -   _permissions:_ [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`  - Permission settings
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>` - Node with updated permissions
-   **updateNodePermissions**(nodeId: `string`, permissionList: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>`<br/>
    Update permissions for a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _permissionList:_ [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`  - New permission settings
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>` - Node with updated permissions
-   **updatePermissionRole**(node: `Node`, updatedPermissionRole: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>`<br/>
    Updates the permission role for a node.
    -   _node:_ `Node`  - Target node
    -   _updatedPermissionRole:_ [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)  - Permission role to update or add
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>` - Node with updated permission
-   **updatePermissions**(node: `Node`, permissions: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>`<br/>
    updates permissions setting from a node.
    -   _node:_ `Node`  - target node with permission
    -   _permissions:_ [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]`  - Permissions to update
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>` - Node with modified permissions

## Details

This service requires the Content Services Groups API, which is available from version 5.2.1.

See the
[Groups API docs](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/GroupsApi.md)
in the Alfresco JS API for more information about the types returned by
the methods and for the implementation of the REST API the service is
based on.

## See also

-   [Permission list component](../components/permission-list.component.md)
