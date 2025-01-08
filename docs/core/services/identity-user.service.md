---
Title: Identity user service
Added: v3.0.0
Status: Active
Last reviewed: 2019-07-12
---

# Identity User Service

Gets OAuth2 personal details and roles for users and performs CRUD operations on identity users.

## Class members

### Methods

-   **getCurrentUserInfo**(): `IdentityUserModel` - Gets the name and other basic details of the current user.
    -   **Returns** `IdentityUserMode` - The user's details
-   **search**(name: `string`, filters?: `IdentityUserFilterInterface`)): `Observable<IdentityUserModel[]>` - Search users based on name input and filters.
    -   _name:_ `string`  - Search query string
    -   _filters:_ `IdentityUserFilterInterface`  - (Optional) 
    -   **Returns** `Observable<IdentityUserModel[]>` - List of users

## See also

-   [JWT helper service](jwt-helper.service.md)
