---
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-23
---

# Node permission dialog service

Displays dialogs to let the user set node permissions.

## Class members

### Methods

-   **close**()<br/>
    Closes the currently-open dialog.
-   **openAddPermissionDialog**(nodeId: `string` = `null`, title?: `string` = `null`): `Observable<MinimalNodeEntity[]>`<br/>
    Opens a dialog to add permissions to a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _title:_ `string`  - (Optional)Dialog title
    -   **Returns** `Observable<MinimalNodeEntity[]>` - Node with updated permissions
-   **updateNodePermissionByDialog**(nodeId?: `string` = `null`, title?: `string` = `null`): `Observable<MinimalNodeEntryEntity>`<br/>
    Opens a dialog to update permissions for a node.
    -   _nodeId:_ `string`  - (Optional)ID of the target node
    -   _title:_ `string`  - (Optional)Dialog title
    -   **Returns** `Observable<MinimalNodeEntryEntity>` - Node with updated permissions

## Details

This service sets up an [Add Permission Dialog component](../content-services/add-permission-dialog.component.md) to provide a user
interface for updating permissions. 

## See also

-   [Node Permission service](node-permission.service.md)
-   [Add Permission Dialog component](add-permission-dialog.component.md)
