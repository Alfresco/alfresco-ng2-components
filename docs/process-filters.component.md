# Process Filters Component

Collection of criteria used to filter process instances, which may be customized by users.

## Basic Usage

```html
<adf-process-instance-filters
    appId="1001">
</adf-process-instance-filters>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| filterParam | `FilterProcessRepresentationModel` |  | The parameters to filter the task filter. If there is no match then the default one (ie, the first filter in the list) is selected. |
| appId | `number` |  | Display filters available to the current user for the application with the specified ID.  |
| appName | `string` |  | Display filters available to the current user for the application with the specified name.  |
| showIcon | `boolean` | `true` | Toggle to show or hide the filter's icon.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterClick | `EventEmitter<ProcessInstanceFilterRepresentation>` | Emitted when the user selects a filter from the list. |
| success | `EventEmitter<ProcessInstanceFilterRepresentation[]>` | Emitted when the list of filters has been successfully loaded from the server. |
| error | `EventEmitter<any>` | Emitted when an error occurs. |

## Details

This component displays a list of available filters and allows the user to select any given
filter as the active filter.

The most common usage is in driving a process instance list to allow the user to choose which
process instances are displayed in the list.

If both `appId` and `appName` are specified then `appName` will take precedence and `appId` will be ignored.

### How filter the activiti process filters

```html
<adf-process-instance-filters 
   [filterParam]="{index: 0}">
</adf-filters>
```

You can use inside the filterParam one of the properties defined by [FilterParamsModel](#filterparamsmodel) (see below).

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
| id | string | The id of the task filter. |
| name | string | The name of the task filter, lowercase is checked. |
| index | number | Zero-based position of the filter in the array. |

### How to create an accordion menu with the processes filter

The process filter often works well as an item in an accordion menu. See the [Accordion component](accordion.component.md)
page for an example of how to do set this up.

## See also

-   [Filter model](filter.model.md)
