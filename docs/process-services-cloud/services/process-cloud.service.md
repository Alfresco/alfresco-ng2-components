---
Title: Process Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-03-15
---

# [Process Cloud Service](../../../lib/process-services-cloud/src/lib/process/services/process-cloud.service.ts "Defined in process-cloud.service.ts")

Manages cloud process instances.

## Class members

### Methods

-   **cancelProcess**(appName: `string`, processInstanceId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>`<br/>
    Cancels a process.
    -   _appName:_ `string`  - Name of the app
    -   _processInstanceId:_ `string`  - Id of the process to cancel
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` - Operation Information
-   **getApplicationVersions**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ApplicationVersionModel`](../../../lib/process-services-cloud/src/lib/models/application-version.model.ts)`[]>`<br/>
    Gets the application versions associated with an app.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ApplicationVersionModel`](../../../lib/process-services-cloud/src/lib/models/application-version.model.ts)`[]>` - Array of Application Version Models
-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getProcessDefinitions**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/models/process-definition-cloud.model.ts)`[]>`<br/>
    Gets the process definitions associated with an app.
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessDefinitionCloud`](../../../lib/process-services-cloud/src/lib/models/process-definition-cloud.model.ts)`[]>` - Array of process definitions
-   **getProcessInstanceById**(appName: `string`, processInstanceId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>`<br/>
    Gets details of a process instance.
    -   _appName:_ `string`  - Name of the app
    -   _processInstanceId:_ `string`  - ID of the process instance whose details you want
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` - Process instance details

## Details

The methods work in much the same way as the equivalent methods in the
[Process list Cloud Component](../components/process-list-cloud.component.md)
but they use the cloud variants of the classes for return values. See the
[Process list Cloud Service](process-list-cloud.service.md) page for usage examples.

## See also

-   [Process list Cloud Service](process-list-cloud.service.md)
-   [Process header cloud component](../../process-services-cloud/components/process-header-cloud.component.md)
