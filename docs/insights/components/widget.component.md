---
Title: Widget component
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-29
---

# [Widget component](../../../lib/insights/analytics-process/components/widgets/widget.component.ts "Defined in widget.component.ts")

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

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| field | `any` |  | Data to be displayed in the field |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| fieldChanged | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | ( |

## Details

The [Widget component](widget.component.md) is the base class for all standard and custom form widgets. See the
[Form Extensibility and Customisation](../../user-guide/extensibility.md) page for full details about
implementing custom widgets.

## See also

-   [Extensibility](../../user-guide/extensibility.md)
