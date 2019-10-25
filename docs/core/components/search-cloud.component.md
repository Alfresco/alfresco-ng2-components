---
Title: Search Cloud Component
Added: v3.5.0
Status: Active
Last reviewed: 2019-10-24
---

# [Serch Cloud Component](../../../lib/core/search-cloud/search-cloud.component.ts "Defined in pagination.component.ts")

Should manage search for cloud components

## Basic Usage

```html
<adf-search-cloud>
    [placeholder]="'placeholder'"
    [debounceTime]="200"
    (change)="onSearchValueChanged($event)"
</adf-search-cloud>
```

## Class members

### Properties 

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| type | [`SearchCloudTypesEnum`](../../../lib/core/models/search-cloud.model.ts) |  | search type ('text'). |
| placeholder | `string` |  | placeholder content. |
| debounceTime | `number` |  | Time in miliseconds for debounce the event. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| change | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when search widget value is changed. |
