---
Title: Folder Edit directive
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Folder Edit directive](../../../lib/content-services/src/lib/folder-directive/folder-edit.directive.ts "Defined in folder-edit.directive.ts")

Allows folders to be edited.

## Basic Usage

```html
<adf-toolbar title="toolbar example">
    <button mat-icon-button
            [adf-edit-folder]="documentList.selection[0]?.entry"
            title="Title of the dialog"
            (success)="doSomething($event)">
        <mat-icon>create</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
    ...
</adf-document-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| folder | [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) |  | Folder node to edit. |
| title | `string` | null | Title of folder edit dialog. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs (eg, a folder with same name already exists). |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`>` | Emitted when the folder has been edited successfully. |

## Details

Pass this directive a folder to edit its name and description using a [Folder Dialog component](../../../lib/content-services/dialogs/folder.dialog.ts).
If the data is valid then the dialog emits a `folderEdit` event when it closes.
