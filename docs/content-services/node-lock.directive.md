---
Added: v2.2.0
Status: Active
Last reviewed: 2018-04-10
---

# Node Lock directive

Locks a node.

## Basic Usage

```html
<button mat-icon-button [adf-node-lock]="node.entry">
    <mat-icon>lock</mat-icon> Lock file
</button>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| adf-node-lock | `MinimalNodeEntryEntity` |  | Node to lock.  |

## Details

This calls the `openLockNodeDialog` method from the
[Content Node Dialog service](content-node-dialog.service.md) method when clicked,
and disables the target button if the provided node is not a file or the user doesn't
have permissions.