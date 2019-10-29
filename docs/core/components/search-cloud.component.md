---
Title: Search Cloud Component
Added: v3.5.0
Status: Active
Last reviewed: 2019-10-24
---

# [Search Cloud Component](../../../lib/core/search-cloud/search-cloud.component.ts "Defined in pagination.component.ts")

Should manage search for cloud components

## Basic Usage

```html
<adf-search-cloud>
    [type]="'text'"
    [placeholder]="'placeholder'"
    [debounceTime]="200"
    [expandable]='false'
    (change)="onSearchValueChanged($event)"
</adf-search-cloud>
```

## Class members

### Properties 

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| type | [`SearchCloudTypesEnum`](../../../lib/core/models/search-cloud.model.ts) |  | search type ('text'). |
| value | `string` |  | preselected input value |
| expandable | `boolean` | false | The field should expand on click when this flag is true |
| placeholder | `string` |  | placeholder content. |
| debounceTime | `number` | 500 | Time in miliseconds for debounce the event. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| change | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when search widget value is changed. |
