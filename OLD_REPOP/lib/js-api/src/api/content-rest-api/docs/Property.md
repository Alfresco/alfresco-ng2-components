# Property

**Properties**

| Name                | Type                        | Description                                                |
|---------------------|-----------------------------|------------------------------------------------------------|
| **id**              | string                      |                                                            |
| title               | string                      | the human-readable title                                   |
| description         | string                      | the human-readable description                             |
| defaultValue        | string                      | the default value                                          |
| dataType            | string                      | the name of the property type (i.g. d:text)                |
| isMultiValued       | boolean                     | define if the property is multi-valued                     |
| isMandatory         | boolean                     | define if the property is mandatory                        |
| isMandatoryEnforced | boolean                     | define if the presence of mandatory properties is enforced |
| isProtected         | boolean                     | define if the property is system maintained                |
| constraints         | [Constraint[]](#Constraint) | list of constraints defined for the property               |

## Constraint

**Properties**

| Name        | Type             | Description                               |
|-------------|------------------|-------------------------------------------|
| **id**      | string           |                                           |
| type        | string           | the type of the constraint                |
| title       | string           | the human-readable constraint title       |
| description | string           | the human-readable constraint description |
| parameters  | Map<string, any> |                                           |



