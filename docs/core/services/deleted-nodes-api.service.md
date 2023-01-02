---
Title: Deleted Nodes Api service
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# [Deleted Nodes Api service](../../../lib/core/src/lib/services/deleted-nodes-api.service.ts "Defined in deleted-nodes-api.service.ts")

Gets a list of Content Services nodes currently in the trash.

## Class members

### Methods

-   **getDeletedNodes**(options?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets a list of nodes in the trash.
    -   _options:_ `any`  - (Optional) Options for JS-API call
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of nodes in the trash

## Details

The `getDeletedNodes` method returns a [`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md) object that lists
the items in the trash. The format of the `options` parameter is
described in the [getDeletedNodes](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getDeletedNodes)
page of the Alfresco JS API docs.

## See also

-   [Nodes api service](nodes-api.service.md)
-   [Node service](node.service.md)
