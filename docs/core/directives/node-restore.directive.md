---
Title: Node Restore directive
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Node Restore directive](../../../lib/core/directives/node-restore.directive.ts "Defined in node-restore.directive.ts")

Restores deleted nodes to their original location.

## Basic Usage

```html
<adf-toolbar title="toolbar example">
    <button mat-icon-button
        [adf-restore]="documentList.selection"
        (restore)="onRestore($event)">
        <mat-icon>restore</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList
    currentFolderId="-trash-" ...>
    ...
</adf-document-list>
```

```ts
    onRestore(restoreMessage: RestoreMessageModel) {
        this.notificationService
            .openSnackMessageAction(
                restoreMessage.message,
                restoreMessage.action
            )
            .onAction()
            .subscribe(() => this.navigateLocation(restoreMessage.path));
        this.documentList.reload();
    }

    navigateLocation(path: PathInfoEntity) {
        const parent = path.elements[path.elements.length - 1];
        this.router.navigate(['files/', parent.id]);
    }
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| selection | [`DeletedNodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DeletedNodeEntry.md)`[]` |  | Array of deleted nodes to restore. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| restore | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`RestoreMessageModel`](../../../lib/core/directives/node-restore.directive.ts)`>` | Emitted when restoration is complete. |

## Details

The directive takes a selection of [`DeletedNodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DeletedNodeEntry.md) instances and restores them to
their original locations. If the original location doesn't exist anymore then they remain
in the trash list.

When you restore a single node, you can use the `location` property to show where the node has
been restored. The property specifies the route path where the list of nodes are rendered.

## See Also

*   [Node delete directive](node-delete.directive.md)
