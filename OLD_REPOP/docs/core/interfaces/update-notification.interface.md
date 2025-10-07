---
Title: Update Notification Interface
Added: v6.0.0
Status: Active
Last reviewed: 2022-11-25
---

# [Update Notification Interface](../../../lib/core/src/lib/card-view/interfaces/update-notification.interface.ts "Defined in update-notification.interface.ts")

## Basic usage

```ts
export interface UpdateNotification {
     target: CardViewBaseItemModel;
     changed: any;
 }
```

## Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| target | [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts) | The target for the update notification. |
| changed | `any` | The changed value on the update notification. |

## See also

-   [BaseCardViewUpdate interface](../interfaces/base-card-view-update.interface.md)
