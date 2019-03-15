---
Title: Process Header Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-03-15
---

# [Process Header Cloud Service](../../../lib/process-services-cloud/src/lib/process/process-header/services/process-header-cloud.service.ts "Defined in process-header-cloud.service.ts")

Manages cloud process instances. 

## Class members

### Methods

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
