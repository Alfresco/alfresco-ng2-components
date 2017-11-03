# Folder Create directive

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            [adf-create-folder]="documentList.currentFolderId">
            <mat-icon>create_new_folder</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

### Properties

| Name              | Type                | Default   | Description                                                       |
| ----------------- | ------------------- | --------- | ----------------------------------------------------------------- |
| adf-create-folder | string              | '-my-'    | Parent folder where the new folder will be located after creation |

## Details

'FolderCreateDirective' directive needs the id of the parent folder where we want the new folder node to be created. If no value is provided, the '-my-' alias is used.
It opens the FolderDialogComponent to receive data for the new folder. If data is valid, on dialog close, it emits folderCreate event.