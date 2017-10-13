# Node Restore directive

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
    <button md-icon-button
        [restoreLocation]="/files"
        [adf-node-restore]="documentList.selection"
        (restore)="documentList.reload()">
        <md-icon>restore</md-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList
    currentFolderId="-trash-" ...>
    ...
</adf-document-list>
```

### Properties

| Name              | Type                | Default | Description                      |
| ----------------- | ------------------- | ------- | -------------------------------  |
| adf-node-restore  | DeletedNodeEntry[]  | []      | Deleted nodes to restore         |
| restoreLocation   | string              | ''      | Route path to view restored node |

### Events

| Name      | Description                     |
| --------- | ------------------------------- |
| restore   | Raised when the restore is done |

## Details

'NodeRestoreDirective' directive takes a selection of `DeletedNodeEntry[]` and restores them in their original location.
If the original location doesn't exist anymore, then they remain in the trash list.

For single node restore, there is action to jump to the location where the node has been restored and for this `restoreLocation` is used to specify the route path where the list of nodes are rendered
