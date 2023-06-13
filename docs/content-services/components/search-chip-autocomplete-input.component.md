---
Title: Search Chip Autocomplete Input component
Added: v6.1.0
Status: Active
Last reviewed: 2023-06-13
---

# [Search Chip Autocomplete Input component](../../../lib/content-services/src/lib/search/components/search-chip-autocomplete-input/search-chip-autocomplete-input.component.ts "Defined in search-chip-autocomplete-input.component.ts")

Represents an input with autocomplete options.

![Search Chip Autocomplete Input](../../docassets/images/search-chip-autocomplete-input.png)

## Basic usage

```html
<adf-search-chip-autocomplete-input
    [autocompleteOptions]="allOptions"
    [onReset$]="onResetObservable$"
    [allowOnlyPredefinedValues]="allowOnlyPredefinedValues"
    (optionsChanged)="onOptionsChange($event)">
</adf-search-chip-autocomplete-input>
```

### Properties

| Name                      | Type                     | Default value | Description                                                                                   |
|---------------------------|--------------------------|----|-----------------------------------------------------------------------------------------------|
| autocompleteOptions       | `string[]` | [] | Options for autocomplete                                                                      |
| onReset$                  | [`Observable`](https://rxjs.dev/guide/observable)`<void>` |    | Observable that will listen to any reset event causing component to clear the chips and input |
| allowOnlyPredefinedValues | boolean | true | A flag that indicates whether it is possible to add a value not from the predefined ones      |

### Events

| Name | Type | Description                                   |
| ---- | ---- |-----------------------------------------------|
| optionsChanged | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string[]>` | Emitted when the selected options are changed |

## See also

-   [Search Configuration Guide](../../user-guide/search-configuration-guide.md)
-   [Search Query Builder service](../services/search-query-builder.service.md)
-   [Search Widget Interface](../interfaces/search-widget.interface.md)
-   [Search Filter Autocomplete Chips component](search-filter-autocomplete-chips.component.md)
-   [Search Logical Filter component](search-logical-filter.component.md)
-   [Search check list component](search-check-list.component.md)
-   [Search date range component](search-date-range.component.md)
-   [Search number range component](search-number-range.component.md)
-   [Search radio component](search-radio.component.md)
-   [Search slider component](search-slider.component.md)
-   [Search text component](search-text.component.md)
-   [Search Chip Input component](search-chip-input.component.md)
