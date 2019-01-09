---
Title: Task Filter Cloud Service
Added: v3.0.0
Status: Active
Last reviewed: 2019-01-09
---

# [Task Filter Cloud Service](../../lib/process-services-cloud/src/lib/task/task-filters/services/task-filter-cloud.service.ts "Defined in task-filter-cloud.service.ts")

Manages task filters. 

## Class members

### Methods

-   **addFilter**(filter: [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts))<br/>
    Adds a new task filter.
    -   _filter:_ [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)  - The new filter to add
-   **deleteFilter**(filter: [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts))<br/>
    Deletes a task filter
    -   _filter:_ [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)  - The filter to delete
-   **getCompletedTasksFilterInstance**(appName: `string`): [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)<br/>
    Creates and returns a filter for "Completed" task instances.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts) - The newly created filter
-   **getMyTasksFilterInstance**(appName: `string`): [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)<br/>
    Creates and returns a filter for "My [`Tasks`](../../e2e/actions/APS-cloud/tasks.ts)" task instances.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts) - The newly created filter
-   **getTaskFilterById**(appName: `string`, id: `string`): [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)<br/>
    Gets a task filter.
    -   _appName:_ `string`  - Name of the target app
    -   _id:_ `string`  - ID of the task
    -   **Returns** [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts) - Details of the task filter
-   **getTaskListFilters**(appName?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>`<br/>
    Gets all task filters for a process app.
    -   _appName:_ `string`  - (Optional) Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>` - Observable of task filter details
-   **getUsername**(): `string`<br/>
    Gets the username field from the access token.
    -   **Returns** `string` - Username string
-   **getValueFromToken**(key: `string`)<br/>
    Gets a named value from the access token.
    -   _key:_ `string`  - Key name of the value
-   **updateFilter**(filter: [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts))<br/>
    Updates a task filter.
    -   _filter:_ [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)  - The filter to update

## Details

The methods of this service generally return an instance of [`TaskFilterCloudModel`](../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts) or
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

-   [Task filter service](../process-services/task-filter.service.md)
