---
Title: Task Filter Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-09
---

# [Task Filter Cloud Service](../../../lib/process-services-cloud/src/lib/task/task-filters/services/task-filter-cloud.service.ts "Defined in task-filter-cloud.service.ts")

Manages task filters. 

## Class members

### Methods

-   **addFilter**(newFilter: [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>`<br/>
    Adds a new task filter.
    -   _newFilter:_ [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>` - Observable of task instance filters with newly added filter
-   **deleteFilter**(deletedFilter: [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>`<br/>
    Deletes a task filter
    -   _deletedFilter:_ [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>` - Observable of task instance filters without deleted filter
-   **getTaskFilterById**(appName: `string`, id: `string`): `any`<br/>
    Gets a task filter.
    -   _appName:_ `string`  - Name of the target app
    -   _id:_ `string`  - ID of the task
    -   **Returns** `any` - Details of the task filter
-   **getTaskListFilters**(appName?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>`<br/>
    Gets all task filters for a task app.
    -   _appName:_ `string`  - (Optional) Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>` - Observable of task filter details
-   **getUsername**(): `string`<br/>
    Gets the username field from the access token.
    -   **Returns** `string` - Username string
-   **updateFilter**(updatedFilter: [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>`<br/>
    Updates a task filter.
    -   _updatedFilter:_ [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>` - Observable of task instance filters with updated filter

## Details

The methods of this service generally return an instance of [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts) or
an array of instances. For example, you could use `getTaskListFilters` as follows:

```ts
this.taskFilterService.getTaskListFilters(appName).subscribe( (filters: TaskFilterCloudModel[]) => {
  console.log('Task filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

These filters can now be used to get matching task instances for the process app.

## See also

-   [Task filter service](../../process-services/services/task-filter.service.md)
