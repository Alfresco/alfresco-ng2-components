---
Title: Edit JSON Dialog
Added: v3.5.0
Status: Active
Last reviewed: 2019-09-17
---

# [Edit JSON Dialog](../../../lib/testing/src/lib/core/dialog/edit-json-dialog.ts "Defined in edit-json-dialog.ts")

Allows a user to preview or edit a JSON content in a dialog.

## Basic usage

```ts
import { EditJsonDialogSettings, EditJsonDialogComponent } from '@alfresco/adf-core';

const settings: EditJsonDialogSettings = {
    title: 'Edit Json',
    editable: true,
    value: `{ "hello": "world" }`
};

this.dialog.open(EditJsonDialogComponent, {
    data: settings,
    minWidth: '50%',
    minHeight: '50%'
})
.afterClosed()
.subscribe((value: string) => {
    // do something with the updated value
});
```
