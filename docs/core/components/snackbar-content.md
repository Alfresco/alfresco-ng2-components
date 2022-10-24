---
Title: Sorting Picker Component
Added: v5.0.0
Status: Active
Last reviewed: 2022-10-21
---

# [Snackbar Content Component](lib/core/src/lib/snackbar-content/snackbar-content.component.ts "Defined in snackbar-content.component.ts")

Custom content for Snackbar which allows use icon as action.

## Basic Usage

```ts
snackBar.openFromComponent(SnackbarContentComponent, {
    data: {
        message: 'Some message',
        actionLabel: "Some action label",
        showAction: true
    }
});
```

## Class members

### Properties

| Name | Type           | Default value | Description                                                      |
|------|----------------|---------------|------------------------------------------------------------------|
| data | `SnackbarData` | false         | Object which is injected into snackbar's content with it's data. |

### Snackbar Data

| Name        | Type      | Default value | Description                                                             |
|-------------|-----------|---------------|-------------------------------------------------------------------------|
| actionLabel | `string`  | false         | Displayed action as a text.                                             |
| actionIcon  | `string`  | false         | Displayed action as an material icon.                                   |
| message     | `string`  | false         | Visible snackbar's message for user.                                    |
| showAction     | `boolean` | false         | True if action should be visible, false in other case.                  |
| callActionOnIconClick     | `boolean` | false         | True if clicking on icon should to trigger action, false in other case. |

## Details

Snackbar allows using action as string by default which causes that there is no possibility to use mat-icon inside snackbar's content. 
That custom content for Angular material Snackbar allows for that. 
