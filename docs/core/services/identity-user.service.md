---
Title: Identity user service
Added: v3.0.0
Status: Active
Last reviewed: 2019-07-12
---

# [Identity user service](../../../lib/process-services-cloud/src/lib/people/services/identity-user.service.ts "Defined in identity-user.service.ts")

Gets OAuth2 personal details and roles for users and performs CRUD operations on identity users.

## Class members

### Methods

-   **getCurrentUserInfo**(): [`IdentityUserModel`](../../../lib/process-services-cloud/src/lib/people/models/identity-user.model.ts)<br/>
    Gets the name and other basic details of the current user.
    -   **Returns** [`IdentityUserModel`](../../../lib/process-services-cloud/src/lib/people/models/identity-user.model.ts) - The user's details
-   **search**(name: `string`, filters?: [`IdentityUserFilterInterface`](../../../lib/process-services-cloud/src/lib/people/services/identity-user-filter.interface.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/process-services-cloud/src/lib/people/models/identity-user.model.ts)`[]>`<br/>
    Search users based on name input and filters.
    -   _name:_ `string`  - Search query string
    -   _filters:_ [`IdentityUserFilterInterface`](../../../lib/process-services-cloud/src/lib/people/services/identity-user-filter.interface.ts)  - (Optional) 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityUserModel`](../../../lib/process-services-cloud/src/lib/people/models/identity-user.model.ts)`[]>` - List of users

## See also

-   [JWT helper service](jwt-helper.service.md)
