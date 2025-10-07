---
Title: Form Extensibility for APA Form Widget
Added: v4.1.0
---

## Form Extensibility for APA Form Widget

This page describes how you can customize ADF forms to your own specification.

## Contents

There are two ways to customize the form
-   [Replace default form widgets with custom components](#replace-default-form-widgets-with-apa-form-widgets)
-   [Replace custom form widget with custom components](#replace-custom-form-widgets-with-custom-components)

## Replace default form widgets with APA form widgets

This is an example of replacing the standard `Text` with a custom component for all APA forms rendered within the `<adf-form>` component.

1. Create a simple form with some `Text` widgets:

    ![default text widget](../docassets/images/apa-simple-form.png)

    Every custom widget component must inherit the [`WidgetComponent`](../core/services/widget.component.md) class in order to function properly:

    ```ts
    import { Component } from '@angular/core';
    import { WidgetComponent } from '@alfresco/adf-core';
   
    @Component({
        selector: 'custom-editor',
        standalone: true,
        template: `
            <div style="color: red">Look, I'm a APA custom editor!</div>
        `
    })
    export class CustomEditorComponent extends WidgetComponent {}
    ```

2. Import the [`FormRenderingService`](../core/services/form-rendering.service.md) in the feature module, or application module (recommended: `ProcessServicesExtensionModule`), and override the default mapping:

    ```ts
    import { CustomEditorComponent } from './custom-editor.component';
    import { FormRenderingService } from '@alfresco/adf-core';
   
    @NgModule({...})
    export class ProcessServicesExtensionModule {
        constructor(formRenderingService: FormRenderingService) {
            this.formRenderingService.register({
                'text': () => CustomEditorComponent
            }, true);
        }
    }
    ```

> [!IMPORTANT]  
> The widget should be registered outside the custom widget component, otherwise the widget will not be registered correctly.

At runtime the form should look similar to the following:

![custom text widget](../docassets/images/apa-simple-override-form.png)

## Replace custom form widgets with custom components

This is an example of rendering custom form widgets using custom Angular components.

### Create a custom form widget

To begin, create a basic form widget and call it `demo-widget`:

![custom form widget](../docassets/images/apa-form-widget.png)

**Note**: The `type` is important as it will become the `field type` when the form is rendered.

You can now design a form that uses your custom form widget:

![custom form widget form](../docassets/images/apa-form-with-widget.png)

### Create a custom widget

When displayed in a task, the field will look similar to the following:

![adf form widget](../docassets/images/apa-unresolved-widget.png)


To render the missing content:

1. Create a standalone Angular component:

    ```ts
    import { Component } from '@angular/core';
    import { WidgetComponent } from '@alfresco/adf-core';
   
    @Component({
        selector: 'app-demo-widget',
        standalone: true,
        template: `<div style="color: green">ADF version of custom form widget</div>`
    })
    export class DemoWidgetComponent extends WidgetComponent {}
    ```

2. Import the [`FormRenderingService`](../core/services/form-rendering.service.md) in the feature module, or application module (recommended: `ProcessServicesExtensionModule`), and override the default mapping:

    ```ts
    import { DemoWidgetComponent } from './demo-widget.component';
    import { FormRenderingService } from '@alfresco/adf-core';
   
    @NgModule({/*...*/})
    export class ProcessServicesExtensionModule {
        constructor(formRenderingService: FormRenderingService) {
            formRenderingService.register({
                'custom-editor': () => DemoWidgetComponent
            });
        }
    }
    ```

At runtime you should now see your custom Angular component rendered in place of the original form widgets:

![adf form widget runtime](../docassets/images/apa-resolved-widget.png)

> [!IMPORTANT]  
> The widget should be registered outside the custom widget component, otherwise the widget will not be registered correctly.

## See Also

-   [Extensibility](./extensibility.md)
-   [Form field model](../core/models/form-field.model.md)
-   [Form rendering service](../core/services/form-rendering.service.md)
-   [Form component](../core/components/form.component.md)
-   [Widget component](../core/services/widget.component.md)
