# RequestFacetField

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**field** | **string** | The facet field | [optional] [default to null]
**label** | **string** | A label to include in place of the facet field | [optional] [default to null]
**prefix** | **string** | Restricts the possible constraints to only indexed values with a specified prefix. | [optional] [default to null]
**sort** | **string** |  | [optional] [default to null]
**method** | **string** |  | [optional] [default to null]
**missing** | **boolean** | When true, count results that match the query but which have no facet value for the field (in addition to the Term-based constraints). | [optional] [default to null]
**limit** | **number** |  | [optional] [default to null]
**offset** | **number** |  | [optional] [default to null]
**mincount** | **number** | The minimum count required for a facet field to be included in the response. | [optional] [default to null]
**facetEnumCacheMinDf** | **number** |  | [optional] [default to null]
**excludeFilters** | **string[]** | Filter Queries with tags listed here will not be included in facet counts.
This is used for multi-select facetting.
 | [optional] [default to null]


<a name="RequestFacetField.SortEnum"></a>
## Enum: RequestFacetField.SortEnum


* `COUNT` (value: `'COUNT'`)

* `INDEX` (value: `'INDEX'`)




<a name="RequestFacetField.MethodEnum"></a>
## Enum: RequestFacetField.MethodEnum


* `ENUM` (value: `'ENUM'`)

* `FC` (value: `'FC'`)




