---
Added: v2.0.0
Status: Active
---
# Process Instance List

Renders a list containing all the process instances matched by the parameters specified.

## Basic Usage

**app.component.html**

```html
<adf-process-instance-list
    [appId]="'1'"
    [state]="'open'">
</adf-process-instance-list>
```

You can also use custom schema declaration as shown below:

define custom schema in the app.config.json as shown below json format.

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
    [state]="'open'"
    [presetColumn]="'customSchema'">
</adf-process-instance-list>
```

You can also use both HTML-based and app.config.json custom schema declaration at same time like shown below:

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

### Pagination strategy

adf-process-instance-list also supports pagination and the same can be used as shown below.

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

### Properties

| Name | Type | Default | Description |
| ---- | ----------- | --- | --- |
| appId | number |  | The id of the app. |
| processDefinitionKey | string |  | The processDefinitionKey of the process. |
| presetColumn | string | | The presetColumn of the custom schema to fetch. |
| state | string |  | Define state of the processes. Possible values are `running`, `completed` and `all` |
| sort | string |  | Define sort of the processes. Possible values are `created-desc`, `created-asc`, `ended-desc`, `ended-asc` |
| name | string | | The name of the list. |
| page | number | 0 | The page of the processes to fetch. |
| size | number | 25 | The number of processes to fetch. |
| data | DataTableAdapter |  | Data source to define the datatable. |
| multiselect | boolean | false | Toggles multiple row selection, renders checkboxes at the beginning of each row. |
| selectionMode | string | 'single' | Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows. |

### Events

| Name | Description |
| ---- | ----------- |
| rowClick | Emitted when a row in the process list is clicked |
| success | Emitted when the list of process instances has been loaded successfully from the server |
| error | Emitted when an error is encountered loading the list of process instances from the server |

```
## See also

-   [Data column component](data-column.component.md)
-   [DataTableAdapter](datatable-adapter.interface.md)
-   [Pagination component](pagination.component.md)