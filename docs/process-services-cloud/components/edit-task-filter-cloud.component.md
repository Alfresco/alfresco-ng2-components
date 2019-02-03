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
| filterProperties | `string []` | `['status', 'assignee', 'sort', 'order']` | List of task filter properties to display. |
| id | `string` |  | (required) ID of the task filter. |
| showFilterActions | `boolean` | true | Toggles the filter actions. |
| showTitle | `boolean` | true | Toggles the title. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterAction`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a filter action occurs (i.e Save, Save As, Delete). |
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
| **_createdDate_** | Date the task was created |
| **_standAlone_** | Standalone status of the task |
| **_owner_** | User ID of the task's owner |
| **_processDefinitionId_** | Process definition ID |
| **_processDefinitionKey_** | Process definition key |
| **_processInstanceId_** | Process instance ID |
| **_lastModified_** | Date the task was last modified. If lastModified defined the component will show the range **_lastModifiedFrom_**, **_lastModifiedTo_**|
| **_sort_** | Field on which the filter results will be sorted (doesn't participate in the filtering itself). Can be "id", "name", "createdDate", "priority", "processDefinitionId". |
| **_order_** | Sort ordering of the filter results it can be ASC or DESC (doesn't participate in the filtering itself). |


By default, the **_status_**, **_assignee_**, **_sort_** and **_order_** properties
are displayed in the editor. However, you can also choose which properties
to show using the `filterProperties` array. For example, the code below initializes
the editor with the **_appName_**, **_processInstanceId_**, **_createdDate_** and
**_lastModified_** properties:

```ts
import { UserProcessModel } from '@alfresco/adf-core';

export class SomeComponent implements OnInit {

    filterProperties: string[] = [
        "appName",
        "processInstanceId",
        "createdDate",
        "lastModified"];

    onFilterChange(filter: TaskFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: TaskFilterAction) {
        console.log('Clicked action: ', $event);
    }
```

With this configuration, only the four listed properties will be shown.

### Sort properties

You can supply various *sort properties* to sort the tasks.

By default, the **_id_**,  **_name_**, **_createdDate_** and **_priority_** properties are
displayed in the editor. However, you can also choose which sort properties
to show using the `sortProperties` array.
For example, the code below initializes the editor with the **_createdDate_** , **_lastModified_** and **_priority_** properties:

```ts

export class SomeComponent implements OnInit {

    sortProperties: string[] = [
        "createdDate",
        "lastModified",
        "priority"];

    onFilterChange(filter: TaskFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: TaskFilterAction) {
        console.log('Clicked action: ', $event);
    }
```
```html
<adf-cloud-edit-task-filter
    [id]="taskFilterId"
    [appName]="applicationName"
    [sortProperties]="sortProperties">
</adf-cloud-edit-task-filter>
```
With this configuration, only the three listed sort properties will be shown.

### Action properties

You can supply various *actions* to apply on task filter.

| Name | Description |
| -- | -- |
| **_save_** | Save task filter. |
| **_saveAs_** | Creates a new task filter. |
| **_delete_** | Delete task filter. |


By default, the **_save_**, **_saveAs_** and **_delete_** actions are
displayed in the editor. However, you can also choose which actions to
show using the `actions` array.
For example, the code below initializes the editor with the **_save_** and **_delete_** actions:

```ts

export class SomeComponent implements OnInit {

    actions: string[] = ['save', 'delete'];

    onFilterChange(filter: TaskFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: TaskFilterAction) {
        console.log('Clicked action: ', $event);
    }
```

```html
<adf-cloud-edit-task-filter
    [id]="taskFilterId"
    [appName]="applicationName"
    [actions]="actions">
</adf-cloud-edit-task-filter>
```

With this configuration, only the two actions will be shown.

## See also

-   [Edit process filter cloud component](edit-process-filter-cloud.component.md)
