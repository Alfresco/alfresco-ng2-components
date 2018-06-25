---
Added: v2.2.0
Status: Active
Last reviewed: 2018-04-10
---

# Node Download directive

Allows folders and/or files to be downloaded, with multiple nodes packed as a '.ZIP' archive.

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

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| adfNodeDownload | [`MinimalNodeEntity`](../content-services/document-library.model.md)`[]` |  | Nodes to download. |
