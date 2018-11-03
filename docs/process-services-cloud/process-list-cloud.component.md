---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-24
---

# Process Instance List

Renders a list containing all the process instances matched by the parameters specified.

## Contents

-   [Basic Usage](#basic-usage)
    -   [Transclusions](#transclusions)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Setting Sorting Order for the list](#setting-sorting-order-for-the-list)
    -   [Pagination strategy](#pagination-strategy)
-   [See also](#see-also)

## Basic Usage

**[app.component](../../demo-shell/src/app/app.component.ts).html**

```html
<adf-cloud-process-list
    [applicationName]="'app-name'">
</adf-cloud-process-list>
```

### [Transclusions](../user-guide/transclusion.md)

Any content inside an `<adf-empty-custom-content>` sub-component will be shown
when the process list is empty:

```html
<adf-cloud-process-list>
    <adf-empty-custom-content>
        Your Content
    </adf-empty-custom-content>
<adf-cloud-process-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| applicationName | `string` |  | The name of the application. |
| appVersion | `string` |  | The application related version |
| initiator | `string` |  | the name of the initiator of the process |
| id | `string` |  | Filter the processes. Display only processes with id equal to the one insterted. |
| name | `string` |  | Filter the processes. Display only processes with name equal to the one insterted. |
| processDefinitionId | `string` |  | Filter the processes. Display only processes with processDefinitionId equal to the one insterted. |
| processDefinitionKey | `string` |  | Filter the processes. Display only processes with processDefinitionKey equal to the one insterted. |
| serviceFullName | `string` |  | Filter the processes. Display only processes with serviceFullName equal to the one insterted. |
| serviceName | `string` |  | Filter the processes. Display only processes with serviceName equal to the one insterted. |
| serviceType | `string` |  | Filter the processes. Display only processes with serviceType equal to the one insterted. |
| serviceVersion | `string` |  | Filter the processes. Display only processes with serviceVersion equal to the one insterted. |
| status | `string` |  | Filter the tasks. Display only processes with status equal to the one insterted. |
| businessKey | `string` |  | Filter the tasks. Display only processes with businessKey equal to the one insterted. |
| selectFirstRow | `boolean` | true | Toggles default selection of the first row |
| landingTaskId | `string` |  | Define which task id should be selected after reloading. If the task id doesn't exist or nothing is passed then the first task will be selected. |
| selectionMode | `string` | "single" | Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode, you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows. |
| multiselect | `boolean` | false | Toggles multiple row selection, renders checkboxes at the beginning of each row |
| sorting | `[ProcessListCloudSortingModel]` |  | This array of `ProcessListCloudSortingModel` specify how the sorting on our table should be provided. This parameters are for BE sorting. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while loading the list of process instances from the server. |
| rowClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when a row in the process list is clicked. |
| rowsSelected | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any[]>` | Emitted when rows are selected/unselected. |
success |  [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the list of process instances has been loaded successfully from the server. |

## Details

You can define a custom schema for the list in the `app.config.json` file and access it with the
`presetColumn` property as shown below:

```json
"adf-cloud-process-list": {
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
<adf-cloud-process-list
    [applicationName]="'appName'">
</adf-cloud-process-list>
```

You can also define the schema in the HTML using the
[Data column component](../core/data-column.component.md). You can combine this with schema
information defined in `app.config.json` as in the example below:

```json
"adf-cloud-process-list": {
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
<adf-cloud-process-list
    [applicationName]="'appName'" >
    <data-columns>
        <data-column key="key" title="title" class="full-width name-column">
            <ng-template let-entry="$implicit">
                    <div>{{getFullName(entry.row.obj.assignee)}}</div>
            </ng-template>
        </data-column>
    </data-columns>
</adf-cloud-process-list>
```

### Setting Sorting Order for the list

you can pass sorting order as shown in the example below:

```ts

let sorting = [{ orderBy: 'status', direction: 'desc' }];
```

```html
<adf-cloud-process-list
    [applicationName]="'appName'"
    [sort]="sorting">
</adf-cloud-process-list>
```

<!-- {% endraw %} -->

### Pagination strategy

The Process Instance List also supports pagination:

```html
<adf-cloud-process-list
    [appId]="'1'"
    [page]="page"
    [size]="size"
    #processList>
</adf-cloud-process-list>
<adf-pagination
    *ngIf="processList"
    [target]="processList"
    [supportedPageSizes]="supportedPages"
    #processListPagination>
</adf-pagination>
```

## See also

-   [Data column component](../core/data-column.component.md)
-   [Data Table Adapter interface](../core/datatable-adapter.interface.md)
-   [Pagination component](../core/pagination.component.md)
