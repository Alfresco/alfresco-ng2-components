---
Title: Search service
Added: v2.0.0
Status: Active
Last reviewed: 2018-12-03
---

# [Search service](../../../lib/core/services/search.service.ts "Defined in search.service.ts")

Accesses the Content Services Search API.

## Class members

### Methods

-   **getNodeQueryResults**(term: `string`, options?: [`SearchOptions`](../../lib/core/services/search.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets a list of nodes that match the given search criteria.
    -   _term:_ `string`  - Term to search for
    -   _options:_ [`SearchOptions`](../../lib/core/services/search.service.ts)  - (Optional) Options for delivery of the search results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of nodes resulting from the search
-   **search**(searchTerm: `string`, maxResults: `number`, skipCount: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Performs a search.
    -   _searchTerm:_ `string`  - Term to search for
    -   _maxResults:_ `number`  - Maximum number of items in the list of results
    -   _skipCount:_ `number`  - Number of higher-ranked items to skip over in the list
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of search results
-   **searchByQueryBody**(queryBody: `QueryBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Performs a search with its parameters supplied by a QueryBody object.
    -   _queryBody:_ `QueryBody`  - Object containing the search parameters
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of search results

## Details

See the
[search method](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-search-rest-api/docs/SearchApi.md#search)
in the Alfresco JS-API for the format of the query and returned data.
The [Search Configuration service](../core/search-configuration.service.md) 
has a method to generate the QueryBody object used by `searchByQueryBody`. The properties of the
SearchOptions
interface are documented in source file comments.

## See also

-   [Search Configuration service](../core/search-configuration.service.md)
