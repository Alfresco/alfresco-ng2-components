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

*   **getGroupMemberByGroupName**(groupName: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/GroupMemberPaging.md)`>`<br/>
    Gets all members related to a group name.
    *   *groupName:* `string`  - Name of group to look for members
    *   *opts:* `any`  - (Optional) Extra options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/GroupMemberPaging.md)`>` - List of members
*   **getNodeRoles**(node: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets a list of roles for the current node.
    *   *node:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - The target node
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - Array of strings representing the roles
*   **removePermission**(node: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), permissionToRemove: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>`<br/>
    Removes a permission setting from a node.
    *   *node:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - ID of the target node
    *   *permissionToRemove:* [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)  - Permission setting to remove
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>` - Node with modified permissions
*   **updateLocallySetPermissions**(node: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), nodes: [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]`, nodeRole: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>`<br/>
    Updates the locally set permissions for a node.
    *   *node:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - ID of the target node
    *   *nodes:* [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]`  - Permission settings
    *   *nodeRole:* `string[]`  - Permission role
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>` - Node with updated permissions
*   **updateNodePermissions**(nodeId: `string`, permissionList: [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>`<br/>
    Update permissions for a node.
    *   *nodeId:* `string`  - ID of the target node
    *   *permissionList:* [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]`  - New permission settings
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>` - Node with updated permissions
*   **updatePermissionRole**(node: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), updatedPermissionRole: [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>`<br/>
    Updates the permission role for a node.
    *   *node:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - Target node
    *   *updatedPermissionRole:* [`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)  - Permission role to update or add
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>` - Node with updated permission

## Details

This service requires the Content Services Groups API, which is available from version 5.2.1.

See the
[Groups API docs](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/GroupsApi.md)
in the Alfresco JS API for more information about the types returned by
the methods and for the implementation of the REST API the service is
based on.

## See also

*   [Permission list component](../components/permission-list.component.md)
