---
Title: Dialog Data Interface
Added: v6.9.0
Status: Active
Last reviewed: 2024-05-17
---

# [Dialog Component](../../../lib/content-services/src/lib/dialogs/dialog/dialog-data.interface.ts "Defined in dialog-data.interface.ts")

Specifies interface for [Dialog Component](../dialogs/dialog.md).

## Basic usage

```ts
interface DialogData {
    title: string;
    description?: string;
    confirmButtonTitle?: string;
    cancelButtonTitle?: string;
    isConfirmButtonDisabled$?: Subject<boolean>;
    isCloseButtonHidden?: boolean;
    isCancelButtonHidden?: boolean;
    dialogSize?: DialogSizes;
    contentTemplate?: TemplateRef<any>;
    actionsTemplate?: TemplateRef<any>;
    descriptionTemplate?: TemplateRef<any>;
    headerIcon?: string;
}
```

## Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` | `no` | It will be placed in the dialog title section. |
| headerIcon | `string` | `no` | It will be placed in header section. Should be used with Alert dialogs. (optional) |
| description | `string` | `no` | It will be placed first in the dialog content section. (optional) |
| confirmButtonTitle | `string` | `COMMON.APPLY` | Confirmation action. After this, the dialog is closed and the `isConfirmButtonDisabled$` is set to `true`. (optional) |
| cancelButtonTitle | `string` | `COMMON.CANCEL` | Cancellation action. After this, the dialog is closed |
| isCancelButtonHidden | `boolean` | `false` | Toggles cancel button visibility. (optional) |
| isCloseButtonHidden | `boolean` | `false` | Toggles close button visibility. (optional) |
| isConfirmButtonDisabled$ | `Subject<boolean>` | `false` | Toggles confirm button disability. (optional) |
| dialogSize | `DialogSize` | `Medium` | Set dialog size. Can be `Large`, `Medium`, `Alert`. (optional) |
| contentTemplate | `TemplateRef<any>` | `no` | Inserts a content template. (optional) |
| actionsTemplate | `TemplateRef<any>` | `no` | Inserts a template styled on the left. Should be used for additional `ghost` style buttons. (optional) |
| descriptionTemplate | `TemplateRef<any>` | `no` | Inserts a description template. (optional) |

## See also

- [Dialog Component](../dialogs/dialog.md)
- [Dialog Model](../models/dialog.model.md)
