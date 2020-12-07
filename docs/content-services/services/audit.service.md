---
Title: Audit Service
Added: v3.9.0
Status: Active
Last reviewed: 2020-08-12
---

# [Audit Service](../../../lib/content-services/src/lib/audit/audit.service.ts "Defined in audit.service.ts")

Manages Audit apps and entries.

## Class members

### Methods

*   **deleteAuditEntries**(auditApplicationId: `string`, where: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Permanently delete audit entries for an audit application.
    *   *auditApplicationId:* `string`  - The identifier of an audit application.
    *   *where:* `string`  - Audit entries to permanently delete for an audit application, given an inclusive time period or range of ids.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` -
*   **deleteAuditEntry**(auditApplicationId: `string`, auditEntryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Permanently delete an audit entry.
    *   *auditApplicationId:* `string`  - The identifier of an audit application.
    *   *auditEntryId:* `string`  - The identifier of an audit entry.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` -
*   **getAuditApp**(auditApplicationId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppEntry`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditAppEntry.ts)`>`<br/>
    Get audit application info.
    *   *auditApplicationId:* `string`  - The identifier of an audit application.
    *   *opts:* `any`  - (Optional) Options.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppEntry`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditAppEntry.ts)`>` -
*   **getAuditApps**(opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditAppPaging.ts)`>`<br/>
    List audit applications.
    *   *opts:* `any`  - (Optional) Options.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditAppPaging.ts)`>` -
*   **getAuditEntries**(auditApplicationId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditEntryPaging.ts)`>`<br/>
    List audit entries for an audit application.
    *   *auditApplicationId:* `string`  - The identifier of an audit application.
    *   *opts:* `any`  - (Optional) Options.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditEntryPaging.ts)`>` -
*   **getAuditEntriesForNode**(nodeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditEntryPaging.ts)`>`<br/>
    List audit entries for a node.
    *   *nodeId:* `string`  - The identifier of a node.
    *   *opts:* `any`  - (Optional) Options.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditEntryPaging.ts)`>` -
*   **getAuditEntry**(auditApplicationId: `string`, auditEntryId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryEntry`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditEntryEntry.ts)`>`<br/>
    Get audit entry.
    *   *auditApplicationId:* `string`  - The identifier of an audit application.
    *   *auditEntryId:* `string`  - The identifier of an audit entry.
    *   *opts:* `any`  - (Optional) Options.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryEntry`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditEntryEntry.ts)`>` -
*   **updateAuditApp**(auditApplicationId: `string`, auditAppBodyUpdate: `boolean`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditApp`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditApp.ts)`|Function>`<br/>
    Update audit application info.
    *   *auditApplicationId:* `string`  - The identifier of an audit application.
    *   *auditAppBodyUpdate:* `boolean`  - The audit application to update.
    *   *opts:* `any`  - (Optional) Options.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditApp`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/auditApp.ts)`|Function>` -
