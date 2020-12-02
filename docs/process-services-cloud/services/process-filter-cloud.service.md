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

*   **addFilter**(newFilter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Adds a new process instance filter
    *   *newFilter:* [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process instance filters with newly added filter
*   **deleteFilter**(deletedFilter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Delete process instance filter
    *   *deletedFilter:* [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process instance filters without deleted filter
*   **getFilterById**(appName: `string`, id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>`<br/>
    Get process instance filter for given filter id
    *   *appName:* `string`  - Name of the target app
    *   *id:* `string`  - Id of the target process instance filter
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` - Observable of process instance filter details
*   **getProcessFilters**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Gets all process instance filters for a process app.
    *   *appName:* `string`  - Name of the target app
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process filters details
*   **isDefaultFilter**(filterName: `string`): `boolean`<br/>
    Checks if given filter is a default filter
    *   *filterName:* `string`  - Name of the target process filter
    *   **Returns** `boolean` - Boolean value for whether the filter is a default filter
*   **updateFilter**(updatedFilter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Update process instance filter
    *   *updatedFilter:* [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process instance filters with updated filter

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

*   [Process filters cloud component](../components/process-filters-cloud.component.md)
*   [Task filter cloud service](task-filter-cloud.service.md)
