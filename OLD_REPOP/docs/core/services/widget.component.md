# Widget Component

Base class for all standard and custom form widgets. All widgets must extend this class.

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

## Class members

### Properties

| Name  | Type  | Default value | Description |
|-------|-------|---------------|-------------|
| field | `any` |               | field.      |

### Events

| Name         | Type                | Description   |
|--------------|---------------------|---------------|
| fieldChanged | `EventEmitter<any>` | fieldChanged. |

## Details

The `WidgetComponent` is the base class for all standard and custom form widgets.
See the [Form Extensibility and Customisation](../../user-guide/extensibility.md) page for full details about
implementing custom widgets.

## See also

-   [Extensibility](../../user-guide/extensibility.md)
