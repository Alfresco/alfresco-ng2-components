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

*   **getNodeQueryResults**(term: `string`, options?: [`SearchOptions`](../../../lib/core/services/search.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets a list of nodes that match the given search criteria.
    *   *term:* `string`  - Term to search for
    *   *options:* [`SearchOptions`](../../../lib/core/services/search.service.ts)  - (Optional) Options for delivery of the search results
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of nodes resulting from the search
*   **search**(searchTerm: `string`, maxResults: `number`, skipCount: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>`<br/>
    Performs a search.
    *   *searchTerm:* `string`  - Term to search for
    *   *maxResults:* `number`  - Maximum number of items in the list of results
    *   *skipCount:* `number`  - Number of higher-ranked items to skip over in the list
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>` - List of search results
*   **searchByQueryBody**(queryBody: `QueryBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>`<br/>
    Performs a search with its parameters supplied by a QueryBody object.
    *   *queryBody:* `QueryBody`  - Object containing the search parameters
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>` - List of search results

## Details

See the
[search method](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-search-rest-api/docs/SearchApi.md#search)
in the Alfresco JS-API for the format of the query and returned data.
The [Search Configuration service](../services/search-configuration.service.md)
has a method to generate the QueryBody object used by `searchByQueryBody`. The properties of the
[`SearchOptions`](../../../lib/core/services/search.service.ts)
interface are documented in source file comments.

## See also

*   [Search Configuration service](../services/search-configuration.service.md)
