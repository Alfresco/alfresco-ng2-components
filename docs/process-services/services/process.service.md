---
Title: Process Service
Added: v2.0.0
Status: Active
Last reviewed: 2019-03-20
---

# [Process Service](../../../lib/process-services/src/lib/process-list/services/process.service.ts "Defined in process.service.ts")

Manages process instances, process variables, and process audit Log.

## Class members

### Methods

*   **cancelProcess**(processInstanceId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Cancels a process instance.
    *   *processInstanceId:* `string`  - ID of process to cancel
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - Null response notifying when the operation is complete
*   **createOrUpdateProcessInstanceVariables**(processInstanceId: `string`, variables: [`RestVariable`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/RestVariable.md)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceVariable`](../../../lib/process-services/src/lib/process-list/models/process-instance-variable.model.ts)`[]>`<br/>
    Creates or updates variables for a process instance.
    *   *processInstanceId:* `string`  - ID of the target process
    *   *variables:* [`RestVariable`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/RestVariable.md)`[]`  - Variables to update
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceVariable`](../../../lib/process-services/src/lib/process-list/models/process-instance-variable.model.ts)`[]>` - Array of instance variable info
*   **deleteProcessInstanceVariable**(processInstanceId: `string`, variableName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Deletes a variable for a process instance.
    *   *processInstanceId:* `string`  - ID of the target process
    *   *variableName:* `string`  - Name of the variable to delete
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - Null response notifying when the operation is complete
*   **fetchProcessAuditJsonById**(processId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Fetches the Process Audit information in a JSON format.
    *   *processId:* `string`  - ID of the target process
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - JSON data
*   **fetchProcessAuditPdfById**(processId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>`<br/>
    Fetches the Process Audit information as a PDF.
    *   *processId:* `string`  - ID of the target process
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>` - Binary PDF data
*   **getProcess**(processInstanceId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstance`](../../../lib/process-services/src/lib/process-list/models/process-instance.model.ts)`>`<br/>
    Gets Process Instance metadata.
    *   *processInstanceId:* `string`  - ID of the target process
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstance`](../../../lib/process-services/src/lib/process-list/models/process-instance.model.ts)`>` - Metadata for the instance
*   **getProcessDefinitions**(appId?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/ProcessDefinitionRepresentation.md)`[]>`<br/>
    Gets process definitions associated with an app.
    *   *appId:* `number`  - (Optional) ID of a target app
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/ProcessDefinitionRepresentation.md)`[]>` - Array of process definitions
*   **getProcessInstanceVariables**(processInstanceId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceVariable`](../../../lib/process-services/src/lib/process-list/models/process-instance-variable.model.ts)`[]>`<br/>
    Gets the variables for a process instance.
    *   *processInstanceId:* `string`  - ID of the target process
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceVariable`](../../../lib/process-services/src/lib/process-list/models/process-instance-variable.model.ts)`[]>` - Array of instance variable info
*   **getProcessInstances**(requestNode: [`ProcessFilterParamRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts), processDefinitionKey?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessListModel`](../../../lib/process-services/src/lib/process-list/models/process-list.model.ts)`>`<br/>
    Gets process instances for a filter and optionally a process definition.
    *   *requestNode:* [`ProcessFilterParamRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)  - Filter for instances
    *   *processDefinitionKey:* `string`  - (Optional) Limits returned instances to a process definition
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessListModel`](../../../lib/process-services/src/lib/process-list/models/process-list.model.ts)`>` - List of process instances
*   **getProcessTasks**(processInstanceId: `string`, state?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`[]>`<br/>
    Gets task instances for a process instance.
    *   *processInstanceId:* `string`  - ID of the process instance
    *   *state:* `string`  - (Optional) Task state filter (can be "active" or "completed")
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsModel`](../../../lib/process-services/src/lib/task-list/models/task-details.model.ts)`[]>` - Array of task instance details
*   **getProcesses**(requestNode: [`ProcessFilterParamRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts), processDefinitionKey?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessListModel`](../../../lib/process-services/src/lib/process-list/models/process-list.model.ts)`>`<br/>
    Gets processes for a filter and optionally a process definition.
    *   *requestNode:* [`ProcessFilterParamRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)  - Filter for instances
    *   *processDefinitionKey:* `string`  - (Optional) Limits returned instances to a process definition
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessListModel`](../../../lib/process-services/src/lib/process-list/models/process-list.model.ts)`>` - List of processes
*   **startProcess**(processDefinitionId: `string`, name: `string`, outcome?: `string`, startFormValues?: [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts), variables?: [`ProcessInstanceVariable`](../../../lib/process-services/src/lib/process-list/models/process-instance-variable.model.ts)`[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstance`](../../../lib/process-services/src/lib/process-list/models/process-instance.model.ts)`>`<br/>
    Starts a process based on a process definition, name, form values or variables.
    *   *processDefinitionId:* `string`  - Process definition ID
    *   *name:* `string`  - Process name
    *   *outcome:* `string`  - (Optional) Process outcome
    *   *startFormValues:* [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts)  - (Optional) Values for the start form
    *   *variables:* [`ProcessInstanceVariable`](../../../lib/process-services/src/lib/process-list/models/process-instance-variable.model.ts)`[]`  - (Optional) Array of process instance variables
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstance`](../../../lib/process-services/src/lib/process-list/models/process-instance.model.ts)`>` - Details of the process instance just started

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

A [`ProcessInstance`](../../../lib/process-services/src/lib/process-list/models/process-instance.model.ts) object is returned for a successfully started process. This implements the
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
