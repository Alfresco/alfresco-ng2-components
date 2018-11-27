---
Title: Search date range component
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-11
---

# Search date range component

Implements a date range widget for the [Search Filter component](../content-services/search-filter.component.md).

![Date Range Widget](../docassets/images/search-date-range.png)

## Basic usage

```json
{
    "search": {
        "categories": [
            {
                "id": "createdDateRange",
                "name": "Created Date (range)",
                "enabled": true,
                "component": {
                    "selector": "date-range",
                    "settings": {
                        "field": "cm:created"
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
| field | string | Field to apply the query to. Required value |
| dateFormat | string | Date format. Dates used by the datepicker are [Moment.js](https://momentjs.com/docs/#/parsing/string-format/) instances, so you can use any date format supported by Moment. Default is 'DD/MM/YYYY'. |

## Details

This component lets the user select a range between two dates based on the particular `field`.
See the [Search filter component](../content-services/search-filter.component.md) for full details of how to use widgets
in a search query.

### Custom date format

You can set the date range picker to work with any date format your app requires. You can use
any date format supported by [Moment.js](https://momentjs.com/docs/#/parsing/string-format/)
in the `dateFormat` setting:

```json
{
    "search": {
        "categories": [
            {
                "id": "createdDateRange",
                "name": "Created Date (range)",
                "enabled": true,
                "component": {
                    "selector": "date-range",
                    "settings": {
                        "field": "cm:created",
                        "dateFormat": "DD-MMM-YY"
                    }
                }
            }
        ]
    }
}
```

## See also

-   [Search filter component](../content-services/search-filter.component.md)
-   [Search check list component](../content-services/search-check-list.component.md)
-   [Search number range component](../content-services/search-number-range.component.md)
-   [Search radio component](../content-services/search-radio.component.md)
-   [Search slider component](../content-services/search-slider.component.md)
-   [Search text component](../content-services/search-text.component.md)
