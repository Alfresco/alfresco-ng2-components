# Tasklist Service
Manage Task Instances. 

## Importing

```ts
import { TaskListService, TaskDetailsModel, TaskQueryRequestRepresentationModel, TaskListModel, Form } from '@alfresco/adf-process-services';
import { TaskUpdateRepresentation } from 'alfresco-js-api';

export class SomePageComponent implements OnInit {

  constructor(private tasklistService: TaskListService) {
  }
```

## Methods

#### getTaskDetails(taskId: string): Observable`<TaskDetailsModel>`
Get Task Instance metadata for passed in Task Instance ID:

```ts
const taskInstanceId = '15303';
this.tasklistService.getTaskDetails(taskInstanceId).subscribe( (taskInstance: TaskDetailsModel) => {
    console.log('TaskInstance: ', taskInstance);
}, error => {
    console.log('Error: ', error);
});
```

The `taskInstanceId` refers to a Task Instance identifier in APS.  
The returned `taskInstance` object is of type `TaskDetailsModel` and looks like in this sample:

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

#### getTaskChecklist(id: string): Observable`<TaskDetailsModel[]>`
Get all the sub-task instances for a Task Instance, also called the check list: 

```ts
const parentTaskId = '15303';
this.tasklistService.getTaskChecklist(parentTaskId).subscribe( (subTasks: TaskDetailsModel[]) => {
  console.log('Sub Tasks: ', subTasks);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `TaskDetailsModel` representing the sub-tasks:

```
Sub Tasks: 
    0:
        adhocTaskCanBeReassigned: false
        assignee: UserProcessModel {pictureId: null, id: 1, email: "admin@app.activiti.com", firstName: null, lastName: "Administrator"}
        category: "2"
        created: "2017-10-29T07:29:28.881+0000"
        description: null
        dueDate: null
        duration: null
        endDate: null
        executionId: null
        formKey: null
        id: "74745"
        initiatorCanCompleteTask: false
        involvedPeople: undefined
        managerOfCandidateGroup: false
        memberOfCandidateGroup: false
        memberOfCandidateUsers: false
        name: "Double check invoice amount"
        parentTaskId: "15303"
        parentTaskName: "Clarify Invoice - Invoice-10292.pdf"
        priority: 50
        processDefinitionCategory: null
        processDefinitionDeploymentId: null
        processDefinitionDescription: null
        processDefinitionId: null
        processDefinitionKey: null
        processDefinitionName: null
        processDefinitionVersion: 0
        processInstanceId: null
        processInstanceName: null
        processInstanceStartUserId: null
        taskDefinitionKey: null
    1 :
        {processDefinitionVersion: 0, id: "74746", name: "Verify with the person that did the purchase", priority: 50, assignee: UserProcessModel, …}
```

Looking at the `TaskDetailsModel` for a sub-task we can see that it has a parent task ID that matches what we specified
when calling this method.

#### getTasks(requestNode: TaskQueryRequestRepresentationModel): Observable`<TaskListModel>`
Get tasks matching passed in query definition:

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

In the above example we query for all Task Instances associated with a Process Application with
ID 2. We set `size` to 5, which means that the query will return max 5 task instances. 

We can mix and match the query parameters to narrow down the task list that is returned. 
If you are just interested in Task Instances related to a specific Process Instance, 
then set the `processInstanceId`. If you want to see all tasks related to a specific type of processes, 
then you should set the `processDefinitionId` property. 

You can use the `state` property to define if only `completed` or only `open` tasks should be returned. If you 
specify `null` for state then `open` will be assumed.

The `assignment` property can be used to filter tasks based on how they are assigned (or not assigned yet).
Use `assignee` if you are interested in tasks that are assigned to a user. If you want to see 
pooled tasks (i.e. tasks that needs to be claimed by a user), then use `candidate`.

A `TaskListModel` object is returned for a successful query and the `data` property is an array of
`TaskDetailsModel`:

```
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
```

We can see that this query resulted in 10 tasks (see `total`), but only 5 were returned as we set `size` to `5`.

#### getTotalTasks(requestNode: TaskQueryRequestRepresentationModel): Observable`<any>`
Get total number of tasks matching passed in query definition:

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
this.tasklistService.getTotalTasks(taskQuery).subscribe( (response: any) => {
  console.log('Total: ', response);
}, error => {
  console.log('Error: ', error);
});
```

This is pretty much the same type of query as the `getTasks` method, except that here we just 
return how many Task Instances it matched in the `total` property:

