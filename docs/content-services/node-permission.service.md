---
Added: v2.0.0
Status: Active
---

# Node Permission service

Manages the role permissions for the content nodes

## Class members

### Methods

-   `getGroupMemeberByGroupName(groupName: string = null, opts?: any = null): Observable<GroupMemberPaging>`<br/>

    -   `groupName: string = null` -  
    -   `opts?: any = null` - (Optional) 
    -   **Returns** `Observable<GroupMemberPaging>` - 

-   `getNodeRoles(node: MinimalNodeEntryEntity = null): Observable<string[]>`<br/>

    -   `node: MinimalNodeEntryEntity = null` -  
    -   **Returns** `Observable<string[]>` - 

-   `updatePermissionRoles(node: MinimalNodeEntryEntity = null, updatedPermissionRole: PermissionElement = null): Observable<MinimalNodeEntryEntity>`<br/>

    -   `node: MinimalNodeEntryEntity = null` -  
    -   `updatedPermissionRole: PermissionElement = null` -  
    -   **Returns** `Observable<MinimalNodeEntryEntity>` -

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
