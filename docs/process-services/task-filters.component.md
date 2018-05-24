---
Added: v2.0.0
Status: Active
---

# Task Filters component

Shows all available filters.

## Contents

-   [Basic Usage](#basic-usage)

-   [Class members](#class-members)

    -   [Properties](#properties)
    -   [Events](#events)

-   [Details](#details)

    -   [How filter the activiti task filters](#how-filter-the-activiti-task-filters)
    -   [FilterParamsModel](#filterparamsmodel)
    -   [How to create an accordion menu with the task filter](#how-to-create-an-accordion-menu-with-the-task-filter)

-   [See also](#see-also)

## Basic Usage

```html
<adf-task-filters></adf-task-filters>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| appId | `number` |  | Display filters available to the current user for the application with the specified ID. |
| appName | `string` |  | Display filters available to the current user for the application with the specified name. |
| filterParam | [`FilterParamsModel`](../../lib/process-services/task-list/models/filter.model.ts) |  | Parameters to use for the task filter. If there is no match then the default filter (the first one the list) is selected. |
| hasIcon | `boolean` | true | Toggles display of the filter's icon. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| error | `EventEmitter<any>` | Emitted when an error occurs during loading. |
| filterClick | [`EventEmitter<FilterRepresentationModel>`](../../lib/process-services/task-list/models/filter.model.ts) | Emitted when a filter in the list is clicked. |
| success | `EventEmitter<any>` | Emitted when the list is loaded. |

## Details

### How filter the activiti task filters

```html
<adf-task-filters 
   [filterParam]="{name:'My tasks'}">
</adf-task-filters>
```

You can use inside the filterParam one of the properties from [`FilterParamsModel`](../../lib/process-services/task-list/models/filter.model.ts) (see below).

### FilterParamsModel

```json
{
    "id": "number",
    "name": "string",
    "index": "number"
}
```

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | The id of the task filter |
| name | string | The name of the task filter, lowercase is checked |
| index | string | The zero-based position of the filter in the array. |

### How to create an accordion menu with the task filter

The task filter often works well as an item in an accordion menu. See the [Accordion component](../core/accordion.component.md)
page for an example of how to do set this up.

## See also

-   [Filter model](filter.model.md)
