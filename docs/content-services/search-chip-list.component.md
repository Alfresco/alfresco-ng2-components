---
Title: Search Chip List Component
Added: v2.3.0
Status: Active
Last reviewed: 2018-09-14
---

# Search Chip List Component

Displays search criteria as a set of "chips".

![Selected Facets](../docassets/images/selected-facets.png)

## Basic usage

```html
<adf-search-chip-list [searchFilter]="searchFilter"></adf-search-chip-list>
<adf-search-filter #searchFilter></adf-search-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| searchFilter | [`SearchFilterComponent`](../content-services/search-filter.component.md) |  | Search filter to supply the data for the chips. |
