---
Added: v2.3.0
Status: Active
Last reviewed: 2018-06-12
---

# Search Query Builder service

Stores information from all the custom search and faceted search widgets, compiles and runs the final search query.

## Class members

### Methods

-   **addFilterQuery**(query: `string` = `null`)<br/>
    Adds a new filter query.
    -   _query:_ `string`  - Text of the query to add

-   **buildQuery**(): `QueryBody`<br/>
    Builds a new query using the added elements.
    -   **Returns** `QueryBody` - The resulting query

-   **execute**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<void>`<br/>
    Executes the query.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<void>` - Notification of query completion

-   **getFacetField**(label: `string` = `null`): [`FacetField`](../../lib/content-services/search/facet-field.interface.ts)<br/>
    Gets the details of a facet field.
    -   _label:_ `string`  - Identifying label of the facet field
    -   **Returns** [`FacetField`](../../lib/content-services/search/facet-field.interface.ts) - Facet field details

-   **getFacetQuery**(label: `string` = `null`): [`FacetQuery`](../../lib/content-services/search/facet-query.interface.ts)<br/>
    Gets the details of a facet query
    -   _label:_ `string`  - Identifying label of the facet query
    -   **Returns** [`FacetQuery`](../../lib/content-services/search/facet-query.interface.ts) - Details of the facet query

-   **getPrimarySorting**(): [`SearchSortingDefinition`](../../lib/content-services/search/search-sorting-definition.interface.ts)<br/>
    Returns primary sorting definition.
    -   **Returns** [`SearchSortingDefinition`](../../lib/content-services/search/search-sorting-definition.interface.ts) - Sorting definition
-   **getSortingOptions**(): [`SearchSortingDefinition`](../../lib/content-services/search/search-sorting-definition.interface.ts)`[]`<br/>
    Returns all pre-configured sorting options that users can choose from.
    -   **Returns** [`SearchSortingDefinition`](../../lib/content-services/search/search-sorting-definition.interface.ts)`[]` - List of available sorting options
-   **removeFilterQuery**(query: `string` = `null`)<br/>
    Removes a previously added filter query.
    -   _query:_ `string`  - The query to remove

-   **update**()<br/>
    Builds the query and notifies subscribers when complete.

## Details

See the [Search filter component](search-filter.component.md) page for full details about the format of queries,
facet fields, and sorting options.

The Query Builder is UI agnostic and does not rely on Angular components.
You can reuse it with multiple component implementations.

You can use custom widgets to populate and edit the following parts of the resulting query:

-   categories
-   query fragments that form a query expression
-   include fields
-   scope settings
-   filter queries
-   facet fields
-   range queries

```ts
constructor(queryBuilder: SearchQueryBuilderService) {

    queryBuilder.updated.subscribe(query => {
        this.queryBuilder.execute();
    });

    queryBuilder.executed.subscribe(data => {
        this.onDataLoaded(data);
    });

}
```

## See also

- [Search filter component](search-filter.component.md)
- [Search Widget interface](search-widget.interface.md)