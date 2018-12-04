---
Title: Edit Process Filter Cloud component
Added: v3.0.0
Status: Active
Last reviewed: 2018-20-11
---

# Edit Process Filter Cloud component

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
| id | `string` | "" | The id of the Process filter. |
| appName | `string` | "" | The name of the application. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessQueryModel`](../../lib/process-services-cloud/src/lib/process-cloud/models/process-filter-cloud.model.ts)`>` | Emitted when a filter properties changed. |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FilterActionType`](../../lib/process-services-cloud/src/lib/process-cloud/models/process-filter-cloud.model.ts)`>` | Emitted when the task filter action clicked (i.e, save, saveAs, Delete). |

## Details

### Editing APS2 process filter

Use the process filter id property to edit process filter properties:

```html
<adf-cloud-edit-process-filter
    [id]="processFilterId"
    [appName]="applicationName">
</adf-cloud-edit-process-filter>
```

![edit-process-filter-cloud](../docassets/images/edit-process-filter-cloud.component.png)
