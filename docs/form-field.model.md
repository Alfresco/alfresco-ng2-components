# Form Field model

Contains the value and metadata for a field of an
[ADF Form](form.component.md).

## Properties

| Name | Type | Default | Description |
|--|--|--|--|
| id | string |  | Field ID |
| name | string |  | Field name |
| type | string |  | Field type (see [Form Rendering service](form-rendering.service.md) for a list of available type strings) |
| value | any |  | Field value (implemented by get/set) |
| readOnly | boolean |  | Is this a read-only field? (Implemented by get/set) |
| required | boolean |  | Is the field required to have a value? (Implemented by get/set) |
| isValid | boolean |  | Does the field pass its validation checks? (Implemented by get/set) |
| overrideId | boolean |  | Should the auto-generated ID (from `name`) be overridden to let the user set a custom ID? |
| tab | string |  | Name of the current form tab |
| rowspan | number | 1 | The number of container rows that the field spans |
| colspan | number | 1 | The number of container columns that the field spans |
| placeholder | string | null | Placeholder text shown before the field is edited |
| minLength | number | 0 | Minimum allowed number of characters in input data |
| maxLength | number | 0 | Maximum allowed number of characters in input data |
| minValue | string |  | Minimum allowed value (eg, for number or date) |
| maxValue | string |  | Minimum allowed value (eg, for number or date) |
| regexPattern | string |  | Regular expression that text data should match |
| options | FormFieldOption[] | [] | Option items for a dropdown menu |
| restUrl | string |  | URL for a REST call to populate a dropdown menu |
| restResponsePath | string |  | Path within REST response JSON to the array of dropdown data |
| restIdProperty | string |  | JSON property name to use for the `id` property of a dropdown item |
| restLabelProperty | string |  | JSON property name to use for the `label` property of a dropdown item |
| hasEmptyValue | boolean |  | Is the field's value empty? (eg, dropdown with no item selected) |
| className | string |  | CSS class name for the field |
| optionType | string |  |  |
| params | FormFieldMetadata | {} |  |
| hyperlinkUrl | string |  | URL for Hyperlink widgets |
| displayText | string |  | Displayed text for Hyperlink widgets |
| isVisible | boolean | true | Is the field shown on the form? |
| visibilityCondition | WidgetVisibilityModel | null | Defines a expression that determines whether the field is visible or not, based on its logical relation to values in other fields |
| enableFractions | boolean | false | Are numeric values allowed to contain a decimal point? |
| currency | string | null | Currency symbol for Amount widgets |
| dateDisplayFormat | string |  | Date/time display format template |
| numberOfColumns | number | 1 | Number of columns defined by a container field |
| fields | FormFieldModel[] | [] | Fields contained within a container field |
| columns | ContainerColumnModel[] | [] | Column definitions for a container field |
| emptyOption | FormFieldOption |  | Dropdown menu item to use when no option is chosen |
| validationSummary | string |  | Error/information message added during field validation (see [FormFieldValidator](FormFieldValidator) interface) |

## Details

Every field of a form has an associated `FormFieldModel` instance that contains the
field's value and metadata. The standard widgets use this information to render fields and you can also make use of it in your own custom widgets and field validators.

### Custom widgets

You will need to use the properties of `FormFieldModel` if you want to implement your own
custom widgets. Aside from the `value` property (which contains the data value entered into
the field), there are also a few other fields that are used for specific types of data. For
example, the `currency` property holds the currency symbol to be displayed next to the value
(such as the dollar sign $) and the `dateDisplayFormat` defines how the elements of a date/time will be arranged. See the [Form Extensibility and Customization](extensibility.md) for more information about creating custom widgets.

### Validation

A [Form](form.component.md) or [Task Details](task-details.component.md) component can
be supplied with a set of validator objects. Each validator applies a particular kind of
check to a field. A number of `FormFieldModel` properties are used by validators. For
example, `minValue` and `maxValue` are used to check that a numeric value falls within an
allowed range and `regexPattern` defines a regular expression that a text field should
match. Also, the `validationSummary` is used to send a message back from the validator
for the user to read. See the [FormFieldValidator](FormFieldValidator.md) page for more information about implementing validators.

### REST properties

You can set the items shown on a dropdown menu using data returned by a REST call. The
properties used by the call are:

- `restUrl`: The URL for the REST service
- `restResponsePath`: Optional path to an array within the JSON object returned by
the REST call. Each element in the array corresponds to an item on the dropdown.
- `restIdProperty`: The name of a JSON property present in each element of the array
selected by `restResponsePath`. Its value will be used for the `id` property of the
dropdown item.
`restLabelProperty`: The name of a JSON property present in each element of the array
selected by `restResponsePath`. Its value will be used for the `label` property of the
dropdown item (ie, the text visible to the user).

The [REST Call Task 101](https://community.alfresco.com/community/bpm/blog/2016/08/31/rest-integration-101)
tutorial on the [APS community site](https://community.alfresco.com/community/bpm)
contains full details about how the REST calls work, along with a worked example.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Extensibility](extensibility.md)
- [FormFieldValidator](FormFieldValidator.md)
- [Form rendering service](form-rendering.service.md)
- [Form component](form.component.md)
<!-- seealso end -->