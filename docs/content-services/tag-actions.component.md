---
Added: v2.0.0
Status: Active
---
# Tag Node Actions List component

Shows available actions for tags.

![Custom columns](../docassets/images/tag3.png)

## Basic Usage

```html
<adf-tag-node-actions-list 
    [nodeId]="nodeId">
</adf-tag-node-actions-list>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | The identifier of a node.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| successAdd | `EventEmitter<any>` | Emitted when a tag is added successfully. |
| error | `EventEmitter<any>` | Emitted when an error occurs. |
| result | `EventEmitter<{}>` | Emitted when an action is chosen. |
