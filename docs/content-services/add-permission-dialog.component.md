---
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-03
---

# Add Permission Dialog Component

Displays a dialog to search for people or groups to add to the current node permissions.

![Add Permission Component](../docassets/images/add-permission-component.png)

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

This component extends the [Add permission panel component](../content-services/add-permission-panel.component.md)
to apply the chosen selection of permissions when they are accepted.
You can open the dialog with the [Node Permission Dialog Service](../content-services/node-permission-dialog.service.md). This returns Observables that
you can subscribe to for get the details of the node after the update.
Use the `updateNodePermissionByDialog` from the service to update node permissions, as shown in
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

-   [Node permission dialog service](node-permission-dialog.service.md)
-   [Add permission panel component](add-permission-panel.component.md)
