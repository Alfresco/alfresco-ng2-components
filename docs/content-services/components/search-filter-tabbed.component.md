---
Title: Search filter tabbed component
Added: v6.1.0
Status: Active
Last reviewed: 2023-06-13
---

# [Search filter tabbed component](../../../lib/content-services/src/lib/search/components/search-filter-tabbed/search-filter-tabbed.component.ts "Defined in search-filter-tabbed.component.ts")

Represents a container [search widget](../../../lib/content-services/src/lib/search/models/search-widget.interface.ts) for [Search Filters](search-filter.component.md) to provide a tabbed user interface for the filters. 

![Search Filter Tabbed Widget](../../docassets/images/search-filter-tabbed.png)

## Basic Usage

```json
{
    "search": {
        "categories": [
            {
                "id": "createdModifiedDateRange",
                "name": "Date",
                "enabled": true,
                "component": {
                    "selector": "widget-composite",
                    "settings": {
                        "useWideMenu": true,
                        "displayLabelSeparator": ";",
                        "tabs":[
                            {
                                "id": "createdDateRange",
                                "name": "Created Date",
                                "tabDisplayLabel": "CREATED",
                                "component": {
                                    "selector": "date-range-advanced",
                                    "settings": {
                                        "allowUpdateOnChange": false,
                                        "hideDefaultAction": true,
                                        "field": "cm:created",
                                        "dateFormat": "DD-MMM-YY",
                                        "maxDate": "today"
                                    }
                                }
                            },
                            {
                                "id": "modifiedDateRange",
                                "name": "Modified Date",
                                "tabDisplayLabel": "MODIFIED",
                                "component": {
                                    "selector": "date-range-advanced",
                                    "settings": {
                                        "allowUpdateOnChange": false,
                                        "hideDefaultAction": true,
                                        "field": "cm:modified",
                                        "dateFormat": "DD-MMM-YY",
                                        "maxDate": "today"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ]
    }
}
```

### Settings

| Name                  | Type                                                                                             | Description                                                                                                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| useWideMenu           | boolean                                                                                          | Boolean flag to control whether to use a wider view for the tabbed component or not. This may or may not be required, depending on the widgets used inside the tab |
| displayLabelSeparator | string                                                                                           | The separator to use to differentiate between the display labels for the different widgets used inside the tab container.                                          |
| tabs                  | [SearchWidget](../../../lib/content-services/src/lib/search/models/search-widget.interface.ts)[] | Array of search widgets to use inside the tabbed container.                                                                                                        |

#### NOTE: 
The tabs property inside the settings object, can take an additional property called `tabDisplayLabel`. This property is used to define the display label for the different widgets once their values are selected. 
It is not a required property, and will be blank by default. Refer [basic usage](#basic-usage) section above for more details.

## Details
This component allows grouping of multiple, related search filter widgets together. This can be useful for saving space when multiple filters can have similar values/filtering rules. The e.g. used in the screenshot above groups date related filters for created and modified dates
together under a single filter widget.

## See also

-   [Search Configuration Guide](../../user-guide/search-configuration-guide.md)
-   [Search Query Builder service](../services/search-query-builder.service.md)
-   [Search Widget Interface](../interfaces/search-widget.interface.md)
-   [Search Chip Input component](search-chip-input.component.md)
-   [Search check list component](search-check-list.component.md)
-   [Search date range component](search-date-range.component.md)
-   [Search date range advanced component](search-date-range-advanced.component.md)
-   [Search number range component](search-number-range.component.md)
-   [Search radio component](search-radio.component.md)
-   [Search slider component](search-slider.component.md)
-   [Search text component](search-text.component.md)
