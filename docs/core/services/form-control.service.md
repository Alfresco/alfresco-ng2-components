---
Title: Form control service
Status: Active
Last reviewed: 2019-04-30
---

# [Form control service](../../../lib/core/form/services/form-control.service.ts "Defined in form-control.service.ts")

Implements Process Services form methods

## Basic Usage

```ts
import { FormControlService, FormEvent, FormFieldEvent } from '@alfresco/adf-core';

@Component(...)
class MyComponent {

    constructor(formControlService: FormControlService) {

        formControlService.formLoaded.subscribe(
            (e: FormEvent) => {
                console.log(`Form loaded: ${e.form.id}`);
            }
        );

        formControlService.formFieldValueChanged.subscribe(
            (e: FormFieldEvent) => {
                console.log(`Field value changed. Form: ${e.form.id}, Field: ${e.field.id}, Value: ${e.field.value}`);
            }
        );

    }

}
```

### Events

| Name | Args Type | Description |
| ---- | --------- | ----------- |
| formLoaded | [`FormEvent`](../../../lib/core/form/events/form.event.ts) | Raised when form has been loaded or reloaded |
| formFieldValueChanged | [`FormFieldEvent`](../../../lib/core/form/events/form-field.event.ts) | Raised when input values change |
| taskCompleted | [`FormEvent`](../../../lib/core/form/events/form.event.ts) | Raised when a task is completed successfully |
| taskCompletedError | [`FormErrorEvent`](../../../lib/core/form/events/form-error.event.ts) | Raised when a task is completed unsuccessfully |
| taskSaved | [`FormEvent`](../../../lib/core/form/events/form.event.ts) | Raised when a task is saved successfully |
| taskSavedError | [`FormErrorEvent`](../../../lib/core/form/events/form-error.event.ts) | Raised when a task is saved unsuccessfully |
| executeOutcome | [`FormOutcomeEvent`](../../../lib/core/form/components/widgets/core/form-outcome-event.model.ts) | Raised when a form outcome is executed |
| formEvents | Event | You can subscribe to this event to listen : ( click, blur, change, focus, focusin, focusout, input, invalid, select) of any elements in the form , see doc below |
| validateForm | [`ValidateFormEvent`](../../../lib/core/form/events/validate-form.event.ts) | Raised each time a form is validated. You can use it to provide custom validation or prevent default behaviour. |
| validateFormField | [`ValidateFormFieldEvent`](../../../lib/core/form/events/validate-form-field.event.ts) | Raised each time a form field is validated. You can use it to provide custom validation or prevent default behaviour. |
