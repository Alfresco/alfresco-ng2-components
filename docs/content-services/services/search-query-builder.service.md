---
Title: Search Query Builder service 
Added: v2.3.0
Status: Active
Last reviewed: 2019-03-19
---

# [Search Query Builder service](../../../lib/content-services/src/lib/search/search-query-builder.service.ts "Defined in search-query-builder.service.ts")

Stores information from all the custom search and faceted search widgets, compiles and runs the final search query.

## Class members

### Methods

*   **addFilterQuery**(query: `string`)<br/>
    Adds a filter query to the current query.
    *   *query:* `string`  - Query string to add

*   **addUserFacetBucket**(field: [`FacetField`](../../../lib/content-services/src/lib/search/facet-field.interface.ts), bucket: [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/facet-field-bucket.interface.ts))<br/>
    Adds a facet bucket to a field.
    *   *field:* [`FacetField`](../../../lib/content-services/src/lib/search/facet-field.interface.ts)  - The target field
    *   *bucket:* [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/facet-field-bucket.interface.ts)  - Bucket to add

*   **buildQuery**(): `QueryBody`<br/>
    Builds the current query.
    *   **Returns** `QueryBody` - The finished query

*   **execute**(queryBody?: `QueryBody`)<br/>
    Builds and executes the current query.
    *   *queryBody:* `QueryBody`  - (Optional)

*   **getFacetField**(label: `string`): [`FacetField`](../../../lib/content-services/src/lib/search/facet-field.interface.ts)<br/>
    Gets a facet field by label.
    *   *label:* `string`  - Label of the facet field
    *   **Returns** [`FacetField`](../../../lib/content-services/src/lib/search/facet-field.interface.ts) - Facet field data

*   **getFacetQuery**(label: `string`): [`FacetQuery`](../../../lib/content-services/src/lib/search/facet-query.interface.ts)<br/>
    Gets a facet query by label.
    *   *label:* `string`  - Label of the query
    *   **Returns** [`FacetQuery`](../../../lib/content-services/src/lib/search/facet-query.interface.ts) - Facet query data

*   **getPrimarySorting**(): [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/search-sorting-definition.interface.ts)<br/>
    Gets the primary sorting definition.
    *   **Returns** [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/search-sorting-definition.interface.ts) - The primary sorting definition

*   **getQueryGroup**(query: `any`): `any`<br/>
    Gets the query group.
    *   *query:* `any`  - Target query
    *   **Returns** `any` - Query group

*   **getScope**(): [`RequestScope`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/search-rest-api/model/requestScope.ts)<br/>

    *   **Returns** [`RequestScope`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/search-rest-api/model/requestScope.ts) -

*   **getSortingOptions**(): [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/search-sorting-definition.interface.ts)`[]`<br/>
    Gets all pre-configured sorting options that users can choose from.
    *   **Returns** [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/search-sorting-definition.interface.ts)`[]` - Pre-configured sorting options

*   **getSupportedLabel**(configLabel: `string`): `string`<br/>
    Encloses a label name with double quotes if it contains whitespace characters.
    *   *configLabel:* `string`  - Original label text
    *   **Returns** `string` - Label, possibly with quotes if it contains spaces

*   **getUserFacetBuckets**(field: `string`): [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/facet-field-bucket.interface.ts)`[]`<br/>
    Gets the buckets currently added to a field
    *   *field:* `string`  - The target fields
    *   **Returns** [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/facet-field-bucket.interface.ts)`[]` - Bucket array

*   **isFilterServiceActive**(): `boolean`<br/>

    *   **Returns** `boolean` -

*   **loadConfiguration**(): [`SearchConfiguration`](../../../lib/content-services/src/lib/search/search-configuration.interface.ts)<br/>

    *   **Returns** [`SearchConfiguration`](../../../lib/content-services/src/lib/search/search-configuration.interface.ts) -

*   **removeFilterQuery**(query: `string`)<br/>
    Removes an existing filter query.
    *   *query:* `string`  - The query to remove

*   **removeUserFacetBucket**(field: [`FacetField`](../../../lib/content-services/src/lib/search/facet-field.interface.ts), bucket: [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/facet-field-bucket.interface.ts))<br/>
    Removes an existing bucket from a field.
    *   *field:* [`FacetField`](../../../lib/content-services/src/lib/search/facet-field.interface.ts)  - The target field
    *   *bucket:* [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/facet-field-bucket.interface.ts)  - Bucket to remove

*   **resetToDefaults**()<br/>

*   **search**(queryBody: `QueryBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>`<br/>

    *   *queryBody:* `QueryBody`  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>` -

*   **setScope**(scope: [`RequestScope`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/search-rest-api/model/requestScope.ts))<br/>

    *   *scope:* [`RequestScope`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/search-rest-api/model/requestScope.ts)  -

*   **update**(queryBody?: `QueryBody`)<br/>
    Builds the current query and triggers the `updated` event.
    *   *queryBody:* `QueryBody`  - (Optional)

## Details

See the [Search filter component](../components/search-filter.component.md) page for full details about the format of queries,
facet fields, and sorting options.

The Query Builder is UI agnostic and does not rely on Angular components.
You can reuse it with multiple component implementations.

You can use custom widgets to populate and edit the following parts of the resulting query:

*   categories
*   query fragments that form a query expression
*   include fields
*   scope settings
*   filter queries
*   facet fields
*   range queries

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

> **Note:** From ADF 3.0.0, the query contains the `"facetFormat": "V2"` parameter so that all the responses have the same structure whether they come from search queries containing facetFields, facetQueries, grouped facetQueries or facetIntervals.

## See also

*   [Search filter component](../components/search-filter.component.md)
*   [Search Widget interface](../interfaces/search-widget.interface.md)
