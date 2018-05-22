---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-08
---

# Node Permission service

Manages role permissions for content nodes.

## Class members

### Methods

-   **getGroupMemeberByGroupName**(groupName: `string` = `null`, opts?: `any` = `null`): `Observable<GroupMemberPaging>`<br/>
    Gets all members related to a group name.
    -   _groupName:_ `string`  - Name of group to look for members
    -   _opts:_ `any`  - (Optional)Extra options supported by JSAPI
    -   **Returns** `Observable<GroupMemberPaging>` - List of members
-   **getNodeRoles**(node: `MinimalNodeEntryEntity` = `null`): `Observable<string[]>`<br/>
    Gets a list of roles for the current node.
    -   _node:_ `MinimalNodeEntryEntity`  - The target node
    -   **Returns** `Observable<string[]>` - Array of strings representing the roles
-   **removePermission**(node: `MinimalNodeEntryEntity` = `null`, permissionToRemove: `PermissionElement` = `null`): `Observable<MinimalNodeEntryEntity>`<br/>

    -   _node:_ `MinimalNodeEntryEntity`  - 
    -   _permissionToRemove:_ `PermissionElement`  - 
    -   **Returns** `Observable<MinimalNodeEntryEntity>` - 

-   **updateLocallySetPermissions**(node: `MinimalNodeEntryEntity` = `null`, nodes: `MinimalNodeEntity[]` = `null`, nodeRole: `string[]` = `null`): `Observable<MinimalNodeEntryEntity>`<br/>

    -   _node:_ `MinimalNodeEntryEntity`  - 
    -   _nodes:_ `MinimalNodeEntity[]`  - 
    -   _nodeRole:_ `string[]`  - 
    -   **Returns** `Observable<MinimalNodeEntryEntity>` - 

-   **updateNodePermissions**(nodeId: `string` = `null`, permissionList: `MinimalNodeEntity[]` = `null`): `Observable<MinimalNodeEntryEntity>`<br/>

    -   _nodeId:_ `string`  - 
    -   _permissionList:_ `MinimalNodeEntity[]`  - 
    -   **Returns** `Observable<MinimalNodeEntryEntity>` - 

-   **updatePermissionRole**(node: `MinimalNodeEntryEntity` = `null`, updatedPermissionRole: `PermissionElement` = `null`): `Observable<MinimalNodeEntryEntity>`<br/>
    Updates the permission for a node.
    -   _node:_ `MinimalNodeEntryEntity`  - Target node
    -   _updatedPermissionRole:_ `PermissionElement`  - Permission role to update or add
    -   **Returns** `Observable<MinimalNodeEntryEntity>` - Node with updated permission

## Details

This service requires the Content Services Groups API, which is available from version 5.2.1.

See the
[Groups API docs](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/GroupssApi.md)
in the Alfresco JS API for more information about the types returned by
the methods and for the implementation of the REST API the service is
based on.

## See also

-   [Permission list component](permission-list.component.md)
