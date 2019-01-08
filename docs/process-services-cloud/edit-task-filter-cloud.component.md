---
Title: Edit Task Filter Cloud component
Added: v3.0.0
Status: Active
Last reviewed: 2019-01-08
---

# [Edit Task Filter Cloud component](../../lib/process-services-cloud/src/lib/task/task-filters/components/edit-task-filter-cloud.component.ts "Defined in edit-task-filter-cloud.component.ts")

Edits Task Filter Details.

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
| appName | `string` |  | Name of the app. |
| id | `string` |  | ID of the task filter. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FilterActionType`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a filter action occurs (i.e Save, Save As, Delete). |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` | Emitted when a task filter property changes. |

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
