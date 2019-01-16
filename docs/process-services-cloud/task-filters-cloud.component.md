---
Title: Task Filters Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-08
---

# [Task Filters Cloud component](../../lib/process-services-cloud/src/lib/task/task-filters/components/task-filters-cloud.component.ts "Defined in task-filters-cloud.component.ts")

Shows all available filters.

## Basic Usage

```html
<adf-cloud-task-filters></adf-cloud-task-filters>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | Display filters available to the current user for the application with the specified name. |
| filterParam | [`FilterParamsModel`](../../lib/process-services/task-list/models/filter.model.ts) |  | Parameters to use for the task filter cloud. If there is no match then the default filter (the first one in the list) is selected. |
| showIcons | `boolean` | false | Toggles display of the filter's icons. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs during loading. |
| filterClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a filter in the list is clicked. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the list is loaded. |

## Details

### Filtering APS2 task filters

Use the `filterParam` property to restrict the range of filters that are shown:

```html
<adf-cloud-task-filters
   [filterParam]="{name:'My tasks'}">
</adf-cloud-task-filters>
```

You can use properties from [`FilterParamsModel`](../../lib/process-services/task-list/models/filter.model.ts)
as the value of `filterParam` as shown in the table below:

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | The id of the task filter |
| name | string | The name of the task filter, lowercase is checked |
| key | string | The key of the task filter |
| index | string | The zero-based position of the filter in the array. |
