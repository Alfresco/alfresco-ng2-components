---
Title: Task List Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-02-06
---

# [Task List Cloud Service](../../../lib/process-services-cloud/src/lib/task/task-list/services/task-list-cloud.service.ts "Defined in task-list-cloud.service.ts")

Searches tasks.

## Class members

### Methods

*   **getBasePath**(appName: `string`): `string`<br/>

    *   *appName:* `string`  -
    *   **Returns** `string` -
*   **getTaskByRequest**(requestNode: [`TaskQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/task/task-list/models/filter-cloud-model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Finds a task using an object with optional query properties.
    *   *requestNode:* [`TaskQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/task/task-list/models/filter-cloud-model.ts)  - Query object
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Task information

## Details

Note that for a call to `getTaskByRequest`, the
[`TaskQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/task/task-list/models/filter-cloud-model.ts) object
must at minimum have the `appName` property correctly set.
