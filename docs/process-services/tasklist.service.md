---
Added: v2.0.0
Status: Active
---

# Tasklist Service

Manages Task Instances.

## Methods

-   `getFilterForTaskById(taskId: string, filterList: FilterRepresentationModel[]): Observable<FilterRepresentationModel>`  
    Gets all the filters in the list that belong to a task.  
    -   `taskId` - ID of the target task
    -   `filterList` - List of filters to search through
-   `isTaskRelatedToFilter(taskId: string, filter: FilterRepresentationModel): Observable<FilterRepresentationModel>`  
    Checks if a taskId is filtered with the given filter.  
    -   `taskId` - ID of the target task
    -   `filter` - The filter you want to check
-   `getTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskListModel>`  
    Gets all the tasks matching the supplied query.  
    -   `requestNode` - Query to search for tasks
-   `findTasksByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable<TaskListModel>`  
    Gets tasks matching a query and state value.  
    -   `requestNode` - Query to search for tasks
    -   `state` - (Optional) Task state. Can be "open" or "completed".
-   `findAllTaskByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable<TaskListModel>`  
    Gets all tasks matching a query and state value.  
    -   `requestNode` - Query to search for tasks.
    -   `state` - (Optional) Task state. Can be "open" or "completed". 
-   `findAllTasksWithoutState(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskListModel>`  
    Get all tasks matching the supplied query but ignoring the task state.  
    -   `requestNode` - Query to search for tasks
-   `getTaskDetails(taskId: string): Observable<TaskDetailsModel>`  
    Gets details for a task.  
    -   `taskId` - ID of the target task.
-   `getTaskChecklist(id: string): Observable<TaskDetailsModel[]>`  
    Gets the checklist for a task.  
    -   `id` - ID of the target task
-   `getFormList(): Observable<Form[]>`  
    Gets all available reusable forms.  

-   `attachFormToATask(taskId: string, formId: number): Observable<any>`  
    Attaches a form to a task.  
    -   `taskId` - ID of the target task
    -   `formId` - ID of the form to add
-   `addTask(task: TaskDetailsModel): Observable<TaskDetailsModel>`  
    Adds a subtask (ie, a checklist task) to a parent task.  
    -   `task` - The task to add
-   `deleteTask(taskId: string): Observable<TaskDetailsModel>`  
    Deletes a subtask (ie, a checklist task) from a parent task.  
    -   `taskId` - The task to delete
-   `completeTask(taskId: string): any`  
    Gives completed status to a task.  
    -   `taskId` - ID of the target task
-   `getTotalTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<any>`  
    Gets the total number of the tasks found by a query.  
    -   `requestNode` - Query to search for tasks
-   `createNewTask(task: TaskDetailsModel): Observable<TaskDetailsModel>`  
    Creates a new standalone task.  
    -   `task` - Details of the new task
-   `assignTask(taskId: string, requestNode: any): Observable<TaskDetailsModel>`  
    Assigns a task to a user or group.  
    -   `taskId` - The task to assign
    -   `requestNode` - User or group to assign the task to
-   `assignTaskByUserId(taskId: string, userId: number): Observable<TaskDetailsModel>`  
    Assigns a task to a user.  
    -   `taskId` - ID of the task to assign
    -   `userId` - ID of the user to assign the task to
-   `claimTask(taskId: string): Observable<TaskDetailsModel>`  
    Claims a task for the current user.  
    -   `taskId` - ID of the task to claim
-   `unclaimTask(taskId: string): Observable<TaskDetailsModel>`  
    Unclaims a task for the current user.  
    -   `taskId` - ID of the task to unclaim
-   `updateTask(taskId: any, updated): Observable<TaskDetailsModel>`  
    Updates the details (name, description, due date) for a task.  
    -   `taskId` - ID of the task to update
    -   `updated` - Data to update the task (as a \`TaskUpdateRepresentation\` instance).
-   `fetchTaskAuditPdfById(taskId: string): Observable<Blob>`  
    Fetches the Task Audit information in PDF format.  
    -   `taskId` - ID of the target task
-   `fetchTaskAuditJsonById(taskId: string): Observable<any>`  
    Fetch the Task Audit information in JSON format  
    -   `taskId` - ID of the target task

## Details

### Task details

Several of the methods return one or more `TaskDetailsModel` instances corresponding
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

The resulting `TaskDetailsModel` object contains information like the following:

```
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
```

### Queries

Some of the methods run a search query contained in a `TaskQueryRequestRepresentationModel` and
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

A successful query returns a `TaskListModel` with the `data` property set to an array of
`TaskDetailsModel`:

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
import { TaskUpdateRepresentation } from 'alfresco-js-api';

export class SomePageComponent implements OnInit {

  constructor(private tasklistService: TaskListService) {
  }
```
