---
Title: Search Text Input Component
Added: v3.6.0
Status: Active
Last reviewed: 2019-11-06
---

# [Search Text Input Component](../../../lib/core/search-text/search-text-input.component.ts "Defined in search-text-input.component.ts")

Displays a input text that supports autocompletion

![Text Widget](../../docassets/images/search-text-input.png)

## Basic Usage

```html
<adf-search-text-input
    [expandable]="true"
    [autocomplete]="autocomplete"
    [liveSearchEnabled]="liveSearchEnabled"
    (searchChange)="onSearchChanged($event)">
</adf-search-text-input>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| autocomplete | `boolean` | false | Toggles auto-completion of the search input field. |
| collapseOnSubmit | `boolean` | true | Collapse search bar on submit. |
| debounceTime | `number` | 0 | Debounce time in milliseconds. |
| defaultState | `SearchTextStateEnum` |  | Default state expanded or Collapsed. |
| expandable | `boolean` | true | Toggles whether to use an expanding search control. If false then a regular input is used. |
| focusListener | [`Observable`](http://reactivex.io/documentation/observable.html)`<FocusEvent>` |  | Listener for results-list events (focus, blur and focusout). |
| inputType | `string` | "text" | Type of the input field to render, e.g. "search" or "text" (default). |
| liveSearchEnabled | `boolean` | true | Toggles "find-as-you-type" suggestions for possible matches. |
| searchAutocomplete | `any` | false | Trigger autocomplete results on input change. |
| searchTerm | `string` | "" | Search term preselected |

### Events

| Name | Type | Description |
| --- | --- | --- |
| reset | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when the result list is reset |
| searchChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the search term is changed. The search term is provided in the 'value' property of the returned object.  If the term is less than three characters in length then it is truncated to an empty string. |
| selectResult | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the result list is selected |
| submit | `EventEmitter<any>` | Emitted when the search is submitted by pressing the ENTER key. The search term is provided as the value of the event. |
