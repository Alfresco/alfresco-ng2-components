---
Added: v2.0.0
Status: Active
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
| selection | `MinimalNodeEntity[]` |  | Array of nodes to delete.  |
| permanent | `boolean` | `false` | If true then the nodes are deleted immediately rather than being put in the trash. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| delete | `EventEmitter<any>` | Emitted when the nodes have been deleted.  |

## Details

See **Demo Shell**

## See also

-   [Node Restore directive](node-restore.directive.md)
