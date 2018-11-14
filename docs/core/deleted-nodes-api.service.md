---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Deleted Nodes Api service

Gets a list of Content Services nodes currently in the trash.

## Class members

### Methods

-   **getDeletedNodes**(options?: `Object`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets a list of nodes in the trash.
    -   _options:_ `Object`  - (Optional) Options for JS-API call
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of nodes in the trash

## Details

The `getDeletedNodes` method returns a [`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts) object that lists
the items in the trash (see [Document Library model](../content-services/document-library.model.md) for
more information about this class). The format of the `options` parameter is
described in the [getDeletedNodes](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getDeletedNodes)
page of the Alfresco JS API docs.

## See also

-   [Nodes api service](nodes-api.service.md)
-   [Node service](node.service.md)
