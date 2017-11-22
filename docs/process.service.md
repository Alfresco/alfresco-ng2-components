# Process Service
Manage Process Instances, filters, variables, and audit log. 

## Importing

```ts
import { ProcessService, ProcessInstance, ProcessInstanceVariable, 
         ProcessDefinitionRepresentation, FilterProcessRepresentationModel,
         ProcessFilterParamRepresentationModel, TaskDetailsModel } from '@alfresco/adf-process-services';

export class SomePageComponent implements OnInit {

  constructor(private processService: ProcessService) {
  }
```

## Methods

#### getProcess(processInstanceId: string): Observable`<ProcessInstance>` 
Get Process Instance metadata for passed in Process Instance ID:

```ts
const processInstanceId = '11337';
this.processService.getProcess(processInstanceId).subscribe( (processInstance: ProcessInstance) => {
  console.log('ProcessInstance: ', processInstance);
  }, error => {
    console.log('Error: ', error);
  });
```

The `processInstanceId` refers to a process instance ID for a running process in APS.  
The returned `processInstance` object is of type `ProcessInstance` and looks like in this sample:

```
   businessKey: null
   ended: null
   graphicalNotationDefined: true
   id: "11337"
   name: "Invoice Approval 2 started from ADF client"
   processDefinitionCategory: "http://www.activiti.org/processdef"
   processDefinitionDeploymentId: "18"
   processDefinitionDescription: "This is a simple invoice approval process that allows a person to assign a dedicated approver for the the invoice. It will then be routed to the Accounting department for payment preparation. Once payment is prepared the invoice will be stored in a specific folder and an email notification will be sent."
   processDefinitionId: "InvoiceApprovalProcess:2:21"
   processDefinitionKey: "InvoiceApprovalProcess"
   processDefinitionName: "Invoice Approval Process"
   processDefinitionVersion: 2
   startFormDefined: true
   started: Tue Oct 10 2017 10:35:42 GMT+0100 (BST) {}
   startedBy: {id: 1, firstName: null, lastName: "Administrator", email: "admin@app.activiti.com"}
   suspended: false
   tenantId: "tenant_1"
   variables:  
        0: {name: "initiator", type: "string", value: "1"}
        1: {name: "approver", type: "long", value: 2002}
        2: {name: "companyemail", type: "string", value: "martin.bergljung@xxxxx.com"}
        3: {name: "invoicetobeapproved", value: null}
        4: {name: "invoiceFileName", type: "string", value: " - [Alfresco_Enterprise_Edition_3_3_Windows_Simple_Install.pdf]"}
        5: {name: "comments", value: null}
        6: {name: "form8outcome", type: "string", value: "Reject"}
```

#### startProcess(processDefinitionId: string, name: string, outcome?: string, startFormValues?: any, variables?: ProcessInstanceVariable[]): Observable`<ProcessInstance>`
Start a process based on passed in Process Definition, name, form values or variables.

When starting you can choose to pass in form field values or process variables (you cannot pass in both).
Here is an example of how to pass in form field values, these correspond to the 
start form that has been defined for the process:

```ts
const processDefinitionId = 'InvoiceApprovalProcess:2:21';
const name = 'Sample Invoice Process';
const outcome = null;
const startFormValues = {
  approver: 'admin@app.activiti.com',
  companyemail: 'someone@acme.com',
  invoicetobeapproved: null
};
this.processService.startProcess(processDefinitionId, name, outcome, startFormValues)
  .subscribe( (processInstance: ProcessInstance) => {
  console.log('ProcessInstance: ', processInstance);
}, error => {
  console.log('Error: ', error);
});
```

A `ProcessInstance` object is returned for a successfully started process:

```
businessKey: null
ended: null
graphicalNotationDefined: true
id: "75001"
name: "Sample Invoice Process"
processDefinitionCategory: "http://www.activiti.org/processdef"
processDefinitionDeploymentId: "18"
processDefinitionDescription: "This is a simple invoice approval process that allows a person to assign a dedicated approver for the the invoice. It will then be routed to the Accounting department for payment preparation. Once payment is prepared the invoice will be stored in a specific folder and an email notification will be sent."
processDefinitionId: "InvoiceApprovalProcess:2:21"
processDefinitionKey: "InvoiceApprovalProcess"
processDefinitionName: "Invoice Approval Process"
processDefinitionVersion: 2
startFormDefined: false
started: Thu Nov 09 2017 08:15:37 GMT+0000 (GMT) {}
startedBy: {id: 1, firstName: null, lastName: "Administrator", email: "admin@app.activiti.com"}
tenantId: "tenant_1"
variables:
    0: {name: "approver", value: null}
    1: {name: "companyemail", type: "string", value: "someone@acme.com"}
    2: {name: "initiator", type: "string", value: "1"}
    3: {name: "invoicetobeapproved", value: null}

```

