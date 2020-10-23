---
Title: People Cloud service
Added: v3.0.0
Status: Active
Last reviewed: 2019-07-12
---

# [People Cloud service](../../../lib/process-services-cloud/src/lib/people/services/people-cloud.service.ts "Defined in process-cloud.service.ts")

Gets/Search OAuth2 identity users.

## Class members

### Methods

-   **findUsers**(searchTerm: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Find/Search users based on search input.
    -   _searchTerm:_ `string`  - Search query string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - List of users
-   **findUsersBasedOnApp**(clientId: `string`, roles: `string[]` searchTerm: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Find/Search users based on application access.
    -   _clientId:_ `string`  - ClientId of the application
    -   roles:_  `string[]`  - List of role names to find/search users
    -   _searchTerm:_ `string`  - Search query string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - List of users
-   **filterUsersBasedOnRoles**(roles: `string[]` searchTerm: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>`<br/>
    Find/Search users based on roles.
    -   roles:_ `string[]`  - List of role names to find/search users
    -   _searchTerm:_ `string`  - Search query string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - List of users

-   **validatePreselectedUser**(preselectedUser: [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)<br/>
    Checks preselected user exists or not.
    -   preselectedUser:_ [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)  - Preselected user details
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` - List of users

-   **getClientIdByApplicationName**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string>`<br/>
    Gets the client ID for an application.
    -   _appName:_ `string`  - Name of the application
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string>` - Client ID string

## See also

-   [Identity user service](../../core/services/identity-user.service.md)
