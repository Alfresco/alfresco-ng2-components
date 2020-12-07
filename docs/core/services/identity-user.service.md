---
Title: Identity user service
Added: v3.0.0
Status: Active
Last reviewed: 2019-07-12
---

# [Identity user service](../../../lib/core/services/identity-user.service.ts "Defined in identity-user.service.ts")

Gets OAuth2 personal details and roles for users and performs CRUD operations on identity users.

## Class members

### Methods

*   **assignRoles**(userId: `string`, roles: [`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Assigns roles to the user.
    *   *userId:* `string`  - Id of the user.
    *   *roles:* [`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]`  - Array of roles.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the role assigned.
*   **changePassword**(userId: `string`, newPassword: [`IdentityUserPasswordModel`](../../../lib/core/services/identity-user.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Changes user password.
    *   *userId:* `string`  - Id of the user.
    *   *newPassword:* [`IdentityUserPasswordModel`](../../../lib/core/services/identity-user.service.ts)  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the password changed.
*   **checkUserHasAnyApplicationRole**(userId: `string`, applicationName: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if a user has any application role.
    *   *userId:* `string`  - ID of the target user
    *   *applicationName:* `string`  - Name of the application
    *   *roleNames:* `string[]`  - List of role names to check for
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has one or more of the roles, false otherwise
*   **checkUserHasAnyClientAppRole**(userId: `string`, clientId: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks whether a user has any of the client app roles.
    *   *userId:* `string`  - ID of the target user
    *   *clientId:* `string`  - ID of the client app
    *   *roleNames:* `string[]`  - List of role names to check for
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has one or more of the roles, false otherwise
*   **checkUserHasApplicationAccess**(userId: `string`, applicationName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if a user has access to an application.
    *   *userId:* `string`  - ID of the user
    *   *applicationName:* `string`  - Name of the application
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has access, false otherwise
*   **checkUserHasClientApp**(userId: `string`, clientId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks whether user has access to a client app.
    *   *userId:* `string`  - ID of the target user
    *   *clientId:* `string`  - ID of the client app
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has access, false otherwise
*   **checkUserHasRole**(userId: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if a user has one of the roles from a list.
    *   *userId:* `string`  - ID of the target user
    *   *roleNames:* `string[]`  - Array of roles to check for
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has one of the roles, false otherwise
*   **createUser**(newUser: [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Creates new user.
    *   *newUser:* [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)  - Object containing the new user details.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the user created.
*   **deleteUser**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes User.
    *   *userId:* `string`  - Id of the  user.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the user deleted.
*   **findUserByEmail**(email: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Find users based on email input.
    *   *email:* `string`  - Search query string
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - List of users
*   **findUserById**(id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Find users based on id input.
    *   *id:* `string`  - Search query string
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - users object
*   **findUserByUsername**(username: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Find users based on username input.
    *   *username:* `string`  - Search query string
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - List of users
*   **findUsersByName**(search: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Find users based on search input.
    *   *search:* `string`  - Search query string
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - List of users
*   **getAssignedRoles**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>`<br/>
    Gets assigned roles.
    *   *userId:* `string`  - Id of the user.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>` - Array of assigned roles information objects
*   **getAvailableRoles**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>`<br/>
    Gets available roles
    *   *userId:* `string`  - Id of the user.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>` - Array of available roles information objects
*   **getClientIdByApplicationName**(applicationName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string>`<br/>
    Gets the client ID for an application.
    *   *applicationName:* `string`  - Name of the application
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string>` - Client ID string
*   **getClientRoles**(userId: `string`, clientId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any[]>`<br/>
    Get client roles of a user for a particular client.
    *   *userId:* `string`  - ID of the target user
    *   *clientId:* `string`  - ID of the client app
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any[]>` - List of client roles
*   **getCurrentUserInfo**(): [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)<br/>
    Gets the name and other basic details of the current user.
    *   **Returns** [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts) - The user's details
*   **getEffectiveRoles**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>`<br/>
    Gets effective roles.
    *   *userId:* `string`  - Id of the user.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>` - Array of composite roles information objects
*   **getInvolvedGroups**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityGroupModel`](../../../lib/core/models/identity-group.model.ts)`[]>`<br/>
    Gets involved groups.
    *   *userId:* `string`  - Id of the user.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityGroupModel`](../../../lib/core/models/identity-group.model.ts)`[]>` - Array of involved groups information objects.
*   **getTotalUsersCount**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<number>`<br/>
    Gets users total count.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<number>` - Number of users count.
*   **getUserRoles**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>`<br/>
    Gets a list of roles for a user.
    *   *userId:* `string`  - ID of the user
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]>` - Array of role info objects
*   **getUsers**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Gets details for all users.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - Array of user info objects
*   **getUsersByRolesWithCurrentUser**(roleNames: `string[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Gets an array of users (including the current user) who have any of the roles in the supplied list.
    *   *roleNames:* `string[]`  - List of role names to look for
    *   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - Array of user info objects
*   **getUsersByRolesWithoutCurrentUser**(roleNames: `string[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Gets an array of users (not including the current user) who have any of the roles in the supplied list.
    *   *roleNames:* `string[]`  - List of role names to look for
    *   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - Array of user info objects
*   **joinGroup**(joinGroupRequest: [`IdentityJoinGroupRequestModel`](../../../lib/core/services/identity-user.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Joins group.
    *   *joinGroupRequest:* [`IdentityJoinGroupRequestModel`](../../../lib/core/services/identity-user.service.ts)  - Details of join group request (IdentityJoinGroupRequestModel).
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the user joined the group.
*   **leaveGroup**(userId: `any`, groupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Leaves group.
    *   *userId:* `any`  - Id of the user.
    *   *groupId:* `string`  - Id of the  group.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the user left the group.
*   **queryUsers**(requestQuery: [`IdentityUserQueryCloudRequestModel`](../../../lib/core/services/identity-user.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserQueryResponse`](../../../lib/core/services/identity-user.service.ts)`>`<br/>
    Gets details for all users.
    *   *requestQuery:* [`IdentityUserQueryCloudRequestModel`](../../../lib/core/services/identity-user.service.ts)  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserQueryResponse`](../../../lib/core/services/identity-user.service.ts)`>` - Array of user information objects.
*   **removeRoles**(userId: `string`, removedRoles: [`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Removes assigned roles.
    *   *userId:* `string`  - Id of the user.
    *   *removedRoles:* [`IdentityRoleModel`](../../../lib/core/models/identity-role.model.ts)`[]`  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the role removed.
*   **updateUser**(userId: `string`, updatedUser: [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Updates user details.
    *   *userId:* `string`  - Id of the user.
    *   *updatedUser:* [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)  - Object containing the user details.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty response when the user updated.

## See also

*   [JWT helper service](jwt-helper.service.md)
