---
Added: v2.0.0
Status: Active
---

# Rating component

Allows a user to add ratings to an item.

![Rating component screenshot](../docassets/images/social2.png)

## Basic Usage

```html
<adf-rating  
    [nodeId]="'74cd8a96-8a21-47e5-9b3b-a1b3e296787d'">
</adf-rating>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | Identifier of the node to apply the rating to. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| changeVote | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` | Emitted when the "vote" gets changed. |

## See also

-   [Like component](like.component.md)
-   [Rating service](rating.service.md)
