---
Added: v2.3.0
Status: Active
Last reviewed: 2018-06-12
---

# Search Query Builder service

Stores information from all the custom search and faceted search widgets, compiles and runs the final search query.

## Class members

### Methods

-   **addFilterQuery**(query: `string`)<br/>

    -   _query:_ `string`  - 

-   **addUserFacetBucket**(field: `FacetField`, bucket: `FacetFieldBucket`)<br/>

    -   _field:_ `FacetField`  - 
    -   _bucket:_ `FacetFieldBucket`  - 

-   **addUserFacetQuery**(query: `FacetQuery`)<br/>

    -   _query:_ `FacetQuery`  - 

-   **buildQuery**(): `QueryBody`<br/>

    -   **Returns** `QueryBody` - 

-   **execute**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<void>`<br/>

    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<void>` - 

-   **getFacetField**(label: `string`): `FacetField`<br/>

    -   _label:_ `string`  - 
    -   **Returns** `FacetField` - 

-   **getFacetQuery**(label: `string`): `FacetQuery`<br/>

    -   _label:_ `string`  - 
    -   **Returns** `FacetQuery` - 

-   **getPrimarySorting**(): `SearchSortingDefinition`<br/>
    Returns primary sorting definition.
    -   **Returns** `SearchSortingDefinition` - 
-   **getSortingOptions**(): `SearchSortingDefinition[]`<br/>
    Returns all pre-configured sorting options that users can choose from.
    -   **Returns** `SearchSortingDefinition[]` - 
-   **removeFilterQuery**(query: `string`)<br/>

    -   _query:_ `string`  - 

-   **removeUserFacetBucket**(field: `FacetField`, bucket: `FacetFieldBucket`)<br/>

    -   _field:_ `FacetField`  - 
    -   _bucket:_ `FacetFieldBucket`  - 

-   **removeUserFacetQuery**(query: `FacetQuery`)<br/>

    -   _query:_ `FacetQuery`  - 

-   **resetToDefaults**()<br/>

-   **update**()<br/>

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

-   [Search filter component](search-filter.component.md)
-   [Search Widget interface](search-widget.interface.md)
