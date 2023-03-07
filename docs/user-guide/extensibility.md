---
Title: Form extensibility and customization
Added: v2.0.0
---

# Form Extensibility and Customization

This page describes how you can customize ADF forms to your own specification.

_Note: it is assumed you are familiar with Alfresco Process Services (powered by Activiti) form definition structure._

-   How components and widgets are rendered on a [`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts)
-   Replacing default form widgets with custom components
-   Replacing custom stencils with custom components

## Contents

-   [How components and widgets are rendered on a Form](#how-components-and-widgets-are-rendered-on-a-form)
    -   [Component type resolvers](#component-type-resolvers)
    -   [Default component mappings](#default-component-mappings)
-   [Form Extensibility for APS/AAE](#form-extensibility-for-apsaae)
-   [See Also](#see-also)

## How components and widgets are rendered on a Form

All form field editors (aka widgets) on a [`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) are rendered by means of [`FormFieldComponent`](../core/components/form-field.component.md)
that takes an instance of a [`FormFieldModel`](../core/models/form-field.model.md):

```html
<form-field [field]="field"></form-field>
```

This component depends on [`FormRenderingService`](../core/services/form-rendering.service.md) service to map [`FormFieldModel`](../core/models/form-field.model.md) to UI component
based on field type or metadata information.

### Component type resolvers

[`FormRenderingService`](../core/services/form-rendering.service.md) maps field types to corresponding instances exposing `ComponentTypeResolver` interface:

```ts
export interface ComponentTypeResolver {
    (field: FormFieldModel): Type<{}>;
}
```

Typically a `ComponentTypeResolver` is a function that takes [`FormFieldModel`](../core/models/form-field.model.md) and returns corresponding component type.
This can either be a predefined component type or dynamically evaluated based on the field properties and metadata.

#### Static component mapping

You can (re)map fields like in the following:

```ts
let customResolver: ComponentTypeResolver = () => CustomWidgetComponent;
formRenderingService.setComponentTypeResolver('text', customResolver, true);
```

or simply:

```ts
formRenderingService.setComponentTypeResolver('text', () => CustomWidgetComponent, true);
```

#### Dynamic component mapping

Alternatively your resolver may return different component types based on [`FormFieldModel`](../core/models/form-field.model.md) state and condition:

```ts
let customResolver: ComponentTypeResolver = (field: FormFieldModel): Type<{}> => {
    if (field) {
        let params = field.params;
    }
    return UnknownWidgetComponent;
};
formRenderingService.setComponentTypeResolver('text', customResolver, true);
```

### Default component mappings

| Stencil Name | Field Type | Component Type |
| ------------ | ---------- | -------------- |
| Text | text | [`TextWidgetComponent`](lib/core/src/lib/form/components/widgets/text/text.widget.ts) |
| Number | integer | [`NumberWidgetComponent`](lib/core/src/lib/form/components/widgets/number/number.widget.ts) |
| Multi-line text | multi-line-text | [`MultilineTextWidgetComponentComponent`](lib/core/src/lib/form/components/widgets/multiline-text/multiline-text.widget.ts) |
| Checkbox | boolean | [`CheckboxWidgetComponent`](lib/core/src/lib/form/components/widgets/checkbox/checkbox.widget.ts) |
| Dropdown | dropdown | [`DropdownWidgetComponent`](lib/process-services/src/lib/form/widgets/dropdown/dropdown.widget.ts) |
| Date | date | [`DateWidgetComponent`](lib/core/src/lib/form/components/widgets/date/date.widget.ts) |
| Amount | amount | [`AmountWidgetComponent`](lib/core/src/lib/form/components/widgets/amount/amount.widget.ts) |
| Radio buttons | radio-buttons | [`RadioButtonsWidgetComponent`](lib/process-services/src/lib/form/widgets/radio-buttons/radio-buttons.widget.ts) |
| Hyperlink | hyperlink | [`HyperlinkWidgetComponent`](lib/core/src/lib/form/components/widgets/hyperlink/hyperlink.widget.ts) |
| Display value | readonly | DisplayValueWidgetComponent |
| Display Rich text | display-rich-text | [`DisplayRichTextWidgetComponent`](lib/process-services-cloud/src/lib/form/components/widgets/display-rich-text/display-rich-text.widget.ts) |
| Display text | readonly-text | [`DisplayTextWidgetComponentComponent`](lib/core/src/lib/form/components/widgets/display-text/display-text.widget.ts) |
| Typeahead | typeahead | [`TypeaheadWidgetComponent`](lib/process-services/src/lib/form/widgets/typeahead/typeahead.widget.ts) |
| People | people | [`PeopleWidgetComponent`](lib/process-services/src/lib/form/widgets/people/people.widget.ts) |
| Group of people | functional-group | [`FunctionalGroupWidgetComponent`](lib/process-services/src/lib/form/widgets/functional-group/functional-group.widget.ts) |
| Dynamic table | dynamic-table | [`DynamicTableWidgetComponent`](lib/process-services/src/lib/form/widgets/dynamic-table/dynamic-table.widget.ts) |
| N/A | container | [`ContainerWidgetComponent`](lib/core/src/lib/form/components/widgets/container/container.widget.ts) (layout component) |
| Header | group | [`ContainerWidgetComponent`](lib/core/src/lib/form/components/widgets/container/container.widget.ts) |
| Attach | upload | AttachWidgetComponent or [`UploadWidgetComponent`](lib/process-services/src/lib/form/widgets/upload/upload.widget.ts) (based on metadata) |
| N/A | N/A | [`UnknownWidgetComponent`](lib/core/src/lib/form/components/widgets/unknown/unknown.widget.ts) |

## Form Extensibility for APS/AAE
-   [Form Extensibility for APS Stencil](./aps-extensions.md)
-   [Form Extensibility for AAE Form Widget](./extensibility.md)

## See Also

-   [Form field model](../core/models/form-field.model.md)
-   [Form rendering service](../core/services/form-rendering.service.md)
-   [Form component](../core/components/form.component.md)
-   [Widget component](../insights/components/widget.component.md)
