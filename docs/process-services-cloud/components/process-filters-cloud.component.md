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
| useBatchedCounters | `boolean`                   | false         | Resolves the counters of the process and the task filters with a single call to `POST /query/v1/count`, which requires Activiti 8.7.0 forward. Both filter components have to ask for it, otherwise the counters are resolved one filter at a time. |
| searchApiMethod | `'GET' \| 'POST'`          | "GET"         | **Deprecated:** the counters are resolved by a single `POST /query/v1/count` call, which requires Activiti 8.7.0 forward. This input is only used to resolve the counters one filter at a time, on the backends without that endpoint, and will be removed along with the `GET` method in ADF 10.0.0. |

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
