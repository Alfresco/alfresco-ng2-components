---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-10
---

# Node Restore directive

Restores deleted nodes to their original location.

## Basic Usage

```html
<adf-toolbar title="toolbar example">
    <button mat-icon-button
        location="/files"
        [adf-restore]="documentList.selection"
        (restore)="documentList.reload()">
        <mat-icon>restore</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList
    currentFolderId="-trash-" ...>
    ...
</adf-document-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| location | `string` | "" | Path to restored node. |
| adf-restore | `DeletedNodeEntry[]` |  | Array of deleted nodes to restore. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| restore | `EventEmitter<any>` | Emitted when restoration is complete. |

## Details

The directive takes a selection of `DeletedNodeEntry` instances and restores them to
their original locations. If the original location doesn't exist anymore then they remain
in the trash list.

When you restore a single node, you can use the `location` property to show where the node has
been restored. The property specifies the route path where the list of nodes are rendered.

## See Also

-   [Node delete directive](node-delete.directive.md)
