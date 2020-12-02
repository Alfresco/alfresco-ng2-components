---
Title: Widget component
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-29
---

# [Widget component](../../../lib/insights/src/lib/analytics-process/components/widgets/widget.component.ts "Defined in widget.component.ts")

Base class for standard and custom [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) classes.

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
| --- | --- | --- | --- |
| field | `any` |  | field. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| fieldChanged | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | fieldChanged. |

## Details

The [Widget component](widget.component.md) is the base class for all standard and custom form widgets. See the
[Form Extensibility and Customisation](../../user-guide/extensibility.md) page for full details about
implementing custom widgets.

## See also

*   [Extensibility](../../user-guide/extensibility.md)
