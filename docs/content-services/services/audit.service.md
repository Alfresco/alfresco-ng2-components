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

-   **deleteAuditEntries**(auditApplicationId: `string`, where: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Permanently delete audit entries for an audit application.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _where:_ `string`  - Audit entries to permanently delete for an audit application, given an inclusive time period or range of ids.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - 
-   **deleteAuditEntry**(auditApplicationId: `string`, auditEntryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Permanently delete an audit entry.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _auditEntryId:_ `string`  - The identifier of an audit entry.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - 
-   **getAuditApp**(auditApplicationId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditAppEntry>`<br/>
    Get audit application info.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditAppEntry>` - status of an audit application.
-   **getAuditApps**(opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditAppPaging>`<br/>
    Gets a list of audit applications.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditAppPaging>` - a list of the audit applications.
-   **getAuditEntries**(auditApplicationId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditEntryPaging>`<br/>
    List audit entries for an audit application.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditEntryPaging>` - a list of audit entries.
-   **getAuditEntriesForNode**(nodeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditEntryPaging>`<br/>
    List audit entries for a node.
    -   _nodeId:_ `string`  - The identifier of a node.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditEntryPaging>` - 
-   **getAuditEntry**(auditApplicationId: `string`, auditEntryId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditEntryEntry>`<br/>
    Get audit entry.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _auditEntryId:_ `string`  - The identifier of an audit entry.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditEntryEntry>` - audit entry.
-   **updateAuditApp**(auditApplicationId: `string`, auditAppBodyUpdate: `boolean`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditApp|any>`<br/>
    Update audit application info.
    -   _auditApplicationId:_ `string`  - The identifier of an audit application.
    -   _auditAppBodyUpdate:_ `boolean`  - The audit application to update.
    -   _opts:_ `any`  - (Optional) Options.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuditApp|any>` -
