---
Title: Search text component
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-11
---

# [Search text component](../../lib/content-services/search/components/search-text/search-text.component.ts "Defined in search-text.component.ts")

Implements a text input widget for the [Search Filter component](../content-services/search-filter.component.md).

![Text Widget](../docassets/images/search-text.png)

## Basic usage

```json
{
    "search": {
        "categories": [
            {
                "id": "queryName",
                "name": "Name",
                "enabled": true,
                "expanded": true,
                "component": {
                    "selector": "text",
                    "settings": {
                        "pattern": "cm:name:'(.*?)'",
                        "field": "cm:name",
                        "placeholder": "Enter the name"
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
| field | string | Field to apply the query fragment to. Required value |
| pattern | string | Regular expression pattern to restrict the format of the input text |
| placeholder | string | Text displayed in the widget when the input string is empty |

## Details

This component lets the user add a text value to search for in the specified
`field`. See the [Search filter component](../content-services/search-filter.component.md) for full
details of how to use widgets in a search query.

## See also

-   [Search filter component](../content-services/search-filter.component.md)
-   [Search check list component](../content-services/search-check-list.component.md)
-   [Search date range component](../content-services/search-date-range.component.md)
-   [Search number range component](../content-services/search-number-range.component.md)
-   [Search radio component](../content-services/search-radio.component.md)
-   [Search slider component](../content-services/search-slider.component.md)
