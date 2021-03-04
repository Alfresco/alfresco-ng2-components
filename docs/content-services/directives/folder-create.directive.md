---
Title: Folder Create directive
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Folder Create directive](../../../lib/content-services/src/lib/folder-directive/folder-create.directive.ts "Defined in folder-create.directive.ts")

Creates folders.

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            [adf-create-folder]="documentList.currentFolderId"
            title="Title of the dialog"
            (success)="doSomething($event)">
            <mat-icon>create_new_folder</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeType | `string` | "cm:folder" | Type of node to create. |
| parentNodeId | `string` |  | Parent folder where the new folder will be located after creation. |
| title | `string` | null | Title of folder creation dialog. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs (eg, a folder with same name already exists). |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Node>` | Emitted when the folder is created successfully. |

## Details

Pass this directive the id of the parent folder where you want the new folder node to be created.
If no value is provided, the '-my-' alias is used.
This will open a [Folder Dialog component](../../../lib/content-services/dialogs/folder.dialog.ts) to receive data for the new folder. If the data is valid
then the dialog will emit a `success` event when it closes.

## See also

-   [Folder Edit directive](folder-edit.directive.md)