We can see here that the form field values have been converted to process variables.

To start the process with process variables instead of form field values do:

```ts
const processDefinitionId = 'InvoiceApprovalProcess:2:21';
const name = 'Sample Invoice Process (Var)';
const variables: ProcessInstanceVariable[] = [
  {name: 'approver', value: 'admin@app.activiti.com'},
  {name: 'companyemail', value: 'someone@acme.com'},
  {name: 'invoicetobeapproved', value: null},
  {name: 'sampleVar', value: 'hello'}
];
this.processService.startProcess(processDefinitionId, name, null, null, variables)
  .subscribe( (processInstance: ProcessInstance) => {
  console.log('ProcessInstance: ', processInstance);
}, error => {
  console.log('Error: ', error);
});
```

If you want to start a process that has no start form and no process variables, then do:

```ts
const processDefinitionId = 'SimpleProcess:1:2';
const name = 'Sample Process';
this.processService.startProcess(processDefinitionId, name)
  .subscribe( (processInstance: ProcessInstance) => {
  console.log('ProcessInstance: ', processInstance);
}, error => {
  console.log('Error: ', error);
});
```
 
####  cancelProcess(processInstanceId: string): Observable`<void>`
Cancel a process instance by passing in its process instance ID:

```ts
const processInstanceId = '75012';
this.processService.cancelProcess(processInstanceId)
  .subscribe( response => {
  console.log('Response: ', response);
}, error => {
  console.log('Error: ', error);
});
```

The response is just `null` if the process instance was cancelled successfully.
Once a Process Instance is cancelled it will show up under processes with status
`completed`.

You typically get the `processInstanceId` when you start a process. It is then
contained in the `ProcessInstance.id` response. 

#### createOrUpdateProcessInstanceVariables(processDefinitionId: string, variables: ProcessInstanceVariable[]): Observable`<ProcessInstanceVariable[]>`
Create or update variables for a Process Instance: 

```ts
const processInstanceId = '75001';
const variables: ProcessInstanceVariable[] = [
  {name: 'sampleVar1', value: 'hello'},
  {name: 'sampleVar2', value: 'bye'}
];
this.processService.createOrUpdateProcessInstanceVariables(processInstanceId, variables)
  .subscribe( response => {
  console.log('Response: ', response);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of the successfully created `ProcessInstanceVariable`:

```
Response:  
    0: {name: "sampleVar1", type: "string", value: "hello", scope: "global"}
    1: {name: "sampleVar2", type: "string", value: "bye", scope: "global"}
