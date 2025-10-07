---
Title: Base Card View Update Interface
Added: v6.0.0
Status: Active
Last reviewed: 2022-11-25
---

# [Base Card View Update interface](../../../lib/core/src/lib/card-view/interfaces/base-card-view-update.interface.ts "Defined in base-card-view-update.interface.ts")

Specifies required properties and methods for [Card View Update service](../../../lib/core/src/lib/card-view/services/card-view-update.service.ts).

## Basic usage

```ts
export interface BaseCardViewUpdate {
    itemUpdated$: Subject<UpdateNotification>;
    itemClicked$: Subject<ClickNotification>;
    updateItem$: Subject<CardViewBaseItemModel>;

    update(property: CardViewBaseItemModel, newValue: any);
    clicked(property: CardViewBaseItemModel);
    updateElement(notification: CardViewBaseItemModel);
}
```

## Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| itemUpdated$ | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`UpdateNotification`](../../../lib/core/src/lib/card-view/interfaces/update-notification.interface.ts)`>` | The current updated item. |
| itemClicked$ | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`ClickNotification`](../../../lib/core/src/lib/card-view/interfaces/click-notification.interface.ts)`>` | The current clicked item. |
| updateItem$ | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)`>` | The current model for the update item. |

### Methods

-   **update**(property: [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts), newValue: `any`)<br/>
    Update itemUpdated$ property.

    -   property:\_ [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  - The property.
    -   newValue:\_ `any`  - new value.

-   **clicked**(property: [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts))<br/>
    Update itemClicked$ property.

    -   property:\_ [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  - The property.

-   **updateElement**(notification: [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts))<br/>
    Update updateItem$ observable.
    -   notification:\_ [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  - The notification.

## See also

-   [CardViewUpdate service](../services/card-view-update.service.md)
