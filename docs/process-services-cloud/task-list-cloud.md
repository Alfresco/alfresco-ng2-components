---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
---

# Task List component

Renders a list containing all the tasks matched by the parameters specified.

## Contents

-   [Basic Usage](#basic-usage)
    -   [Transclusions](#transclusions)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Setting the column schema](#setting-the-column-schema)
    -   [Setting Sorting Order for the list](#setting-sorting-order-for-the-list)
    -   [Pagination strategy](#pagination-strategy)
    -   [DataTableAdapter example](#datatableadapter-example)
    -   [DataColumn Features](#datacolumn-features)
-   [See also](#see-also)

## Basic Usage

```html
<adf-cloud-task-list 
    [applicationName]="'APPLICATION-NAME'" >
</adf-cloud-task-list>
```

### [Transclusions](../user-guide/transclusion.md)

Any content inside an `<adf-empty-custom-content>` sub-component will be shown
when the task list is empty:

```html
<adf-cloud-task-list>
    <adf-empty-custom-content>
        Your Content
    </adf-empty-custom-content>
<adf-cloud-task-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| applicationName | `string` |  | The name of the application. |
| assignee | `string` |  | The assigee of the process. Possible values are: "assignee" (the current user is the assignee), candidate (the current user is a task candidate", "group_x" (the task is assigned to a group where the current user is a member, no value(the current user is involved). |
| createdDate | `Date` |  | filter the tasks for the date when the task should have been created |
| dueDate | `Date` |  | Filter the tasks. Display only tasks with dueDate equal to the one insterted. |
| id | `string` |  | Filter the tasks. Display only tasks with id equal to the one insterted. |
| name | `string` |  | Filter the tasks. Display only tasks with name equal to the one insterted. |
| parentTaskId | `string` |  | Filter the tasks. Display only tasks with parentTaskId equal to the one insterted. |
| processDefinitionId | `string` |  | Filter the tasks. Display only tasks with processDefinitionId equal to the one insterted. |
| processInstanceId | `string` |  | Filter the tasks. Display only tasks with processInstanceId equal to the one insterted. |
| status | `string` |  | Filter the tasks. Display only tasks with status equal to the one insterted. |
| processDefinitionId | `string` |  | Filter the tasks. Display only tasks with processDefinitionId equal to the one insterted. |
| landingTaskId | `string` |  | Define which task id should be selected after reloading. If the task id doesn't exist or nothing is passed then the first task will be selected. |
| selectFirstRow | `boolean` | true | Toggles default selection of the first row |
| selectionMode | `string` | "single" | Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode, you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows. |
| multiselect | `boolean` | false | Toggles multiple row selection, renders checkboxes at the beginning of each row |
| sorting | `TaskListCloudSortingModel` |  | This array of `TaskListCloudSortingModel` specify how the sorting on our table should be provided. This parameters are for BE sorting. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| rowClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when a task in the list is clicked |
| rowsSelected | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any[]>` | Emitted when rows are selected/unselected |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task list is loaded |

## Details

This component displays lists of tasks related to the application name insterted. Extra filtering can be provided by applying extra input parameters

### Setting the column schema

You can use an HTML-based schema declaration to set a column schema for the tasklist as shown below :

```html
<adf-cloud-task-list ...>
    <data-columns>
        <data-column key="name" title="NAME" class="full-width name-column"></data-column>
        <data-column key="created" title="Created" class="hidden"></data-column>
    </data-columns>
</adf-cloud-task-list>
```

You can also set a static custom schema declaration in `app.config.json` as shown below:

```json
"adf-cloud-task-list": {
        "presets": {
            "customSchema": [
            {
                    "key": "name",
                    "type": "text",
                    "title": "name",
                    "sortable": true         
            }],
            "default": [
                {
                    "key": "name",
                    "type": "text",
                    "title": "name",
                    "sortable": true
            }],
        }
}
```

```html
<adf-cloud-task-list 
    [appId]="'1'" 
    [presetColumn]="'customSchema'">
</adf-cloud-task-list>
```

You can use an HTML-based schema and an `app.config.json` custom schema declaration at the same time:

```json
"adf-cloud-task-list": {
        "presets": {
            "customSchema": [
            {
                    "key": "id",
                    "type": "text",
                    "title": "Id",
                    "sortable": true         
            }],
            "default": [
                {
                    "key": "name",
                    "type": "text",
                    "title": "name",
                    "sortable": true
            }],
        }
}
```

<!-- {% raw %} -->

```html
<adf-cloud-task-list
    [applicationName]="'ApplicationName'">
    <data-columns>
        <data-column key="assignee" title="Assignee" class="full-width name-column">
            <ng-template let-entry="$implicit">
                    <div>{{getFullName(entry.row.obj.assignee)}}</div>
            </ng-template>
        </data-column>
    </data-columns>
</adf-cloud-task-list>
```

### Setting Sorting Order for the list

you can pass sorting order as shown in the example below:

```ts
let sorting = { orderBy: 'created', direction: 'desc' }; 
```

```html
<adf-cloud-task-list
    [appId]="'1'"
    [sorting]="[sorting]">
</adf-cloud-task-list>
```

<!-- {% endraw %} -->

### Pagination strategy

The Tasklist also supports pagination as shown in the example below:

```html
<adf-cloud-task-list #taskCloud
                        [applicationName]="'APPLICATION-NAME'">
</adf-cloud-task-list>
<adf-pagination [target]="taskCloud"
                (changePageSize)="onChangePageSize($event)">
</adf-pagination>
```

### DataTableAdapter example

See the [`DataTableAdapter`](../../lib/core/datatable/data/datatable-adapter.ts) page for full details of the interface and its standard
implementation, [`ObjectDataTableAdapter`](../../lib/core/datatable/data/object-datatable-adapter.ts). Below is an example of how you can set up the adapter for a
typical tasklist.

```json
[
 {"type": "text", "key": "id", "title": "Id"},
 {"type": "text", "key": "name", "title": "Name", "cssClass": "full-width name-column", "sortable": true},
 {"type": "text", "key": "formKey", "title": "Form Key", "sortable": true},
 {"type": "text", "key": "created", "title": "Created", "sortable": true}
]
```

### DataColumn Features

You can customize the styling of a column and also add features like tooltips and automatic translation of column titles. See the [`DataColumn`](../../lib/core/datatable/data/data-column.model.ts) page for more information about these features.

## See also

-   [Data column component](../core/data-column.component.md)
-   [`DataTableAdapter`](../../lib/core/datatable/data/datatable-adapter.ts)
-   [Pagination component](../core/pagination.component.md)
