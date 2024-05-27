---
Title: AdditionalDialogActionButton Interface
Added: v6.10.0
Status: Active
Last reviewed: 2024-05-24
---

# [AdditionalDialogActionButton Interface](../../../lib/content-services/src/lib/dialogs/dialog/dialog-data.interface.ts "Defined in dialog-data.interface.ts")

Specifies interface for [Dialog Component](../dialogs/dialog.md).

## Basic usage

```ts
interface AdditionalDialogActionButton {
    title: string;
    onClick: (args?: any) => void;
    class?: string;
}
```

## Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` |    | Button title. |
| onClick | `(args?: any) => void` |    | Callback for button. (optional) |
| class | `string` |    | Button class. (optional) |

Note that in order for the design to be displayed well, it is necessary to provide no more than 2 additional buttons.

## See also

- [Dialog Component](../dialogs/dialog.md)
- [Dialog Model](../models/dialog.model.md)
- [DialogData Interface](./dialog.interface.md)
