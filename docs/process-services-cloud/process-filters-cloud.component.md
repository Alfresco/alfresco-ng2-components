---
Added: v3.0.0
Status: Active
Last reviewed: 2018-21-11
---

# [Process Filter Cloud Component](../../lib/process-services-cloud/src/lib/process-cloud/process-filters-cloud/process-filters-cloud.component.ts "Defined in process-filters-cloud.component.ts")

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
| filterParam | [`ProcessFilterParamModel`](../../lib/process-services-cloud/src/lib/process-cloud/models/process-filter-cloud.model.ts) |  | (optional) The filter to be selected by default |
| showIcons | `boolean` | false | (optional) The flag hides/shows icon against each filter |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs while loading the filters |
| filterClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterRepresentationModel`](../../lib/process-services-cloud/src/lib/process-cloud/models/process-filter-cloud.model.ts)`>` | Emitted when a filter is selected/clicked |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when filters are loaded successfully |