```
data:[]
size: 0
start: 0
total: 10
```

When you call this method it always sets the `size` property to `0`.

#### findTasksByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable`<TaskListModel>`
Find and return Task Instances by state `open` or `completed` and query model:

```ts
const taskState = 'open';
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

this.tasklistService.findTasksByState(taskQuery, taskState).subscribe( (taskList: TaskListModel) => {
  console.log('Task list: ', taskList);
}, error => {
  console.log('Error: ', error);
});
```
The number of tasks that are returned is controlled by the `size` property.

This is a convenience method on top of the `getTasks` method. It overwrites the `requestNode.state` property 
with passed in `state` before making the call to `getTasks`.
For an example of the response see the `getTasks` method.

#### findAllTaskByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable`<TaskListModel>`
Find and return all Task Instances by state `open` or `completed` and query model:

```ts
const taskState = 'open';
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

this.tasklistService.findAllTaskByState(taskQuery, taskState).subscribe( (taskList: TaskListModel) => {
  console.log('Task list: ', taskList);
}, error => {
  console.log('Error: ', error);
});
```

This is a convenience method on top of the `getTasks` method. It overwrites the `requestNode.state` property with 
passed in `state` before making any other calls. Before making the `getTasks` call it will first call the 
`getTotalTasks` method to get the total number of tasks that match query and state. It then overwrite the 
`requestNode.size` with the total so all matching tasks are returned when finnally making the `getTasks` call.

**Note** that this can return a lot of data if you are not careful.

#### findAllTasksWithoutState(requestNode: TaskQueryRequestRepresentationModel): Observable`<TaskListModel>`
Find and return all Task Instances that matches query model, regardless of state:

```ts
const taskQuery: TaskQueryRequestRepresentationModel = {
  appDefinitionId: '2',
  processInstanceId: null,
  processDefinitionId: null,
  text: null,
  assignment: null,
  state: null,
  sort: 'created_asc',
  page: 0,
  size: 5,
  start: null
};

this.tasklistService.findAllTasksWithoutState(taskQuery).subscribe( (taskList: TaskListModel) => {
  console.log('Task list: ', taskList);
}, error => {
  console.log('Error: ', error);
});
```

This method can be used when you have a task query that should return all tasks regardless of the state they 
are in. You cannot achieve this with the `getTasks` method. If you specify a `size` it is overwritten.
Internally it basically calls `findTasksByState(requestNode, 'open')` and 
`findAllTaskByState(requestNode, 'completed')`.

**Note** that this can return a lot of data if you are not careful.

#### assignTaskByUserId(taskId: string, userId: number): Observable`<TaskDetailsModel>`
Assign a Task Instance to a user via the User ID:

```ts
const taskId = '15303';
const userId = 1;
this.tasklistService.assignTaskByUserId(taskId, userId).subscribe( (taskInstance: TaskDetailsModel) => {
  console.log('Task instance: ', taskInstance);
}, error => {
  console.log('Error: ', error);
});
```

The user ID identifies a User in APS.

#### assignTask(taskId: string, requestNode: any): Observable`<TaskDetailsModel>`
Assign a task to a user via a user object with an `id` property, for example:

```ts
const taskId = '15303';
const user = { id: 1, email: 'admin@app.activiti.com', firstName: 'APS', lastName: 'Admin' };
this.tasklistService.assignTask(taskId, user).subscribe( (taskInstance: TaskDetailsModel) => {
  console.log('Task instance: ', taskInstance);
}, error => {
  console.log('Error: ', error);
});
```

This method does the same as the `assignTaskByUserId` method, the only difference is that this
method can be used when you have an object where the User ID is contained in an `id` property.

#### claimTask(taskId: string): Observable`<TaskDetailsModel>` 
Claim a pooled task (i.e. candidate task) as current user so it can be worked on and later on completed: 

```ts
const taskId = '15368'; 
this.tasklistService.claimTask(taskId).subscribe( (taskInstance: TaskDetailsModel) => {
  console.log('Task instance: ', taskInstance);
}, error => {
  console.log('Error: ', error);
});
```

The response will be `null` if the task was claimed successfully.
 
The task assignment changes from `candidate` to `assignee`.

#### unclaimTask(taskId: string): Observable`<TaskDetailsModel>` 
Return a claimed task to the pool (i.e. make it a candidate task): 

