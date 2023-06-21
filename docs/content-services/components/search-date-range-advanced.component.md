---
Title: Search date range advanced component
Added: v6.1.0
Status: Active
Last reviewed: 2023-06-13
---

# [Search date range advanced component](../../../lib/content-services/src/lib/search/components/search-date-range-advanced-tabbed/search-date-range-advanced/search-date-range-advanced.component.ts "Defined in search-date-range.component.ts")

Represents an advanced date range [search widget](../../../lib/content-services/src/lib/search/models/search-widget.interface.ts) for the [Search Filter component](search-filter.component.md).

![Date Range Advanced Widget](../../docassets/images/search-date-range-advanced.png)

## Basic usage

```json
{
    "search": {
        "categories": [
            {
                "id": "createdDateRange",
                "name": "Created Date",
                "component": {
                    "selector": "date-range-advanced",
                    "settings": {
                        "allowUpdateOnChange": false,
                        "hideDefaultAction": true,
                        "field": "cm:created",
                        "dateFormat": "dd-MMM-yy",
                        "maxDate": "today"
                    }
                }
            }
        ]
    }
}
```

### Settings

| Name | Type | Description                                                                                                                                                                                                                                              |
| ---- | ---- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| allowUpdateOnChange | boolean | Enable/Disable the update fire event when text has been changed. By default is false.                                                                                                                                                                    |
| hideDefaultAction | boolean | Show/hide the widget actions. By default is false.                                                                                                                                                                                                       |
| field | string | Field to apply the query to. Required value                                                                                                                                                                                                              |
| dateFormat | string | Date format. Dates used by the datepicker are Javascript Date objects, using [date-fns](https://date-fns.org/v2.30.0/docs/format) for formatting, so you can use any date format supported by the library. Default is 'dd-MMM-yy (sample date - 07-Jun-23) |
| maxDate | string | A fixed date (in format mentioned above, default format: dd-MMM-yy) or the string `"today"` that will set the maximum searchable date. Default is today.                                                                                                 |

## Details

This component lets the user choose a variety of options to apply date related filters through on the particular field. Currently, 3 different kinds of date filters are supported

- Anytime - No date filters are applied on the `field`. This option is selected by default
- In the last - Allows to user to apply a filter to only show results from the last 'n' unit of time. User can set the number as well as the unit of time on the filter. Currently, 3 units are supported - Days, Weeks, and Months.
  - The search query created while using this option has the following format
    `<field>:[NOW/DAY-n<unit> TO NOW/DAY+1DAY]`
  - For e.g., a search query for fetching results created in the last 4 weeks would be
    `cm:created:[NOW/DAY-4WEEKS TO NOW/DAY+1DAY]`
- Between - Allows the user to select a range of dates to filter the search results. 
  - The search query created while using this options has the following format
    `<field>:[<from_date> TO <to_date>]`
  - For e.g., a search query for fetching the results created between 6 June, 2023 to 10 June, 2023 would be - 
    `cm:created:['2023-06-06T00:00:00+05:30' TO '2023-06-10T23:59:59+05:30']`

See the [Search filter component](search-filter.component.md) for full details of how to use widgets
in a search query.

### Custom date format

You can set the date range picker to work with any date format your app requires. You can use
any date format supported by the [date-fns](https://date-fns.org/v2.30.0/docs/format) library
in the `dateFormat` and in the `maxDate` setting:

```json
{
    "search": {
        "categories": [
            {
                "id": "createdDateRange",
                "name": "Created Date (range)",
                "enabled": true,
                "component": {
                    "selector": "date-range-advanced",
                    "settings": {
                        "field": "cm:created",
                        "dateFormat": "dd-MMM-yy",
                        "maxDate": "02-Mar-20"
                    }
                }
            }
        ]
    }
}
```

## See also

-   [Search Configuration Guide](../../user-guide/search-configuration-guide.md)
-   [Search Query Builder service](../services/search-query-builder.service.md)
-   [Search Widget Interface](../interfaces/search-widget.interface.md)
-   [Search Chip Input component](search-chip-input.component.md)
-   [Search check list component](search-check-list.component.md)
-   [Search date range component](search-date-range.component.md)
-   [Search number range component](search-number-range.component.md)
-   [Search radio component](search-radio.component.md)
-   [Search slider component](search-slider.component.md)
-   [Search text component](search-text.component.md)
-   [Search filter tabbed component](search-filter-tabbed.component.md)