```

If a variable already exist, then its value will be updated.

**Note**. you need to pass in a Process Instance ID here, not a Process Definition ID.

#### deleteProcessInstanceVariable(processDefinitionId: string, variableName: string): Observable`<void>`
Delete a variable for a Process Instance: 

```ts
const processInstanceId = '75001';
const variableName = 'sampleVar1';
this.processService.deleteProcessInstanceVariable(processInstanceId, variableName)
  .subscribe( response => {
  console.log('Response: ', response);
}, error => {
  console.log('Error: ', error);
});
```

The response will be `null` if the variable was successfully deleted from the Process Instance.
 
**Note**. you need to pass in a Process Instance ID here, not a Process Definition ID.

#### getProcessInstanceVariables(processDefinitionId: string): Observable`<ProcessInstanceVariable[]>` 
Get all the variables for a Process Instance: 

```ts
const processInstanceId = '75001';
this.processService.getProcessInstanceVariables(processInstanceId)
  .subscribe( (procVars: ProcessInstanceVariable[]) => {
  console.log('procVars: ', procVars);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `ProcessInstanceVariable`:

```
procVars:  
    0: {name: "approver", scope: "global", value: null, valueUrl: null}
    1: {name: "companyemail", scope: "global", value: "someone@acme.com", valueUrl: null}
    2: {name: "initiator", scope: "global", value: "1", valueUrl: null}
    3: {name: "sampleVar2", scope: "global", value: "bye", valueUrl: null}
    4: {name: "invoicetobeapproved", scope: "global", value: null, valueUrl: null}
    5: {name: "invoiceFileName", scope: "global", value: " - [UNKNOWN]", valueUrl: null}
```
 
**Note**. you need to pass in a Process Instance ID here, not a Process Definition ID.

 
#### getProcessDefinitions(appId?: number): Observable`<ProcessDefinitionRepresentation[]>`
Get Process Definitions associated with a Process App:

```ts
const processAppId = 2;
this.processService.getProcessDefinitions(processAppId)
  .subscribe( (procDefs: ProcessDefinitionRepresentation[]) => {
  console.log('ProceDefs: ', procDefs);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `ProcessDefinitionRepresentation` objects looking like in this example:

```
0:
    category: "http://www.activiti.org/processdef"
    deploymentId: "18"
    description: "This is a simple invoice approval process that allows a person to assign a dedicated approver for the the invoice. It will then be routed to the Accounting department for payment preparation. Once payment is prepared the invoice will be stored in a specific folder and an email notification will be sent."
    hasStartForm: true
    id: "InvoiceApprovalProcess:2:21"
    key: "InvoiceApprovalProcess"
    metaDataValues: []
    name: "Invoice Approval Process"
    tenantId: "tenant_1"
    version: 2
```

If you wanted a list of all available process definitions call the method without specifying the
process application ID:

```ts
this.processService.getProcessDefinitions()
  .subscribe( (procDefs: ProcessDefinitionRepresentation[]) => {
  console.log('ProceDefs: ', procDefs);
}, error => {
  console.log('Error: ', error);
});
```

#### createDefaultFilters(appId: number): Observable`<any[]>`
Create and return the default filters for a Process App:

```ts
const processAppId = 2;
this.processService.createDefaultFilters(processAppId)
  .subscribe( filters => {
  console.log('filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `FilterProcessRepresentationModel` objects:

```
filters:  
    0: {
       appId: 2
       filter:
            name: ""
            sort: "created-desc"
            state: "running"
       icon: "glyphicon-random"
       id: null
       index: undefined    
       name: "Running"
       recent: true
       }
    1: {id: null, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
    2: {id: null, appId: 2, name: "All", recent: true, icon: "glyphicon-th", …}
```

These filters can now be used to get matching process instances for Process App with ID 2, 
such as 'Running', 'Completed', and 'All' .

#### getProcessFilters(appId: number): Observable`<FilterProcessRepresentationModel[]>`
Get all filters defined for a Process App: 

```ts
const processAppId = 2;
this.processService.getProcessFilters(processAppId)
  .subscribe( (filters: FilterProcessRepresentationModel[]) => {
  console.log('filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `FilterProcessRepresentationModel` objects:

```
filters:  
    0: {id: 15, appId: 2, name: "Running", recent: true, icon: "glyphicon-random", …}
    1: {id: 14, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
    2: {id: 13, appId: 2, name: "All", recent: false, icon: "glyphicon-th", …}
    3: {id: 3003, appId: 2, name: "Running", recent: false, icon: "glyphicon-random", …}
    4: {id: 3004, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
    5: {id: 3005, appId: 2, name: "All", recent: false, icon: "glyphicon-th", …}
 
```
In this example I had run the `createDefaultFilters` method ones and that created the duplicate of 
the default filters.

These filters can now be used to get matching process instances for Process App with ID 2, 
such as 'Running', 'Completed', and 'All' .

#### getProcessFilterById(filterId: number, appId?: number): Observable`<FilterProcessRepresentationModel>` 
Get a specific Process Filter based on its ID, optionally pass in Process App ID to improve performance
when searching for filter: 

```ts
const processAppId = 2;
const filterId = 3003;
this.processService.getProcessFilterById(filterId, processAppId)
  .subscribe( (filter: FilterProcessRepresentationModel) => {
  console.log('filter: ', filter);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
filter: {sort: "created-desc", name: "", state: "running"}
icon: "glyphicon-random"
id: 3003
name: "Running"
recent: false
```

The filter can now be used to get 'Running' process instances for Process App with ID 2.

#### getProcessFilterByName(filterName: string, appId?: number): Observable`<FilterProcessRepresentationModel>` 
Get a specific Process Filter based on its name, optionally pass in Process App ID to improve performance
when searching for filter: 

```ts
const processAppId = 2;
const filterName = 'Running';
this.processService.getProcessFilterByName(filterName, processAppId)
  .subscribe( (filter: FilterProcessRepresentationModel) => {
  console.log('filter: ', filter);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
filter: {sort: "created-desc", name: "", state: "running"}
icon: "glyphicon-random"
id: 15
name: "Running"
recent: true
```
If there are several filters with the same name for the Process App, then you get back the 
first one found matching the name.

The filter can now be used to get 'Running' process instances for Process App with ID 2.

#### addProcessFilter(filter: FilterProcessRepresentationModel): Observable`<FilterProcessRepresentationModel>`
Add a new Process Instance filter: 

```ts
const processAppId = 2;
const filterName = 'RunningAsc';
const filterRunningAsc = new FilterProcessRepresentationModel({
  'name': filterName,
  'appId': processAppId,
  'recent': true,
  'icon': 'glyphicon-random',
  'filter': { 'sort': 'created-asc', 'name': 'runningasc', 'state': 'running' }
});
this.processService.addProcessFilter(filterRunningAsc)
  .subscribe( (filterResponse: FilterProcessRepresentationModel) => {
  console.log('filterResponse: ', filterResponse);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
icon: "glyphicon-random"
id: 3008
name: "RunningAsc"
recent: false
```

The filter can now be used to get 'Running' process instances for 
Process App with ID 2 in created date ascending order. 

See also the `getRunningFilterInstance` method.

#### getRunningFilterInstance(appId: number): FilterProcessRepresentationModel
Convenience method to create and return a filter that matches `running` process instances 
for passed in Process App ID: 

```ts
const processAppId = 2;
const runningFilter: FilterProcessRepresentationModel = this.processService.getRunningFilterInstance(processAppId);
console.log('Running filter', runningFilter);
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
filter: {sort: "created-desc", name: "", state: "running"}
icon: "glyphicon-random"
id: null
index: undefined
name: "Running"
recent: true
```

The filter can now be used to get 'Running' process instances for 
Process App with ID 2 in created date ascending order.

#### getProcessInstances(requestNode: ProcessFilterParamRepresentationModel, processDefinitionKey?: string): Observable`<ProcessInstance[]>`
Get Process Instances for passed in filter and optionally Process Definition: 

```ts
const processDefKey = 'InvoiceApprovalProcess';
const filterRunningAsc = new ProcessFilterParamRepresentationModel({
'state': 'running',
'sort': 'created-asc',
});
this.processService.getProcessInstances(filterRunningAsc, processDefKey)
  .subscribe( (processInstances: ProcessInstance[]) => {
  console.log('Process Instances: ', processInstances);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `ProcessInstance` objects as in this example:

```
    0: {id: "7501", name: "Invoice Approval Process - October 9th 2017", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:3:2511", tenantId: "tenant_1", …}
    1: {id: "7520", name: "Invoice Approval Process - October 9th 2017", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:2:21", tenantId: "tenant_1", …}
    2: {id: "8206", name: "Invoice Approval Process - October 9th 2017", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:2:21", tenantId: "tenant_1", …}
    3: {id: "8302", name: "Invoice Approval Process - October 9th 2017", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:2:21", tenantId: "tenant_1", …}
    4: {id: "11337", name: "Invoice Approval 2 started from ADF client", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:2:21", tenantId: "tenant_1", …}
    5: {id: "11437", name: "Invoice Approval Process - October 10th 2017", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:2:21", tenantId: "tenant_1", …}
    6: {id: "67143", name: "Sample Invoice Approval 2017-10-26", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:5:62514", tenantId: "tenant_1", …}
    7: {id: "75001", name: "Sample Invoice Process", businessKey: null, processDefinitionId: "InvoiceApprovalProcess:2:21", tenantId: "tenant_1", …}
```
You can also narrow down the search via other properties in the `ProcessFilterParamRepresentationModel`, such as
`processDefinitionId` and `appDefinitionId`.
The number of Process Instances that are returned can be controlled with the `page` and `size` properties.

#### getProcessTasks(processInstanceId: string, state?: string): Observable`<TaskDetailsModel[]>`
Get Task Instances for passed in Process Instance, optionally filter by task state: 

```ts
const processInstanceId = '75001';
this.processService.getProcessTasks(processInstanceId)
  .subscribe( (taskInstances: TaskDetailsModel[]) => {
  console.log('Task Instances: ', taskInstances);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `TaskDetailsModel` objects as in this example:

```
{
    "size":1,
    "total":1,
    "start":0,
    "data":[
        {"id":"75010",
        "name":"Approve Invoice  - [Invoice 123]",
        "description":null,
        "category":null,
        "assignee":{"id":1,"firstName":null,"lastName":"Administrator","email":"admin@app.activiti.com"},
        "created":"2017-11-09T08:15:37.427+0000",
        "dueDate":null,
        "endDate":null,
        "duration":null,
        "priority":50,
        "parentTaskId":null,
        "parentTaskName":null,
        "processInstanceId":"75001",
        "processInstanceName":null,
        "processDefinitionId":"InvoiceApprovalProcess:2:21",
        "processDefinitionName":"Invoice Approval Process",
        "processDefinitionDescription":"This is a simple invoice approval process that allows a person to assign a dedicated approver for the the invoice. It will then be routed to the Accounting department for payment preparation. Once payment is prepared the invoice will be stored in a specific folder and an email notification will be sent.",
        "processDefinitionKey":"InvoiceApprovalProcess",
        "processDefinitionCategory":"http://www.activiti.org/processdef",
        "processDefinitionVersion":2,
        "processDefinitionDeploymentId":"18",
        "formKey":"8",
        "processInstanceStartUserId":null,
        "initiatorCanCompleteTask":false,
        "adhocTaskCanBeReassigned":false,
        "taskDefinitionKey":"approveInvoice",
        "executionId":"75001",
        "memberOfCandidateGroup":false,
        "memberOfCandidateUsers":false,
        "managerOfCandidateGroup":false
        }
        ]
}
```
You can also filter by task state, which can be `active` or `completed`:

```ts
const processInstanceId = '75001';
const taskState = 'active';
this.processService.getProcessTasks(processInstanceId, taskState)
  .subscribe( (taskInstances: TaskDetailsModel[]) => {
  console.log('Task Instances: ', taskInstances);
}, error => {
  console.log('Error: ', error);
});
```

#### fetchProcessAuditJsonById(processId: string): Observable`<any>`
Fetch Process Audit log as JSON for a Process Instance ID: 

```ts
const processInstanceId = '75001';
this.processService.fetchProcessAuditJsonById(processInstanceId)
  .subscribe( auditJson => {
  console.log('Process Audit: ', auditJson);
}, error => {
  console.log('Error: ', error);
});
```

The response is JSON object with the Process Instance audit log:

```
{
  "processInstanceId": "75001",
  "processInstanceName": "Sample Invoice Process",
  "processDefinitionName": "Invoice Approval Process",
  "processDefinitionVersion": "2",
  "processInstanceStartTime": "Thu Nov 09 08:15:37 GMT 2017",
  "processInstanceEndTime": null,
  "processInstanceDurationInMillis": null,
  "processInstanceInitiator": " Administrator",
  "entries": [
    {
      "index": 1,
      "type": "startForm",
      "selectedOutcome": null,
      "formData": [
        {
          "fieldName": "Approver",
          "fieldId": "approver",
          "value": ""
        },
        {
          "fieldName": "Company Email",
          "fieldId": "companyemail",
          "value": "someone@acme.com"
        },
        {
          "fieldName": "Invoice to be approved",
          "fieldId": "invoicetobeapproved",
          "value": ""
        }
      ],
      "taskName": null,
      "taskAssignee": null,
      "activityId": null,
      "activityName": null,
      "activityType": null,
      "startTime": null,
      "endTime": null,
      "durationInMillis": null
    },
    {
      "index": 2,
      "type": "activityExecuted",
      "selectedOutcome": null,
      "formData": [],
      "taskName": null,
      "taskAssignee": null,
      "activityId": "startInvoiceProcess",
      "activityName": "Start Invoice Process",
      "activityType": "startEvent",
      "startTime": "Thu Nov 09 08:15:37 GMT 2017",
      "endTime": "Thu Nov 09 08:15:37 GMT 2017",
      "durationInMillis": 37
    },
    {
      "index": 3,
      "type": "activityExecuted",
      "selectedOutcome": null,
      "formData": [],
      "taskName": null,
      "taskAssignee": null,
      "activityId": "approveInvoice",
      "activityName": "Approve Invoice",
      "activityType": "userTask",
      "startTime": "Thu Nov 09 08:15:37 GMT 2017",
      "endTime": null,
      "durationInMillis": null
    },
    {
      "index": 4,
      "type": "taskCreated",
      "selectedOutcome": null,
      "formData": [],
      "taskName": "Approve Invoice  - [UNKNOWN]",
      "taskAssignee": " Administrator",
      "activityId": null,
      "activityName": null,
      "activityType": null,
      "startTime": "Thu Nov 09 08:15:37 GMT 2017",
      "endTime": null,
      "durationInMillis": null
    }
  ],
  "decisionInfo": {
    "calculatedValues": [],
    "appliedRules": []
  }
}
```

#### fetchProcessAuditPdfById(processId: string): Observable`<Blob>`
Fetch Process Audit log as a PDF for a Process Instance ID: 

```ts
const processInstanceId = '75001';
this.processService.fetchProcessAuditPdfById(processInstanceId)
  .subscribe( auditPdf => {
  console.log('Process Audit log BLOB: ', auditPdf);
}, error => {
  console.log('Error: ', error);
});
```

The response is a BLOB as follows:

```
Process Audit log BLOB:  Blob {size: 124511, type: "text/xml"}
```


<!-- seealso start -->

<!-- seealso end -->