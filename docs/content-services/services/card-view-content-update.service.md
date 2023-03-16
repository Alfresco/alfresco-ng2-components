---
Title: Card View Content Update Service
Added: v6.0.0
Status: Active
Last reviewed: 2022-11-25
---

# [Card View Content Update Service](../../../lib/content-services/src/lib/common/services/card-view-content-update.service.ts "Defined in card-view-content-update.service.ts")

Manages Card View properties in the content services environment. 
Implements [`BaseCardViewContentUpdate`](../../../lib/content-services/src/lib/interfaces/base-card-view-content-update.interface.ts).

## Class members

### Methods

-   **update**(property: [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts), newValue: `any`)<br/>

    -   _property:_ [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  - 
    -   _newValue:_ `any`  - 

-   **updateElement**(notification: [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts))<br/>
    Updates the cardview items property
    -   _notification:_ [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  - 
-   **updateNodeAspect**(node: [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md))<br/>
    Update node aspect observable.
    -   _node:_ [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)  -

## Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| itemUpdated$ | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`UpdateNotification`](../../../lib/core/src/lib/card-view/interfaces/update-notification.interface.ts)`>` | The current updated item. |
| updateAspect$ | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`(@alfresco/js-api) | The current Node. |
