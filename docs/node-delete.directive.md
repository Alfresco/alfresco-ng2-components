# Node Delete directive

Delete multiple files and folders

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
    <button md-icon-button
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
