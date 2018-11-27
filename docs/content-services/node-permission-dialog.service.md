---
Title: Node permission dialog service
Added: v2.4.0
Status: Active
Last reviewed: 2018-09-13
---

# Node permission dialog service

Displays dialogs to let the user set node permissions.

## Class members

### Methods

-   **close**()<br/>
    Closes the currently-open dialog.
-   **openAddPermissionDialog**(node: `Node`, title?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a dialog to add permissions to a node.
    -   _node:_ `Node`  - ID of the target node
    -   _title:_ `string`  - (Optional) Dialog title
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntity`](../content-services/document-library.model.md)`[]>` - Node with updated permissions
-   **updateNodePermissionByDialog**(nodeId?: `string`, title?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>`<br/>
    Opens a dialog to update permissions for a node.
    -   _nodeId:_ `string`  - (Optional) ID of the target node
    -   _title:_ `string`  - (Optional) Dialog title
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` - Node with updated permissions

## Details

This service sets up an [Add Permission Dialog component](../content-services/add-permission-dialog.component.md) to provide a user
interface for updating permissions. 

## See also

-   [Node Permission service](node-permission.service.md)
-   [Add Permission Dialog component](add-permission-dialog.component.md)
