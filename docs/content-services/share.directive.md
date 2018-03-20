---
Added: v2.2.0
Status: Active
---
# Node Share directive

Allows folders and/or files to be shared

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            [adf-share-dialog]="documentList.selection">
            <mat-icon>get_app</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| node | `MinimalNodeEntity` |  | Nodes to share.  |
