# Form component

Shows a Form from APS (see it live: [Form Quickstart](https://embed.plnkr.co/YSLXTqb3DtMhVJSqXKkE/))

## Contents

-   [Basic Usage](#basic-usage)

    -   [Properties](#properties)
    -   [Advanced properties](#advanced-properties)
    -   [Events](#events)

-   [Details](#details)

    -   [Custom empty form template](#custom-empty-form-template)
    -   [Controlling outcome execution behaviour](#controlling-outcome-execution-behaviour)
    -   [Field Validators](#field-validators)

-   [Other documentation](#other-documentation)

    -   [Common scenarios](#common-scenarios)

-   [See also](#see-also)

## Basic Usage

```html
<adf-form 
    [taskId]="taskId">
</adf-form>
```

**Display form instance by task id:**

```html
<adf-form 
    [taskId]="selectedTask?.id">
</adf-form>
```

For an existing Task both form and values will be fetched and displayed.

**Display form definition by form id:**

```html
<adf-form 
    [formId]="selectedFormDefinition?.id"
    [data]="customData">
</adf-form>
```

Only form definition will be fetched.

**Display form definition by form name:**

```html
<adf-form 
    [formName]="selectedFormDefinition?.name"
    [data]="customData">
</adf-form>
```

**Display form definition by ECM nodeId:**

In this case the metadata of the node are showed in an activiti Form.
If there is no form definied in activiti for the type of the node,
a new form will be automaticaly created in Activiti.

```html
<adf-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'">
</adf-form>
```

**Display form definition by form name, and store the form field as metadata:**

The param nameNode is optional.

```html
<adf-form 
    [formName]="'activitiForms:patientFolder'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</adf-form>
```

**Display form definition by ECM nodeId:**

In this case the metadata of the node are shown in an activiti Form,
and store the form field as metadata. The param nameNode is optional.

```html
<adf-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</adf-form>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| form | `FormModel` |  | Underlying form model instance.  |
| taskId | `string` |  | Task id to fetch corresponding form and values.  |
| nodeId | `string` |  | Content Services node ID for the form metadata.  |
| formId | `string` |  | The id of the form definition to load and display with custom values.  |
| formName | `string` |  | Name of the form definition to load and display with custom values.  |
| saveMetadata | `boolean` | `false` | Toggle saving of form metadata.  |
| data | `FormValues` |  | Custom form values map to be used with the rendered form.  |
| path | `string` |  | Path of the folder where the metadata will be stored.  |
| nameNode | `string` |  | Name to assign to the new node where the metadata are stored.  |
| showTitle | `boolean` | `true` | Toggle rendering of the form title.  |
| showCompleteButton | `boolean` | `true` | Toggle rendering of the `Complete` outcome button.  |
| disableCompleteButton | `boolean` | `false` | If true then the `Complete` outcome button is shown but it will be disabled.  |
| disableStartProcessButton | `boolean` | `false` | If true then the `Start Process` outcome button is shown but it will be disabled.  |
| showSaveButton | `boolean` | `true` | Toggle rendering of the `Save` outcome button.  |
| showDebugButton | `boolean` | `false` | Toggle debug options.  |
| readOnly | `boolean` | `false` | Toggle readonly state of the form. Forces all form widgets to render as readonly if enabled.  |
| showRefreshButton | `boolean` | `true` | Toggle rendering of the `Refresh` button.  |
| showValidationIcon | `boolean` | `true` | Toggle rendering of the validation icon next to the form title.  |
| fieldValidators | `FormFieldValidator[]` | `[]` | Contains a list of form field validator instances.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| formSaved | `EventEmitter<FormModel>` | Emitted when the form is submitted with the `Save` or custom outcomes. |
| formCompleted | `EventEmitter<FormModel>` | Emitted when the form is submitted with the `Complete` outcome. |
| formContentClicked | `EventEmitter<ContentLinkModel>` | Emitted when form content is clicked. |
| formLoaded | `EventEmitter<FormModel>` | Emitted when the form is loaded or reloaded. |
| formDataRefreshed | `EventEmitter<FormModel>` | Emitted when form values are refreshed due to a data property change. |
| executeOutcome | `EventEmitter<FormOutcomeEvent>` | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| onError | `EventEmitter<any>` | Emitted when any error occurs. |

## Details

All `form*` events receive an instance of the `FormModel` as event argument for ease of development:

**MyView.component.html**

```html
<adf-form
    [taskId]="selectedTask?.id"
    (formSaved)="onFormSaved($event)">
</adf-form>
```

**MyView.component.ts**

```ts
onFormSaved(form: FormModel) {
    console.log(form);
}
```

### Custom empty form template

You can add a template that will be show if no form definition has been found

```html
<adf-form .... >

    <div empty-form >
        <h2>Empty form</h2>
    </div>

</adf-form>
```

### Controlling outcome execution behaviour

If absolutely needed it is possible taking full control over form outcome execution by means of `executeOutcome` event.
This event is fired upon each outcome execution, both system and custom ones.

You can prevent default behaviour by calling `event.preventDefault()`.
This allows for example having custom form validation scenarios and/or additional validation summary presentation.

Alternatively you may want just running additional code on outcome execution without suppressing default one.

**MyView.component.html**

```html
<adf-form
    [taskId]="selectedTask?.id"
    executeOutcome="validateForm($event)">
</adf-form>
```

**MyView.component.ts**

```ts
import { FormOutcomeEvent } from '@alfresco/adf-core';

export class MyView {

    validateForm(event: FormOutcomeEvent) {
        let outcome = event.outcome;

        // you can also get additional properties of outcomes
        // if you defined them within outcome definition

        if (outcome) {
            let form = outcome.form;
            if (form) {
                // check/update the form here
                event.preventDefault();
            }
        }
    }

}
```

There are two additional functions that can be of a great value when controlling outcomes:

-   `saveTaskForm()` - saves current form
-   `completeTaskForm(outcome?: string)` - save and complete form with a given outcome name

**Please note that if `event.preventDefault()` is not called then default outcome behaviour
will also be executed after your custom code.**

### Field Validators

You can supply a set of validator objects to the form using the `fieldValidators`
property. Each validator implements checks for a particular type of data (eg, a
date validator might check that the date in the field falls between 1980 and 2017).
ADF supplies a standard set of validators that handle most common cases but you can
also implement your own custom validators to replace or extend the set. See the
[FormFieldValidator](FormFieldValidator.md) class for full details and examples.

## Other documentation

### Common scenarios

#### Changing field value based on another field

Create a simple Form with a dropdown widget (id: `type`), and a multiline text (id: `description`).

```ts
formService.formFieldValueChanged.subscribe((e: FormFieldEvent) => {
    if (e.field.id === 'type') {
        const fields: FormFieldModel[] = e.form.getFormFields();
        const description = fields.find(f => f.id === 'description');
        if (description != null) {
            console.log(description);
            description.value = 'Type set to ' + e.field.value;
        }
    }
});
```

You subscribe to the `formFieldValueChanged` event and check whether event is raised for the `type` widget, then you search for a `description` widget and assign its value to some simple text.

The result should be as following:

![](docassets/images/form-service-sample-01.png)

#### Listen all form Events

If you want to listen all the events fired in the form you can subscribe to this Subject :

```ts
formService.formEvents.subscribe((event: Event) => {
  console.log('Event fired:' + event.type);
  console.log('Event Target:' + event.target);
});
```

## See also

-   [Stencils](stencils.md)
-   [FormFieldValidator](FormFieldValidator.md)
-   [Extensibility](extensibility.md)
-   [Form rendering service](form-rendering.service.md)
-   [Form field model](form-field.model.md)
