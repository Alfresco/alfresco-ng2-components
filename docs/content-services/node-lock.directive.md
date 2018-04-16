---
Added: v2.2.0
Status: Active
Last reviewed: 2018-04-10
---

# Node Lock directive

Locks a node.

When the directive is clicked a dialog is shown and you can lock or unlock a file (folder cannot be locked)
there are two types of lock: indefinite lock and time lock.
If the time is not selected the user will lock the file it until will not unlock it
When a file is locked it can be locked and unlocked by default only by the user that creates the lock but you can also allow the other file owners to modify it 
![adf-lock](../docassets/images/lock-directive.png)

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