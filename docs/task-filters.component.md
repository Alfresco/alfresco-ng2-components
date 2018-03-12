---
Added: v2.0.0
Status: Active
---
# Task Filters component

Shows all available filters.

## Basic Usage

```html
<adf-filters></adf-filters>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| filterParam | `FilterParamsModel` |  | Parameters to use for the task filter. If there is no match then the default filter (the first one the list) is selected. |
| appId | `number` |  | Display filters available to the current user for the application with the specified ID.  |
| appName | `string` |  | Display filters available to the current user for the application with the specified name.  |
| hasIcon | `boolean` | `true` | Toggles display of the filter's icon.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterClick | `EventEmitter<FilterRepresentationModel>` | Emitted when a filter in the list is clicked. |
| success | `EventEmitter<any>` | Emitted when the list is loaded. |
| error | `EventEmitter<any>` | Emitted when an error occurs during loading. |

## Details

### How filter the activiti task filters

```html
<adf-filters 
   [filterParam]="{name:'My tasks'}">
</adf-filters>
```

You can use inside the filterParam one of the properties from [FilterParamsModel](#filterparamsmodel) (see below).

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

The task filter often works well as an item in an accordion menu. See the [Accordion component](core/accordion.component.md)
page for an example of how to do set this up.

## See also

-   [Filter model](filter.model.md)
