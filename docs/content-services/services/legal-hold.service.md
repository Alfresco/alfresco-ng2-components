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

-   **getHolds**(filePlanId: `string`, options?: `ContentPagingQuery`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>`<br/>
    Gets the list of holds for a node.
    -   _filePlanId_: `string` - The identifier of a file plan. You can also use the -filePlan- alias
    -   _options_: `ContentPagingQuery` - Optional parameters supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>` - List of holds <br/>
-   **createHold**(filePlanId: `string`, holds: [`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>`<br/>
    Gets the list of holds for a node.
    -   _filePlanId_: `string` - The identifier of a file plan. You can also use the -filePlan- alias
    -   _holds_: `<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>` - Array of one hold that should be created
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldEntry`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldEntry.md)`>` - Hold entry<br/>
-   **createHolds**(filePlanId: `string`, holds: [`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>`<br/>
    Gets the list of holds for a node.
    -   _filePlanId_: `string` - The identifier of a file plan. You can also use the -filePlan- alias
    -   _holds_: `<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>` - Array of holds that should be created
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldPaging`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldPaging.md)`>` - List of paginated holds entries

## Details

To create, delete or get holds Records Management should be created and user should be added to it.

## See also

-   [LegalHoldApi](../../../lib/js-api/src/api/gs-core-rest-api/docs/LegalHoldApi.md)
