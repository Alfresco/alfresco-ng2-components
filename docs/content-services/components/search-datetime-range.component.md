---
Title: Search datetime range component
Added: v4.2.0
Status: Active
Last reviewed: 2020-11-02
---

# [Search datetime range component](../../../lib/content-services/src/lib/search/components/search-datetime-range/search-datetime-range.component.ts "Defined in search-datetime-range.component.ts")

Implements a [search widget](../../../lib/content-services/src/lib/search/search-widget.interface.ts) for the [Search Filter component](search-filter.component.md).

![Date Range Widget](../../docassets/images/search-datetime-range.png)

## Basic usage

```json
{
    "search": {
        "categories": [
            {
                "id": "createdDatetimeRange",
                "name": "Created Datetime (range)",
                "enabled": true,
                "component": {
                    "selector": "datetime-range",
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
| datetimeFormat | string | Datetime format. Datetime formats used by the datetime picker are [Moment.js](https://momentjs.com/docs/#/parsing/string-format/) instances, so you can use any datetime format supported by Moment. Default is 'DD/MM/YYYY HH:mm'. |
| maxDatetime | string | A fixed datetime that will set the maximum searchable datetime. Default is no maximum. |
| hideDefaultAction | boolean | Show/hide the [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) actions. By default is false. |

## Details

This component lets the user select a range between two dates and times based on the particular `field`.
See the [Search filter component](search-filter.component.md) for full details of how to use widgets
in a search query.

### Custom datetime format

You can set the datetime range picker to work with any datetime format your app requires. You can use
any datetime format supported by [Moment.js](https://momentjs.com/docs/#/parsing/string-format/)
in the `datetimeFormat` and in the `maxDatetime` setting:

```json
{
    "search": {
        "categories": [
            {
                "id": "createdDateTimeRange",
                "name": "Created Datetime (range)",
                "enabled": true,
                "component": {
                    "selector": "datetime-range",
                    "settings": {
                        "field": "cm:created",
                        "datetimeFormat": "DD-MMM-YY HH:mm:ss",
                        "maxDatetime": "10-Mar-20 20:00"
                    }
                }
            }
        ]
    }
}
```

## See also

-   [Search filter component](search-filter.component.md)
-   [Search check list component](search-check-list.component.md)
-   [Search number range component](search-number-range.component.md)
-   [Search radio component](search-radio.component.md)
-   [Search slider component](search-slider.component.md)
-   [Search text component](search-text.component.md)
