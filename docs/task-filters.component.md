# Activiti Filter component

Shows all available filters.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)
  * [How filter the activiti task filters](#how-filter-the-activiti-task-filters)
  * [FilterParamsModel](#filterparamsmodel)
  * [How to create an accordion menu with the task filter](#how-to-create-an-accordion-menu-with-the-task-filter)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-filters></adf-filters>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| filterParam | [FilterParamsModel](#filterparamsmodel) | The params to filter the task filter. If there is no match the default one (first filter of the list) is selected |
| appId | string | Display filters available to the current user for the application with the specified ID. |
| `appName` | string | Display filters available to the current user for the application with the specified name. |
| `hasIcon` | boolean | Toggle to show or not the filter's icon. |

If both `appId` and `appName` are specified then `appName` will take precedence and `appId` will be ignored.

### Events

| Name | Description |
| --- | --- |
| filterClick | Raised when the filter in the list is clicked  |
| success | Raised when the list is loaded  |
| error | Raised if there is an error during the loading  |

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
| --- | --- | --- |
| id | string | The id of the task filter |
| name | string | The name of the task filter, lowercase is checked |
| index | string | The zero-based position of the filter in the array. |

### How to create an accordion menu with the task filter

The task filter often works well as an item in an accordion menu. See the [Accordion component](accordion.component.md)
page for an example of how to do set this up.
