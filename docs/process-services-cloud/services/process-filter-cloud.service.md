---
Title: Process Filter Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-09
---

# [Process Filter Cloud Service](../../../lib/process-services-cloud/src/lib/process/process-filters/services/process-filter-cloud.service.ts "Defined in process-filter-cloud.service.ts")

Manage Process Filters, which are pre-configured Process Instance queries. 

## Class members

### Methods

-   **addFilter**(filter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts))<br/>
    Adds a new process instance filter
    -   _filter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - The new filter to add
-   **deleteFilter**(filter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts))<br/>
    Delete process instance filter
    -   _filter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - The new filter to delete
-   **getAllProcessesFilter**(appName: `string`): [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)<br/>
    Creates and returns a filter for "All" Process instances.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts) - The newly created filter
-   **getCompletedProcessesFilter**(appName: `string`): [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)<br/>
    Creates and returns a filter for "Completed" Process instances.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts) - The newly created filter
-   **getProcessFilterById**(appName: `string`, id: `string`): [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)<br/>
    Get process instance filter for given filter id
    -   _appName:_ `string`  - Name of the target app
    -   _id:_ `string`  - Id of the target process instance filter
    -   **Returns** [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts) - Details of process filter
-   **getProcessFilters**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Gets all process instance filters for a process app.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process filter details
-   **getRunningProcessesFilter**(appName: `string`): [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)<br/>
    Creates and returns a filter for "Running" Process instances.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts) - The newly created filter
-   **updateFilter**(filter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts))<br/>
    Update process instance filter
    -   _filter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - The new filter to update

## Inject Preference service

Token: [`PROCESS_FILTERS_SERVICE_TOKEN`](../../../lib/process-services-cloud/src/lib/services/cloud-token.service.ts)
A DI token that maps to the dependency to be injected.

[Process Filter Cloud Service](../../../lib/process-services-cloud/src/lib/process/process-filters/services/process-filter-cloud.service.ts "Defined in process-filter-cloud.service.ts")
is by default injected with the [Local Preference Cloud Service](../../process-services-cloud/services/local-preference-cloud.service.md)

```ts
import { NgModule } from '@angular/core';
import { LocalPreferenceCloudService, PROCESS_FILTERS_SERVICE_TOKEN } from '@alfresco/adf-process-services-cloud';

@NgModule({
    imports: [
        ...Import Required Modules
    ],
    providers: [
        { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
    ]
})
export class ExampleModule {}

```

If you would like to inject the [User Preference Cloud Service](../../process-services-cloud/services/user-preference-cloud.service.md), you can inject the service like below shown 

```ts
import { NgModule } from '@angular/core';
import { UserPreferenceCloudService, PROCESS_FILTERS_SERVICE_TOKEN } from '@alfresco/adf-process-services-cloud';

@NgModule({
    imports: [
        ...Import Required Modules
    ],
    providers: [
        { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: UserPreferenceCloudService }
    ]
})
export class ExampleModule {}

```

## See also

-   [Process filters cloud component](../components/process-filters-cloud.component.md)
-   [Task filter cloud service](task-filter-cloud.service.md)
