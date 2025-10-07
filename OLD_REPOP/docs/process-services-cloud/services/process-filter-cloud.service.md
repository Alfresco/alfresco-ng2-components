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

-   **addFilter**(newFilter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Adds a new process instance filter
    -   _newFilter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process instance filters with newly added filter
-   **deleteFilter**(deletedFilter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Delete process instance filter
    -   _deletedFilter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process instance filters without deleted filter
-   **getFilterById**(appName: `string`, id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>`<br/>
    Get process instance filter for given filter id
    -   _appName:_ `string`  - Name of the target app
    -   _id:_ `string`  - Id of the target process instance filter
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`>` - Observable of process instance filter details
-   **getProcessFilters**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Gets all process instance filters for a process app.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process filters details
-   **isDefaultFilter**(filterName: `string`): `boolean`<br/>
    Checks if given filter is a default filter
    -   _filterName:_ `string`  - Name of the target process filter
    -   **Returns** `boolean` - Boolean value for whether the filter is a default filter
-   **readQueryParams**(obj: `any`): [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)<br/>

    -   _obj:_ `any`  - 
    -   **Returns** [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts) - 

-   **resetProcessFilterToDefaults**(appName: `string`, filter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Reset the process filters to the default configuration if it exists and stores it. If there is no default configuration for the process cloud filter with the provided filter name, then it changes nothing but stores the current values of the filter
    -   _appName:_ `string`  - Name of the target app
    -   _filter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - The process filter to be restored to defaults
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process filters details
-   **updateFilter**(updatedFilter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Update process instance filter
    -   _updatedFilter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process instance filters with updated filter
-   **writeQueryParams**(value: `any`, filterProperties: `string[]`, appName?: `string`, id?: `string`): `any`<br/>

    -   _value:_ `any`  - 
    -   _filterProperties:_ `string[]`  - 
    -   _appName:_ `string`  - (Optional)
    -   _id:_ `string`  - (Optional)
    -   **Returns** `any` -

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
