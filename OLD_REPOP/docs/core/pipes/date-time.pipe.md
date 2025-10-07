---
Title: Date Time Pipe
Added: v6.2.0
Status: Active
Last reviewed: 2023-08-30
---

# [Date Time Pipe](../../../lib/core/src/lib/pipes/date-time.pipe.ts "Defined in date-time.pipe.ts")

Converts a given input value into a Date object and adjusts it according to the specified format and timezone offset.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Adjusted Date: {{ inputValue | adfDateTime: 'your-date-format' }}
</div>

```

<!-- {% endraw %} -->

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | string, Date, number | The input value to be converted to a Date object |
| dateFormat | string | The format to use for parsing the input string value |
| returns | Date | The adjusted Date object, accounted with timezone offset |

## Details
The pipe transforms the input value into a Date object, adjusting it for the timezone offset as necessary.

## Input Types
If the input value is of type string, it is parsed using the specified date format and converted to a Date object.
If the input value is a Date object, it is used as is.
If the input value is a number, it is treated as a Unix timestamp and converted to a Date object.

## Timezone Adjustment
The pipe calculates the timezone offset of the input value and adjusts it accordingly. This ensures that the resulting Date object is adjusted to the correct timezone.

## Example
```HTML
<div>
    Date: {{ '2023-08-30T12:00:00' | adfDateTime: `yyyy-MM-dd'T'HH:mm:ss` }}
</div>
```
