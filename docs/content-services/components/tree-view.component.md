---
Title: Tree View component
Added: v3.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Tree View component](../../../lib/content-services/src/lib/tree-view/components/tree-view.component.ts "Defined in tree-view.component.ts")

Shows the folder and subfolders of a node as a tree view.

![TreeView component screenshot](../../docassets/images/tree-view.png)

## Basic Usage

```html
<adf-tree-view-list [nodeId]="'74cd8a96-8a21-47e5-9b3b-a1b3e296787d'" 
                    (nodeClicked)="onClick($event)">
</adf-tree-view-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| nodeId | `string` |  | Identifier of the node to display. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an invalid node id is given. |
| nodeClicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` | Emitted when a node in the tree view is clicked. |
