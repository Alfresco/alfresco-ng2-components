---
Title: Card View Update service
Added: v2.0.0
Status: Active
Last reviewed: 2022-11-25
---

# [Card View Update service](../../../lib/core/src/lib/card-view/services/card-view-update.service.ts "Defined in card-view-update.service.ts")

Reports edits and clicks within fields of a [Card View component](../components/card-view.component.md).
Implements [`BaseCardViewUpdate`](../../../lib/core/src/lib/card-view/interfaces/base-card-view-update.interface.ts).

## Details

You can use the [Card View Update service](card-view-update.service.md) to respond to edits and clicks within items on
a card view. This might involve updating application data to reflect the changes made to
the view or could simply be a matter of highlighting a clicked item.

The service is injected into a component using a constructor parameter, which also
creates a corresponding property in the object:

```ts
properties: any;

constructor(private cardViewUpdateService: CardViewUpdateService) {

    this.properties = [
        new CardViewTextItemModel({
            label: 'Name',
            value: 'Kirk',
            key: 'name',
            default: 'No name entered',
            multiline: false,
            editable: true,
            clickable: true
        }),
        new CardViewTextItemModel({
            label: 'Rank',
            value: 'Captain',
            key: 'rank',
            default: 'No rank entered',
            multiline: false,
            editable: true,
            clickable: true
        }),
        new CardViewTextItemModel({
            label: 'Ship',
            value: 'Enterprise',
            key: 'ship',
            default: 'No ship entered',
            multiline: false,
            editable: true,
            clickable: true
        })
    ];
}
```

The constructor here also sets the [`CardViewTextItemModel`](../../../lib/core/src/lib/card-view/models/card-view-textitem.model.ts) instances that define the layout of the
card view (see the [Card View component](../components/card-view.component.md) for further information
about this). The model objects and the `key` property are used to identify which item has been clicked
or updated when an event occurs. 

You must subscribe to the service to be informed about clicks and updates. You can do this by
registering your own functions with the service's `itemUpdated$` and `itemClicked$` events
(place this code in the `ngOnInit` 
[lifecycle hook](https://angular.io/guide/lifecycle-hooks#oninit) rather than the constructor):

```ts
ngOnInit() {
    this.cardViewUpdateService.itemUpdated$.subscribe(this.respondToCardUpdate.bind(this));
    this.cardViewUpdateService.itemClicked$.subscribe(this.respondToCardClick.bind(this));
}
```

With the subscriptions in place, `respondToCardUpdate` and `respondToCardClick` will now be
called after updates and clicks, respectively. 

### Responding to updates

The update function is passed a parameter of type [`UpdateNotification`](../../../lib/core/src/lib/card-view/interfaces/update-notification.interface.ts):

```ts
export interface UpdateNotification {
    target: any;
    changed: any;
}
```

Here, `target` contains the [`CardViewTextItemModel`](../../../lib/core/src/lib/card-view/models/card-view-textitem.model.ts) that was used to initialize
the field in question (in practice, this might be a [`CardViewDateItemModel`](../../../lib/core/src/lib/card-view/models/card-view-dateitem.model.ts) or [`CardViewMapItemModel`](../../../lib/core/src/lib/card-view/models/card-view-mapitem.model.ts) if
the card layout includes these objects). The `changed` property contains an object with a single property:

```ts
{ keyValue: 'Value after editing' }
```

Here, `keyValue` is actually the value of the `key` field specified when the item was initialized. So
in our example, if the third item was edited from 'Enterprise' to 'Shuttle Craft', the object would be:

```ts
{ ship: 'Shuttle Craft' }
```

The complete code for `respondToCardUpdate` might look something like the following:

```ts
respondToCardUpdate(un: UpdateNotification) {
    this.updateMessage = un.target.label + ' changed to ' + un.changed[un.target.key];
}
```

Note that the function will only be called if the `editable` property of the model object is set to true
for this item. Also, the `editable` value of all items will be overridden if `editable` is set to false
on the [Card View component](../components/card-view.component.md) itself.

### Responding to clicks

The click function is passed a [`ClickNotification`](../../../lib/core/src/lib/card-view/interfaces/click-notification.interface.ts) object, which is similar to [`UpdateNotification`](../../../lib/core/src/lib/card-view/interfaces/update-notification.interface.ts) described above,
but without the `changed` property. Use the `target` property to identify the item that was clicked:

```ts
respondToCardClick(cn: ClickNotification) {
    this.clickMessage = cn.target.label + ' was just clicked';
}  
```

Note that this function will only be called if the `clickable` property of the model object is set to true for this item.

## Update cardview update item

[`updateElement`](../../../lib/core/src/lib/card-view/services/card-view-update.service.ts)  function helps to update the card view item. It takes the [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts)  type object as parameter.

Example

```javascript
   this.cardViewUpdateService.updateElement(cardViewBaseItemModel)
```

## See also

-   [Card view component](../components/card-view.component.md)
-   [UpdateNotification interface](../interfaces/update-notification.interface.md)
-   [ClickNotification interface](../interfaces/click-notification.interface.md)
