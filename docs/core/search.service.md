---
Title: Search service
Added: v2.0.0
Status: Active
---

# [Search service](../../lib/core/services/search.service.ts "Defined in search.service.ts")

Accesses the Content Services Search API.

## Class members

### Methods

-   **getNodeQueryResults**(term: `string`, options?: [`SearchOptions`](../../lib/core/services/search.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>

    -   _term:_ `string`  - 
    -   _options:_ [`SearchOptions`](../../lib/core/services/search.service.ts)  - (Optional) (Optional) 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - 

-   **search**(searchTerm: `string`, maxResults: `number`, skipCount: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>

    -   _searchTerm:_ `string`  - 
    -   _maxResults:_ `number`  - 
    -   _skipCount:_ `number`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - 

-   **searchByQueryBody**(queryBody: `QueryBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>

    -   _queryBody:_ `QueryBody`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` -

## Details

See the
[Alfresco JS API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-search-rest-api/docs/SearchApi.md#search)
for the format of the query and returned data.