```ts
const taskId = '15368'; 
this.tasklistService.unclaimTask(taskId).subscribe( (taskInstance: TaskDetailsModel) => {
  console.log('Task instance: ', taskInstance);
}, error => {
  console.log('Error: ', error);
});
```
 
The task assignment changes from `assignee` to `candidate`.

#### completeTask(taskId: string) 
Complete a Task Instance as current user and progress Process Instance:

```ts
const taskId = '15176';
this.tasklistService.completeTask(taskId);
```

This only works if the Task Instance has only one Outcome (i.e. the default `Complete` one). 
If the Task Instance has multiple Outcomes, such as Approve and Reject, then this method does not
work, and the Task Instance has to be completed via its associated form. Otherwise you will see an error such as:

*ERROR Error: Uncaught (in promise): Error: {"message":"Task must be completed using it's form","messageKey":"GENERAL.ERROR.BAD-REQUEST"}*

#### updateTask(taskId: any, updated): Observable`<TaskDetailsModel>` 
Update name, description, and due date for a Task Instance:

```ts
const taskId = '80002';
const updateData: TaskUpdateRepresentation = {
    description: 'Updated description',
    dueDate: new Date(2018, 1, 10, 11, 0, 0, 0),
    name: 'Updated name'
};
this.tasklistService.updateTask(taskId, updateData).subscribe( (updatedTaskDetails: TaskDetailsModel) => {
  console.log('Updated task: ', updatedTaskDetails);
}, error => {
  console.log('Error: ', error);
});
```
The response is all info about the updated Task Instance, in this example a stand-alone task was updated so there
is no associated process:

```
adhocTaskCanBeReassigned: false
assignee: undefined
category: null
created: Mon Nov 13 2017 16:34:49 GMT+0000 (GMT) {}
description: "Updated description"
dueDate: Sat Feb 10 2018 11:00:00 GMT+0000 (GMT) {}
duration: NaN
endDate: null
executionId: null
formKey: "5005"
id: "80002"
initiatorCanCompleteTask: false
managerOfCandidateGroup: false
memberOfCandidateGroup: false
memberOfCandidateUsers: false
name: "Updated name"
parentTaskId: null
parentTaskName: null
priority: 50
processDefinitionCategory: null
processDefinitionDeploymentId: null
processDefinitionDescription: null
processDefinitionId: null
processDefinitionKey: null
processDefinitionName: null
processDefinitionVersion: 0
processInstanceId: null
processInstanceName: null
processInstanceStartUserId: null
taskDefinitionKey: null
``` 

#### createNewTask(task: TaskDetailsModel): Observable`<TaskDetailsModel>`
Create a new stand-alone Task Instance that is not associated with a Process Instance:

```ts
const taskDetails = new TaskDetailsModel({
  name: 'Some Task',
  description: 'A new stand-alone task'
});

this.tasklistService.createNewTask(taskDetails).subscribe( (createdTaskDetails: TaskDetailsModel) => {
  console.log('Created task details: ', createdTaskDetails);
}, error => {
  console.log('Error: ', error);
});
```

In this case we are creating a disconnected Task Instance that is not associated with a form (i.e. `formKey: null`) 
and that is not assigned to a user (i.e. `assignee: null`).

The response looks like this, we can see that an ID was generated for the Task Instance:

```
Created task details:  
    adhocTaskCanBeReassigned: false
    assignee: null
    category: null
    created: Mon Nov 13 2017 16:34:49 GMT+0000 (GMT) {}
    description: "A new stand-alone task"
    dueDate: null
    duration: null
    endDate: null
    executionId: null
    formKey: null
    id: "80002"
    initiatorCanCompleteTask: false
    involvedPeople: undefined
    managerOfCandidateGroup: false
    memberOfCandidateGroup: false
    memberOfCandidateUsers: false
    name: "Some Task"
    parentTaskId: null
    parentTaskName: null
    priority: 50
    processDefinitionCategory: null
    processDefinitionDeploymentId: null
    processDefinitionDescription: null
    processDefinitionId: null
    processDefinitionKey: null
    processDefinitionName: null
    processDefinitionVersion: 0
    processInstanceId: null
    processInstanceName: null
    processInstanceStartUserId: null
    taskDefinitionKey: null
```

See the `attachFormToATask` method for how to attach a form to the User Task. And see the `assignTaskByUserId` method
for how to assign a user to the new Task Instance.

#### attachFormToATask(taskId: string, formId: number): Observable`<any>`
Attach a form to a User Task:

