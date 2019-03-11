---
Title: Process Filters Cloud Component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-08
---

# [Process Filters Cloud Component](../../lib/process-services-cloud/src/lib/process/process-filters/components/process-filters-cloud.component.ts "Defined in process-filters-cloud.component.ts")

Lists all available process filters and allows to select a filter.

## Basic Usage

```html
<adf-cloud-process-filters
    [appName]="currentAppName"
    [showIcons]="true">
</adf-cloud-process-filters>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | (required) The application name |
| filterParam | [`FilterParamsModel`](../../lib/process-services/task-list/models/filter.model.ts) |  | (optional) The filter to be selected by default |
| showIcons | `boolean` | false | (optional) Toggles showing an icon by the side of each filter |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs while loading the filters |
| filterClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterCloudModel`](../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` | Emitted when a filter is selected/clicked |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when filters are loaded successfully |
