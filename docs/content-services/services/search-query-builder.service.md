---
Title: Search Query Builder service 
Added: v2.3.0
Status: Active
Last reviewed: 2026-06-29
---

# [Search Query Builder service](../../../lib/content-services/src/lib/search/services/search-query-builder.service.ts "Defined in search-query-builder.service.ts")

Stores information from all the custom search and faceted search widgets, compiles and runs the final search query.

## Class members

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| userQuery | `string` | The raw query string typed by the user. Setting it stores the value, records it in `filterRawParams` and recomputes `parsedQuery` according to the current `searchMode`. |
| parsedQuery | `string` (read-only) | The query derived from `userQuery`. In `regular` mode the user terms are expanded against the configured fields (see `app:fields`) and optionally wildcarded; in `formula` mode it is identical to `userQuery`. |
| searchMode | `'regular' \| 'formula'` | Controls how `userQuery` is turned into `parsedQuery`. `regular` (default) parses the user input into a field query; `formula` uses the user input verbatim as an AFTS expression. |
| selectedConfigurationId | `string` | Id of the currently active search configuration. Setting it also records the value in `filterRawParams`. |
| encodedQuery | `string` (read-only) | The Base64-encoded `filterRawParams`, produced by `encodeQuery()` and written to the `q` route query parameter. |
| wildcardsEnabled | `boolean` (read-only) | Reads the `search-wildcards-enabled` app config flag (default `true`). When enabled, query terms are suffixed with `*` so partial matches are returned. |

### Methods

-   **addFilterQuery**(query: `string`)<br/>
    Adds a filter query to the current query.
    -   _query:_ `string`  - Query string to add
-   **addUserFacetBucket**(field: [`FacetField`](../../../lib/content-services/src/lib/search/models/facet-field.interface.ts), bucket: [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/models/facet-field-bucket.interface.ts))<br/>
    Adds a facet bucket to a field.
    -   _field:_ [`FacetField`](../../../lib/content-services/src/lib/search/models/facet-field.interface.ts)  - The target field
    -   _bucket:_ [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/models/facet-field-bucket.interface.ts)  - Bucket to add
-   **buildQuery**(): `SearchRequest`<br/>
    Builds the current query.
    -   **Returns** `SearchRequest` - The finished query
-   **encodeQuery**()<br/>
    Encodes query shards stored in `filterRawParams` property.    
-   **execute**(updateQueryParams: `boolean` = `true`, queryBody?: `SearchRequest`)<br/>
    Builds and executes the current query, then emits the result on the `executed` stream.
    -   _updateQueryParams:_ `boolean`  - (Optional) When `true` (default) the encoded query is written to the `q` route query parameter. Pass `false` to execute without updating the URL.
    -   _queryBody:_ `SearchRequest`  - (Optional) Pre-built query to execute instead of building one from the current state.
-   **getDefaultConfiguration**(): [`SearchConfiguration`](../../../lib/content-services/src/lib/search/models/search-configuration.interface.ts)`|undefined`<br/>

    -   **Returns** [`SearchConfiguration`](../../../lib/content-services/src/lib/search/models/search-configuration.interface.ts)`|undefined` - 

-   **getFacetField**(label: `string`): [`FacetField`](../../../lib/content-services/src/lib/search/models/facet-field.interface.ts)<br/>
    Gets a facet field by label.
    -   _label:_ `string`  - Label of the facet field
    -   **Returns** [`FacetField`](../../../lib/content-services/src/lib/search/models/facet-field.interface.ts) - Facet field data
-   **getFacetQuery**(label: `string`): [`FacetQuery`](../../../lib/content-services/src/lib/search/models/facet-query.interface.ts)<br/>
    Gets a facet query by label.
    -   _label:_ `string`  - Label of the query
    -   **Returns** [`FacetQuery`](../../../lib/content-services/src/lib/search/models/facet-query.interface.ts) - Facet query data
-   **getPrimarySorting**(): [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/models/search-sorting-definition.interface.ts)<br/>
    Gets the primary sorting definition.
    -   **Returns** [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/models/search-sorting-definition.interface.ts) - The primary sorting definition
-   **getQueryGroup**(query: `any`): `any`<br/>
    Gets the query group.
    -   _query:_ `any`  - Target query
    -   **Returns** `any` - Query group
-   **getScope**(): `RequestScope`<br/>

    -   **Returns** `RequestScope` - 

-   **getSearchFormDetails**(): [`SearchForm`](../../../lib/content-services/src/lib/search/models/search-form.interface.ts)`[]`<br/>

    -   **Returns** [`SearchForm`](../../../lib/content-services/src/lib/search/models/search-form.interface.ts)`[]` - 

-   **getSortingOptions**(): [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/models/search-sorting-definition.interface.ts)`[]`<br/>
    Gets all pre-configured sorting options that users can choose from.
    -   **Returns** [`SearchSortingDefinition`](../../../lib/content-services/src/lib/search/models/search-sorting-definition.interface.ts)`[]` - Pre-configured sorting options
-   **getSupportedLabel**(configLabel: `string`): `string`<br/>
    Encloses a label name with double quotes if it contains whitespace characters.
    -   _configLabel:_ `string`  - Original label text
    -   **Returns** `string` - Label, possibly with quotes if it contains spaces
-   **getUserFacetBuckets**(field: `string`): [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/models/facet-field-bucket.interface.ts)`[]`<br/>
    Gets the buckets currently added to a field
    -   _field:_ `string`  - The target fields
    -   **Returns** [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/models/facet-field-bucket.interface.ts)`[]` - Bucket array
-   **isFilterServiceActive**(): `boolean`<br/>

    -   **Returns** `boolean` - 

