---
Title: Edit Task Filter Cloud component
Added: v3.0.0
Status: Active
Last reviewed: 2018-20-11
---

# Edit Task Filter Cloud component

Shows Task Filter Details.

## Basic Usage

```html
<adf-cloud-edit-task-filter 
    [id]="taskFilterId"
    [appName]="applicationName">
</adf-cloud-edit-task-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| id | `string` | "" | The id of the Task filter. |
| appName | `string` | "" | The name of the application. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`QueryModel`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts)`>` | Emitted when a filter properties changed. |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FilterActionType`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts)`>` | Emitted when the task filter action clicked (i.e, save, saveAs, Delete). |

## Details

### Editing APS2 task filter

Use the application name and task filter id property to edit task filter properties:

```html
<adf-cloud-edit-task-filter
    [id]="taskFilterId"
    [appName]="applicationName">
</adf-cloud-edit-task-filter>
```

![edit-task-filter-cloud](../docassets/images/edit-task-filter-cloud.component.png)
