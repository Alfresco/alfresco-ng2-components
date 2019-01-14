---
Title: Process Instance List Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2018-11-09
---

# [Process Instance List Cloud component](../../lib/process-services-cloud/src/lib/process/process-list/components/process-list-cloud.component.ts "Defined in process-list-cloud.component.ts")

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

**app.component.html**

```html
<adf-cloud-process-list
    [applicationName]="'app-name'">
</adf-cloud-process-list>
```

### [Transclusions](../user-guide/transclusion.md)

Any content inside an `<adf-custom-empty-content>` sub-component will be shown
when the process list is empty:

```html
<adf-cloud-process-list>
    <adf-custom-empty-content>
        Your Content
    </adf-custom-empty-content>
<adf-cloud-process-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appVersion | `string` | "" | The related application version. |
| applicationName | `string` | "" | The name of the application. |
| businessKey | `string` | "" | Filter the tasks to display only the ones with this businessKey value. |
| id | `string` | "" | Filter the processes to display only the ones with this ID. |
| initiator | `string` | "" | Name of the initiator of the process. |
| landingTaskId | `string` |  | Define which task id should be selected after reloading. If the task id doesn't exist or nothing is passed then the first task will be selected. |
| multiselect | `boolean` | false | Toggles multiple row selection and renders checkboxes at the beginning of each row |
| name | `string` | "" | Filter the processes to display only the ones with this name. |
| processDefinitionId | `string` | "" | Filter the processes to display only the ones with this process definition ID. |
| processDefinitionKey | `string` | "" | Filter the processes to display only the ones with this process definition key. |
| selectFirstRow | `boolean` | true | Toggles default selection of the first row |
| selectionMode | `string` | "single" | Row selection mode. Can be "none", "single" or "multiple". For multiple mode, you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows. |
| serviceFullName | `string` | "" | Filter the processes to display only the ones with this serviceFullName value. |
| serviceName | `string` | "" | Filter the processes to display only the ones with this serviceName value. |
| serviceType | `string` | "" | Filter the processes to display only the ones with this serviceType value. |
| serviceVersion | `string` | "" | Filter the processes to display only the ones with this serviceVersion value. |
| sorting | [`ProcessListCloudSortingModel`](../../lib/process-services-cloud/src/lib/process/process-list/models/process-list-sorting.model.ts)`[]` |  | Array of objects specifying the sort order and direction for the list. The sort parameters are for BE sorting. |
| status | `string` | "" | Filter the processes to display only the ones with this status. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while loading the list of process instances from the server. |
| rowClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when a row in the process list is clicked. |
| rowsSelected | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any[]>` | Emitted when rows are selected/unselected. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the list of process instances has been loaded successfully from the server. |

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

You can specify a sorting order as shown in the example below:

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
