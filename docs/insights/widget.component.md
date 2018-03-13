---
Added: v2.0.0
Status: Active
---
# Widget component

Base class for standard and custom widget classes.

## Basic Usage

```ts
import { Component } from '@angular/core';
import { WidgetComponent } from '@alfresco/adf-core';

@Component({
    selector: 'custom-editor',
    template: `
        <div style="color: red">Look, I'm a custom editor!</div>
    `
})
export class CustomEditorComponent extends WidgetComponent {}
```

### Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| readOnly | boolean | false | Does the widget show a read-only value? (ie, can't be edited) |
| field | [FormFieldModel](../core/form-field.model.md) |  | Data to be displayed in the field |

## Details

The Widget component is the base class for all standard and custom form widgets. See the
[Form Extensibility and Customisation](../extensibility.md) page for full details about
implementing custom widgets.

## See also

-   [Extensibility](../extensibility.md)
