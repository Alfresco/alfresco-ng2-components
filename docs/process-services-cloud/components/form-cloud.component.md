---
Title: Form cloud component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-12
---

# [Form cloud component](../../../lib/process-services-cloud/src/lib/form/components/form-cloud.component.ts "Defined in form-cloud.component.ts")

Shows a [`form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) from Process Services.

## Contents

-   [Basic Usage](#basic-usage)
    -   [Custom form outcomes template](#custom-form-outcomes-template)
    -   [Empty form template](#empty-form-template)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Displaying a form](#displaying-a-form)
    -   [Controlling outcome execution behaviour](#controlling-outcome-execution-behaviour)
    -   [Field Validators](#field-validators)
    -   [Common scenarios](#common-scenarios)
-   [See also](#see-also)

## Basic Usage

```html
<adf-cloud-form 
    [appName]="appName"
    [taskId]="taskId"
    [processInstanceId]="processInstanceId">
</adf-cloud-form>
```

### Custom form outcomes template

You can set the custom form outcomes using an `<adf-cloud-form-custom-outcomes>` element.

```html
<adf-cloud-form .... >

    <adf-cloud-form-custom-outcomes>
        <button mat-button (click)="onCustomOutcome1()">
            Custom-outcome-1
        </button>
        <button mat-button (click)="onCustomOutcome2()">
            Custom-outcome-2
        </button>
        <button mat-button (click)="onCustomOutcome3()">
            Custom-outcome-3
        </button>
    </adf-cloud-form-custom-outcomes>

</adf-cloud-form>
```

### Empty form template

The template defined inside `empty-form` will be shown when no form definition is found:

```html
<adf-cloud-form .... >

    <div empty-form >
        <h2>Empty form</h2>
    </div>

</adf-cloud-form>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` | "" | App name to fetch corresponding form and values. |
| appVersion | `number` |  | The application version to use when fetching data |
| data | [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]` |  | Custom form values map to be used with the rendered form. |
| disableCompleteButton | `boolean` | false | If true then the `Complete` outcome button is shown but it will be disabled. |
| disableSaveButton | `boolean` | false | If true then the `Save` outcome button is shown but will be disabled. |
| disableStartProcessButton | `boolean` | false | If true then the `Start Process` outcome button is shown but it will be disabled. |
| fieldValidators | [`FormFieldValidator`](../../../lib/core/src/lib/form/components/widgets/core/form-field-validator.ts)`[]` |  | [FormFieldValidator](../../../lib/core/src/lib/form/components/widgets/core/form-field-validator.ts) allow to override the form field validators provided. |
| form | [`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts) |  | Underlying form model instance. |
| formId | `string` |  | Task id to fetch corresponding form and values. |
| nameNode | `string` |  | Name to assign to the new node where the metadata are stored. |
| path | `string` |  | Path of the folder where the metadata will be stored. |
| processInstanceId | `string` |  | ProcessInstanceId id to fetch corresponding form and values. |
| readOnly | `boolean` | false | Toggle readonly state of the form. Forces all form widgets to render as readonly if enabled. |
| showCompleteButton | `boolean` | true | Toggle rendering of the `Complete` outcome button. |
| showRefreshButton | `boolean` | true | Toggle rendering of the `Refresh` button. |
| showSaveButton | `boolean` | true | Toggle rendering of the `Save` outcome button. |
| showTitle | `boolean` | true | Toggle rendering of the form title. |
| showValidationIcon | `boolean` | true | Toggle rendering of the validation icon next to the form title. |
| taskId | `string` |  | Task id to fetch corresponding form and values. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs. |
| executeOutcome | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormOutcomeEvent`](../../../lib/core/src/lib/form/components/widgets/core/form-outcome-event.model.ts)`>` | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| formCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is submitted with the `Complete` outcome. |
| formContentClicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ContentLinkModel`](../../../lib/core/src/lib/form/components/widgets/core/content-link.model.ts)`>` | Emitted when form content is clicked. |
| formDataRefreshed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when form values are refreshed due to a data property change. |
| formError | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormFieldModel`](../../core/models/form-field.model.md)`[]>` | Emitted when the supplied form values have a validation error. |
| formLoaded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is loaded or reloaded. |
| formSaved | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is submitted with the `Save` or custom outcomes. |

