---
Title: Tag Node List component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Tag Node List component](../../../lib/content-services/src/lib/tag/tag-node-list.component.ts "Defined in tag-node-list.component.ts")

Shows tags for a node.

![Custom columns](../../docassets/images/tag1.png)

## Basic Usage

```html
<adf-tag-node-list 
    [nodeId]="nodeId">
</adf-tag-node-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| nodeId | `string` |  | The identifier of a node. |
| showDelete | `boolean` | true | Show delete button |

### Events

| Name | Type | Description |
| --- | --- | --- |
| results | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when a tag is selected. |
