---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-10
---

# Folder Create directive

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
| -- | -- | -- | -- |
| adf-create-folder | `string` |  DEFAULT_FOLDER_PARENT_ID | Parent folder where the new folder will be located after creation. |
| title | `string` |  null | The title of the opened dialog. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| error | `EventEmitter<any>` | Emitted when an error occurs (for example a folder with same name already exists) |
| success | `EventEmitter<MinimalNodeEntryEntity>` | Emitted when the creation successfully happened |

## Details

Pass this directive the id of the parent folder where you want the new folder node to be created.
If no value is provided, the '-my-' alias is used.
This will open a Folder Dialog component to receive data for the new folder. If the data is valid
then the dialog will emit a `folderCreate` event when it closes.
