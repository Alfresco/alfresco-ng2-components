---
Title: Search Filter component
Added: v2.3.0
Status: Active
Last reviewed: 2019-03-20
---

# [Search Filter component](../../../lib/content-services/src/lib/search/components/search-filter/search-filter.component.ts "Defined in search-filter.component.ts")

Represents a main container component for custom search and faceted search settings.

## Basic usage

```html
<adf-search-filter #settings [showContextFacets]=true></adf-search-filter>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| showContextFacets | `boolean` | true | Toggles whether to show or not the context facet filters |

## Details

The component UI uses dynamically created expansion card widgets to specify the search query and its
options. It then uses the [Search Query Builder service](../services/search-query-builder.service.md)
to build and execute the query.

## See also

-   [Search Configuration Guide](../../user-guide/search-configuration-guide.md)
-   [Search Query Builder service](../services/search-query-builder.service.md)
-   [Search filter chips component](./search-filter-chips.component.md)
-   [Search Chip List Component](search-chip-list.component.md)
-   [Search Sorting Picker Component](search-sorting-picker.component.md)
-   [Search Widget Interface](../interfaces/search-widget.interface.md)
-   [Search check list component](search-check-list.component.md)
-   [Search date range component](search-date-range.component.md)
-   [Search number range component](search-number-range.component.md)
-   [Search radio component](search-radio.component.md)
-   [Search slider component](search-slider.component.md)
-   [Search text component](search-text.component.md)
