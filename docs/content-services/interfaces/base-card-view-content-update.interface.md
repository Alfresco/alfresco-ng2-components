---
Title: Base Card View Content Update interface
Added: v6.0.0
Status: Active
Last reviewed: 2022-11-25
---

# [Base Card View Content Update interface](../../../lib/content-services/src/lib/interfaces/base-card-view-content-update.interface.ts "Defined in base-card-view-content-update.interface.ts")

Specifies required properties and methods for [Card View Content Update service](lib/content-services/src/lib/common/services/card-view-content-update.service.ts).
Extends from [`BaseCardViewUpdate`](../../../lib/core/src/lib/card-view/interfaces/base-card-view-update.interface.ts).

## Basic usage

```ts
export interface BaseCardViewContentUpdate {
    itemUpdated$: Subject<UpdateNotification>;
    updatedAspect$: Subject<MinimalNode>;

    update(property: CardViewBaseItemModel, newValue: any);
    updateElement(notification: CardViewBaseItemModel);
    updateNodeAspect(node: MinimalNode);
}
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| itemUpdated$ | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`UpdateNotification`](../../../lib/core/src/lib/card-view/interfaces/update-notification.interface.ts)`>` |  | The current updated item. |
| updatedAspect$ | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`(@alfresco/js-api) |  | [`Subject`](http://reactivex.io/documentation/subject.html) holding the current node |

### Methods

-   **update**(property: [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts), newValue: `any`)<br/>
    Update itemUpdated$ property.

    -   property:\_ [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  - The property.
    -   newValue:\_ `any`  - new value.

-   **updateElement**(notification: [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts))<br/>
    Update updateItem$ observable.

    -   notification:\_ [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  - The notification.

-   **updateNodeAspect**(node: [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md))<br/>
    Update node aspect observable.
    -   node:\_ [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)  - The node.

## See also

-   [CardViewContentUpdate service](../services/card-view-content-update.service.md)
