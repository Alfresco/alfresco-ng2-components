---
Title: Edit Process Filter Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-30
---

# [Edit Process Filter Cloud component](../../lib/lib/process-services-cloud/src/lib/process/process-filters/components/edit-process-filter-cloud.component.ts "Defined in edit-process-filter-cloud.component.ts")

Shows Process Filter Details.

![edit-process-filter-cloud](../docassets/images/edit-process-filter-cloud.component.png)

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Editing APS2 process filters](#editing-aps2-process-filters)
    -   [Filter properties](#filter-properties)
    -   [Sort properties](#sort-properties)
    -   [Action properties](#action-properties)
-   [See also](#see-also)

## Basic Usage

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="appName"
    [filterProperties]="filterProperties"s
    (filterChange)="onFilterChange($event)"
    (action)="onAction($event)">
</adf-cloud-edit-process-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| actions | `string[]` |  | List of sort actions. |
| appName | `string` |  | The name of the application. |
| filterProperties | `string[]` |  | List of process filter properties to display |
| id | `string` |  | Id of the process instance filter. |
| showFilterActions | `boolean` | true | Toggles editing of process filter actions. |
| showTitle | `boolean` | true | Toggles editing of the process filter title. |
| sortProperties | `string[]` |  | List of sort properties to display. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterAction`](../../lib/lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when a filter action occurs i.e Save, SaveAs, Delete. |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterCloudModel`](../../lib/lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when a process instance filter property changes. |

## Details

### Editing APS2 process filters

Use the `appName` and `id` properties to choose which process filter to edit:

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="appName">
</adf-cloud-edit-process-filter>
```

### Filter properties

You can supply various _filter properties_ to edit that will determine
which processes are found by a filter. The full set of properties is
given below:

| Name | Description |
| ---- | ----------- |
| **_appName_** | Name of the app |
| **_processInstanceId_** | Process instance ID |
| **_processName_** | Process name. |
| **_initiator_** | ID of the user who initiated the process |
| **_status_** | Execution status of the process. |
| **_processDefinitionId_** | Process definition ID |
| **_processDefinitionKey_** | Process definition key |
| **_lastModified_** | Date the process was last modified. If lastModified defined the component will show the range **_lastModifiedTo_**, **_lastModifiedFrom_**|
| **_startDate_** | Date the process was started |
| **_sort_** | Field on which the filter results will be sorted (doesn't participate in the filtering itself). Can be "id", "name", "status" or "startDate". |
| **_order_** | Sort ordering of the filter results (this doesn't participate in the filtering itself) |

By default, the **_status_**, **_sort_** and **_order_** properties are
displayed in the editor. However, you can also choose which properties
to show using the `filterProperties` array.
For example, the code below initializes the editor with the **_appName_**,
**_processInstanceId_**, **_startDate_** and **_lastModified_** properties:

```ts
export class SomeComponent implements OnInit {

    filterProperties: string[] = [
        "appName",
        "processInstanceId",
        "startDate",
        "lastModified"];

    onFilterChange(filter: ProcessFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: ProcessFilterAction) {
        console.log('Clicked action: ', $event);
    }
```

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName"
    [filterProperties]="filterProperties">
</adf-cloud-edit-process-filter>
```

With this configuration, only the four listed properties will be shown.

### Sort properties

You can supply various _sort properties_ to sort the processes.

By default, the **_id_**, **_name_**, **_status_** and **_startDate_** properties are
displayed in the editor. However, you can also choose which sort properties
to show using the `sortProperties` array.
For example, the code below initializes the editor with the **_startDate_** and **_lastModified_** properties:

```ts
export class SomeComponent implements OnInit {

    sortProperties: string[] = [
        "startDate",
        "lastModified"];

    onFilterChange(filter: ProcessFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: ProcessFilterAction) {
        console.log('Clicked action: ', $event);
    }
```

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName"
    [sortProperties]="sortProperties">
</adf-cloud-edit-process-filter>
```

With this configuration, only the two listed sort properties will be shown.

### Action properties

You can supply various _actions_ to apply on process filter.

| Name | Description |
| ---- | ----------- |
| **_save_** | Save process filter. |
| **_saveAs_** | Creates a new process filter. |
| **_delete_** | Delete process filter. |

By default, the **_save_**, **_saveAs_** and **_delete_** actions are
displayed in the editor. However, you can also choose which actions to
show using the `actions` array.
For example, the code below initializes the editor with the **_save_** and **_delete_** actions:

```ts
export class SomeComponent implements OnInit {

    actions: string[] = ['save', 'delete'];

    onFilterChange(filter: ProcessFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: ProcessFilterAction) {
        console.log('Clicked action: ', $event);
    }
```

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName"
    [actions]="actions">
</adf-cloud-edit-process-filter>
```

With this configuration, only the two actions will be shown.

## See also

-   [Edit task filter cloud component](edit-task-filter-cloud.component.md)
