---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# Task Filters component

Shows all available filters.

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Filtering APS task filters](#filtering-aps-task-filters)
    -   [How to create an accordion menu with the task filter](#how-to-create-an-accordion-menu-with-the-task-filter)
-   [See also](#see-also)

## Basic Usage

```html
<adf-task-filters></adf-task-filters>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appId | `number` |  | Display filters available to the current user for the application with the specified ID. |
| appName | `string` |  | Display filters available to the current user for the application with the specified name. |
| filterParam | [`FilterParamsModel`](../../lib/process-services/task-list/models/filter.model.ts) |  | Parameters to use for the task filter. If there is no match then the default filter (the first one the list) is selected. |
| showIcon | `boolean` |  | Toggles display of the filter's icon. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs during loading. |
| filterClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FilterRepresentationModel`](../../lib/process-services/task-list/models/filter.model.ts)`>` | Emitted when a filter in the list is clicked. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the list is loaded. |

## Details

### Filtering APS task filters

Use the `filterParam` property to restrict the range of filters that are shown:

```html
<adf-task-filters 
   [filterParam]="{name:'My tasks'}">
</adf-task-filters>
```

You can use properties from [`FilterParamsModel`](../../lib/process-services/task-list/models/filter.model.ts)
as the value of `filterParam` as shown in the table below:

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | The id of the task filter |
| name | string | The name of the task filter, lowercase is checked |
| index | string | The zero-based position of the filter in the array. |

### How to create an accordion menu with the task filter

The task filter often works well as an item in an accordion menu. See the
[Accordion component](../core/accordion.component.md)
page for an example of how to set this up.

## See also

-   [Filter model](filter.model.md)
