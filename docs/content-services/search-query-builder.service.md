---
Added: v2.3.0
Status: Active
---

# Search Query Builder service

Stores information from all the custom search and faceted search widgets, compiles and runs the final Search query.

## Class members

### Methods

-   `addFilterQuery(query: string): void`  
    Adds a filter query to the search.  
    -   `query` - Query text
-   `removeFilterQuery(query: string): void`  
    Removes a previously added filter query from the search.  
    -   `query` - Query text
-   `getFacetQuery(label: string): FacetQuery`  
    Gets a facet query.  
    -   `label` - Identifier of the target query
-   `update(): void`  
    Rebuilds the query and triggers the `updated` event.  
-   `async execute()`  
    Executes the query.  
-   `buildQuery(): QueryBody`  
    Builds the query.  

## Details

The Query Builder is UI agnostic and does not rely on Angular components.
You can reuse it with multiple component implementations.

You can use custom widgets to populate and edit the following parts of the resulting query:

- categories
- query fragments that form query expression
- include fields
- scope settings
- filter queries
- facet fields
- range queries

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