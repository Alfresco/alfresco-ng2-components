# RequestSortDefinitionInner

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | How to order - using a field, when position of the document in the index, score/relevance. | [optional] [default to null]
**field** | **string** | The name of the field | [optional] [default to null]
**ascending** | **boolean** | The sort order. (The ordering of nulls is determined by the SOLR configuration) | [optional] [default to null]


<a name="RequestSortDefinitionInner.TypeEnum"></a>
## Enum: RequestSortDefinitionInner.TypeEnum


* `FIELD` (value: `'FIELD'`)

* `DOCUMENT` (value: `'DOCUMENT'`)

* `SCORE` (value: `'SCORE'`)




