---
Title: Identity user service
Added: v3.0.0
Status: Active
Last reviewed: 2019-01-09
---

# [Identity user service](../../lib/core/userinfo/services/identity-user.service.ts "Defined in identity-user.service.ts")

Gets OAuth2 personal details and roles for users. 

## Class members

### Methods

-   **getCurrentUserInfo**(): [`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)<br/>
    Gets the name and other basic details of the current user.
    -   **Returns** [`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts) - The user's details
-   **getUserRoles**(userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../lib/core/userinfo/models/identity-role.model.ts)`[]>`<br/>
    Gets a list of roles for a user.
    -   _userId:_ `string`  - ID of the user
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityRoleModel`](../../lib/core/userinfo/models/identity-role.model.ts)`[]>` - Array of role info objects
-   **getUsers**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`[]>`<br/>
    Gets details for all users.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`[]>` - Array of user info objects
-   **getUsersByRolesWithCurrentUser**(roleNames: `string[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`[]>`<br/>
    Gets an array of users (including the current user) who have any of the roles in the supplied list.
    -   _roleNames:_ `string[]`  - List of role names to look for
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`[]>` - Array of user info objects
-   **getUsersByRolesWithoutCurrentUser**(roleNames: `string[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`[]>`<br/>
    Gets an array of users (not including the current user) who have any of the roles in the supplied list.
    -   _roleNames:_ `string[]`  - List of role names to look for
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`[]>` - Array of user info objects
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
