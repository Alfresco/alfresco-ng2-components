---
Title: Process List Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-03-25
---

# [Process List Cloud Service](../../../lib/process-services-cloud/src/lib/process/process-list/services/process-list-cloud.service.ts "Defined in process-list-cloud.service.ts")

Searches processes.

## Class members

### Methods

-   **getAdminProcessByRequest**(requestNode: [`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts), queryUrl?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Finds a process using an object with optional query properties in admin app.
    -   _requestNode:_ [`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts)  - Query object
    -   _queryUrl:_ `string`  - (Optional) Query url
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Process information
-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getProcessByRequest**(requestNode: [`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts), queryUrl?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Finds a process using an object with optional query properties.
    -   _requestNode:_ [`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts)  - Query object
    -   _queryUrl:_ `string`  - (Optional) Query url
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Process information

## Details

Note that for a call to `getProcessByRequest`, the
[`ProcessQueryCloudRequestModel`](../../../lib/process-services-cloud/src/lib/process/process-list/models/process-cloud-query-request.model.ts) object
must at minimum have the `appName` property correctly set.

## Activiti 7

If you are generating a project for Activiti 7, you must add the list of apps you want to use in **app.config.json** .

For example :

```json
  "alfresco-deployed-apps" : [{"name": "simple-app"}]
```

## See also

-   [App list cloud component](../components/app-list-cloud.component.md)
