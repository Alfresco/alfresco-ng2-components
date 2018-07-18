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

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| node | [`MinimalNodeEntryEntity`](../content-services/document-library.model.md) |  | Node to lock/unlock. |

## Details

When the decorated element (eg, div) is clicked, a dialog is shown to let you lock
or unlock a file (a folder cannot be locked).

There are two types of lock: indefinite lock and time lock.
If the time is not selected the user will lock the file it until will not unlock it
When a file is locked it can be locked and unlocked by default only by the user that creates the lock but you can also allow the other file owners to modify it 
![adf-lock](../docassets/images/lock-directive.png)

This calls the `openLockNodeDialog` method from the
[Content Node Dialog service](content-node-dialog.service.md) method when clicked,
and disables the target button if the provided node is not a file or the user doesn't
have permissions.
