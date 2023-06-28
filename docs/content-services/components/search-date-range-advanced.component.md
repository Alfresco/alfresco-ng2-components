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

## Details

This component lets the user choose a variety of options to apply date related filters through on the particular field.
Currently, 3 different kinds of date filters are supported

- Anytime - No date filters are applied on the `field`. This option is selected by default
- In the last - Allows to user to apply a filter to only show results from the last 'n' unit of time. User can set the
  number as well as the unit of time on the filter. Currently, 3 units are supported - Days, Weeks, and Months.
    - The search query created while using this option has the following format
      `<field>:[NOW/DAY-n<unit> TO NOW/DAY+1DAY]`
    - For e.g., a search query for fetching results created in the last 4 weeks would be
      `cm:created:[NOW/DAY-4WEEKS TO NOW/DAY+1DAY]`
- Between - Allows the user to select a range of dates to filter the search results.
    - The search query created while using this options has the following format
      `<field>:[<from_date> TO <to_date>]`
    - For e.g., a search query for fetching the results created between 6 June, 2023 to 10 June, 2023 would be -
      `cm:created:['2023-06-06T00:00:00+05:30' TO '2023-06-10T23:59:59+05:30']`
