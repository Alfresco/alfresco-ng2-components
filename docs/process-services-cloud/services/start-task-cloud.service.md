---
Title: Start Task Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-09
---

# [Start Task Cloud Service](../../../lib/process-services-cloud/src/lib/task/services/start-task-cloud.service.ts "Defined in start-task-cloud.service.ts")

Starts standalone tasks.

## Class members

### Methods

*   **createNewTask**(taskDetails: [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    (**Deprecated:** in 3.5.0, use TaskCloudService instead. Creates a new standalone task.)
    *   *taskDetails:* [`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)  - Details of the task to create
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the newly created task
*   **getBasePath**(appName: `string`): `string`<br/>

    *   *appName:* `string`  -
    *   **Returns** `string` -

## Details

The `createNewTask` method works the same way as the method with the same name in the
[Tasklist service](../../process-services/services/tasklist.service.md)
but uses the cloud variants of the classes for the parameter and return value. See the
[Tasklist service](../../process-services/services/tasklist.service.md) page for usage examples.

## See also

*   [Tasklist service](../../process-services/services/tasklist.service.md)
