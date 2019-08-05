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
-   **updateFilter**(updatedFilter: [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>`<br/>
    Update process instance filter
    -   _updatedFilter:_ [`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts)`[]>` - Observable of process instance filters with updated filter

## Details

The methods of this service generally return an instance of
[`ProcessFilterCloudModel`](../../../lib/process-services-cloud/src/lib/process/process-filters/models/process-filter-cloud.model.ts) or an array of instances.

You can use the returned filters to get matching process instances for the process app, 
such as 'Running', 'Completed', 'All', etc.

## See also

-   [Process filters cloud component](../components/process-filters-cloud.component.md)
-   [Task filter cloud service](task-filter-cloud.service.md)
