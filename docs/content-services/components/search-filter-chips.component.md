---
Title: Search Filter Chips component
Added: v4.5.0
Status: Active
Last reviewed: 2021-06-26
---

# [Search Filter chip component](../../../lib/content-services/src/lib/search/components/search-filter-chips/search-filter-chips.component.ts "Defined in search-filter-chips.component.ts")

Represents a chip based container component for custom search and faceted search settings.

![Search Filter Chips](../../docassets/images/search-filter-chips.png)


![Search Filter Chip Menu](../../docassets/images/search-filter-chip-widget.png)

## Contents

-   [Basic usage](#basic-usage)
    -   [Properties](#properties)
-   [Details](#details)
-   [See also](#see-also)

## Basic usage

```html
<adf-search-filter-chips [showContextFacets]=true></adf-search-filter-chips>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| showContextFacets | `boolean` | true | Toggles whether to show or not the context facet filters |

## Details

This component is chip based layout for searching. it just alternate component for [expanded panel search filter](./search-filter.component.md)

You may find it useful to check out the following resources for background information
before customizing the search UI:

-   [Search API](https://docs.alfresco.com/5.2/concepts/search-api.html)
-   [Alfresco Full Text Search Reference](https://docs.alfresco.com/5.2/concepts/rm-searchsyntax-intro.html)
-   [ACS API Explorer](https://api-explorer.alfresco.com/api-explorer/#!/search/search)

## See also

-   [Search Filter Component](./search-filter.component.md)
-   [Search Query Builder service](../services/search-query-builder.service.md)
-   [Search Widget Interface](../interfaces/search-widget.interface.md)
-   [Search check list component](search-check-list.component.md)
-   [Search date range component](search-date-range.component.md)
-   [Search number range component](search-number-range.component.md)
-   [Search radio component](search-radio.component.md)
-   [Search slider component](search-slider.component.md)
-   [Search text component](search-text.component.md)
