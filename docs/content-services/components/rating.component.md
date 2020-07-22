---
Title: Rating component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-14
---

# [Rating component](../../../lib/content-services/src/lib/social/rating.component.ts "Defined in rating.component.ts")

Allows a user to add and remove rating to an item.

It displays the average rating and the number of ratings. If the user has not rated the item the average rating stars color is grey.

![Rating component screenshot](../../docassets/images/social3.png)

If the user has rated the item the average rating stars color is yellow.

![Rating component screenshot](../../docassets/images/social2.png)

In order to remove the rating the user should click on the same star that he rated.
If the average is decimal number it will be rounded.

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
| changeVote | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the "vote" gets changed. |

## See also

-   [Like component](like.component.md)
-   [Rating service](../services/rating.service.md)
