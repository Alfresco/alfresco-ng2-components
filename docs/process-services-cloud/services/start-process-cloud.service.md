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

-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getProcessDefinitions**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-definition-cloud.model.ts)`[]>`<br/>
    Gets the process definitions associated with an app.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-definition-cloud.model.ts)`[]>` - Array of process definitions
-   **startProcess**(appName: `string`, requestPayload: [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>`<br/>
    Starts a process based on a process definition, name, form values or variables.
    -   _appName:_ `string`  - name of the Application
    -   _requestPayload:_ [`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts)  - Details of the process (definition key, name, variables, etc)
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` - Details of the process instance just started

## Details

You can use the `startProcess` method in much the same way as the `startProcess` method in the
[Process service](../../process-services/services/process.service.md) (see the [Process service](../../process-services/services/process.service.md) page
for an example). However, the cloud version
combines the process details and variables conveniently into the
[`ProcessPayloadCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-payload-cloud.model.ts) object.

## See also

-   [Process service](../../process-services/services/process.service.md)
