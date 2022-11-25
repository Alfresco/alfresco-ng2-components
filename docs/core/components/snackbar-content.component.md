---
Title: Snackbar Content Component
Added: v5.1.0
Status: Active
Last reviewed: 2022-11-08
---

# [Snackbar Content Component](../../../lib/core/src/lib/snackbar-content/snackbar-content.component.ts "Defined in snackbar-content.component.ts")

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

## Details

Snackbar allows using action as string by default which causes that there is no possibility to use mat-icon inside snackbar's content. 
That custom content for Angular material Snackbar allows for that. 
