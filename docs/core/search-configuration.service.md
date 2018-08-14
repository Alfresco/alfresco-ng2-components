---
Added: v2.1.0
Status: Active
---

# Search Configuration service

Provides fine control of parameters to a search.

## Class members

### Methods

-   **generateQueryBody**(searchTerm: `string`, maxResults: `number`, skipCount: `number`): `QueryBody`<br/>

    -   _searchTerm:_ `string`  - 
    -   _maxResults:_ `number`  - 
    -   _skipCount:_ `number`  - 
    -   **Returns** `QueryBody` -

## Details

The `generateQueryBody` method returns a
[QueryBody](https://github.com/Alfresco/alfresco-js-api/blob/1.6.0/src/alfresco-search-rest-api/docs/QueryBody.md)
object. This configures the search to use `searchTerm` along with `maxResults` and `skipCount`
specified for the paging of the search results.

This service is a standard implementation of the
[Search configuration interface](search-configuration.interface.md) that works well for many
common cases. However, you can also supply your own implementation if you need to. See the
[Search configuration interface](search-configuration.interface.md) page for full details and
example code.

## See also

-   [Search component](../content-services/search.component.md)
-   [Search configuration interface](search-configuration.interface.md)
