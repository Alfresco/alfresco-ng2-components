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
<adf-process-instance-list
    [appId]="'1'"
    [state]="'all'">
</adf-process-instance-list>
```

### [Transclusions](../user-guide/transclusion.md)

Any content inside an `<adf-empty-custom-content>` sub-component will be shown
when the process list is empty:

```html
<adf-process-instance-list>
    <adf-empty-custom-content>
        Your Content
    </adf-empty-custom-content>
<adf-process-instance-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appId | `number` |  | The id of the app. |
| data | `DataTableAdapter` |  | Data source to define the datatable. |
| multiselect | `boolean` | false | Toggles multiple row selection, which renders checkboxes at the beginning of each row |
| page | `number` | 0 | The page number of the processes to fetch. |
| processDefinitionId | `string` |  | The Definition Id of the process. |
| processDefinitionKey | `string` |  | (**Deprecated:** 2.4.0) The Definition Key of the process. |
| processInstanceId | `number \| string` |  | The id of the process instance. |
| selectFirstRow | `boolean` | true | Toggles default selection of the first row |
| selectionMode | `string` | "single" | Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode, you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows. |
| size | `number` |  | The number of processes to fetch in each page. |
| sort | `string` |  | Defines the sort ordering of the list. Possible values are `created-desc`, `created-asc`, `ended-desc`, `ended-asc`. |
| state | `string` |  | Defines the state of the processes. Possible values are `running`, `completed` and `all` |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while loading the list of process instances from the server. |
| rowClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when a row in the process list is clicked. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<ProcessListModel>` | Emitted when the list of process instances has been loaded successfully from the server. |

## Details

You can define a custom schema for the list in the `app.config.json` file and access it with the
`presetColumn` property as shown below:

```json
"adf-process-list": {
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
<adf-process-instance-list
    [appId]="'1'"
    [state]="'all'"
    [presetColumn]="'customSchema'">
</adf-process-instance-list>
```

You can also define the schema in the HTML using the
[Data column component](../core/data-column.component.md). You can combine this with schema
information defined in `app.config.json` as in the example below:

```json
"adf-process-list": {
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
<adf-process-instance-list
    [appId]="'1'" 
    [presetColumn]="'customSchema'">
    <data-columns>
        <data-column key="key" title="title" class="full-width name-column">
            <ng-template let-entry="$implicit">
                    <div>{{getFullName(entry.row.obj.assignee)}}</div>
            </ng-template>
        </data-column>
    </data-columns>
</adf-process-instance-list>
```

### Setting Sorting Order for the list

you can pass sorting order as shown in the example below:

```ts
// Possible values are : `created-desc`, `created-asc`, `ended-desc`, `ended-asc` |
let sortParam = 'created-desc'; 
```

```html
<adf-process-instance-list
    [appId]="'1'"
    [sort]="sortParam">
</adf-process-instance-list>
```

<!-- {% endraw %} -->

### Pagination strategy

The Process Instance List also supports pagination:

```html
<adf-process-instance-list
    [appId]="'1'"
    [page]="page"
    [size]="size"
    #processList>
</adf-process-instance-list>
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
