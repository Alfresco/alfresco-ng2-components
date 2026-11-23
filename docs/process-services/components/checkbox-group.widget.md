---
Title: Checkbox group widget
Status: Active
---

# Checkbox group widget

Renders labeled checkboxes bound to one form field. The widget is registered as
`checkbox-group` by `ProcessFormRenderingService` and is exported as
`CheckboxGroupWidgetComponent` from `@alfresco/adf-process-services`.

## Basic usage

Include a checkbox group in the JSON definition supplied to the [Form component](form.component.md):

```json
{
  "id": "interests",
  "name": "Interests",
  "type": "checkbox-group",
  "optionType": "manual",
  "required": true,
  "alignmentType": "vertical",
  "tooltip": "Select at least one interest",
  "options": [
    { "id": "news", "name": "News" },
    { "id": "events", "name": "Events" }
  ]
}
```

No options are selected initially. Use `value` to restore a saved selection.

## Field configuration

| Property | Default | Description |
| --- | --- | --- |
| `options` | `[]` | Options with string `id` and `name` properties. IDs identify selections; labels do not need to be unique. |
| `optionType` | | `manual` uses supplied options. `rest` loads options through the existing ADF process form services. Shared models also accept `variable` options supplied by the consuming application. |
| `restUrl` | | Enables REST loading when `optionType` is `rest`. The form must have a `taskId` or `processDefinitionId`. |
| `required` | `false` | Requires at least one selection. Optional fields allow an empty selection. Hidden fields follow the normal form validation rules. |
| `readOnly` | `false` | Displays saved selections with disabled checkboxes. Form and widget readonly settings also prevent changes. |
| `alignmentType` | vertical layout | `vertical` stacks options; `horizontal` lays them out across the row and wraps them when needed. |
| `tooltip` | `""` | Tooltip for each checkbox. |
| `style` | | Named style from `form.theme.widgets['checkbox-group']` or a predefined `normal`, `strong`, or `heading` style. |
| `className` | | Additional CSS classes on the widget container. |

## Values and events

Checkbox groups always allow multiple selections; `selectionType` is not required.
Values are arrays of option objects, for example `[{ "id": "news", "name": "News" }]`. An empty or cleared
selection submits `[]`, including when only one option was previously selected.

Empty values are explicitly included in `form.values` for manual, REST, and
application-supplied variable sources. Save these values as returned to preserve
cleared selections when reopening a form. Saved option IDs and labels are retained,
including saved options no longer present in the supplied options. After a successful
REST response, selections absent from the returned options are removed and the field
is revalidated. Arrays of string IDs are
resolved against the available options; provide full option objects when restoring labels
before remote options are available. Duplicate selected IDs are collapsed.
Non-array input is treated as an empty selection; scalar IDs and option objects
are not converted into selections.

Changes update the form model, validation, `fieldChanged`, and the normal
`fieldValueChanged` form-rule event. Required errors appear after interaction or
when the form displays all validation errors.

REST loading disables interaction and sets the group's `aria-busy` state. Task
forms use `TaskFormService.getRestFieldValues`; start forms use
`ProcessDefinitionService.getRestFieldValuesByProcessId`. An empty response gives
an empty option list. A failed request emits `widgetError`, ends the loading state,
and preserves the existing value and options. Pending requests are cancelled when
the widget is destroyed. Readonly forms display saved values without fetching options.

The legacy ADF widget does not fetch Automate variables. Variable fetching belongs
to the consuming application's integration.

## Styling

Use the normal form theme and a named field `style`:

```json
{
  "theme": {
    "widgets": {
      "checkbox-group": {
        "emphasis": {
          "name": "Emphasis",
          "styles": {
            "--adf-checkbox-group-font-size": "18px",
            "--adf-checkbox-group-font-weight": "bold",
            "--adf-checkbox-group-color": "#333333"
          }
        }
      }
    }
  }
}
```

Set `"style": "emphasis"` on the checkbox-group field. These variables style the
group title only. Checkbox item labels retain their Material theme styling.
When no checkbox-group style is set, the title follows the existing form label theme.

## See also

- [Form field model](../../core/models/form-field.model.md)
- [Form component](form.component.md)
