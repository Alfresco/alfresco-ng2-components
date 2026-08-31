---
Title: Process Filters Cloud Component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-08
---

# Process Filters Cloud Component

Lists all available process filters and allows to select a filter.

## Basic Usage

```html
<adf-cloud-process-filters
    [appName]="currentAppName"
    [showIcons]="true"
/>
```

## Class members

### Properties

| Name        | Type                           | Default value | Description                                                   |
|-------------|--------------------------------|---------------|---------------------------------------------------------------|
| appName     | `string`                       | ""            | (required) The application name                               |
| filterParam | `UserTaskFilterRepresentation` |               | (optional) The filter to be selected by default               |
| showIcons   | `boolean`                      | false         | (optional) Toggles showing an icon by the side of each filter |
| useBatchedCounters | `boolean` | false | Get all the filter counters with one call to `POST /query/v1/count` (needs Activiti 8.7.0). Turn it on for both filter components. |

### Events

| Name           | Type                                    | Description                                                             |
|----------------|-----------------------------------------|-------------------------------------------------------------------------|
| error          | `EventEmitter<any>`                     | Emitted when any error occurs while loading the filters                 |
| filterClicked  | `EventEmitter<ProcessFilterCloudModel>` | Emitted when a filter is being clicked from the UI.                     |
| filterSelected | `EventEmitter<ProcessFilterCloudModel>` | Emitted when a filter is being selected based on the filterParam input. |
| success        | `EventEmitter<any>`                     | Emitted when filters are loaded successfully                            |

## See also

-   [Process Filter Cloud Service](./services/process-filter-cloud.service.md)
-   [Local preference Cloud Service](./services/local-preference-cloud.service.md)
-   [User preference Cloud Service](./services/user-preference-cloud.service.md)
