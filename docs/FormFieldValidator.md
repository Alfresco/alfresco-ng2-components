# FormFieldValidator interface

Defines how the input fields of [ADF Form](form.component.md) and
[ADF Task Details](task-details.component.md) components are validated.

## Basic Usage

```html
<adf-form [fieldValidators]="fieldValidators"></adf-form>
```

```ts
import { FORM_FIELD_VALIDATORS } from 'lib/core/form/components/widgets/core';

@Component({...})
export class AppComponent {

    fieldValidators = [
        // default set of ADF validators if needed
        ...FORM_FIELD_VALIDATORS,

        // custom validator
        new MyValidator()
    ];

}

export class MyValidator implements FormFieldValidator {

    isSupported(field: FormFieldModel): boolean {
        // Check if this validation can be used with 'field'.
    }
    
    validate(field: FormFieldModel): boolean {
        // Perform the validation.
    }
}
```

### Methods

`isSupported(field: FormFieldModel): boolean;`
Does this validator support the type of data used in `field`?

`validate(field: FormFieldModel): boolean;`
Perform validation on `field`.

## Details

You can supply a set of validator objects for a form using its `fieldValidators` property.
ADF will determine if a validator should be used with a given field by calling its
`isSupported` method, passing the field's FormFieldModel as a parameter. If the validator
does support the field then its `validate` method will be called on the FormFieldModel
during the validation phase.

Several validator classes are predefined for you to use:

| Validator name | Checks that: |
| --- | --- |
| `RequiredFieldValidator` | Field is not left blank |
| `NumberFieldValidator` | Field contains numeric data |
| `MinLengthFieldValidator` | Field text has at least a minimum number of characters |
| `MaxLengthFieldValidator` | Field text has no more than a maximum number of characters |
| `MinValueFieldValidator` | Numeric field's value is greater than a lower limit |
| `MaxValueFieldValidator` | Numeric field's vaue is less than an upper limit |
| `RegExFieldValidator` | Field text matches a regular expression |
| `DateFieldValidator` | Field contains a date in the correct format |
| `MinDateFieldValidator` | Date within a field occurs after a certain starting point |
| `MaxDateFieldValidator` | Date within a field occurs before a certain end point |

The `FORM_FIELD_VALIDATORS` array contains an instance of each of these classes. You can assign this to the `fieldValidators` property of an Activiti Form or Activiti Task Details component to enable standard validation.

### Custom validators

You can implement your own custom validator classes if the standard set doesn't provide the
features you need. For example, you could check for consistency between separate fields on
the form (currency values adding up to a given total, say).

The `type` property of `FormFieldModel` is often used in the `isSupported` function, since
validation methods typically apply only to specific types of data.
The [FormFieldTypes](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form-field-types.ts)
class defines convenient constants for the type strings. 

The validator in the example
below simply checks that "admin" is not entered into a text field:

```ts
import { FormFieldModel, FormFieldTypes, FormFieldValidator } from 'lib/core/form/components/widgets/core';

export class DemoFieldValidator implements FormFieldValidator {

    isSupported(field: FormFieldModel): boolean {
        return field && field.type === FormFieldTypes.TEXT;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field)) {
            if (field.value && field.value.toLowerCase() === 'admin') {
                field.validationSummary = 'Sorry, the value cannot be "admin".';
                return false;
            }
        }
        return true;
    }

}
```

You will usually want to extend the existing `FORM_FIELD_VALIDATORS` set rather than replace
it entirely (although you can do this if necessary):

```ts
import { DemoFieldValidator } from './demo-field-validator';

@Component({...})
export class AppComponent {

    fieldValidators = [
        ...FORM_FIELD_VALIDATORS,
        new DemoFieldValidator()
    ];

}
```

You can now use the 'fieldValidators' property of the Form or Task Details components to assign your
custom validator set:

```html
<activiti-task-details
    [fieldValidators]="fieldValidators"
    taskId="123">
</<activiti-task-details>

<!-- OR -->

<adf-form
    [fieldValidators]="fieldValidators"
    taskI="123">
</adf-form>
```

If you now run the application and try to enter "admin" in one of the text fields (either optional or required), you should see the following error:

![](docassets/images/demo-validator.png)

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Form field model](form-field.model.md)
- [Form component](form.component.md)
<!-- seealso end -->