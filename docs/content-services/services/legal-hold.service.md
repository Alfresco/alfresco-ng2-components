---
Title: Legal Hold service
Added: v6.10.0
Status: Active
Last reviewed: 2024-06-19
---

# [Legal Hold service](../../../lib/content-services/src/lib/legal-hold/services/legal-hold.service.ts "Defined in legal-hold.service.ts")

Manages holds for nodes.

## Class members

### Methods

-   **getHolds**(filePlanId: `string`, options?: `ContentPagingQuery`): [`Observable`](http://reactivex.io/documentation/observable.html)`<[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>`<br/>
    updates permissions setting from a node.
    -   filePlanId:_ `string`  - The identifier of a file plan. You can also use the -filePlan- alias
    -   options:_ `ContentPagingQuery`  - Optional parameters supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>` - List of holds

## Details

To create, delete or get holds Records Management should be created and user should be added to it.

See the
[Groups API docs](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/GroupsApi.md)
in the Alfresco JS API for more information about the types returned by
the methods and for the implementation of the REST API the service is
based on.

## See also

-   [LegalHoldApi](../../../lib/js-api/src/api/gs-core-rest-api/docs/LegalHoldApi.md)
