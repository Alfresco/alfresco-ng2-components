---
Added: v2.0.0
Status: Active
---
# Process Service

Manages Process Instances, Process Variables, and Process Audit Log. 

## Methods

-   `getProcessInstances(requestNode: ProcessFilterParamRepresentationModel, processDefinitionKey?: string): Observable<ProcessListModel>`  
    Get process instances for a filter and optionally a process definition.  
    -   `requestNode` - Filter for instances
    -   `processDefinitionKey` - (Optional) Limits returned instances to a process definition
-   `fetchProcessAuditPdfById(processId: string): Observable<Blob>`  
    Fetches the Process Audit information as a pdf  
    -   `processId` - ID of the target process
-   `fetchProcessAuditJsonById(processId: string): Observable<any>`  
    Fetches the Process Audit information in a json format.  
    -   `processId` - ID of the target process
-   `getProcess(processInstanceId: string): Observable<ProcessInstance>`  
    Gets Process Instance metadata.  
    -   `processInstanceId` - ID of the target process
-   `getProcessTasks(processInstanceId: string, state?: string): Observable<TaskDetailsModel[]>`  
    Gets task instances for a process instance.  
    -   `processInstanceId` - ID of the process instance
    -   `state` - (Optional) Task state filter (can be "active" or "completed")
-   `getProcessDefinitions(appId?: number): Observable<ProcessDefinitionRepresentation[]>`  
    Gets process definitions associated with an app.  
    -   `appId` - (Optional) ID of a target app
-   `getProcessDefinitionVersions(appId?: number): Observable<ProcessDefinitionRepresentation[]>`  
    Gets the versions of process definitions associated with an app.  
    -   `appId` - (Optional) ID of a target app
-   `startProcess(processDefinitionId: string, name: string, outcome?: string, startFormValues?: FormValues, variables?: ProcessInstanceVariable[]): Observable<ProcessInstance>`  
    Starts a process based on a process definition, name, form values or variables.  
    -   `processDefinitionId` - Process definition ID
    -   `name` - Process name
    -   `outcome` - (Optional) Process outcome
    -   `startFormValues` - (Optional) Values for the start form
    -   `variables` - (Optional) Array of process instance variables
-   `cancelProcess(processInstanceId: string): Observable<void>`  
    Cancels a process instance.  
    -   `processInstanceId` - ID of process to cancel
-   `getProcessInstanceVariables(processInstanceId: string): Observable<ProcessInstanceVariable[]>`  
    Gets the variables for a process instance.  
    -   `processInstanceId` - ID of the target process
-   `createOrUpdateProcessInstanceVariables(processInstanceId: string, variables: ProcessInstanceVariable[]): Observable<ProcessInstanceVariable[]>`  
    Creates or updates variables for a process instance.  
    -   `processInstanceId` - ID of the target process
    -   `variables` - Variables to update
-   `deleteProcessInstanceVariable(processInstanceId: string, variableName: string): Observable<void>`  
    Deletes a variable for a process instance.  
    -   `processInstanceId` - ID of the target process
    -   `variableName` - Name of the variable to delete

## Details

Parameter and return value classes are defined in the Alfresco JS API. See the
[Activiti REST API](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api)
pages for further information.

### Importing

```ts
import { ProcessService, ProcessInstance, ProcessInstanceVariable, 
         ProcessDefinitionRepresentation, ProcessFilterParamRepresentationModel, TaskDetailsModel } from '@alfresco/adf-process-services';

export class SomePageComponent implements OnInit {

  constructor(private processService: ProcessService) {
  }
```

### Example of starting a process

When starting a process, you can choose to pass in form field values or process variables
but not both in the same call.

In this example, values are supplied to the start form that has been defined for the process:

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

A `ProcessInstance` object is returned for a successfully started process. This implements the
[ProcessInstanceRepresentation interface](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/ProcessInstanceRepresentation.md).

You can start the process with process variables instead of form field values using
code like the following:

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

You can also start a process that has no start form and no process variables:

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
