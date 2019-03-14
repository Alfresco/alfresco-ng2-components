---
Title: Edit Task Filter Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-30
---

# [Edit Task Filter Cloud component](../../../lib/process-services-cloud/src/lib/task/task-filters/components/edit-task-filter-cloud.component.ts "Defined in edit-task-filter-cloud.component.ts")

Edits Task Filter Details.

![edit-task-filter-cloud](../../docassets/images/edit-task-filter-cloud.component.png)

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Editing APS2 task filters](#editing-aps2-task-filters)
    -   [Filter properties](#filter-properties)
-   [See also](#see-also)

## Basic Usage

```html
<adf-cloud-edit-task-filter
    [id]="taskFilterId"
    [appName]="appName"
    [filterProperties]="filterProperties"
    (filterChange)="onFilterChange($event)"
    (action)="onAction($event)">
</adf-cloud-edit-task-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | (required) Name of the app. |
| filterProperties | `string[]` |  | List of task filter properties to display. |
| id | `string` |  | (required) ID of the task filter. |
| showFilterActions | `boolean` | true | Toggles the filter actions. |
| showTitle | `boolean` | true | Toggles the title. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FilterActionType`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a filter action occurs (i.e Save, Save As, Delete). |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a task filter property changes. |

## Details

### Editing APS2 task filters

Use the `appName` and `id` properties to choose which task filter to edit:

```html
<adf-cloud-edit-task-filter
    [id]="taskFilterId"
    [appName]="appName">
</adf-cloud-edit-task-filter>
```

### Filter properties

You can supply various _filter properties_ to edit that will determine
which tasks are found by a filter. The full set of properties is
given below:

| Name | Description |
| ---- | ----------- |
| **_appName_** | Name of the app |
| **_state_** | Execution state of the task. |
| **_assignment_** | User the task is assigned to |
| **_taskName_** | Name of the task |
| **_parentTaskId_** | ID of the task's parent task |
| **_priority_** | Task priority |
| **_standAlone_** | Standalone status of the task |
| **_owner_** | User ID of the task's owner |
| **_processDefinitionId_** | Process definition ID |
| **_processDefinitionKey_** | Process definition key |
| **_processInstanceId_** | Process instance ID |
| **_lastModifiedFrom_** | Finds tasks modified _after_ this date |
| **_lastModifiedTo_** | Finds tasks modified _before_ this date |
| **_sort_** | Field on which the filter results will be sorted (doesn't participate in the filtering itself). Can be "id", "name", "createdDate", "priority", "processDefinitionId". |
| **_order_** | Sort ordering of the filter results it can be ASC or DESC (doesn't participate in the filtering itself). |

By default, the **_state_**, **_assignment_**, **_sort_** and **_order_** properties
are displayed in the editor. However, you can also choose which properties
to show using the `filterProperties` array. For example, the code below initializes
the editor with the **_appName_**, **_processInstanceId_**, **_startDate_** and
**_lastModifiedTo_** properties:

```ts
import { UserProcessModel } from '@alfresco/adf-core';

export class SomeComponent implements OnInit {

    filterProperties: string[] = [
        "appName",
        "processInstanceId",
        "startDate",
        "lastModifiedTo"];

    onFilterChange(filter: TaskFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: FilterActionType) {
        console.log('Clicked action: ', $event);
    }
```

With this configuration, only the four listed properties will be shown.

**Note:** Currently, the `sort` property has a limited set of properties
to choose from: **_id_**, **_name_**, **_status_** and **_startDate_**.

## See also

-   [Edit process filter cloud component](edit-process-filter-cloud.component.md)
