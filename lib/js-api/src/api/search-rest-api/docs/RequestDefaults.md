# RequestDefaults

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**textAttributes** | **string[]** | A list of query fields/properties used to expand TEXT: queries.
The default is cm:content.
You could include all content properties using d:content or list all individual content properties or types.
As more terms are included the query size, complexity, memory impact and query time will increase.
 | [optional] [default to null]
**defaultFTSOperator** | **string** | The default way to combine query parts when AND or OR is not explicitly stated - includes ! - +
one two three
(one two three)
 | [optional] [default to null]
**defaultFTSFieldOperator** | **string** | The default way to combine query parts in field query groups when AND or OR is not explicitly stated - includes ! - +
FIELD:(one two three)
 | [optional] [default to null]
**namespace** | **string** | The default name space to use if one is not provided | [optional] [default to null]
**defaultFieldName** | **string** |  | [optional] [default to null]


<a name="RequestDefaults.DefaultFTSOperatorEnum"></a>
## Enum: RequestDefaults.DefaultFTSOperatorEnum


* `AND` (value: `'AND'`)

* `OR` (value: `'OR'`)




<a name="RequestDefaults.DefaultFTSFieldOperatorEnum"></a>
## Enum: RequestDefaults.DefaultFTSFieldOperatorEnum


* `AND` (value: `'AND'`)

* `OR` (value: `'OR'`)




