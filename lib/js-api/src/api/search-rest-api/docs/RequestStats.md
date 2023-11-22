# RequestStats

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**field** | **string** | The stats field | [optional] [default to null]
**label** | **string** | A label to include for reference the stats field | [optional] [default to null]
**min** | **boolean** | The minimum value of the field | [optional] [default to null]
**max** | **boolean** | The maximum value of the field | [optional] [default to null]
**sum** | **boolean** | The sum of all values of the field | [optional] [default to null]
**countValues** | **boolean** | The number which have a value for this field | [optional] [default to null]
**missing** | **boolean** | The number which do not have a value for this field | [optional] [default to null]
**mean** | **boolean** | The average | [optional] [default to null]
**stddev** | **boolean** | Standard deviation | [optional] [default to null]
**sumOfSquares** | **boolean** | Sum of all values squared | [optional] [default to null]
**distinctValues** | **boolean** | The set of all distinct values for the field (This can be very expensive to calculate) | [optional] [default to null]
**countDistinct** | **boolean** | The number of distinct values  (This can be very expensive to calculate) | [optional] [default to null]
**cardinality** | **boolean** | A statistical approximation of the number of distinct values | [optional] [default to null]
**cardinalityAccuracy** | **number** | Number between 0.0 and 1.0 indicating how aggressively the algorithm should try to be accurate. Used with boolean cardinality flag. | [optional] [default to 0.3]
**excludeFilters** | **string[]** | A list of filters to exclude | [optional] [default to null]
**percentiles** | **number[]** | A list of percentile values, e.g. \"1,99,99.9\" | [optional] [default to null]


