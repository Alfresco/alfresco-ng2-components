---
Title: Legal Hold service
Added: v6.10.0
Status: Active
Last reviewed: 2024-06-19
---

# [Legal Hold service](../../../lib/content-services/src/lib/legal-hold/services/legal-hold.service.ts) "Defined in legal-hold.service.ts"

Manages holds for nodes.

## Class members

### Methods

-   **getHolds**(filePlanId: `string`, options?: `ContentPagingQuery`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>`<br/>
    Gets the list of holds for a node.
    -   _filePlanId_: `string` - The identifier of a file plan. You can also use the -filePlan- alias
    -   _options_: `ContentPagingQuery` - Optional parameters supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`[]>` - List of holds

-   **assignHold**(nodeId: `string`, holdId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`>`<br/>
    Assign a node to a hold.
    -   _nodeId_: `string` - The Id of the node which will be assigned to a hold
    -   _holdId_: `string` - The Id of the hold to which nodes will be assigned
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldEntry`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldEntry.md)`>` - Entry with the hold

-   **assignHolds**(nodeIds: `<{id: string}[]>`, holdId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Hold`](../../../lib/js-api/src/api/gs-core-rest-api/docs/HoldPaging.md)`>`<br/>
    Assign a node to a hold.
    -   _nodeIds_: `<{id: string}[]>` - The Ids of the nodes which will be assigned to a hold
    -   _holdId_: `string` - The Id of the hold to which nodes will be assigned
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`HoldPaging`](../../../lib/js-api/src/api/gs-core-rest-api/docs/Hold.md)`>` - Hold paging

-   **unassignHold**(holdId: `string`, nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`void`]`>`<br/>
    Assign a node to a hold.
    -   _holdId_: `string` - The hold Id
    -   _nodeId_: `string` - The Id of the node which is unassigned
    -   **Returns** [`void`]


## Details

To create, delete or get holds Records Management should be created and user should be added to it.

## See also

-   [LegalHoldApi](../../../lib/js-api/src/api/gs-core-rest-api/docs/LegalHoldApi.md)
