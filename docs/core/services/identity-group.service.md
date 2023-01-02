---
Title: Identity Group service
Added: v3.4.0
Status: Active
Last reviewed: 2019-07-13
---

# [Identity Group service](../../../lib/process-services-cloud/src/lib/group/services/identity-group.service.ts "Defined in identity-group.service.ts")

Performs CRUD operations on identity groups.

## Class members

### Methods

-   **search**(name: `string`, filters?: [`IdentityGroupFilterInterface`](../../../lib/process-services-cloud/src/lib/group/services/identity-group-filter.interface.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityGroupModel`](../../../lib/process-services-cloud/src/lib/group/models/identity-group.model.ts)`[]>`<br/>

    -   _name:_ `string`  - 
    -   _filters:_ [`IdentityGroupFilterInterface`](../../../lib/process-services-cloud/src/lib/group/services/identity-group-filter.interface.ts)  - (Optional) 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`IdentityGroupModel`](../../../lib/process-services-cloud/src/lib/group/models/identity-group.model.ts)`[]>` -

## See also

-   [Identity user service](../../core/userInfo/services/identity-user.service.md)
