---
Title: Group Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-02-06
---

# [Group Cloud Service](../../../lib/process-services-cloud/src/lib/group/services/group-cloud.service.ts "Defined in group-cloud.service.ts")

Searches and gets information for groups.

## Class members

### Methods

*   **checkGroupHasAnyClientAppRole**(groupId: `string`, clientId: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Check if a group has any of the client app roles in the supplied list.
    *   *groupId:* `string`  - ID of the target group
    *   *clientId:* `string`  - ID of the client
    *   *roleNames:* `string[]`  - Array of role names to check
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the group has one or more of the roles, false otherwise
*   **checkGroupHasClientApp**(groupId: `string`, clientId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if a group has a client app.
    *   *groupId:* `string`  - ID of the target group
    *   *clientId:* `string`  - ID of the client
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the group has the client app, false otherwise
*   **checkGroupHasRole**(groupId: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Check that a group has one or more roles from the supplied list.
    *   *groupId:* `string`  - ID of the target group
    *   *roleNames:* `string[]`  - Array of role names
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the group has one or more of the roles, false otherwise
*   **findGroupsByName**(searchParams: [`GroupSearchParam`](../../../lib/process-services-cloud/src/lib/group/models/group.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Finds groups filtered by name.
    *   *searchParams:* [`GroupSearchParam`](../../../lib/process-services-cloud/src/lib/group/models/group.model.ts)  - Object containing the name filter string
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - List of group information
*   **getClientIdByApplicationName**(applicationName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string>`<br/>
    Gets the client ID using the app name.
    *   *applicationName:* `string`  - Name of the app
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string>` - client ID string
*   **getClientRoles**(groupId: `string`, clientId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any[]>`<br/>
    Gets client roles.
    *   *groupId:* `string`  - ID of the target group
    *   *clientId:* `string`  - ID of the client
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any[]>` - List of roles
*   **getGroupRoles**(groupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupRoleModel`](../../../lib/process-services-cloud/src/lib/group/models/group.model.ts)`[]>`<br/>
    Gets details for a specified group.
    *   *groupId:* `string`  - ID of the target group
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupRoleModel`](../../../lib/process-services-cloud/src/lib/group/models/group.model.ts)`[]>` - Group details

## Details

See the
[Groups API](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/GroupsApi.md)
page in the Alfresco JS-API docs for further details about the information about the format
of the returned data.
