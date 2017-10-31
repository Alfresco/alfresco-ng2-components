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

| Name              | Type                | Default | Description                 |
| ----------------- | ------------------- | ------- | --------------------------- |
| adf-delete        | MinimalNodeEntity[] | []      | Nodes to delete             |
| permanent         | boolean             | false   | Permanent delete            |

### Events

| Name                      | Description                                  |
| ------------------------- | -------------------------------------------- |
| delete                    | emitted when delete process is done          |

## Details

See **Demo Shell**
