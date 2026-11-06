---
Title: Signal form
Added: v9.2.0
Status: Experimental
Last reviewed: 2026-10-20
---

# Signal form

A form engine on [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview), published as the
`@alfresco/adf-core/signal-form` entry point. It reads the same form JSON as the current
[Form component](../process-services/components/form.component.md) and the [Form Cloud component](../process-services-cloud/components/form-cloud.component.md), so a form designed in the modeler works with
both. It is meant to replace them over time, behind feature flags in the applications that adopt it.

> The entry point is experimental and is delivered in steps. This first step contains how a form definition is read
> and how each field type handles its value. The form state, the renderer and host components, and the widgets
> follow in the next steps.

## Contents

-   [Basic usage](#basic-usage)
-   [Form definition](#form-definition)
-   [Field types](#field-types)
-   [Adding a field type or a validator](#adding-a-field-type-or-a-validator)
-   [Migrating from the current form](#migrating-from-the-current-form)

## Basic usage

```ts
import { readFormDefinition } from '@alfresco/adf-core/signal-form';

const definition = readFormDefinition(formJson, undefined, savedValues);

definition.fields.forEach((field) => console.log(field.id, field.type, field.initialValue));
```

`readFormDefinition(json, widgets?, values?)` takes:

| Name    | Type                      | Description                                                                                                                                                                                  |
| ------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| json    | `FormDefinitionJson`      | The form JSON, as saved by the modeler: with a `formRepresentation`, or the `formDefinition` content itself.                                                                                 |
| widgets | `FormWidgetResolver`      | How each field type handles its value. Defaults to the built-in field types (`BUILT_IN_FORM_WIDGET_RESOLVER`).                                                                               |
| values  | `Record<string, unknown>` | Saved values, keyed by field id or by `variables.<name>`, as the current form takes them. Each is read the way the field type reads its value; a repeatable section's value gives its rows. |

It returns a `FormDefinition`, read once and not modified afterwards.

## Form definition

`FormDefinition` holds what the form JSON describes:

| Property            | Description                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `fields`            | Every field outside repeatable sections, as `FieldDefinition`s.                                  |
| `sections`          | The repeatable sections, with their own fields, row limits and saved rows.                       |
| `tabs`              | The tabs and their visibility conditions.                                                        |
| `outcomes`          | The outcomes, with the built-in Save outcome and the default Complete when the form defines none. |
| `layout`            | The containers, groups and sections with their columns, for the renderer.                        |
| `variables`         | The form and process variables.                                                                  |
| `theme`, `className`, `leftLabels`, `showTabNavigation`, `stickyTabs` | The form's own display settings.                    |

A `FieldDefinition` carries the field's settings (validation limits, options, date formats, input mask, read-only
and required state, visibility condition, and so on) and its `initialValue`. Its `json` property is the field's JSON
as authored, for widgets that read settings of their own.

## Field types

Each field type is described by a `FormWidgetDefinition`:

| Property         | Description                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `type`           | The field type, as in the form JSON (`text`, `dropdown`, `date`…).                           |
| `component`      | Loads the component that shows the field. Optional: a type without one shows a placeholder. |
| `initialValue`   | Reads the field's value from its JSON.                                                       |
| `submittedValue` | Writes the value the form submits for the field.                                             |
| `validators`     | The type's validators, run in order; the first error is the one shown.                       |
| `displayValue`   | Gives the field's value as text, for example an option by its name.                          |

`BUILT_IN_FORM_WIDGETS` lists the field types of the current form with the same value handling. In this step they
carry no component yet.

A Studio custom widget that no application implements is handled by the built-in type of its value type
(`fieldWidget`), as the current form does.

## Adding a field type or a validator

Give `readFormDefinition` a resolver with your own definitions; a later definition for a type replaces an earlier one:

```ts
import { BUILT_IN_FORM_WIDGETS, formWidgetResolver, readFormDefinition, FieldValidator } from '@alfresco/adf-core/signal-form';

const ratingInRange: FieldValidator = (field, value) => (value !== null && (value < 1 || value > 5) ? 'APP.ERRORS.RATING_OUT_OF_RANGE' : null);

const widgets = formWidgetResolver([...BUILT_IN_FORM_WIDGETS, { type: 'rating', validators: [ratingInRange] }]);

const definition = readFormDefinition(formJson, widgets);
```

A validator returns an error kind: one of ADF's (`FieldErrorKind`), or a translation key for a message of its own.
Validators an application adds to every field type come with the form options in the next step.

## Migrating from the current form

Nothing changes for applications using the [Form component](../process-services/components/form.component.md) or the cloud form:
the current form, its widgets and its services are not modified, and the signal form reads the same JSON. There is
nothing to migrate yet.

Once the next steps land, an application adopts the signal form one screen at a time, typically behind a feature
flag, by building a signal form from the same JSON and showing it with the signal form host component instead of
the current one.
