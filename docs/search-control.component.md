---
Added: v2.0.0
Status: Active
---
# Search control component

Displays a input text which shows find-as-you-type suggestions.

![adf-search-control](docassets/images/search-control-component.png)

## Basic usage

```html
<adf-search-control 
    [highlight]="true"
    (optionClicked)="onItemClicked($event)"
    (submit)="onSearchSubmit($event)">
</adf-search-control>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| expandable | `boolean` | `true` | Toggles whether to use an expanding search control. If false then a regular input is used. |
| highlight | `boolean` | `false` | Toggles highlighting of the search term in the results.  |
| inputType | `string` | `'text'` | Type of the input field to render, e.g. "search" or "text" (default).  |
| autocomplete | `boolean` | `false` | Toggles auto-completion of the search input field.  |
| liveSearchEnabled | `boolean` | `true` | Toggles "find-as-you-type" suggestions for possible matches.  |
| liveSearchMaxResults | `number` | `5` | Maximum number of results to show in the live search.  |
| customQueryBody | `QueryBody` |  |  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| submit | `EventEmitter<any>` | Emitted when the search is submitted pressing ENTER button. The search term is provided as value of the event. |
| searchChange | `EventEmitter<string>` | Emitted when the search term is changed. The search term is provided in the 'value' property of the returned object.  If the term is less than three characters in length then the term is truncated to an empty string. |
| optionClicked | `EventEmitter<any>` | Emitted when a file item from the list of "find-as-you-type" results is selected. |

## Details

```html
<adf-search-control 
    [highlight]="true"
    (optionClicked)="onItemClicked($event)"
    (submit)="onSearchSubmit($event)">
</adf-search-control>
```

Example of a component that uses the search control. In this example the search term is simply logged to the console
but instead the component could emit an event to be consumed upstream, or it could trigger a change inside a search
results component embedded inside the same component.

## Customizable template for no result
It is possible to customize with your own template what to show when no result are found for the search.

```html
<adf-search-control [highlight]="true"
                    (optionClicked)="onItemClicked($event)"
                    (submit)="onSearchSubmit($event)">
    <adf-empty-search-result>
        <!-- YOUR CUSTOM TEMPLATE HERE -->
        <span>YOUR CUSTOM MESSAGE</span>
    </adf-empty-search-result>
</adf-search-control>
```
All you need to add is the `adf-empty-search-result` tag in the `adf-search-control` and then put inside the template you want to render when no results are found.