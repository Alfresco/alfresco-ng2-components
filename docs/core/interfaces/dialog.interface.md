---
Title: Dialog Data Interface
Added: v6.10.0
Status: Active
Last reviewed: 2024-05-24
---

# [Dialog Data Interface](../../../lib/core/src/lib/dialogs/dialog/dialog-data.interface.ts "Defined in dialog-data.interface.ts")

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
    additionalActionButtons?: AdditionalDialogActionButton[];
    componentData: any;
}
```

## Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` |    | It will be placed in the dialog title section. |
| headerIcon | `string` |    | It will be placed in header section. Should be used with Alert dialogs. (optional) |
| description | `string` |    | It will be placed first in the dialog content section. Non-scrollable content. (optional) |
| confirmButtonTitle | `string` | `COMMON.APPLY` | Confirmation action. After this, the dialog is closed and the `isConfirmButtonDisabled$` is set to `true`. (optional) |
| cancelButtonTitle | `string` | `COMMON.CANCEL` | Cancellation action. After this, the dialog is closed |
| isCancelButtonHidden | `boolean` | `false` | Toggles cancel button visibility. (optional) |
| isCloseButtonHidden | `boolean` | `false` | Toggles close button visibility. (optional) |
| isConfirmButtonDisabled$ | `Subject<boolean>` | `false` | Toggles confirm button disability. (optional) |
| dialogSize | `DialogSize` | `Medium` | Set dialog size. Can be `Large`, `Medium`, `Alert`. (optional) |
| contentText | `string` |    | Inserts a content text. (optional) |
| contentComponent | `Type<any>` |    | Inserts a content component. (optional) |
| contentTemplate | `TemplateRef<any>` |    | Inserts a content template. (optional) |
| actionsTemplate | `TemplateRef<any>` |    | Inserts a template styled on the left. Should be used for additional `mat-button` style buttons. (optional) |
| descriptionTemplate | `TemplateRef<any>` |    | Inserts a description template. (optional) |
| additionalActionButtons | `AdditionalDialogActionButton[]` |    | Inserts additional base-styled buttons into the action bar on the left. (optional) |
| componentData | `any` |    | Data that injected in contentComponent. (optional) |

## See also

- [Dialog Component](../dialogs/dialog.md)
- [Dialog Model](../models/dialog.model.md)
- [AdditionalDialogActionButton Interface](./additional-dialog-action-button.interface.md)
