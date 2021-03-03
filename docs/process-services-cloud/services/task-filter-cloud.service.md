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
-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getTaskFilterById**(appName: `string`, id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>`<br/>
    Gets a task filter.
    -   _appName:_ `string`  - Name of the target app
    -   _id:_ `string`  - ID of the task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`>` - Details of the task filter
-   **getTaskFilterCounter**(taskFilter: [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Finds a task using an object with optional query properties.
    -   _taskFilter:_ [`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Task information
-   **getTaskListFilters**(appName?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>`<br/>
    Gets all task filters for a task app.
    -   _appName:_ `string`  - (Optional) Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskFilterCloudModel`](../../../lib/process-services-cloud/src/lib/task/task-filters/models/filter-cloud.model.ts)`[]>` - Observable of task filter details
-   **getTaskNotificationSubscription**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskCloudEngineEvent`](../../../lib/process-services-cloud/src/lib/models/engine-event-cloud.model.ts)`[]>`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskCloudEngineEvent`](../../../lib/process-services-cloud/src/lib/models/engine-event-cloud.model.ts)`[]>` - 

-   **isDefaultFilter**(filterName: `string`): `boolean`<br/>
    Checks if given filter is a default filter
    -   _filterName:_ `string`  - Name of the target task filter
    -   **Returns** `boolean` - Boolean value for whether the filter is a default filter
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

## Inject Preference service

Token: [`TASK_FILTERS_SERVICE_TOKEN`](../../../lib/process-services-cloud/src/lib/services/cloud-token.service.ts)
A DI token that maps to the dependency to be injected.

[Task Filter Cloud Service](../../../lib/process-services-cloud/src/lib/task/task-filters/services/task-filter-cloud.service.ts "Defined in task-filter-cloud.service.ts")
is by default injected with the [Local Preference Cloud Service](../../process-services-cloud/services/local-preference-cloud.service.md)

```ts
import { NgModule } from '@angular/core';
import { LocalPreferenceCloudService, TASK_FILTERS_SERVICE_TOKEN } from '@alfresco/adf-process-services-cloud';

@NgModule({
    imports: [
        ...Import Required Modules
    ],
    providers: [
        { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
    ]
})
export class ExampleModule {}
```

If you would like to inject the [`UserPreferenceCloudService`](../../process-services-cloud/services/user-preference-cloud.service.md),  you can inject the service like below shown

```ts
import { NgModule } from '@angular/core';
import { UserPreferenceCloudService, TASK_FILTERS_SERVICE_TOKEN } from '@alfresco/adf-process-services-cloud';

@NgModule({
    imports: [
        ...Import Required Modules
    ],
    providers: [
        { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: UserPreferenceCloudService }
    ]
})
export class ExampleModule {}
```

## See also

-   [Task filter service](../../process-services/services/task-filter.service.md)
