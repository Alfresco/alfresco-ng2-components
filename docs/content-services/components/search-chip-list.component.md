---
Title: Search Chip List Component
Added: v2.3.0
Status: Active
Last reviewed: 2018-09-14
---

# [Search Chip List Component](../../../lib/content-services/src/lib/search/components/search-chip-list/search-chip-list.component.ts "Defined in search-chip-list.component.ts")

Displays search criteria as a set of "chips".

![Selected Facets](../../docassets/images/selected-facets.png)

## Basic usage

```html
<adf-search-chip-list></adf-search-chip-list>
<adf-search-filter></adf-search-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| clearAll | `boolean` | false | Flag used to enable the display of a clear-all-filters button. |
| searchFilter | [`SearchFilterComponent`](../../content-services/components/search-filter.component.md) |  | Search filter to supply the data for the chips. Not required from 4.5.0 and later versions @deprecated |
