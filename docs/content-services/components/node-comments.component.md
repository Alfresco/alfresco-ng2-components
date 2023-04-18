---
Title: Node Comments Component
Added: v5.1.0
Status: Active
---

# [Node Comments Component](../../../lib/content-services/src/lib/node-comments/node-comments.component.ts "Defined in node-comments.component.ts")

Displays comments from users involved in a specified content and allows an involved user to add a comment to a content.

![adf-comments](../../docassets/images/adf-comments.png)

## Basic Usage Task

```html
<adf-node-comments
    [nodeId]="YOUR_NODE_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-node-comments>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | nodeId of the document that has comments |
| readOnly | `boolean` |  | make the [comments component](../../core/components/comments.component.md) readOnly |
