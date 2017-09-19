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
| onSuccess | Raised when the list is loaded  |
| onError | Raised if there is an error during the loading  |

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

You can create an accordion menu using the AccordionComponent that wrap the activiti task filter.
The AccordionComponent is exposed by the alfresco-core.

```html
<adf-accordion>
    <adf-accordion-group [heading]="'Tasks'" [isSelected]="true" [headingIcon]="'assignment'">
        <adf-filters
            [appId]="appId"
            [hasIcon]="false"
            (filterClick)="onTaskFilterClick($event)"
            (onSuccess)="onSuccessTaskFilterList($event)"
            #activitifilter>
        </adf-filters>
    </adf-accordion-group>
</adf-accordion>
```

![how-create-accordion-menu](../docassets/images/how-to-create-accordion-menu.png)
