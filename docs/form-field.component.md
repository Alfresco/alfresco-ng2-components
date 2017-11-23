# Form field component
A form field in an APS form.

## Basic Usage
All form field editors (aka widgets) on a Form are rendered by means of a `FormFieldComponent`
that takes an instance of a `FormFieldModel`:

```html
<adf-form-field [field]="field"></adf-form-field>
```

This component depends on the `FormRenderingService` to map the `FormFieldModel` to a Form Field UI component
based on the field type or the metadata information.

### Properties
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| field | FormFieldModel |  | Contains all the necessary data needed to determine what UI Widget to use when rendering the field in the form. You would typically not create this data manually but instead create the form in APS and export it to get to all the `FormFieldModel` definitions. |

## Details
You would typically not use this component directly but instead use the `<adf-form>` component, which under the hood
uses `<adf-form-field>` components to render the form fields. See next section for how each field in a form definition
is mapped to a form field component (i.e. UI widget) implementation.

### Field Type -> Form Field Component mappings
Forms defined in APS have the following default mappings for the form fields:

| APS Form Designer Widget | Field Type | Component Type |
| --- | --- | --- |
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

<!-- seealso start -->

<!-- seealso end -->