```ts
const taskId = '80002'; 
const formId = 5005;
this.tasklistService.attachFormToATask(taskId, formId).subscribe( (response: any) => {
  console.log('Assign form response: ', response);
}, error => {
  console.log('Error: ', error);
});
```

In this case we need to have a task created and know the ID for it, such as with the `createNewTask` method.
We also need to have a form defined in APS and know the ID for it (you can see the ID for a form in the URL 
in APS when you work with it). See the `getFormList` method for how fetch a list of available forms.

The response will be `null` if form was attached successfully to task.  

#### getFormList(): Observable`<Form []>`
Get a list of the available reusable forms:

```ts
this.tasklistService.getFormList().subscribe( (formList: Form[]) => {
  console.log('Available forms: ', formList);
}, error => {
  console.log('Error: ', error);
});
```

A successful response looks like this:

```
Available forms:  

0:  
    id: 5005
    name: "Name Info"
1: {name: "cm:folder", id: 3012}
2: {name: "Alfresco Node Form", id: 3011}
3: {name: "Employee", id: 3010}
```

The form id property can be used with the `attachFormToATask` method.

**Note**. Referenced forms that are associated with specific tasks in a process are not included in this list. 
Only reusable forms are included.

#### addTask(task: TaskDetailsModel): Observable`<TaskDetailsModel>`
Add a Sub-Task (i.e. checklist task) to a parent Task Instance:

```ts
const parentTaskId = '80002';
const subTaskDetails = new TaskDetailsModel({
  parentTaskId: parentTaskId,
  name: 'Check the invoice amount'
});
this.tasklistService.addTask(subTaskDetails).subscribe( (updatedTaskDetails: TaskDetailsModel) => {
  console.log('Sub-task info: ', updatedTaskDetails);
}, error => {
  console.log('Error: ', error);
});
```

The response includes the new sub-task id and also parent task name.
In this example the parent task was just a stand-alone task, so no process information is included:

```
adhocTaskCanBeReassigned: false
assignee: null
category: null
created: Tue Nov 14 2017 13:32:41 GMT+0000 (GMT) {}
description: null
dueDate: null
duration: null
endDate: null
executionId: null
formKey: null
id: "80003"
initiatorCanCompleteTask: false
involvedPeople: undefined
managerOfCandidateGroup: false
memberOfCandidateGroup: false
memberOfCandidateUsers: false
name: "Check the invoice amount"
parentTaskId: "80002"
parentTaskName: "Some Task"
priority: 50
processDefinitionCategory: null
processDefinitionDeploymentId: null
processDefinitionDescription: null
processDefinitionId: null
processDefinitionKey: null
processDefinitionName: null
processDefinitionVersion: 0
processInstanceId: null
processInstanceName: null
processInstanceStartUserId:null
taskDefinitionKey: null
```

#### deleteTask(taskId: string): Observable`<TaskDetailsModel>`
Delete a Sub-Task (i.e. checklist task):

```ts
const taskId = '75100'; // Sub-task ID
this.tasklistService.deleteTask(taskId).subscribe( (taskDetails: TaskDetailsModel) => {
  console.log('Deleted task info: ', taskDetails);
}, error => {
  console.log('Error: ', error);
});
```

**Note**. you can only delete so called checklist tasks with this method. 

#### fetchTaskAuditJsonById(taskId: string): Observable`<any>`
Fetch Task Audit log as JSON for a Task Instance ID:

```ts
const taskId = '15368';
this.tasklistService.fetchTaskAuditJsonById(taskId)
  .subscribe( auditJson => {
    console.log('Task Audit: ', auditJson);
  }, error => {
    console.log('Error: ', error);
  });
```

The response is JSON object with the Task Instance audit log:

```
{
  taskId: "15368",
  taskName: "Approve by someone in Accounting",
  processInstanceId: "15361",
  processDefinitionName: "Process With Pooled task",
  processDefinitionVersion: 1,
  …
}
```

#### fetchTaskAuditPdfById(taskId: string): Observable`<Blob>`
Fetch Task Audit log as JSON for a Task Instance ID:

```ts
this.tasklistService.fetchTaskAuditPdfById(taskId)
  .subscribe( (auditPdf: Blob) => {
    console.log('Task Audit: ', auditPdf);
  }, error => {
    console.log('Error: ', error);
  });
```

The response is PDF with the Task Instance audit log.


<!-- seealso start -->

<!-- seealso end -->