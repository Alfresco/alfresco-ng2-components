---
Title: Task Cloud Service
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-03-29
---

# [Task Cloud Service](../../../lib/process-services-cloud/src/lib/task/services/task-cloud.service.ts "Defined in task-cloud.service.ts")

Manages task cloud.

## Class members

### Methods

-   **canClaimTask**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task can be claimed.
    -   _taskDetails:_ [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    -   **Returns** `boolean` - Boolean value if the task can be completed
-   **canCompleteTask**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task can be completed.
    -   _taskDetails:_ [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    -   **Returns** `boolean` - Boolean value if the task can be completed
-   **canUnclaimTask**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task can be unclaimed.
    -   _taskDetails:_ [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    -   **Returns** `boolean` - Boolean value if the task can be completed
-   **claimTask**(appName: `string`, taskId: `string`, assignee: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Claims a task for an assignee.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task to claim
    -   _assignee:_ `string`  - User to assign the task to
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the claimed task
-   **completeTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Complete a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task to complete
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the task that was completed
-   **createNewTask**(startTaskRequest: [`StartTaskCloudRequestModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/start-task-cloud-request.model.ts), appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Creates a new standalone task.
    -   _startTaskRequest:_ [`StartTaskCloudRequestModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/start-task-cloud-request.model.ts)  - 
    -   _appName:_ `string`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the newly created task
-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getTaskById**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Gets details of a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task whose details you want
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Task details
-   **isTaskEditable**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task is editable.
    -   _taskDetails:_ [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    -   **Returns** `boolean` - Boolean value if the task is editable
-   **unclaimTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Un-claims a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task to unclaim
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the task that was unclaimed
-   **updateTask**(appName: `string`, taskId: `string`, updatePayload: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Updates the details (name, description, due date) for a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the task to update
    -   _updatePayload:_ `any`  - Data to update the task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details

## Details

The methods work in much the same way as the equivalent methods in the
[Tasklist service](../../process-services/services/tasklist.service.md)
but they use the cloud variants of the classes for return values. See the
[Tasklist service](../../process-services/services/tasklist.service.md) page for usage examples.

## See also

-   [Tasklist service](../../process-services/services/tasklist.service.md)
