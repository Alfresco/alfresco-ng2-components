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
| appName | `string` |  | The name of the application. |
| id | `string` |  | Id of the process instance filter. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterActionType`](../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when an filter action occurs i.e Save, SaveAs, Delete. |
| filterChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterCloudModel`](../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when an process instance filter property changes. |

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
