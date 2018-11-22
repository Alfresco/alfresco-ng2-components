---
Added: v3.0.0
Status: Active
Last reviewed: 2018-21-11
---

# Process Filter Cloud Component

Lists all available process filters and allows to select a filter.

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)


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
| filterParam | `ProcessFilterParamModel` |  | (optional) The filter to be selected by default |
| showIcons | `boolean` | false | (optional) The flag hides/shows icon against each filter |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterRepresentationModel`](../../lib/process-services-cloud/src/lib/process-cloud/models/process-filter-cloud.model.ts)`>` | Emitted when a filter is selected/clicked. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when filters are loaded successfully. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs while loading the filters. |

### Details

The `filterParam` input can be used to select a filter as mentioned below.

```html
<adf-cloud-process-filters
    [filterParam]="{name:'Running Processes'}">
</adf-cloud-process-filters>
```

A filter can be selected by using any of the `ProcessFilterParamModel` property.

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | The id of the filter |
| name | string | The name of the filter |
| index | string | The zero-based position of the filter in the array |