---
Title: Card View Item interface
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-08
---

# [Card View Item interface](../../../lib/core/src/lib/card-view/interfaces/card-view-item.interface.ts "Defined in card-view-item.interface.ts")

Defines the implementation of an item in a [Card View component](../components/card-view.component.md).

## Definition

```ts
export interface CardViewItem {
    label: string;
    value: any;
    key: string;
    default?: any;
    type: string;
    displayValue: string;
    editable?: boolean;
    icon?: string;
    data?: any;
}
```

### Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| label | string | "" | Item label |
| value | any |  | The original data value for the item |
| key | string | "" | Identifying key (important when editing the item) |
| default | any |  | The default value to display if the value is empty |
| displayValue | string | "" | The value to display |
| editable | boolean | false | Toggles whether the item is editable |
| clickable | boolean | false | Toggles whether the item is clickable |
| icon | string |  | The material icon to show beside clickable items |
| data | any | null | Any custom data which is needed to be provided and stored in the model for any reason. During an update or a click event this can be a container of any custom data which can be useful for 3rd party codes. |

## Details

Card item components are loaded dynamically by the
main [Card View component](../components/card-view.component.md). This allows you to define your own
component for a custom item type.

For example, follow the steps given below to add a **stardate** type to display Captain
Picard's birthday (47457.1):

1.  Define the model for the custom type.

    Your model must extend the [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts) class and implement the [`CardViewItem`](../../../lib/core/src/lib/card-view/interfaces/card-view-item.interface.ts)
    and [`DynamicComponentModel`](../../../lib/core/src/lib/common/services/dynamic-component-mapper.service.ts) interfaces. See the
    [Card View Text Item model source](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/core/card-view/components/card-view-textitem/card-view-textitem.component.ts)
    for an example of how to do this.

    ```ts
    import { CardViewBaseItemModel, CardViewItem, DynamicComponentModel } from '@alfresco/adf-core';

    export class CardViewStarDateItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
        type: string = 'star-date';

        get displayValue() {
            return this.convertToStarDate(this.value) || this.default;
        }

        private convertToStarDate(starTimeStamp: number): string {
            // Do the magic
        }
    }
    ```

2.  Define the component for the custom type.

    The selector is not important given that this is a dynamically loaded component.
    You can choose any name for the selector, but it makes sense to follow the Angular standards.

    ```ts
    @Component({
        selector: 'card-view-stardateitem' /* For example */
        ...
    })
    export class CardViewStarDateItemComponent {
        @Input()
        property: CardViewStarDateItemModel;

        @Input()
        editable: boolean;

        constructor(private cardViewUpdateService: CardViewUpdateService) {}

        isEditable() {
            return this.editable && this.property.editable;
        }

        showStarDatePicker() {
            ...
        }
    }
    ```

    See the
    [Card View Text Item component source](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/core/card-view/components/card-view-textitem/card-view-textitem.component.ts)
    or the
    [Card View Date Item component source](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/core/card-view/components/card-view-dateitem/card-view-dateitem.component.ts) for examples of how to make the field
    editable.

3.  Bind your custom component to the [custom model](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/customModel.api.ts) type so that Angular's dynamic component
    loader can find it.

    ```ts
    @Component({
        ...
        providers: [ CardItemTypeService ] /* If you don't want to pollute the main instance of the CardItemTypeService service */
        ...
    })
    export class SomeParentComponent {

        constructor(private cardItemTypeService: CardItemTypeService) {
            cardItemTypeService.setComponentTypeResolver('star-date', () => CardViewStarDateItemComponent);
        }
    }
    ```

    The [Card Item Type service](../services/card-item-types.service.md) maps each item type to the
    corresponding component. See its [doc page](../services/card-item-types.service.md) for further
    details.

## See also

-   [Card View component](../components/card-view.component.md)
-   [Card Item Types service](../services/card-item-types.service.md)
