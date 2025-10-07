# RequestRange

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**field** | **string** | The name of the field to perform range | [optional] [default to null]
**start** | **string** | The start of the range | [optional] [default to null]
**end** | **string** | The end of the range | [optional] [default to null]
**gap** | **string** | Bucket size | [optional] [default to null]
**hardend** | **boolean** | If true means that the last bucket will end at “end” even if it is less than “gap” wide. | [optional] [default to null]
**other** | **string[]** | before, after, between, non, all | [optional] [default to null]
**include** | **string[]** | lower, upper, edge, outer, all | [optional] [default to null]
**label** | **string** | A label to include as a pivot reference | [optional] [default to null]
**excludeFilters** | **string[]** | Filter queries to exclude when calculating statistics | [optional] [default to null]


