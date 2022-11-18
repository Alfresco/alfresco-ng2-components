---
Title: Node Delete directive
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Node Delete directive](../../../lib/content-services/src/lib/directives/node-delete.directive.ts "Defined in node-delete.directive.ts")

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

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| permanent | `boolean` | false | If true then the nodes are deleted immediately rather than being put in the trash |
| selection | [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[] \| DeletedNodeEntity[]` |  | Array of nodes to delete. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| delete | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the nodes have been deleted. |

## Details

Note that if a target item is already in the trashcan (and is therefore a `DeletedNodeEntity`) then
this action will delete the file permanently.

## See also

-   [Node Restore directive](node-restore.directive.md)
