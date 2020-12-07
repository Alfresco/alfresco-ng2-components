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

*   **close**()<br/>
    Closes the currently-open dialog.
*   **openAddPermissionDialog**(node: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), title?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]>`<br/>
    Opens a dialog to add permissions to a node.
    *   *node:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - ID of the target node
    *   *title:* `string`  - (Optional) Dialog title
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]>` - Node with updated permissions
*   **updateNodePermissionByDialog**(nodeId?: `string`, title?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>`<br/>
    Opens a dialog to update permissions for a node.
    *   *nodeId:* `string`  - (Optional) ID of the target node
    *   *title:* `string`  - (Optional) Dialog title
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>` - Node with updated permissions

## Details

This service sets up an [Add Permission Dialog component](../components/add-permission-dialog.component.md) to provide a user
interface for updating permissions.

## See also

*   [Node Permission service](node-permission.service.md)
*   [Add Permission Dialog component](../components/add-permission-dialog.component.md)
