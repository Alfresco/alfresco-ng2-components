---
Title: Search service
Added: v2.0.0
Status: Active
Last reviewed: 2018-12-03
---

# [Search service](../../../lib/content-services/src/lib/search/services/search.service.ts "Defined in search.service.ts")

Accesses the Content Services Search API.

## Class members

### Methods

-   **getNodeQueryResults**(term: `string`, options?: [`SearchOptions`](../../../lib/content-services/src/lib/search/services/search.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../../lib/js-api/src/api/content-rest-api/model/nodePaging.ts)`>`<br/>
    Gets a list of nodes that match the given search criteria.
    -   _term:_ `string`  - Term to search for
    -   _options:_ [`SearchOptions`](../../../lib/content-services/src/lib/search/services/search.service.ts)  - (Optional) Options for delivery of the search results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../../lib/js-api/src/api/content-rest-api/model/nodePaging.ts)`>` - List of nodes resulting from the search
-   **search**(searchTerm: `string`, maxResults: `number`, skipCount: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](../../../lib/js-api/src/api/search-rest-api/docs/ResultSetPaging.md)`>`<br/>
    Performs a search.
    -   _searchTerm:_ `string`  - Term to search for
    -   _maxResults:_ `number`  - Maximum number of items in the list of results
    -   _skipCount:_ `number`  - Number of higher-ranked items to skip over in the list
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](../../../lib/js-api/src/api/search-rest-api/docs/ResultSetPaging.md)`>` - List of search results
-   **searchByQueryBody**(queryBody: `SearchRequest`, shouldEmit: `boolean` = `true`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](../../../lib/js-api/src/api/search-rest-api/docs/ResultSetPaging.md)`>`<br/>
    Performs a search with its parameters supplied by a SearchRequest object.
    -   _queryBody:_ `SearchRequest`  - Object containing the search parameters
    -   _shouldEmit:_ `boolean`  - Whether the `dataLoaded` event should be emitted with the results. Set to `false` for auxiliary searches (for example populating autocomplete options) that should not notify the main results subscribers. Defaults to `true`
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](../../../lib/js-api/src/api/search-rest-api/docs/ResultSetPaging.md)`>` - List of search results

## Details

See the
[search method](../../../lib/js-api/src/api/search-rest-api/docs/SearchApi.md#search)
in the Alfresco JS-API for the format of the query and returned data.
The [Search Configuration service](../services/search-configuration.service.md)
has a method to generate the QueryBody object used by `searchByQueryBody`. The properties of the
[`SearchOptions`](../../../lib/content-services/src/lib/search/services/search.service.ts)
interface are documented in source file comments.

## See also

-   [Search Configuration service](../services/search-configuration.service.md)
