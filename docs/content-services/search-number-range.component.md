---
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-11
---

# Search number range component

Implements a number range widget for the [Search Filter component](../content-services/search-filter.component.md).

![Number Range Widget](../docassets/images/search-number-range.png)

## Basic usage

```json
{
    "search": {
        "categories": [
            {
                "id": "contentSizeRange",
                "name": "Content Size (range)",
                "enabled": true,
                "component": {
                    "selector": "number-range",
                    "settings": {
                        "field": "cm:content.size",
                        "format": "[{FROM} TO {TO}]"
                    }
                }
            }
        ]
    }
}
```

### Settings

| Name | Type | Description |
| ---- | ---- | ----------- |
| field | string | Field to to use |
| format | string | Value format. Uses string substitution to allow all sorts of [range queries](https://docs.alfresco.com/5.2/concepts/rm-searchsyntax-ranges.html). |

## Details

This component lets the user specify a range between two predefined numbers based on the
particular `field`. See the [Search filter component](../content-services/search-filter.component.md) for full details of how to use widgets
in a search query.

#### Range query format

See the [Search for ranges](https://docs.alfresco.com/5.2/concepts/rm-searchsyntax-ranges.html) page in the ACS docs for more information about the date range format.

The `format` setting specifies how the date is displayed textually. Most of the format is
displayed as-is but you can use `{FROM}` and `{TO}` markers to interpolate the range limits
into the format string:

```json
"settings": {
    "field": "cm:content.size",
    "format": "[{FROM} TO {TO}]"
}
```

The format above would be displayed at runtime as follows:

```text
cm:content.size:[0 TO 100]
```

## See also

-   [Search filter component](../content-services/search-filter.component.md)
-   [Search check list component](../content-services/search-check-list.component.md)
-   [Search date range component](../content-services/search-date-range.component.md)
-   [Search number range component](../content-services/search-number-range.component.md)
-   [Search radio component](../content-services/search-radio.component.md)
-   [Search slider component](../content-services/search-slider.component.md)
-   [Search text component](../content-services/search-text.component.md)
