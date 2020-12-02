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

*   **getDeployedApplicationsByStatus**(status: `string`, role?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ApplicationInstanceModel`](../../../lib/process-services-cloud/src/lib/app/models/application-instance.model.ts)`[]>`<br/>
    Gets a list of deployed apps for this user by status.
    *   *status:* `string`  - Required status value
    *   *role:* `string`  - (Optional) to filter the apps
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ApplicationInstanceModel`](../../../lib/process-services-cloud/src/lib/app/models/application-instance.model.ts)`[]>` - The list of deployed apps
*   **hasDeployedApps**(): `boolean`<br/>

    *   **Returns** `boolean` -
*   **loadApps**()<br/>

## Details

This service implements some features of the [Apps process service](../../core/services/apps-process.service.md)
with modifications for cloud use.

## See also

*   [Apps process service](../../core/services/apps-process.service.md)
