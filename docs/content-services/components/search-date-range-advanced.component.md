---
Title: Search date range advanced component
Added: v6.1.0
Status: Active
Last reviewed: 2023-06-13
---

# [Search date range advanced component](../../../lib/content-services/src/lib/search/components/search-date-range-advanced-tabbed/search-date-range-advanced-tabbed.component.ts "Defined in search-date-range.component.ts")

Represents an advanced date range component for
the [SearchAdvancedDateRangeTabbedComponent](search-date-range-advanced-tabbed.component.md).

![Date Range Advanced Widget](../../docassets/images/search-date-range-advanced.png)

## Basic usage

```html
<adf-search-date-range-advanced></adf-search-date-range-advanced>
```

## Class Members

### Properties

| Name         | Type                    | Description                                                                                                                                                                                                                                                |
|--------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| field        | string                  | Field to apply the query to. Required value                                                                                                                                                                                                                |
| maxDate      | string                  | A fixed date (default format: dd-MMM-yy) or the string `"today"` that will set the maximum searchable date. Default is today.                                                                                                                              |
| dateFormat   | string                  | Date format. Dates used by the datepicker are Javascript Date objects, using [date-fns](https://date-fns.org/v2.30.0/docs/format) for formatting, so you can use any date format supported by the library. Default is 'dd-MMM-yy (sample date - 07-Jun-23) |
| initialValue | SearchDateRangeAdvanced | Initial value for the component                                                                                                                                                                                                                            |

### Events

| Name                | Type                                                                                           | Description                                                                                                                                    |
|---------------------|------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| updatedQuery        | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>`                           | Emitted whenever a change is made in the component values. Emits the updated query based on the change made.                                   |
| updatedDisplayValue | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<{ [key: string]: string }>`        | Emitted whenever a change is made in the component values. Emits the displayLabel based on the changes made                                    |
| changed             | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Partial<SearchDateRangeAdvanced>>` | Emitted whenever a change is made in the component values. Emits the changes being made in the component.                                      |
| valid               | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>`                          | Emitted whenever a change is made in the component values. Emits a flag indicating whether the current state of the component is valid or not. |
