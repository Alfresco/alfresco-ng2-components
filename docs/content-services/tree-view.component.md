---
Added: v2.6.1
Status: Active
---

# Rating component

Allow a user to show the folder and subfolders of a node in a tree view

![TreeView component screenshot](../docassets/images/tree-view.png)

## Basic Usage

```html
<adf-tree-view-list [nodeId]="'74cd8a96-8a21-47e5-9b3b-a1b3e296787d'" 
                    (nodeClicked)="onClick($event)">
</adf-tree-view-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | Identifier of the node to apply the rating to. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| nodeClicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<TreeBaseNode>` | Emitted when a node on the tree view is clicked |
