---
Title: Edit Process Filter Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-08
---

# [Edit Process Filter Cloud component](../../lib/process-services-cloud/src/lib/process/process-filters/components/edit-process-filter-cloud.component.ts "Defined in edit-process-filter-cloud.component.ts")

Shows Process Filter Details.

## Basic Usage

```html
<adf-cloud-edit-process-filter 
    [id]="processFilterId"
    [appName]="applicationName">
</adf-cloud-edit-process-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | (required) The name of the application. |
| id | `string` |  | (required) Id of the process instance filter. |
| filterProperties | `string []` | `['state', 'sort', 'order']` | List of process filter properties to display. |
| toggleFilterActions | `boolean` | `true` | Toggles edit process filter actions. |
| showTitle | `boolean` | `true` | Toggles edit process filter title. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterActionType`](../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when an filter action occurs i.e Save, SaveAs, Delete. |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterCloudModel`](../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when an process instance filter property changes. |

## Details

### Editing APS2 process filter

Use the application name and process filter id property to edit process filter properties:

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName">
</adf-cloud-edit-process-filter>
```
By default these below properties are displayed:

**_state_**, **_sort_**, **_order_**.

However, you can also choose which properties to show using an input property
`filterProperties`:

Populate the filterProperties in the component class:

```ts
import { UserProcessModel } from '@alfresco/adf-core';

export class SomeComponent implements OnInit {

    filterProperties: string[] = [
        "appName",
        "processInstanceId",
        "startDate",
        "startedAfter"];

    onFilterChange(filter: ProcessFilterCloudModel) {
        console.log('On filter change: ', filter);
    }

    onAction($event: ProcessFilterActionType) {
        console.log('Clicked action: ', $event);
    }
```

With this configuration, only the four listed properties will be shown.

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName"
    [filterProperties]="filterProperties"
    (filterChange)="onFilterChange($event)"
    (action)="onAction($event)">
</adf-cloud-edit-process-filter>
```


All Available properties are:

**_appName_**, **_state_**, **_sort_**, **_order_**, **_processDefinitionId_**, **_processInstanceId_**, **_startDate_**, **_lastModified_**, **_lastModifiedFrom_**, **_lastModifiedTo_**.

![edit-process-filter-cloud](../docassets/images/edit-process-filter-cloud.component.png)
