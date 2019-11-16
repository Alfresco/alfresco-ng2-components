---
Title: Add Permission Dialog Component
Added: v2.4.0
Status: Active
Last reviewed: 2018-11-13
---

# [Add Permission Dialog Component](../../../lib/content-services/src/lib/permission-manager/components/add-permission/add-permission-dialog.component.ts "Defined in add-permission-dialog.component.ts")

Displays a dialog to search for people or groups to add to the current node permissions.

![Add Permission Component](../../docassets/images/add-permission-component.png)

## Basic Usage

```ts
import { NodePermissionDialogService } from '@alfresco/adf-content-services';

    constructor(private nodePermissionDialogService: nodePermissionDialogService) {
    }

    this.nodePermissionDialogService.openAddPermissionDialog(this.nodeId).subscribe((selectedNodes) => {
        //action for selected nodes
    },
    (error) => {
        this.showErrorMessage(error);
    });
```

## Details

This component extends the [Add permission panel component](add-permission-panel.component.md)
to apply the chosen selection of permissions when they are accepted.
You can open the dialog with the `openAddPermissionDialog` method from the
[Node Permission Dialog Service](../services/node-permission-dialog.service.md).
This returns an [`Observable`](http://reactivex.io/documentation/observable.html)
that you can subscribe to so you can get the details of the node after the update.
Use the `updateNodePermissionByDialog` nethod from the service to update node permissions, as shown in
the following example:

```ts
import { NodePermissionDialogService } from '@alfresco/adf-content-services';

    constructor(private nodePermissionDialogService: nodePermissionDialogService) {
    }

    this.nodePermissionDialogService.updateNodePermissionByDialog(this.nodeId).subscribe((node) => {
        //updated node
    },
    (error) => {
        this.showErrorMessage(error);
    });
```

## See also

-   [Node permission dialog service](../services/node-permission-dialog.service.md)
-   [Add permission panel component](add-permission-panel.component.md)