## Details

All `formXXX` events receive a [`FormCloudModel`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) instance as their argument:

**MyView.component.html**

```html
<adf-cloud-form
    [appName]="appName"
    [taskId]="selectedTask?.id"
    [processInstanceId]="selectedTask?.processInstanceId"
    (formSaved)="onFormSaved($event)">
</adf-cloud-form>
```

**MyView.component.ts**

```ts
onFormSaved(form: FormCloudModel) {
    console.log(form);
}
```

### Displaying a form

There are various ways to display a form. The common scenarios are detailed below.

#### Displaying a form instance by task id and processInstanceId

```html
<adf-cloud-form 
    [appName]="appName"
    [taskId]="selectedTask?.id"
    [processInstanceId]="selectedTask?.processInstanceId">
</adf-cloud-form>
```

For an existing Task both the form and its values will be fetched and displayed.

#### Displaying a form definition by form id

```html
<adf-cloud-form 
    [appName]="appName"
    [formId]="selectedFormDefinition?.id"
    [data]="customData">
</adf-cloud-form>
```

In this case, only the form definition will be fetched.

### Controlling outcome execution behaviour

In unusual circumstances, you may need to take complete control of form outcome execution.
You can do this by implementing the `executeOutcome` event, which is emitted for both system
outcomes and custom ones.

Note that by default, the code in your `executeOutcome` handler is executed _before_ the default
behavior but you can switch the default behavior off using `event.preventDefault()`.
You might want to do this, for example, to provide custom form validation or to show a summary
of the form validation before it is submitted.

**MyView.component.html**

```html
<adf-cloud-form
    [appName]="appName"
    [taskId]="selectedTask?.id"
    [processInstanceId]="selectedTask?.processInstanceId"
    executeOutcome="validateForm($event)">
</adf-cloud-form>
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

There are two other functions that can be very useful when you need to control form outcomes:

-   `saveTaskForm()` - Saves the current form
-   `completeTaskForm(outcome?: string)` Saves and completes the form with a given outcome name

### Field Validators

You can supply a set of validator objects to the form using the `fieldValidators`
property. Each validator implements a check for a particular type of data (eg, a
date validator might check that the date in the field falls between 1980 and 2017).
ADF supplies a standard set of validators that handle most common cases but you can
also implement your own custom validators to replace or extend the set. See the
[Form Field Validator](../../core/interfaces/form-field-validator.interface.md) interface for full details and examples.

### Common scenarios

#### Rendering a form using form definition JSON

See the [demo-form](../../docassets/demo-cloud.form.json) file for an example of form definition JSON.

The component below (with the JSON assigned to the `formDefinitionJSON` property), shows how a
form definition is rendered:

```ts
@Component({
    selector: 'sample-form',
    template: `<div class="form-container">
                    <adf-cloud-form
                        [form]="form">
                    </adf-cloud-form>
                </div>`
})
export class SampleFormComponent implements OnInit {

    form: FormCloudModel;
    formDefinitionJSON: any;

    constructor(private formService: FormService) {
    }

    ngOnInit() {        
        this.form = this.formService.parseForm(this.formDefinitionJSON);
    }
}
```

#### Customizing the styles of form outcome buttons

You can use normal CSS selectors to style the outcome buttons of your form.
Every outcome has an CSS id value following a simple pattern:

      adf-cloud-form-OUTCOME_NAME

In the CSS, you can target any outcome ID and change the style as in this example:

```css
#adf-cloud-form-complete {
    background-color: blue !important;
    color: white;
}


#adf-cloud-form-save {
    background-color: green !important;
    color: white;
}

#adf-cloud-form-customoutcome {
    background-color: yellow !important;
    color: white;
}
```

![](../../docassets/images/form-style-sample.png)

## See also

-   [Form Field Validator interface](../../core/interfaces/form-field-validator.interface.md)
-   [Extensibility](../../user-guide/extensibility.md)
-   [Form rendering service](../../core/services/form-rendering.service.md)
-   [Form field model](../../core/models/form-field.model.md)
-   [Form cloud service](../services/form-cloud.service.md)