-   **isOperator**(input: `string`): `boolean`<br/>
    Checks whether the supplied string is a logical `AND` or `OR` operator. Used when parsing a multi-word user query in `regular` search mode.
    -   _input:_ `string`  - String to check
    -   **Returns** `boolean` - `true` if the trimmed string is `AND` or `OR`, otherwise `false`

-   **loadConfiguration**(): [`SearchConfiguration`](../../../lib/content-services/src/lib/search/models/search-configuration.interface.ts)<br/>

    -   **Returns** [`SearchConfiguration`](../../../lib/content-services/src/lib/search/models/search-configuration.interface.ts) -

-   **navigateToSearch**(query: `string`, searchUrl: `string`) <br/>
    Updates user query, executes existing search configuration, encodes the query and navigates to searchUrl.
    -   _query:_ `string`  - The query to use as user query
    -   _searchUrl:_ `string`  - Search url to navigate to

-   **removeFilterQuery**(query: `string`)<br/>
    Removes an existing filter query.
    -   _query:_ `string`  - The query to remove
-   **removeUserFacetBucket**(field: [`FacetField`](../../../lib/content-services/src/lib/search/models/facet-field.interface.ts), bucket: [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/models/facet-field-bucket.interface.ts))<br/>
    Removes an existing bucket from a field.
    -   _field:_ [`FacetField`](../../../lib/content-services/src/lib/search/models/facet-field.interface.ts)  - The target field
    -   _bucket:_ [`FacetFieldBucket`](../../../lib/content-services/src/lib/search/models/facet-field-bucket.interface.ts)  - Bucket to remove
-   **resetToDefaults**(withNavigate: `boolean` = `false`, resetUserQuery: `boolean` = `true`)<br/>
    Resets the query builder back to the default search configuration.
    -   _withNavigate:_ `boolean`  - (Optional) When `true`, clears the `q` route query parameter while resetting. Defaults to `false`.
    -   _resetUserQuery:_ `boolean`  - (Optional) When `true` (default), the `userQuery` and its parsed form are cleared. Pass `false` to keep the current user query while resetting the rest of the options.

-   **search**(queryBody: `SearchRequest`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>`<br/>

    -   _queryBody:_ `SearchRequest`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>` - 

-   **setScope**(scope: `RequestScope`)<br/>

    -   _scope:_ `RequestScope`  - 

-   **updateSearchQueryParams**() <br/>
    Encodes the query and navigates to existing search route adding encoded query as a search param.
-   **updateSelectedConfiguration**(id: `string`, resetFilters: `boolean` = `true`, shouldExecute: `boolean` = `true`)<br/>
    Switches the active search configuration to the one matching the supplied id (only relevant when multiple configurations are provided).
    -   _id:_ `string`  - Id of the configuration to select
    -   _resetFilters:_ `boolean`  - (Optional) When `true` (default), the current search options are reset before applying the new configuration. Pass `false` to keep them.
    -   _shouldExecute:_ `boolean`  - (Optional) When `true` (default), the query is executed immediately after switching configuration.

## Details

See the [Search filter component](../components/search-filter.component.md) page for full details about the format of queries,
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

    queryBuilder.executed.subscribe(data => {
        this.onDataLoaded(data);
    });

}
```

To run a search, build the query state (for example by setting `userQuery` or by letting a
search widget update `queryFragments`) and then call `execute()`. The result is delivered
through the `executed` stream.

```ts
this.queryBuilder.userQuery = 'invoice';
void this.queryBuilder.execute();
```

> **Note:** Earlier versions exposed an `updated` stream and an `update()` method that built the
> query and emitted it so that a subscriber could call `execute()`. Both have been removed; build
> the query state and call `execute()` directly instead.

### Search modes

The builder supports two search modes, selected through the `searchMode` property:

-   **regular** (default) - the text in `userQuery` is treated as user input and parsed into a
    field query. The query is split into terms, each term is matched against the fields listed in
    the `app:fields` search configuration entry (falling back to `cm:name`), and a `*` wildcard is
    appended when wildcards are enabled. Bare `AND`/`OR` words are preserved as operators.
-   **formula** - the text in `userQuery` is used verbatim as an [AFTS](https://docs.alfresco.com/content-services/latest/develop/search-api/) expression, allowing callers that already build their own query syntax to bypass parsing.

> **Note:** From ADF 3.0.0, the query contains the `"facetFormat": "V2"` parameter so that all the responses have the same structure whether they come from search queries containing facetFields, facetQueries, grouped facetQueries or facetIntervals.

## Runtime Configuration

You can provide search configuration at runtime using the `ADF_SEARCH_CONFIGURATION` injection token.
The value should expose the [SearchConfiguration](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/content-services/src/lib/search/models/search-configuration.interface.ts#L25) interface.

```ts
@NgModule({
    providers: [
        { provide: ADF_SEARCH_CONFIGURATION, useValue: {/*...*/} }
    ]
})
class AppModule {}
```

## See also

-   [Search Configuration Guide](../../user-guide/search-configuration-guide.md)
-   [Search filter component](../components/search-filter.component.md)
-   [Search filter chips component](../components/search-filter-chips.component.md)
-   [Search Form Component](../components/search-form.component.md)
-   [Search Widget interface](../interfaces/search-widget.interface.md)
-   [Search check list component](../components/search-check-list.component.md)
-   [Search date range tabbed component](../components/search-date-range-tabbed.component.md)
-   [Search number range component](../components/search-number-range.component.md)
-   [Search radio component](../components/search-radio.component.md)
-   [Search slider component](../components/search-slider.component.md)
-   [Search text component](../components/search-text.component.md)
-   [Search input component](../components/search-input.component.md)
