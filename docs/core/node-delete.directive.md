---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-21
---

# Node Delete directive

Deletes multiple files and folders.

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            (delete)="documentList.reload()"
            [adf-delete]="documentList.selection">
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| selection | `MinimalNodeEntity[] | DeletedNodeEntity[]` |  | Array of nodes to delete.  |
| permanent | `boolean` | `false` | If true then the nodes are deleted immediately rather than being put in the trash. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| delete | `EventEmitter<any>` | Emitted when the nodes have been deleted.  |

## Details

Note that if a target item is already in the trashcan (and is therefore a `DeletedNodeEntity`) then
this action will delete the file permanently.

## See also

-   [Node Restore directive](node-restore.directive.md)
