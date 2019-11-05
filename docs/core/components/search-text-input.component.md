---
Title: Search Text Input Component
Added: v3.6.0
Status: Active
Last reviewed: 2019-11-06
---

# [Search Text Input Component](../../../lib/core/search-text/search-text-input.component.ts "Defined in search-text-input.component.ts")

Displays a input text that supports autocompletion

## Basic Usage

```html
<adf-search-text-input
    [expandable]="expandable"
    [autocomplete]="autocomplete"
    [liveSearchEnabled]="liveSearchEnabled"
    (searchChange)="onSearchChanged($event)">
</adf-search-text-input>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| autocomplete | `boolean` | false | Toggles auto-completion of the search input field. |
| expandable | `boolean` | true | Toggles whether to use an expanding search control. If false then a regular input is used. |
| highlight | `boolean` | false | Toggles highlighting of the search term in the results. |
| inputType | `string` | "text" | Type of the input field to render, e.g. "search" or "text" (default). |
| liveSearchEnabled | `boolean` | true | Toggles "find-as-you-type" suggestions for possible matches. |
| searchAutocomplete | [`SearchTriggerDirective`](../../../lib/core/search-text/search-trigger.directive.ts) | null | Trigger autocomplete results on input change |
| searchTerm | `string` | empty | Preselected search widget value |
| debounceTime | `number` | 0 | Debounce time in miliseconds |
| focusListener | [`Observable`](http://reactivex.io/documentation/observable.html) `<` [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) `>` | null | Listener for results-list events (focus, blur and focusout) |
| defaultState | [`SearchTextStateEnum`](../../../lib/core/models/search-text-input.model.ts) | collapsed | Default state of the search widget |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| searchChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when search widget value is changed. |
| submit | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when search widget is submited. |
| selectResult | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the result list is selected |
| reset | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the search widget is reseted |
| reset | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the search widget is reseted |