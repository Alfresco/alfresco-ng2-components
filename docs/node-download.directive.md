---
Added: v2.2.0
Status: Active
---
# Node Download directive

Allows folders and/or files to be downloaded. Multiple nodes are packed as a '.ZIP' archive.

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            [adfNodeDownload]="documentList.selection">
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
| nodes | `MinimalNodeEntity[]` |  | Nodes to download.  |
