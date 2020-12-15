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

*   **assign**(appName: `string`, taskId: `string`, assignee: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Updates the task assignee.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task to update assignee
    *   *assignee:* `string`  - assignee to update current user task assignee
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details with new assignee
*   **canClaimTask**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task can be claimed.
    *   *taskDetails:* [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    *   **Returns** `boolean` - Boolean value if the task can be completed
*   **canCompleteTask**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task can be completed.
    *   *taskDetails:* [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    *   **Returns** `boolean` - Boolean value if the task can be completed
*   **canUnclaimTask**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task can be unclaimed.
    *   *taskDetails:* [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    *   **Returns** `boolean` - Boolean value if the task can be completed
*   **claimTask**(appName: `string`, taskId: `string`, assignee: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Claims a task for an assignee.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task to claim
    *   *assignee:* `string`  - [User](../../../lib/core/pipes/user-initial.pipe.ts) to assign the task to
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the claimed task
*   **completeTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Complete a task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task to complete
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the task that was completed
*   **createNewTask**(startTaskRequest: [`StartTaskCloudRequestModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/start-task-cloud-request.model.ts), appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Creates a new standalone task.
    *   *startTaskRequest:* [`StartTaskCloudRequestModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/start-task-cloud-request.model.ts)  -
    *   *appName:* `string`  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the newly created task
*   **getBasePath**(appName: `string`): `string`<br/>

    *   *appName:* `string`  -
    *   **Returns** `string` -
*   **getCandidateGroups**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets candidate groups of the task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - Candidate groups
*   **getCandidateUsers**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets candidate users of the task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - Candidate users
*   **getPriorityLabel**(priority: `number`): `string`<br/>

    *   *priority:* `number`  -
    *   **Returns** `string` -
*   **getProcessDefinitions**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/models/process-definition-cloud.model.ts)`[]>`<br/>
    Gets the process definitions associated with an app.
    *   *appName:* `string`  - Name of the target app
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/models/process-definition-cloud.model.ts)`[]>` - Array of process definitions
*   **getTaskById**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Gets details of a task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task whose details you want
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Task details
*   **isAssigneePropertyClickable**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts), candidateUsers: [`CardViewArrayItem`](../../../lib/core/card-view/models/card-view-arrayitem.model.ts)`[]`, candidateGroups: [`CardViewArrayItem`](../../../lib/core/card-view/models/card-view-arrayitem.model.ts)`[]`): `boolean`<br/>

    *   *taskDetails:* [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  -
    *   *candidateUsers:* [`CardViewArrayItem`](../../../lib/core/card-view/models/card-view-arrayitem.model.ts)`[]`  -
    *   *candidateGroups:* [`CardViewArrayItem`](../../../lib/core/card-view/models/card-view-arrayitem.model.ts)`[]`  -
    *   **Returns** `boolean` -
*   **isTaskEditable**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): `boolean`<br/>
    Validate if a task is editable.
    *   *taskDetails:* [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - task details object
    *   **Returns** `boolean` - Boolean value if the task is editable
*   **unclaimTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Un-claims a task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task to unclaim
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the task that was unclaimed
*   **updateTask**(appName: `string`, taskId: `string`, payload: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Updates the details (name, description, due date) for a task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the task to update
    *   *payload:* `any`  - Data to update the task
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details

## Details

The methods work in much the same way as the equivalent methods in the
[Tasklist service](../../process-services/services/tasklist.service.md)
but they use the cloud variants of the classes for return values. See the
[Tasklist service](../../process-services/services/tasklist.service.md) page for usage examples.

## See also

*   [Tasklist service](../../process-services/services/tasklist.service.md)
