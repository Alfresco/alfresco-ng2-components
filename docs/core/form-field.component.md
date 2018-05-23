---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-08
---

# Form field component

A form field in an APS form.

## Basic Usage

All form field editors (aka widgets) on a [`Form`](../../lib/process-services/task-list/models/form.model.ts) are rendered by means of a [`FormFieldComponent`](../core/form-field.component.md)
that takes an instance of a [`FormFieldModel`](../core/form-field.model.md):

```html
<adf-form-field [field]="field"></adf-form-field>
```

This component depends on the [`FormRenderingService`](../core/form-rendering.service.md) to map the [`FormFieldModel`](../core/form-field.model.md) to a [`Form`](../../lib/process-services/task-list/models/form.model.ts) Field UI component
based on the field type or the metadata information.

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| field | [`FormFieldModel`](../core/form-field.model.md) |  null | Contains all the necessary data needed to determine what UI Widget to use when rendering the field in the form. You would typically not create this data manually but instead create the form in APS and export it to get to all the [`FormFieldModel`](../core/form-field.model.md) definitions. |

## Details

You would typically not use this component directly but instead use the `<adf-form>` component, which under the hood
uses `<adf-form-field>` components to render the form fields.

### Field Type -> Form Field Component mappings

Forms defined in APS have the following default mappings for the form fields:

| APS Form Designer Widget | Field Type | Component Type |
| ------------------------ | ---------- | -------------- |
| Text | text | TextWidgetComponent |
| Multi-line text | multi-line-text | MultilineTextWidgetComponentComponent |
| Number | integer | NumberWidgetComponent |
| Checkbox | boolean | CheckboxWidgetComponent |
| Date | date | DateWidgetComponent |
| Dropdown | dropdown | DropdownWidgetComponent |
| Typeahead | typeahead | TypeaheadWidgetComponent |
| Amount | amount | AmountWidgetComponent |
| Radio buttons | radio-buttons | RadioButtonsWidgetComponent |
| People | people | PeopleWidgetComponent |
| Group of people | functional-group | FunctionalGroupWidgetComponent |
| Dynamic table | dynamic-table | DynamicTableWidgetComponent |
| Hyperlink | hyperlink | HyperlinkWidgetComponent |
| Header | group | ContainerWidgetComponent |
| Attach File | upload | AttachWidgetComponent or UploadWidgetComponent (based on metadata) |
| Display value | readonly | DisplayValueWidgetComponent |
| Display text | readonly-text | DisplayTextWidgetComponentComponent |
| N/A | container | ContainerWidgetComponent (layout component) |
| N/A | N/A | UnknownWidgetComponent |
