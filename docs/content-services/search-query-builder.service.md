---
Title: Search Query Builder service 
Added: v2.3.0
Status: Active
Last reviewed: 2018-06-12
---

# [Search Query Builder service](../../content-services/search/search-query-builder.service.ts "Defined in search-query-builder.service.ts")

Stores information from all the custom search and faceted search widgets, compiles and runs the final search query.

## Class members

### Methods

-   **addFilterQuery**(query: `string`)<br/>
    Adds a filter query to the current query.
    -   _query:_ `string`  - Query string to add
-   **addUserFacetBucket**(field: [`FacetField`](../../content-services/search/facet-field.interface.ts), bucket: [`FacetFieldBucket`](../../content-services/search/facet-field-bucket.interface.ts))<br/>
    Adds a facet bucket to a field.
    -   _field:_ [`FacetField`](../../content-services/search/facet-field.interface.ts)  - The target field
    -   _bucket:_ [`FacetFieldBucket`](../../content-services/search/facet-field-bucket.interface.ts)  - Bucket to add
-   **buildQuery**(): `QueryBody`<br/>
    Builds the current query.
    -   **Returns** `QueryBody` - The finished query
-   **execute**()<br/>
    Builds and executes the current query.
-   **getFacetField**(label: `string`): [`FacetField`](../../content-services/search/facet-field.interface.ts)<br/>
    Gets a facet field by label.
    -   _label:_ `string`  - Label of the facet field
    -   **Returns** [`FacetField`](../../content-services/search/facet-field.interface.ts) - Facet field data
-   **getFacetQuery**(label: `string`): [`FacetQuery`](../../content-services/search/facet-query.interface.ts)<br/>
    Gets a facet query by label.
    -   _label:_ `string`  - Label of the query
    -   **Returns** [`FacetQuery`](../../content-services/search/facet-query.interface.ts) - Facet query data
-   **getPrimarySorting**(): [`SearchSortingDefinition`](../../content-services/search/search-sorting-definition.interface.ts)<br/>
    Gets the primary sorting definition.
    -   **Returns** [`SearchSortingDefinition`](../../content-services/search/search-sorting-definition.interface.ts) - The primary sorting definition
-   **getSortingOptions**(): [`SearchSortingDefinition`](../../content-services/search/search-sorting-definition.interface.ts)`[]`<br/>
    Gets all pre-configured sorting options that users can choose from.
    -   **Returns** [`SearchSortingDefinition`](../../content-services/search/search-sorting-definition.interface.ts)`[]` - Pre-configured sorting options
-   **getUserFacetBuckets**(field: `string`): [`FacetFieldBucket`](../../content-services/search/facet-field-bucket.interface.ts)`[]`<br/>
    Gets the buckets currently added to a field
    -   _field:_ `string`  - The target fields
    -   **Returns** [`FacetFieldBucket`](../../content-services/search/facet-field-bucket.interface.ts)`[]` - Bucket array
-   **removeFilterQuery**(query: `string`)<br/>
    Removes an existing filter query.
    -   _query:_ `string`  - The query to remove
-   **removeUserFacetBucket**(field: [`FacetField`](../../content-services/search/facet-field.interface.ts), bucket: [`FacetFieldBucket`](../../content-services/search/facet-field-bucket.interface.ts))<br/>
    Removes an existing bucket from a field.
    -   _field:_ [`FacetField`](../../content-services/search/facet-field.interface.ts)  - The target field
    -   _bucket:_ [`FacetFieldBucket`](../../content-services/search/facet-field-bucket.interface.ts)  - Bucket to remove
-   **resetToDefaults**()<br/>
    Resets the query to the defaults specified in the app config.
-   **update**()<br/>
    Builds the current query and triggers the `updated` event.

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
> **Note:** Since ADF 3.0.0, the query contains the `"facetFormat": "V2"` parameter so that all the responses have the same structure even if coming from facetFields, from un-grouped facetQueries, from grouped facetQueries or from facetIntervals.

## See also

-   [Search filter component](search-filter.component.md)
-   [Search Widget interface](search-widget.interface.md)
