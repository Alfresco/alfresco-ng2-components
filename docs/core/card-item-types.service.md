---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-08
---

# Card Item Type service

Maps type names to field component types for the [Card View component](../core/card-view.component.md).

## Class members

### Methods

-   **getComponentTypeResolver**(type: `string` = `null`, defaultValue: `Type<__type>` = `this.defaultValue`): [`DynamicComponentResolveFunction`](../../lib/core/services/dynamic-component-mapper.service.ts)<br/>
    Gets the currently active ComponentTypeResolver function for a field type.
    -   _type:_ `string`  - The type whose resolver you want
    -   _defaultValue:_ `Type<__type>`  - Default type returned for types that are not yet mapped
    -   **Returns** [`DynamicComponentResolveFunction`](../../lib/core/services/dynamic-component-mapper.service.ts) - Resolver function
-   **resolveComponentType**(model: [`DynamicComponentModel`](../../lib/core/services/dynamic-component-mapper.service.ts) = `null`, defaultValue: `Type<__type>` = `this.defaultValue`): `Type<__type>`<br/>
    Finds the component type that is needed to render a form field.
    -   _model:_ [`DynamicComponentModel`](../../lib/core/services/dynamic-component-mapper.service.ts)  - [Form](../../lib/process-services/task-list/models/form.model.ts) field model for the field to render
    -   _defaultValue:_ `Type<__type>`  - Default type returned for field types that are not yet mapped.
    -   **Returns** `Type<__type>` - Component type
-   **setComponentTypeResolver**(type: `string` = `null`, resolver: [`DynamicComponentResolveFunction`](../../lib/core/services/dynamic-component-mapper.service.ts) = `null`, override: `boolean` = `true`)<br/>
    Sets or optionally replaces a ComponentTypeResolver function for a field type.
    -   _type:_ `string`  - The type whose resolver you want to set
    -   _resolver:_ [`DynamicComponentResolveFunction`](../../lib/core/services/dynamic-component-mapper.service.ts)  - The new resolver function
    -   _override:_ `boolean`  - The new resolver will only replace an existing one if this parameter is true

## Details

The [Card View component](card-view.component.md) uses this service to find the component
type that is required to display a particular field type (text, date, etc). The service
maps a type name string to a corresponding `ComponentTypeResolver` function that takes a
model object as a parameter and returns the component type needed to display that model.

The default mapping is shown below:

| Type string | Component |
| ----------- | --------- |
| 'text' | CardViewTextItemComponent |
| 'int' | CardViewTextItemComponent |
| 'float' | CardViewTextItemComponent |
| 'date' | CardViewDateItemComponent |
| 'datetime' | CardViewDateItemComponent |
| 'bool' | CardViewBoolItemComponent |
| 'map' | CardViewMapItemComponent |

### Adding new type mappings

You can define your own custom field types for the Card View (see the
[Card View Item interface](card-view-item.interface.md) page for full details of how to do this).
When you have defined the field component, you need to register it with the [Card Item Type service](../../lib/core/card-view/services/card-item-types.service.ts)
so that the [Card View component](../core/card-view.component.md) can make use of it:

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

## See also

-   [Card View component](card-view.component.md)
-   [Card View Item interface](card-view-item.interface.md)
