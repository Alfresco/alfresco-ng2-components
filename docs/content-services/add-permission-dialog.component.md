---
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-03
---

# Add Permission Dialog Component

Allow user to search people or group that could be added to the current node permissions.

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

## Class members

## Details

This component extends the [Add permission panel component](../add-permission-panel.component.md) 
and apply the action confirm when the selection made is accepted.
The dialog will be opened via the nodePermissionDialogService which will provide an Observable to subscribe to for getting the node selected.
In case you want the dialog service to take care of update the current node you can call `updateNodePermissionByDialog` in this way : 

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
