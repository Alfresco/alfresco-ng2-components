---
Title: Edit Task Filter Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2023-04-03
---

# [Edit Task Filter Cloud component](../../../lib/process-services-cloud/src/lib/task/task-filters/components/edit-task-filters/edit-task-filter-cloud.component.ts "Defined in edit-task-filter-cloud.component.ts")

Edits task filter details.

![edit-task-filter-cloud](../../docassets/images/edit-task-filter-cloud.component.png)

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Editing APS2 task filters](#editing-aps2-task-filters)
    -   [Filter properties](#filter-properties)
    -   [Sort properties](#sort-properties)
    -   [Action properties](#action-properties)
-   [Saving custom filters](#saving-custom-filters)
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
| actions | `string[]` |  | List of task filter actions. |
| appName | `string` | "" | (required) Name of the app. |
| environmentList | [`Environment`](../../../lib/process-services-cloud/src/lib/common/interface/environment.interface.ts)`[]` | \[] | List of environments. |
| filterProperties | `string[]` | \[] | List of task filter properties to display. |
| id | `string` |  | (required) ID of the task filter. |
| processInstanceId | `string` |  | processInstanceId of the task filter. |
| role | `string` | "" | user role. |
| showFilterActions | `boolean` | true | Toggles the filter actions. |
| showTaskFilterName | `boolean` | true | Toggles display of task filter name |
| showTitle | `boolean` | true | Toggles the title. |
| sortProperties | `string[]` | \[] | List of sort properties to display. |
| taskFilter | [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts) |  | Task Filter to use. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterAction`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a filter action occurs (i.e Save, Save As, Delete). |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<>` | Emitted when a task filter property changes. |

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
| **_status_** | Execution state of the task. |
| **_assignee_** | [`User`](lib/core/src/lib/pipes/user-initial.pipe.ts) the task is assigned to |
| **_taskName_** | Name of the task |
| **_taskId_** | ID of the task |
| **_parentTaskId_** | ID of the task's parent task |
| **_priority_** | Task priority |
| **_createdDate_** | Date the task was created |
| **_standalone_** | Standalone status of the task |
| **_owner_** | [`User`](lib/core/src/lib/pipes/user-initial.pipe.ts) ID of the task's owner |
| **_processDefinitionId_** | Process definition ID |
| **_processInstanceId_** | Process instance ID |
| **_lastModified_** | Date the task was last modified. If lastModified defined the component will show the range **_lastModifiedFrom_**, **_lastModifiedTo_** |
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

You can supply a list of _sort properties_ to sort the tasks. You can use
any of the [filter properties](#filter-properties) listed above as
sort properties and you can also use the task **_id_** property and
use **_name_** as a shorthand for **_taskName_**.

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

You can supply various _actions_ to apply on task filter.

| Name | Description |
| ---- | ----------- |
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

## Saving custom filters

Users can save a filter if they make any changes to it in an application using the **Save** icon. How it is saved is dictated by the Activiti version used:

-   An Activiti 7 community version stores saved filters in the local browser storage. This restricts a user's custom filters to that single session.

-   An Activiti Enterprise version uses the preference service to store saved filters. This allows for user's custom filters to be available between sessions and between devices.

## See also

-   [Edit process filter cloud component](edit-process-filter-cloud.component.md)
-   [Task filters Cloud Service](../services/task-filter-cloud.service.md)
-   [Local preference Cloud Service](../services/local-preference-cloud.service.md)
-   [User preference Cloud Service](../services/user-preference-cloud.service.md)
