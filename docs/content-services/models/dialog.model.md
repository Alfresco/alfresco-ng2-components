---
Title: Dialog Size model
Added: v6.9.0
Status: Active
Last reviewed: 2024-05-17
---

# [Dialog Size model](../../../lib/content-services/src/lib/dialogs/dialog/dialog.model.ts "Defined in dialog.model.ts")

Sets a specific CSS class to [Dialog Component](../dialogs/dialog.md). 

## Basic usage

```ts
export const DialogSize = {
    Large: 'adf-large',
    Medium: 'adf-medium',
    Alert: 'adf-alert'
} as const;

export type DialogSizes = typeof DialogSize[keyof typeof DialogSize];
```

## Properties

| [`Property`](../../../lib/content-services/src/lib/content-metadata/interfaces/property.interface.ts) 
| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| Large | `string` | `adf-large` | Add `afd-large` class to Dialog container |
| Medium | `string` | `adf-medium` | Add `afd-medium` class to Dialog container |
| Alert | `string` | `adf-alert` | Add `afd-alert` class to Dialog container |

### Examples

If you want to change the style on rows where the user can create content: 

```ts
constructor(private dialog: MatDialog) {}

...

function openDialog() {
    const data: DialogData = {
        title: 'Dialog title',
        dialogSize: DialogSize.Large,
    };

    this.dialog.open(DialogComponent, { data });
}
```

## See also

- [Dialog Component](../dialogs/dialog.md)
- [Dialog Data Interface](../interfaces/dialog.interface.md)
