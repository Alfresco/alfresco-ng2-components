---
Title: Identity user service
Added: v3.0.0
Status: Active
Last reviewed: 2019-02-08
---

# [Identity user service](../../lib/lib/core/userinfo/services/identity-user.service.ts "Defined in identity-user.service.ts")

Gets OAuth2 personal details and roles for users. 

## Class members

### Methods

-   **checkUserHasAnyApplicationRole**(userId: `string`, applicationName: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if a user has any application role.
    -   _userId:_ `string`  - ID of the target user
    -   _applicationName:_ `string`  - Name of the application
    -   _roleNames:_ `string[]`  - List of role names to check for
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has one or more of the roles, false otherwise
-   **checkUserHasAnyClientAppRole**(userId: `string`, clientId: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks whether a user has any of the client app roles.
    -   _userId:_ `string`  - ID of the target user
    -   _clientId:_ `string`  - ID of the client app
    -   _roleNames:_ `string[]`  - List of role names to check for
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has one or more of the roles, false otherwise
-   **checkUserHasApplicationAccess**(userId: `string`, applicationName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if a user has access to an application.
    -   _userId:_ `string`  - ID of the user
    -   _applicationName:_ `string`  - Name of the application
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has access, false otherwise
-   **checkUserHasClientApp**(userId: `string`, clientId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks whether user has access to a client app.
    -   _userId:_ `string`  - ID of the target user
    -   _clientId:_ `string`  - ID of the client app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has access, false otherwise
-   **checkUserHasRole**(userId: `string`, roleNames: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if a user has one of the roles from a list.
    -   _userId:_ `string`  - ID of the target user
    -   _roleNames:_ `string[]`  - Array of roles to check for
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the user has one of the roles, false otherwise
-   **findUserByEmail**(email: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Find users based on email input.
    -   _email:_ `string`  - [Search](../../lib/node_modules/@alfresco/js-api/src/api-legacy/legacy.ts) query string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - List of users
-   **findUserById**(id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Find users based on id input.
    -   _id:_ `string`  - [Search](../../lib/node_modules/@alfresco/js-api/src/api-legacy/legacy.ts) query string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - users object
-   **findUserByUsername**(username: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Find users based on username input.
    -   _username:_ `string`  - [Search](../../lib/node_modules/@alfresco/js-api/src/api-legacy/legacy.ts) query string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - List of users
-   **findUsersByName**(search: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Find users based on search input.
    -   _search:_ `string`  - [Search](../../lib/node_modules/@alfresco/js-api/src/api-legacy/legacy.ts) query string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - List of users
-   **getClientIdByApplicationName**(applicationName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string>`<br/>
    Gets the client ID for an application.
    -   _applicationName:_ `string`  - Name of the application
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string>` - Client ID string
-   **getClientRoles**(userId: `string`, clientId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any[]>`<br/>
    Get client roles of a user for a particular client.
    -   _userId:_ `string`  - ID of the target user
    -   _clientId:_ `string`  - ID of the client app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any[]>` - List of client roles
-   **getCurrentUserInfo**(): [`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)<br/>
    Gets the name and other basic details of the current user.
    -   **Returns** [`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts) - The user's details
-   **getUserRoles**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../lib/lib/core/userinfo/models/identity-role.model.ts)`[]>`<br/>
    Gets a list of roles for a user.
    -   _userId:_ `string`  - ID of the user
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../lib/lib/core/userinfo/models/identity-role.model.ts)`[]>` - Array of role info objects
-   **getUsers**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`[]>`<br/>
    Gets details for all users.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`[]>` - Array of user info objects
-   **getUsersByRolesWithCurrentUser**(roleNames: `string[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`[]>`<br/>
    Gets an array of users (including the current user) who have any of the roles in the supplied list.
    -   _roleNames:_ `string[]`  - List of role names to look for
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`[]>` - Array of user info objects
-   **getUsersByRolesWithoutCurrentUser**(roleNames: `string[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`[]>`<br/>
    Gets an array of users (not including the current user) who have any of the roles in the supplied list.
    -   _roleNames:_ `string[]`  - List of role names to look for
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`[]>` - Array of user info objects
-   **getValueFromToken**(key: `string`)<br/>
    Gets a named value from the user access token.
    -   _key:_ `string`  - Key name of the field to retrieve

## Details

[OAuth2](https://oauth.net/2/) defines an _access token_ (used when
authenticating a user) and a number of _authentication roles_ that the user
can participate in (see
[this page](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2)
for an introduction to OAuth2 and a description of the roles). You can use the
[Identity user service](identity-user.service.md) to access this information for users, including the current user.

## See also

-   [JWT helper service](../core/jwt-helper.service.md)
