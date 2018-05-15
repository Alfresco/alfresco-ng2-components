---
Added: v2.3.0
Status: Active
---

# Search Query Builder service

Stores information from all the custom search and faceted search widgets, compiles and runs the final Search query.

## Class members

### Methods

-   **addFilterQuery**(query: string = null) <br/>

    -   _query:_ `string`  -  
    -   **buildQuery**(): `QueryBody` <br/>

        -   **Returns** `QueryBody` - 

-   **execute**(): `Promise<void>` <br/>

    -   **Returns** `Promise<void>` - 

-   **getFacetQuery**(label: string = null): [`FacetQuery`](../../lib/content-services/search/facet-query.interface.ts) <br/>

    -   _label:_ `string`  -  
    -   **Returns** [`FacetQuery`](../../lib/content-services/search/facet-query.interface.ts) - 

-   **removeFilterQuery**(query: string = null) <br/>

    -   _query:_ `string`  -  

-   **update**() <br/>

## Details

The Query Builder is UI agnostic and does not rely on Angular components.
You can reuse it with multiple component implementations.

You can use custom widgets to populate and edit the following parts of the resulting query:

-   categories
-   query fragments that form query expression
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
