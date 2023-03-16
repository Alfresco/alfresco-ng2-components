---
Title: Search Configuration service
Added: v2.1.0
Status: Active
Last reviewed: 2018-09-13
---

# [Search Configuration service](../../../lib/content-services/src/lib/search/services/search-configuration.service.ts "Defined in search-configuration.service.ts")

Provides fine control of parameters to a search.

## Class members

### Methods

-   **generateQueryBody**(searchTerm: `string`, maxResults: `number`, skipCount: `number`): `QueryBody`<br/>
    Generates a QueryBody object with custom search parameters.
    -   _searchTerm:_ `string`  - Term text to search for
    -   _maxResults:_ `number`  - Maximum number of search results to show in a page
    -   _skipCount:_ `number`  - The offset of the start of the page within the results list
    -   **Returns** `QueryBody` - Query body defined by the parameters

## Details

The `generateQueryBody` method returns a
[QueryBody](https://github.com/Alfresco/alfresco-js-api/blob/1.6.0/src/alfresco-search-rest-api/docs/QueryBody.md)
object. This configures the search to use `searchTerm` along with `maxResults` and `skipCount`
specified for the paging of the search results.

This service is a standard implementation of the
[Search configuration interface](../interfaces/search-configuration.interface.md) that works well for many
common cases. However, you can also supply your own implementation if you need to. See the
[Search configuration interface](../interfaces/search-configuration.interface.md) page for full details and
example code.

## See also

-   [Search component](../../content-services/components/search.component.md)
-   [Search configuration interface](../interfaces/search-configuration.interface.md)
