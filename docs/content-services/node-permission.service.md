---
Added: v2.0.0
Status: Active
---
# Node Permission service

Manages the role permissions for the content nodes

## Class members

## Methods

-   `getNodeRoles(node: MinimalNodeEntryEntity): Observable<string[]>`  
    Gets a list of roles for the current node.  
    -   `node` - the target node
-   `updatePermissionRoles(node: MinimalNodeEntryEntity, updatedPermissionRole: PermissionElement): Observable<MinimalNodeEntryEntity>`  
    Update the given permission for the related node
    - `node` - the target node
    - `updatedPermissionRole` the permission role to update/add

-   `getGroupMemeberByGroupName(groupName: string, opts?: any): Observable<GroupMemberPaging>`  
    Perform a call to the groups api to retrieve all the members related to that group name.
    - `groupName` the members group name
    - `opts` additional parameters to perform the call


## Details

Content Services supports
This service needs the support for the groups api fo content services that is available from version 5.2.1

See the
[Groups API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/GroupssApi.md)
in the Alfresco JS API for more information about the types returned by Tag
service methods and for the implementation of the REST API the service is
based on.

## See also

-   [Permission list component](permission-list.component.md)
