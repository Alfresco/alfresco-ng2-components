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

-   **createHold**(filePlanId: `string`, hold: [`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldEntry`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldEntry.md)`>`<br/>
    Create new hold in File Plan.
    -   _filePlanId_: `string` - The identifier of a file plan. You can also use the -filePlan- alias
    -   _hold_: [`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md) - Hold that should be created
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldEntry`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldEntry.md)`>` - Hold entry<br/>

-   **createHolds**(filePlanId: `string`, holds: [`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>`<br/>
    Create new holds in File Plan.
    -   _filePlanId_: `string` - The identifier of a file plan. You can also use the -filePlan- alias
    -   _holds_: `<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>` - Array of holds that should be created
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldPaging`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldPaging.md)`>` - List of paginated holds entries

-   **assignHold**(nodeId: `string`, holdId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldEntry`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldEntry.md)`>`<br/>
    Assign a node to a hold.
    -   _nodeId_: `string` - The Id of the node which will be assigned to a hold
    -   _holdId_: `string` - The Id of the hold to which nodes will be assigned
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldEntry`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldEntry.md)`>` - Entry with the hold <br/>

-   **assignHolds**(nodeIds: `<{id: string}[]>`, holdId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldPaging`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldPaging.md)`>`<br/>
    Assign a node to a hold.
    -   _nodeIds_: `<{id: string}[]>` - The Ids of the nodes which will be assigned to a hold
    -   _holdId_: `string` - The Id of the hold to which nodes will be assigned
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldPaging`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`>` - Hold paging <br/>

-   **unassignHold**(holdId: `string`, nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`void`]`>`<br/>
    Assign a node to a hold.
    -   _holdId_: `string` - The hold Id
    -   _nodeId_: `string` - The Id of the node which is unassigned
    -   **Returns** [`void`] <br/>

-   **bulkAssignHold**(holdId: `string`, query: `string`, language: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`void`]`>`<br/>
    Assign a node to a hold.
    -   _holdId_: `string` - The hold Id
    -   _query_: `string` - Search query
    -   _language_: `string` - Language code. `afts` can be used to automatically define a language

    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BulkAssignHoldResponse`](../../../lib/js-api/src/api/gs-core-rest-api/docs/BulkAssignHoldResponse.md)`>` - Bulk status <br/>

-   **bulkAssignHold**(holdId: `string`, query: `string`, language: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`void`]`>`<br/>
    Assign a node to a hold.
    -   _holdId_: `string` - The hold Id
    -   _query_: `string` - Search query
    -   _language_: `string` - Language code. `afts` can be used to automatically define a language

    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BulkAssignHoldResponse`](../../../lib/js-api/src/api/gs-core-rest-api/docs/BulkAssignHoldResponse.md)`>` - Bulk status <br/>


## Details

To create, delete or get holds Records Management should be created and user should be added to it.

## See also

-   [LegalHoldApi](../../../lib/js-api/src/api/gs-core-rest-api/docs/LegalHoldApi.md)
