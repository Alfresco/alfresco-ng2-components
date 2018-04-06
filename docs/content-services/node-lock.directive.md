---
Added: v2.2.0
Status: Active
---
# Node Lock directive

Call [`ContentNodeDialogService.openLockNodeDialog(nodeEntry)`](./content-node-dialog.service.md) method on click event,
and disable target button if provided node is not a file or user don't have permissions.

## Basic Usage

```html
<button mat-icon-button [adf-node-lock]="node.entry">
    <mat-icon>lock</mat-icon> Lock file
</button>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| node | `MinimalNodeEntryEntity` |  | Node to lock.  |
