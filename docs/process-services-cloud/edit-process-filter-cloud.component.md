---
Title: Edit Process Filter Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-08
---

# [Edit Process Filter Cloud component](../../lib/process-services-cloud/src/lib/process/process-filters/components/edit-process-filter-cloud.component.ts "Defined in edit-process-filter-cloud.component.ts")

Shows Process Filter Details.

## Basic Usage

```html
<adf-cloud-edit-process-filter 
    [id]="processFilterId"
    [appName]="applicationName">
</adf-cloud-edit-process-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | (required) The name of the application. |
| id | `string` |  | (required) Id of the process instance filter. |
| filterProperties | `string []` | `['state', 'sort', 'order']` | List of process filter properties to display. |
| showFilterActions | `boolean` | `true` | Toggles edit process filter actions. |
| showTitle | `boolean` | `true` | Toggles edit process filter title. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterActionType`](../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when an filter action occurs i.e Save, SaveAs, Delete. |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterCloudModel`](../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when an process instance filter property changes. |

## Details

### Editing APS2 process filter

Use the `appName` and `id` properties to choose which process filter to edit:

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName">
</adf-cloud-edit-process-filter>
```

### Filter properties

You can supply various *filter properties* to choose which processes
will be found by a filter. The full set of properties is given below:

| Name | Description |
| -- | -- |
| **_appName_** | Name of the app |
| **_initiator_** | ID of the user who initiated the process |
| **_state_** | Execution state of the process. |
| **_sort_** | Field on which the filter results will be sorted (doesn't participate in the filtering itself) |
| **_order_** | Sort ordering of the filter results (this doesn't participate in the filtering itself) |
| **_processDefinitionId_** | Process definition ID |
| **_processDefinitionKey_** | Process definition key |
| **_processInstanceId_** | Process instance ID |
| **_startDate_** | Date the process was started |
| **_lastModified_** | Date the process was last modified |
| **_lastModifiedFrom_** | Finds processes modified *after* this date |
| **_lastModifiedTo_** | Finds processes modified *before* this date |

By default, the **_state_**, **_sort_** and **_order_** properties are
displayed in the editor. However, you can also choose which properties
to show using the `filterProperties` array.
For example, the code below initializes the editor with the **_appName_**,
**_processInstanceId_**, **_startDate_** and **_lastModified_** properties:

```ts
import { UserProcessModel } from '@alfresco/adf-core';

export class SomeComponent implements OnInit {

    filterProperties: string[] = [
        "appName",
        "processInstanceId",
        "startDate",
        "lastModified"];

    onFilterChange(filter: ProcessFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: ProcessFilterActionType) {
        console.log('Clicked action: ', $event);
    }
```

With this configuration, only the four listed properties will be shown.

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName"
    [filterProperties]="filterProperties"
    (filterChange)="onFilterChange($event)"
    (action)="onAction($event)">
</adf-cloud-edit-process-filter>
```

![edit-process-filter-cloud](../docassets/images/edit-process-filter-cloud.component.png)
