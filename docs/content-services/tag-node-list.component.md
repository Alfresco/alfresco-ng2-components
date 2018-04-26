---
Added: v2.0.0
Status: Active
---

# Tag Node List component

Shows tags for a node.

![Custom columns](../docassets/images/tag1.png)

## Basic Usage

```html
<adf-tag-node-list 
    [nodeId]="nodeId">
</adf-tag-node-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| nodeId | `string` |  | The identifier of a node. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| results | `EventEmitter<Object>` | Emitted when a tag is selected. |
