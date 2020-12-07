---
Title: Task Filters component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-16
---

# [Task Filters component](../../../lib/process-services/src/lib/task-list/components/task-filters.component.ts "Defined in task-filters.component.ts")

Shows all available filters.

## Basic Usage

```html
<adf-task-filters></adf-task-filters>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| appId | `number` |  | Display filters available to the current user for the application with the specified ID. |
| appName | `string` |  | Display filters available to the current user for the application with the specified name. |
| filterParam | [`FilterParamsModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts) |  | Parameters to use for the task filter. If there is no match then the default filter (the first one the list) is selected. |
| showIcon | `boolean` |  | Toggles display of the filter's icon. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs during loading. |
| filterClicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)`>` | Emitted when a filter is being clicked from the UI. |
| filterSelected | `EventEmitter<FilterRepresentationModel>` | Emitted when a filter is being selected based on the filterParam input. |
| success | `EventEmitter<any>` | Emitted when the list is loaded. |

## Details

### Filtering APS task filters

Use the `filterParam` property to restrict the range of filters that are shown:

```html
<adf-task-filters 
   [filterParam]="{name:'My tasks'}">
</adf-task-filters>
```

You can use properties from [`FilterParamsModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)
as the value of `filterParam` as shown in the table below:

| Name  | Type   | Description                                         |
| ----- | ------ | --------------------------------------------------- |
| id    | string | The id of the task filter                           |
| name  | string | The name of the task filter, lowercase is checked   |
| index | string | The zero-based position of the filter in the array. |
