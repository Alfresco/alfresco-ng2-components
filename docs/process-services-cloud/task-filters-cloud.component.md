---
Title: Task Filters Cloud component
Added: v3.0.0
Status: Active
Last reviewed: 2018-20-11
---

# Task Filters Cloud component

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
| filterParam | [`FilterParamsModel`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts) |  | Parameters to use for the task filter cloud. If there is no match then the default filter (the first one the list) is selected. |
| showIcon | `boolean` |  | Toggles display of the filter's icon. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs during loading. |
| filterClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterCloudRepresentationModel`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts)`>` | Emitted when a filter in the list is clicked. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the list is loaded. |

## Details

### Filtering APS2 task filters

Use the `filterParam` property to restrict the range of filters that are shown:

```html
<adf-cloud-task-filters
   [filterParam]="{name:'My tasks'}">
</adf-cloud-task-filters>
```

You can use properties from [`FilterParamsModel`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts)
as the value of `filterParam` as shown in the table below:

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | The id of the task filter |
| name | string | The name of the task filter, lowercase is checked |
| key | string | The key of the task filter |
| index | string | The zero-based position of the filter in the array. |

### How to create an accordion menu with the task filter cloud

The task filter cloud often works well as an item in an accordion menu. See the
[Material Accordion component]((https://material.angular.io/components/expansion/overview#accordion))
