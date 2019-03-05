---
Title: Task Header Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-18
---

# [Task Header Cloud Service](../../../lib/process-services-cloud/src/lib/task/task-header/services/task-header-cloud.service.ts "Defined in task-header-cloud.service.ts")

Manages cloud tasks.

## Class members

### Methods

-   **claimTask**(appName: `string`, taskId: `string`, assignee: `string`): `any`<br/>
    Claims a task for an assignee.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task to claim
    -   _assignee:_ `string`  - User to assign the task to
    -   **Returns** `any` - Details of the claimed task
-   **getTaskById**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Gets details of a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task whose details you want
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Task details
-   **unclaimTask**(appName: `string`, taskId: `string`): `any`<br/>
    Un-claims a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task to unclaim
    -   **Returns** `any` - Details of the task that was unclaimed
-   **updateTask**(appName: `string`, taskId: `string`, updatePayload: `any`): `any`<br/>
    Updates the details (name, description, due date) for a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task to update
    -   _updatePayload:_ `any`  - Data to update the task
    -   **Returns** `any` - Updated task details

## Details

The methods work in much the same way as the equivalent methods in the
[Tasklist service](../../process-services/services/tasklist.service.md)
but they use the cloud variants of the classes for return values. See the
[Tasklist service](../../process-services/services/tasklist.service.md) page for usage examples.

## See also

-   [Tasklist service](../../process-services/services/tasklist.service.md)
