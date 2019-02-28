---
Title: Task Cloud Service
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-02-28
---

# [Task Cloud Service](../../lib/lib/process-services-cloud/src/lib/task/task-header/services/task-cloud.service.ts "Defined in task-cloud.service.ts")

Manage task cloud.

## Class members

### Methods

-   **completeTask**(appName: `string`, taskId: `string`)<br/>
    Complete a task
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  -  ID of the task to complete

-   **canCompleteTask**(taskDetails: [`TaskDetailsCloudModel`](../../lib/process-services-cloud/src/lib/task/start-filters/models/task-details-cloud.model.ts))<br/>
    Validate if a task can be completed.
    -   _taskDetails:_ [`TaskDetailsCloudModel`](../../lib/process-services-cloud/src/lib/task/start-filters/models/task-details-cloud.model.ts)  - Task details object