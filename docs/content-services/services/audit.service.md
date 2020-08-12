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

-   **getAuditApps**(opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditAppPaging.md)`>`<br/>
    List audit applications.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditAppPaging.md)`>` - Target Audit Apps.
-   **getAuditApp**(auditApplicationId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditAppEntry.md)`>`<br/>
    Get audit application info.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditAppEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditAppEntry.md)`>` - Target Audit App.
-   **updateAuditApp**(auditApplicationId: `string`, auditAppBodyUpdate: `boolean`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditApp`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditApp.md)` | {}>`<br/>
    Update audit application info.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _auditAppBodyUpdate:_ `boolean`  - The audit application to update.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns**  - Information about audit application that were updated
-   **getAuditEntries**(auditApplicationId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditEntryPaging.md)`>`<br/>
    List audit entries for an audit application.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns**  - A list of audit entries for audit application.
-   **getAuditEntry**(auditApplicationId: `string`, auditEntryId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditEntryEntry.md)`>`<br/>
    Get audit entry.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _auditEntryId:_ `string`  - The identifier of an audit entry.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns**  - Targe audit entry.
-   **getAuditEntriesForNode**(nodeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditEntryPaging.md)`>`<br/>
    List audit entries for a node.
    -   _nodeId:_ `string`  - The identifier of a node.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AuditEntryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/AuditEntryPaging.md)`>` - A list of audit entries for node.
-   **deleteAuditEntries**(auditApplicationId: `string`, where: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Permanently delete audit entries for an audit application.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _where:_ `string`  - Audit entries to permanently delete for an audit application, given an inclusive time period or range of ids.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - empty response body
-   **deleteAuditEntry**(auditApplicationId: `string`, auditEntryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Permanently delete an audit entry.
    -   _auditApplicationId:_ `string` - The identifier of an audit application.
    -   _auditEntryId:_ `string` - The identifier of an audit entry.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - empty response body

