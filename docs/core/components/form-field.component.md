---
Title: Form field component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Form field component](../../../lib/core/form/components/form-field/form-field.component.ts "Defined in form-field.component.ts")

Represents a UI field in a form.

## Basic Usage

All form field editors (aka widgets) on a [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) are rendered by means of a [`FormFieldComponent`](../../core/components/form-field.component.md)
that takes an instance of a [`FormFieldModel`](../../core/models/form-field.model.md):

```html
<adf-form-field [field]="field"></adf-form-field>
```

This component depends on the [`FormRenderingService`](../../core/services/form-rendering.service.md) to map the [`FormFieldModel`](../../core/models/form-field.model.md) to a [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Field UI component
based on the field type or the metadata information.

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| field | [`FormFieldModel`](../../core/models/form-field.model.md) | null | Contains all the necessary data needed to determine what UI [`Widget`](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) to use when rendering the field in the form. You would typically not create this data manually but instead create the form in APS and export it to get to all the `FormFieldModel` definitions. |

## Details

You would typically not use this component directly but instead use the `<adf-form>` component, which under the hood
uses `<adf-form-field>` components to render the form fields.

### Field Type -> Form Field Component mappings

Forms defined in APS have the following default mappings for the form fields:

| *APS [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Designer* [`Widget`](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) | Field Type       | Component Type                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Text                                                                                                                                                                     | text             | [`TextWidgetComponent`](../../../lib/core/form/components/widgets/text/text.widget.ts)                                                    |
| Multi-line text                                                                                                                                                          | multi-line-text  | [`MultilineTextWidgetComponentComponent`](../../../lib/core/form/components/widgets/multiline-text/multiline-text.widget.ts)              |
| Number                                                                                                                                                                   | integer          | [`NumberWidgetComponent`](../../../lib/core/form/components/widgets/number/number.widget.ts)                                              |
| Checkbox                                                                                                                                                                 | boolean          | [`CheckboxWidgetComponent`](../../../lib/core/form/components/widgets/checkbox/checkbox.widget.ts)                                        |
| Date                                                                                                                                                                     | date             | [`DateWidgetComponent`](../../../lib/core/form/components/widgets/date/date.widget.ts)                                                    |
| Dropdown                                                                                                                                                                 | dropdown         | [`DropdownWidgetComponent`](../../../lib/core/form/components/widgets/dropdown/dropdown.widget.ts)                                        |
| Typeahead                                                                                                                                                                | typeahead        | [`TypeaheadWidgetComponent`](../../../lib/core/form/components/widgets/typeahead/typeahead.widget.ts)                                     |
| Amount                                                                                                                                                                   | amount           | [`AmountWidgetComponent`](../../../lib/core/form/components/widgets/amount/amount.widget.ts)                                              |
| Radio buttons                                                                                                                                                            | radio-buttons    | [`RadioButtonsWidgetComponent`](../../../lib/core/form/components/widgets/radio-buttons/radio-buttons.widget.ts)                          |
| People                                                                                                                                                                   | people           | [`PeopleWidgetComponent`](../../../lib/core/form/components/widgets/people/people.widget.ts)                                              |
| Group of people                                                                                                                                                          | functional-group | [`FunctionalGroupWidgetComponent`](../../../lib/core/form/components/widgets/functional-group/functional-group.widget.ts)                 |
| Dynamic table                                                                                                                                                            | dynamic-table    | [`DynamicTableWidgetComponent`](../../../lib/core/form/components/widgets/dynamic-table/dynamic-table.widget.ts)                          |
| Hyperlink                                                                                                                                                                | hyperlink        | [`HyperlinkWidgetComponent`](../../../lib/core/form/components/widgets/hyperlink/hyperlink.widget.ts)                                     |
| Header                                                                                                                                                                   | group            | [`ContainerWidgetComponent`](../../../lib/core/form/components/widgets/container/container.widget.ts)                                     |
| Attach File                                                                                                                                                              | upload           | AttachWidgetComponent or [`UploadWidgetComponent`](../../../lib/core/form/components/widgets/upload/upload.widget.ts) (based on metadata) |
| Display value                                                                                                                                                            | readonly         | [`TextWidgetComponent`](../../../lib/core/form/components/widgets/text/text.widget.ts)                                                    |
| Display text                                                                                                                                                             | readonly-text    | [`DisplayTextWidgetComponent`](../../../lib/core/form/components/widgets/display-text/display-text.widget.ts)                             |
| N/A                                                                                                                                                                      | container        | [`ContainerWidgetComponent`](../../../lib/core/form/components/widgets/container/container.widget.ts) (layout component)                  |
| N/A                                                                                                                                                                      | N/A              | [`UnknownWidgetComponent`](../../../lib/core/form/components/widgets/unknown/unknown.widget.ts)                                           |
