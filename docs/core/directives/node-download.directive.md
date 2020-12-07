---
Title: Node Download directive
Added: v2.2.0
Status: Active
Last reviewed: 2018-11-20
---

# [Node Download directive](../../../lib/core/directives/node-download.directive.ts "Defined in node-download.directive.ts")

Allows folders and/or files to be downloaded, with multiple nodes packed as a '.ZIP' archive.

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            [adfNodeDownload]="documentList.selection"
            [version]="version">
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
| --- | --- | --- | --- |
| nodes | [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`  \|  `[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]` |  | Nodes to download. |
| version | `VersionEntry` |  | Node's version to download. |
