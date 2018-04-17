---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-10
---

# Folder Edit directive

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
| -- | -- | -- | -- |
| adf-edit-folder | `MinimalNodeEntryEntity` |  | Folder node to edit. |
| title | `string` |  null | The title of the opened dialog. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| error | `EventEmitter<any>` | Emitted when an error occurs (for example a folder with same name already exists) |
| success | `EventEmitter<MinimalNodeEntryEntity>` | Emitted when the edition successfully happened |

## Details

Pass this directive a folder to edit its name and description using a Folder Dialog component.
If the data is valid then the dialog emits a `folderEdit` event when it closes.
