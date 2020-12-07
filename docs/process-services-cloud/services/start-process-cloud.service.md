---
Title: Start Process Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-09
---

# [Start Process Cloud Service](../../../lib/process-services-cloud/src/lib/process/start-process/services/start-process-cloud.service.ts "Defined in start-process-cloud.service.ts")

Gets process definitions and starts processes.

## Class members

### Methods

*   **createProcess**(appName: `string`, payload: [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>`<br/>
    Create a process based on a process definition, name, form values or variables.
    *   *appName:* `string`  - name of the [Application](../../../lib/testing/src/lib/core/structure/application.ts)
    *   *payload:* [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)  - Details of the process (definition key, name, variables, etc)
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` - Details of the process instance just created
*   **deleteProcess**(appName: `string`, processInstanceId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Delete an existing process instance
    *   *appName:* `string`  - name of the [Application](../../../lib/testing/src/lib/core/structure/application.ts)
    *   *processInstanceId:* `string`  - process instance to update
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` -
*   **getBasePath**(appName: `string`): `string`<br/>

    *   *appName:* `string`  -
    *   **Returns** `string` -
*   **getProcessDefinitions**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/models/process-definition-cloud.model.ts)`[]>`<br/>
    Gets the process definitions associated with an app.
    *   *appName:* `string`  - Name of the target app
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/models/process-definition-cloud.model.ts)`[]>` - Array of process definitions
*   **startCreatedProcess**(appName: `string`, createdProcessInstanceId: `string`, payload: [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>`<br/>
    Starts an already created process using the process instance id.
    *   *appName:* `string`  -
    *   *createdProcessInstanceId:* `string`  - process instance id of the process previously created
    *   *payload:* [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` - Details of the process instance just started
*   **startProcess**(appName: `string`, payload: [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>`<br/>
    Starts a process based on a process definition, name, form values or variables.
    *   *appName:* `string`  - name of the [Application](../../../lib/testing/src/lib/core/structure/application.ts)
    *   *payload:* [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)  - Details of the process (definition key, name, variables, etc)
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` - Details of the process instance just started
*   **updateProcess**(appName: `string`, processInstanceId: `string`, payload: [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>`<br/>
    Update an existing process instance
    *   *appName:* `string`  - name of the [Application](../../../lib/testing/src/lib/core/structure/application.ts)
    *   *processInstanceId:* `string`  - process instance to update
    *   *payload:* [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)  - Details of the process (definition key, name, variables, etc)
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` - Details of the process instance just started

## Details

You can use the `startProcess` method in much the same way as the `startProcess` method in the
[Process service](../../process-services/services/process.service.md) (see the [Process service](../../process-services/services/process.service.md) page
for an example). However, the cloud version
combines the process details and variables conveniently into the
[`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts) object.

## See also

*   [Process service](../../process-services/services/process.service.md)
