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
| filterParam | `ProcessFilterRepresentationModel` |  | (optional) The filter to be selected by default |
| showIcons | `boolean` | false | (optional) The flag hides/shows icon against each filter |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessFilterRepresentationModel`](../../lib/process-services-cloud/src/lib/process-cloud/models/process-filter-cloud.model.ts)`>` | Emitted when a filter is selected/clicked. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when filters are loaded successfully. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs while loading the filters. |