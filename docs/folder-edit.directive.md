# Folder Edit directive

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
<adf-toolbar title="toolbar example">
    <button mat-icon-button
            [adf-edit-folder]="documentList.selection[0]?.entry">
        <mat-icon>create</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
    ...
</adf-document-list>
```

### Properties

| Name              | Type                   | Default | Description                          |
| ----------------- | ---------------------- | ------- | -----------------------------------  |
| adf-edit-folder   | MinimalNodeEntryEntity |         | The folder node entity for editing   |

## Details

'FolderEditDirective' directive needs a selection folder entry of #documentList to open the folder dialog component to edit the name and description properties of that selected folder.
If data is valid, on dialog close, it emits folderEdit event.