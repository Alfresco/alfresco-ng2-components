---
Title: Tasklist Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-14
---

# [Tasklist Service](../../../lib/process-services/src/lib/task-list/services/tasklist.service.ts "Defined in tasklist.service.ts")

Manages Task Instances.

## Class members

### Methods

-   **addTask**(task: [`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Adds a subtask (ie, a checklist task) to a parent task.
    -   _task:_ [`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)  - The task to add
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - The subtask that was added
-   **assignTask**(taskId: `string`, requestNode: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Assigns a task to a user or group.
    -   _taskId:_ `string`  - The task to assign
    -   _requestNode:_ `any`  - User or group to assign the task to
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Details of the assigned task
-   **assignTaskByUserId**(taskId: `string`, userId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Assigns a task to a user.
    -   _taskId:_ `string`  - ID of the task to assign
    -   _userId:_ `string`  - ID of the user to assign the task to
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Details of the assigned task
-   **attachFormToATask**(taskId: `string`, formId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Attaches a form to a task.
    -   _taskId:_ `string`  - ID of the target task
    -   _formId:_ `number`  - ID of the form to add
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response notifying when the operation is complete
-   **claimTask**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Claims a task for the current user.
    -   _taskId:_ `string`  - ID of the task to claim
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Details of the claimed task
-   **completeTask**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gives completed status to a task.
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response notifying when the operation is complete
-   **createNewTask**(task: [`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Creates a new standalone task.
    -   _task:_ [`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)  - Details of the new task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Details of the newly created task
-   **deleteForm**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Deletes a form from a task.
    -   _taskId:_ `string`  - Task id related to form
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Null response notifying when the operation is complete
-   **deleteTask**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Deletes a subtask (ie, a checklist task) from a parent task.
    -   _taskId:_ `string`  - The task to delete
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Null response notifying when the operation is complete
-   **fetchTaskAuditJsonById**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Fetch the Task Audit information in JSON format
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - JSON data
-   **fetchTaskAuditPdfById**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>`<br/>
    Fetches the Task Audit information in PDF format.
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>` - Binary PDF data
-   **findAllTaskByState**(requestNode: [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts), state?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>`<br/>
    Gets all tasks matching a query and state value.
    -   _requestNode:_ [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)  - Query to search for tasks.
    -   _state:_ `string`  - (Optional) Task state. Can be "open" or "completed".
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>` - List of tasks
-   **findAllTasksWithoutState**(requestNode: [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>`<br/>
    Gets all tasks matching the supplied query but ignoring the task state.
    -   _requestNode:_ [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)  - Query to search for tasks
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>` - List of tasks
-   **findTasksByState**(requestNode: [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts), state?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>`<br/>
    Gets tasks matching a query and state value.
    -   _requestNode:_ [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)  - Query to search for tasks
    -   _state:_ `string`  - (Optional) Task state. Can be "open" or "completed".
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>` - List of tasks
-   **getFilterForTaskById**(taskId: `string`, filterList: [`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)`>`<br/>
    Gets all the filters in the list that belong to a task.
    -   _taskId:_ `string`  - ID of the target task
    -   _filterList:_ [`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)`[]`  - List of filters to search through
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)`>` - Filters belonging to the task
-   **getFormList**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts)`[]>`<br/>
    Gets all available reusable forms.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts)`[]>` - Array of form details
-   **getTaskChecklist**(id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`[]>`<br/>
    Gets the checklist for a task.
    -   _id:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`[]>` - Array of checklist task details
-   **getTaskDetails**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Gets details for a task.
    -   _taskId:_ `string`  - ID of the target task.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Task details
-   **getTasks**(requestNode: [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>`<br/>
    Gets all the tasks matching the supplied query.
    -   _requestNode:_ [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)  - Query to search for tasks
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts)`>` - List of tasks
-   **getTotalTasks**(requestNode: [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets the total number of the tasks found by a query.
    -   _requestNode:_ [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)  - Query to search for tasks
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Number of tasks
-   **isTaskRelatedToFilter**(taskId: `string`, filterModel: [`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)`>`<br/>
    Checks if a taskId is filtered with the given filter.
    -   _taskId:_ `string`  - ID of the target task
    -   _filterModel:_ [`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)  - The filter you want to check
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts)`>` - The filter if it is related or null otherwise
-   **unclaimTask**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Un-claims a task for the current user.
    -   _taskId:_ `string`  - ID of the task to unclaim
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Null response notifying when the operation is complete
-   **updateTask**(taskId: `string`, updated: [`TaskUpdateRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/TaskUpdateRepresentation.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>`<br/>
    Updates the details (name, description, due date) for a task.
    -   _taskId:_ `string`  - ID of the task to update
    -   _updated:_ [`TaskUpdateRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/TaskUpdateRepresentation.md)  - Data to update the task (as a [`TaskUpdateRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/TaskUpdateRepresentation.md) instance).
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`>` - Updated task details

## Details

### Task details

Several of the methods return one or more [`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts) instances corresponding
to tasks or subtasks matched by a query of some kind. For example, `getTaskDetails`
could be used as shown below:

```ts
const taskInstanceId = '15303';
this.tasklistService.getTaskDetails(taskInstanceId).subscribe( (taskInstance: TaskDetailsModel) => {
    console.log('TaskInstance: ', taskInstance);
}, error => {
    console.log('Error: ', error);
});
```

The resulting [`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts) object contains information like the following:

        adhocTaskCanBeReassigned: false
        assignee: UserProcessModel {pictureId: null, id: 1, email: "admin@app.activiti.com", firstName: null, lastName: "Administrator"}
        category: null
        created: Wed Oct 11 2017 09:07:14 GMT+0100 (BST) {}
        description: null
        dueDate: null
        duration: null
        endDate: null
        executionId: "11337"
        formKey: "9"
        id: "15303"
        initiatorCanCompleteTask: false
        involvedPeople: []
        managerOfCandidateGroup: false
        memberOfCandidateGroup: false
        memberOfCandidateUsers: false
        name: "Clarify Invoice - Invoice-20302.pdf"
        parentTaskId: null
        parentTaskName: null
        priority: 50
        processDefinitionCategory: "http://www.activiti.org/processdef"
        processDefinitionDeploymentId: "18"
        processDefinitionDescription: "This is a simple invoice approval process that allows a person to assign a dedicated approver for the the invoice. It will then be routed to the Accounting department for payment preparation. Once payment is prepared the invoice will be stored in a specific folder and an email notification will be sent."
        processDefinitionId: "InvoiceApprovalProcess:2:21"
        processDefinitionKey: "InvoiceApprovalProcess"
        processDefinitionName: "Invoice Approval Process"
        processDefinitionVersion: 2
        processInstanceId: "11337"
        processInstanceName: null
        processInstanceStartUserId: "1"
        taskDefinitionKey: "clarifyInvoice"

### Queries

Some of the methods run a search query contained in a [`TaskQueryRequestRepresentationModel`](../../../lib/process-services/src/lib/task-list/models/filter.model.ts) and
return the matched tasks. Below is an example of how you might run a query using `getTasks`:

```ts
const taskQuery: TaskQueryRequestRepresentationModel = {
  appDefinitionId: '2',
  processInstanceId: null,
  processDefinitionId: null,
  text: null,
  assignment: null,
  state: 'open',
  sort: 'created_asc',
  page: 0,
  size: 5,
  start: null
};
this.tasklistService.getTasks(taskQuery).subscribe( (taskListModel: TaskListModel) => {
    console.log('Task List Model: ', taskListModel);
}, error => {
    console.log('Error: ', error);
});
```

In this example, the query specifies all Task Instances for the process app with
ID 2. Setting the `size` property to 5 ensures the query will return no more than
five task instances in the results.

You can use various query parameters to narrow down the scope of the results.
If you are only interested in task instances related to a specific process instance,
then you can set the `processInstanceId` accordingly. If you want all tasks related to
a type of process then you can use `processDefinitionId`.

Use the `state` property to indicate that you want only "completed" or "open" tasks (this
defaults to "open" if you leave it undefined).

The `assignment` property filters tasks based on how they are assigned (or not assigned yet).
Use `assignee` if you are interested in tasks that are assigned to a user. If you want to see
pooled tasks (i.e. tasks that needs to be claimed by a user), then use `candidate`.

A successful query returns a [`TaskListModel`](../../../lib/process-services/src/lib/task-list/models/task-list.model.ts) with the `data` property set to an array of
[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts):

    data:
        0: {id: "75010", name: "Approve Invoice  - Invoice-10202.pdf", description: null, category: null, assignee: {…}, …}
        1: {id: "74746", name: "Verify with the person that did the purchase", description: null, category: "2", assignee: {…}, …}
        2: {id: "74745", name: "Double check invoice amount", description: null, category: "2", assignee: {…}, …}
        3: {id: "20686", name: "Sample checklist task 1", description: null, category: "2", assignee: {…}, …}
        4: {id: "15303", name: "Clarify Invoice - Invoice-20302.pdf", description: null, category: null, assignee: {…}, …}
    length: 5
    size: 5
    start: 0
    total: 10

The `total` property indicates that actual number of tasks that were found, but the `size` property
limited the found set to five items.

### Importing

```ts
import { TaskListService, TaskDetailsModel, TaskQueryRequestRepresentationModel, TaskListModel, Form } from '@alfresco/adf-process-services';
import { TaskUpdateRepresentation } from '@alfresco/js-api';

export class SomePageComponent implements OnInit {

  constructor(private tasklistService: TaskListService) {
  }
```
