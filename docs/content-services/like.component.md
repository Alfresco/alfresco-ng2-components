---
Added: v2.0.0
Status: Active
---

# Like component

Allows a user to add "likes" to an item.

![Custom columns](../docassets/images/social1.png)

## Basic Usage

```html
<adf-like [nodeId]="nodeId"></adf-like>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | Identifier of a node to apply likes to. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| changeVote | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` | Emitted when the "vote" gets changed. |

## See also

-   [Rating component](rating.component.md)
-   [Rating service](rating.service.md)
