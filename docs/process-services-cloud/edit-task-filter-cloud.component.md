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
<adf-cloud-edit-task-filter [taskFilter]="filter"></adf-cloud-edit-task-filter>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskFilter |  [`TaskFilterCloudRepresentationModel`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts) |  | The Task filter to edit.|

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskFilterCloudRepresentationModel`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts)`>` | Emitted when a filter properties changed. |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FilterActionType`](../../lib/process-services-cloud/src/lib/task-cloud/models/filter-cloud.model.ts)`>` | Emitted when the task filter action clicked (i.e, save, saveAs, Delete). |

## Details

### Editing APS2 task filter

Use the `TaskFilterCloudRepresentationModel` property to edit task filter properties:

```html
<adf-cloud-edit-task-filter
    [taskFilter]="filter">
</adf-cloud-edit-task-filter>
```

![edit-task-filter-cloud](../docassets/images/edit-task-filter-cloud.component.png)
