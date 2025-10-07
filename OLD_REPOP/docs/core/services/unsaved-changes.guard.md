---
Title: Unsaved Changes guard
Added: v6.6.0
Status: Active
Last reviewed: 2024-02-06
---

# [Unsaved Changes guard](../../../lib/core/src/lib/dialogs/unsaved-changes-dialog/unsaved-changes.guard.ts "Defined in unsaved-changes.guard.ts")

This guard prevents deactivating route if page has any unsaved changes. User needs intentionally discard changes through displayed modal to leave actual route.

## Class members

### Methods

-   **canDeactivate**(): `boolean` | [`Observable`](https://rxjs.dev/guide/observable)`<boolean>`<br/>
    Allows to deactivate route when there is no unsaved changes, otherwise displays dialog to confirm discarding changes.
    -   **Returns** `boolean` | [`Observable`](https://rxjs.dev/guide/observable)`<boolean>` - true when there is no unsaved changes or changes can be discarded, false otherwise.

## See also

-   [Unsaved Changes Dialog component](../dialogs/unsaved-changes-dialog.component.md)
