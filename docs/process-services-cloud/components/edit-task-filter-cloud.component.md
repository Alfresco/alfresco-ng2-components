---
Title: Edit Task Filter Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-03-27
---

# [Edit Task Filter Cloud component](../../../lib/process-services-cloud/src/lib/task/task-filters/components/edit-task-filters/edit-task-filter-cloud.component.ts "Defined in edit-task-filter-cloud.component.ts")

Edits task filter details.

![edit-task-filter-cloud](../../docassets/images/edit-task-filter-cloud.component.png)

## Contents

*   [Basic Usage](#basic-usage)
*   [Class members](#class-members)
    *   [Properties](#properties)
    *   [Events](#events)
*   [Details](#details)
    *   [Editing APS2 task filters](#editing-aps2-task-filters)
    *   [Filter properties](#filter-properties)
    *   [Sort properties](#sort-properties)
    *   [Action properties](#action-properties)
*   [Saving custom filters](#saving-custom-filters)
*   [See also](#see-also)

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
| --- | --- | --- | --- |
| actions | `string[]` |  | List of task filter actions. |
| appName | `string` | "" | (required) Name of the app. |
| filterProperties | `string[]` | \[] | List of task filter properties to display. |
| id | `string` |  | (required) ID of the task filter. |
| role | `string` | "" | user role. |
| showFilterActions | `boolean` | true | Toggles the filter actions. |
| showTaskFilterName | `boolean` | true | Toggles display of task filter name |
| showTitle | `boolean` | true | Toggles the title. |
| sortProperties | `string[]` | \[] | List of sort properties to display. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterAction`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a filter action occurs (i.e Save, Save As, Delete). |
| filterChange | `EventEmitter<>` | Emitted when a task filter property changes. |

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

You can supply various *filter properties* to edit that will determine
which tasks are found by a filter. The full set of properties is
given below:

| Name                      | Description                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ***appName***             | Name of the app                                                                                                                                                        |
| ***status***              | Execution state of the task.                                                                                                                                           |
| ***assignee***            | [`User`](../../../lib/core/pipes/user-initial.pipe.ts) the task is assigned to                                                                                         |
| ***taskName***            | Name of the task                                                                                                                                                       |
| ***taskId***              | ID of the task                                                                                                                                                         |
| ***parentTaskId***        | ID of the task's parent task                                                                                                                                           |
| ***priority***            | Task priority                                                                                                                                                          |
| ***createdDate***         | Date the task was created                                                                                                                                              |
| ***standalone***          | Standalone status of the task                                                                                                                                          |
| ***owner***               | [`User`](../../../lib/core/pipes/user-initial.pipe.ts) ID of the task's owner                                                                                          |
| ***processDefinitionId*** | Process definition ID                                                                                                                                                  |
| ***processInstanceId***   | Process instance ID                                                                                                                                                    |
| ***lastModified***        | Date the task was last modified. If lastModified defined the component will show the range ***lastModifiedFrom***, ***lastModifiedTo***                                |
| ***sort***                | Field on which the filter results will be sorted (doesn't participate in the filtering itself). Can be "id", "name", "createdDate", "priority", "processDefinitionId". |
| ***order***               | Sort ordering of the filter results it can be ASC or DESC (doesn't participate in the filtering itself).                                                               |

By default, the ***status***, ***assignee***, ***sort*** and ***order*** properties
are displayed in the editor. However, you can also choose which properties
to show using the `filterProperties` array. For example, the code below initializes
the editor with the ***appName***, ***processInstanceId***, ***createdDate*** and
***lastModified*** properties:

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

You can supply a list of *sort properties* to sort the tasks. You can use
any of the [filter properties](#filter-properties) listed above as
sort properties and you can also use the task ***id*** property and
use ***name*** as a shorthand for ***taskName***.

By default, the ***id***,  ***name***, ***createdDate*** and ***priority*** properties are
displayed in the editor. However, you can also choose which sort properties
to show using the `sortProperties` array.
For example, the code below initializes the editor with the ***createdDate*** , ***lastModified*** and ***priority*** properties:

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

| Name         | Description                |
| ------------ | -------------------------- |
| ***save***   | Save task filter.          |
| ***saveAs*** | Creates a new task filter. |
| ***delete*** | Delete task filter.        |

By default, the ***save***, ***saveAs*** and ***delete*** actions are
displayed in the editor. However, you can also choose which actions to
show using the `actions` array.
For example, the code below initializes the editor with the ***save*** and ***delete*** actions:

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

*   An Activiti 7 community version stores saved filters in the local browser storage. This restricts a user's custom filters to that single session.

*   An Activiti Enterprise version uses the preference service to store saved filters. This allows for user's custom filters to be available between sessions and between devices.

## See also

*   [Edit process filter cloud component](edit-process-filter-cloud.component.md)
*   [Task filters Cloud Service](../services/task-filter-cloud.service.md)
*   [Local preference Cloud Service](../services/local-preference-cloud.service.md)
*   [User preference Cloud Service](../services/user-preference-cloud.service.md)
