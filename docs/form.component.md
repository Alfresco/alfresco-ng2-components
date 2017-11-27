# Activiti Form component

The component shows a Form from Activiti (see it live: [Form Quickstart](https://embed.plnkr.co/YSLXTqb3DtMhVJSqXKkE/))

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Advanced properties](#advanced-properties)
  * [Events](#events)
- [Details](#details)
  * [Custom empty form template](#custom-empty-form-template)
  * [Controlling outcome execution behaviour](#controlling-outcome-execution-behaviour)
  * [Field Validators](#field-validators)
- [Other documentation](#other-documentation)
  * [Common scenarios](#common-scenarios)
    + [Changing field value based on another field](#changing-field-value-based-on-another-field)
    + [Listen all form Events](#listen-all-form-events)
- [See also](#see-also)

<!-- tocstop -->

<!-- markdown-toc end -->

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

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| taskId | string | | Task id to fetch corresponding form and values. |
| formId | string | | The id of the form definition to load and display with custom values. |
| formName | string | | Name of the form definition to load and display with custom values. |
| data | FormValues | | Custom form values map to be used with the rendered form. |
| showTitle | boolean | true | Toggle rendering of the form title. |
| showCompleteButton | boolean | true | Toggle rendering of the `Complete` outcome button. |
| disableCompleteButton | boolean | false | The `Complete` outcome button is shown but it will be disabled. |
| disableStartProcessButton | boolean | false | The `Start Process` outcome button is shown but it will be disabled. |
| showSaveButton | boolean | true | Toggle rendering of the `Save` outcome button. |
| readOnly | boolean | false | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| showRefreshButton | boolean | true | Toggle rendering of the `Refresh` button. |
| showValidationIcon | boolean | true | Toggle rendering of the validation icon next form title. |
| saveMetadata | boolean | false | Store the value of the form as metadata. |
| path | string |  |  Path of the folder where to store the metadata. |
| nameNode | string | true | Name to assign to the new node where the metadata are stored. |
| fieldValidators | FormFieldValidator[] | See [Field Validators](#field-validators) section below | Contains a list of form field validator instances. |

### Advanced properties

 The following properties are for complex customisation purposes:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| form | FormModel | | Underlying form model instance. |
| showDebugButton | boolean | false | Toggle debug options. |
| debugMode | boolean | false | Toggle debug mode, allows displaying additional data for development and debugging purposes. |

### Events

| Name |  Return Type | Description |
| --- | --- | --- |
| formLoaded | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts) | Invoked when form is loaded or reloaded. |
| formSaved | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts)  | Invoked when form is submitted with `Save` or custom outcomes.  |
| formCompleted | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts)  | Invoked when form is submitted with `Complete` outcome.  |
| formDataRefreshed | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts) | Invoked when form values are refreshed due to a data property change  |
| executeOutcome | [FormOutcomeEvent](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form-outcome-event.model.ts) | Invoked when any outcome is executed, default behaviour can be prevented via `event.preventDefault()` |
| error | any | Invoked at any error |

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
import { FormOutcomeEvent } from 'lib/core/form/components/widgets/core';

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

- `saveTaskForm()` - saves current form
- `completeTaskForm(outcome?: string)` - save and complete form with a given outcome name

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

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Stencils](stencils.md)
- [FormFieldValidator](FormFieldValidator.md)
- [Extensibility](extensibility.md)
- [Form rendering service](form-rendering.service.md)
- [Form field model](form-field.model.md)
<!-- seealso end -->