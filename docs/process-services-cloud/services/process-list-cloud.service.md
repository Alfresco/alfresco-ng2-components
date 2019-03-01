---
Title: Process List Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-02-06
---

# [Process List Cloud Service](../../../lib/process-services-cloud/src/lib/process/process-list/services/process-list-cloud.service.ts "Defined in process-list-cloud.service.ts")

Searches processes. 

## Class members

### Methods

-   **getProcessByRequest**(requestNode: [`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Finds a process using an object with optional query properties.
    -   _requestNode:_ [`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts)  - Query object
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Process information

## Details

Note that for a call to `getProcessByRequest`, the
[`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts) object
must at minimum have the `appName` property correctly set.
