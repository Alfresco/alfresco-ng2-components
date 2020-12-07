---
Title: Form Rendering service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Form Rendering service](../../../lib/core/form/services/form-rendering.service.ts "Defined in form-rendering.service.ts")

Maps a form field type string onto the corresponding form [widget component](../../insights/components/widget.component.md) type.

## Class members

### Methods

*   **getComponentTypeResolver**(type: `string`, defaultValue: `Type<Function>` = `this.defaultValue`): [`DynamicComponentResolveFunction`](../../../lib/core/services/dynamic-component-mapper.service.ts)<br/>
    Gets the currently active [DynamicComponentResolveFunction](../../../lib/core/services/dynamic-component-mapper.service.ts) for a field type.
    *   *type:* `string`  - The type whose resolver you want
    *   *defaultValue:* `Type<Function>`  - Default type returned for types that are not yet mapped
    *   **Returns** [`DynamicComponentResolveFunction`](../../../lib/core/services/dynamic-component-mapper.service.ts) - Resolver function
*   **register**(components: `Function`, override: `boolean` = `false`)<br/>
    Register multiple components
    *   *components:* `Function`  -
    *   *override:* `boolean`  -
*   **resolveComponentType**(model: [`DynamicComponentModel`](../../../lib/core/services/dynamic-component-mapper.service.ts), defaultValue: `Type<Function>` = `this.defaultValue`): `Type<Function>`<br/>
    Finds the component type that is needed to render a form field.
    *   *model:* [`DynamicComponentModel`](../../../lib/core/services/dynamic-component-mapper.service.ts)  - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) field model for the field to render
    *   *defaultValue:* `Type<Function>`  - Default type returned for field types that are not yet mapped.
    *   **Returns** `Type<Function>` - Component type
*   **setComponentTypeResolver**(type: `string`, resolver: [`DynamicComponentResolveFunction`](../../../lib/core/services/dynamic-component-mapper.service.ts), override: `boolean` = `true`)<br/>
    Sets or optionally replaces a [DynamicComponentResolveFunction](../../../lib/core/services/dynamic-component-mapper.service.ts) for a field type.
    *   *type:* `string`  - The type whose resolver you want to set
    *   *resolver:* [`DynamicComponentResolveFunction`](../../../lib/core/services/dynamic-component-mapper.service.ts)  - The new resolver function
    *   *override:* `boolean`  - The new resolver will only replace an existing one if this parameter is true

## Details

The [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Field component uses this service to choose which [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) to use to render an instance of a
form field. The [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Field model stores the field type name as a string (see the table below).
The [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Rendering service maintains a mapping between each type name and
a corresponding [`DynamicComponentResolveFunction`](../../../lib/core/services/dynamic-component-mapper.service.ts). The function takes a [`FormFieldModel`](../../core/models/form-field.model.md) object as its argument and
uses the data from the object to determine which [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) should be used to render the field.

In some cases, the field type string alone is enough to determine the [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) type and so the function
just returns the type directly:

```ts
let customResolver: DynamicComponentResolveFunction = () => CustomWidgetComponent;
formRenderingService.setComponentTypeResolver('text', customResolver, true);
```

In other cases, the function may need to choose the [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) dynamically based on
specific values in the form data:

```ts
let customResolver: DynamicComponentResolveFunction = (field: FormFieldModel): Type<{}> => {
    if (field) {
        let params = field.params;
    }
    return UnknownWidgetComponent;
};
formRenderingService.setComponentTypeResolver('text', customResolver, true);
```

### Default type mapping

The [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Rendering service is initialized with the mapping shown in the table below:

| Stencil name    | Field type string  | Component type                                                                                                                            |
| --------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Amount          | "amount"           | [`AmountWidgetComponent`](../../../lib/core/form/components/widgets/amount/amount.widget.ts)                                              |
| Attach          | "upload"           | AttachWidgetComponent or [`UploadWidgetComponent`](../../../lib/core/form/components/widgets/upload/upload.widget.ts) (based on metadata) |
| Checkbox        | "boolean"          | [`CheckboxWidgetComponent`](../../../lib/core/form/components/widgets/checkbox/checkbox.widget.ts)                                        |
| Date            | "date"             | [`DateWidgetComponent`](../../../lib/core/form/components/widgets/date/date.widget.ts)                                                    |
| Display text    | "readonly-text"    | [`DisplayTextWidgetComponentComponent`](../../../lib/core/form/components/widgets/display-text/display-text.widget.ts)                    |
| Display value   | "readonly"         | DisplayValueWidgetComponent                                                                                                               |
| Dropdown        | "dropdown"         | [`DropdownWidgetComponent`](../../../lib/core/form/components/widgets/dropdown/dropdown.widget.ts)                                        |
| Dynamic table   | "dynamic-table"    | [`DynamicTableWidgetComponent`](../../../lib/core/form/components/widgets/dynamic-table/dynamic-table.widget.ts)                          |
| Group of people | "functional-group" | [`FunctionalGroupWidgetComponent`](../../../lib/core/form/components/widgets/functional-group/functional-group.widget.ts)                 |
| Header          | "group"            | [`ContainerWidgetComponent`](../../../lib/core/form/components/widgets/container/container.widget.ts)                                     |
| Hyperlink       | "hyperlink"        | [`HyperlinkWidgetComponent`](../../../lib/core/form/components/widgets/hyperlink/hyperlink.widget.ts)                                     |
| Multi-line text | "multi-line-text"  | [`MultilineTextWidgetComponentComponent`](../../../lib/core/form/components/widgets/multiline-text/multiline-text.widget.ts)              |
| Number          | "integer"          | [`NumberWidgetComponent`](../../../lib/core/form/components/widgets/number/number.widget.ts)                                              |
| People          | "people"           | [`PeopleWidgetComponent`](../../../lib/core/form/components/widgets/people/people.widget.ts)                                              |
| Radio buttons   | "radio-buttons"    | [`RadioButtonsWidgetComponent`](../../../lib/core/form/components/widgets/radio-buttons/radio-buttons.widget.ts)                          |
| Text            | "text"             | [`TextWidgetComponent`](../../../lib/core/form/components/widgets/text/text.widget.ts)                                                    |
| Typeahead       | "typeahead"        | [`TypeaheadWidgetComponent`](../../../lib/core/form/components/widgets/typeahead/typeahead.widget.ts)                                     |

You can add new items to the mapping or replace existing items in order to customize the way
fields are rendered.

### Adding new or replacement items to the mapping

You can use the `setComponentTypeResolver` method to add a new ComponentTypeResolver function for a
particular type string. You can also replace the resolver for a type that already exists in the mapping
if you set the `override` parameter to 'true':

```ts
formRenderingService.setComponentTypeResolver('text', newResolver, true);
```

You would typically use this to replace an existing [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) with your own custom version that
implements a modified layout or responds differently when the data is entered. See the
[Form Extensibility and Customisation](../../user-guide/extensibility.md) guide for further details and examples
of this technique.

## See also

*   [Extensibility](../../user-guide/extensibility.md)
*   [Form field model](../models/form-field.model.md)
*   [Form component](../components/form.component.md)
