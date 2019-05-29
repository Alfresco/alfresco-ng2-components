---
Title: Apps Process Cloud Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-09
---

# [Apps Process Cloud Service](../../../lib/process-services-cloud/src/lib/app/services/apps-process-cloud.service.ts "Defined in apps-process-cloud.service.ts")

Gets details of deployed apps for the current user. 

## Class members

### Methods

-   **getDeployedApplicationsByStatus**(status: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ApplicationInstanceModel`](../../../lib/process-services-cloud/src/lib/app/models/application-instance.model.ts)`[]>`<br/>
    Gets a list of deployed apps for this user by status.
    -   _status:_ `string`  - Required status value
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ApplicationInstanceModel`](../../../lib/process-services-cloud/src/lib/app/models/application-instance.model.ts)`[]>` - The list of deployed apps.

    You can override the behaviour by defining the required applications in app.config.json against the property `alfresco-deployed-apps`. The service will fetch the deployed apps only when there are no apps defined in the app.config.json

## Details

This service implements some features of the [Apps process service](../../core/services/apps-process.service.md)
with modifications for cloud use.

## See also

-   [Apps process service](../../core/services/apps-process.service.md)
