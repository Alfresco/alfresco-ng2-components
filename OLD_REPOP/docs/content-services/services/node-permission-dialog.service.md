---
Title: Node permission dialog service
Added: v2.4.0
Status: Active
Last reviewed: 2019-01-16
---

# [Node permission dialog service](../../../lib/content-services/src/lib/permission-manager/services/node-permission-dialog.service.ts "Defined in node-permission-dialog.service.ts")

Displays dialogs to let the user set node permissions.

## Class members

### Methods

-   **close**()<br/>
    Closes the currently-open dialog.
-   **openAddPermissionDialog**(node: `Node`, roles: [`RoleModel`](../../../lib/content-services/src/lib/permission-manager/models/role.model.ts)`[]`, title?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]>`<br/>
    Opens a dialog to add permissions to a node.
    -   _node:_ `Node`  - target node
    -   _roles:_ [`RoleModel`](../../../lib/content-services/src/lib/permission-manager/models/role.model.ts)`[]`  - settable roles for the node
    -   _title:_ `string`  - (Optional) Dialog title
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`[]>` - Node with updated permissions
-   **updateNodePermissionByDialog**(nodeId?: `string`, title?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>`<br/>
    Opens a dialog to update permissions for a node.
    -   _nodeId:_ `string`  - (Optional) ID of the target node
    -   _title:_ `string`  - (Optional) Dialog title
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Node>` - Node with updated permissions

## Details

This service sets up an [Add Permission Dialog component](../components/add-permission-dialog.component.md) to provide a user
interface for updating permissions.

## See also

-   [Node Permission service](node-permission.service.md)
-   [Add Permission Dialog component](../components/add-permission-dialog.component.md)
