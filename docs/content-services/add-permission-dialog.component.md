---
Added: v2.3.0
Status: Active
Last reviewed: 2018-03-23
---

# Add Permission Component

Allow user to search people or group that could be added to the current node permissions.

![Permission List](../docassets/images/adf-permission-list.png)

## Basic Usage

```ts
    this.addPermissionDialogService.openAddPermissionDialog(this.nodeId).subscribe(() => {
        this.displayPermissionComponent.reload();
    },
        (error) => {
            this.showErrorMessage(error);
        });
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| nodeId | `string` | "" |  |

### Events

| Name | Type | Description |
| -- | -- | -- |
| success | `EventEmitter<MinimalNodeEntryEntity>` |  |
| error | `EventEmitter<any>` |  |

## Details

This component extends the [Add permission panel component](../add-permission-panel.component.md) 
and apply the action confirm when the selection made is accepted.
The dialog will be opened via the addPermissionDialogService which will provide an Observable to subscribe to for getting the operation result.