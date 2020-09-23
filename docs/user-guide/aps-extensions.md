## Replacing default form widgets with APS custom components

This is a short walkthrough on replacing a standard `Text` [widget](../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) with a custom component for all APS forms
rendered within `<adf-form>` component.

First let's create a simple APS form with `Text` widgets:

![default text widget](../docassets/images/text-default-widget.png)

Every custom [widget](../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) must inherit [`WidgetComponent`](../insights/components/widget.component.md) class in order to function properly:

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

Now you will need to add it to the application module or any custom module that is imported into the application one:

```ts
import { NgModule } from '@angular/core';
import { CustomEditorComponent } from './custom-editor.component';

@NgModule({
    declarations: [ CustomEditorComponent ],
    exports: [ CustomEditorComponent ]
})
export class CustomEditorsModule {}
```

Every custom [widget](../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) should be added into the following collections: `declarations`, `exports`.

If you decided to store custom widgets in a separate dedicated module (and optionally as separate redistributable library)
don't forget to import it into your main application one:

```ts
@NgModule({
    imports: [
        // ...
        CustomEditorsModule
        // ...
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
```

Now you can import [`FormRenderingService`](../core/services/form-rendering.service.md) in any of your Views and override default mapping similar to the following:

```ts
import { Component } from '@angular/core';
import { CustomEditorComponent } from './custom-editor.component';

@Component({...})
export class MyView {

    constructor(formRenderingService: FormRenderingService) {
        formRenderingService.setComponentTypeResolver('text', () => CustomEditorComponent, true);
    }

}
```

At runtime it should look similar to the following:

![custom text widget](../docassets/images/text-custom-widget.png)

## Replacing custom stencils with custom components

This is a short walkthrough on rendering custom APS stencils by means of custom Angular components.

### Creating custom stencil

First let's create a basic stencil and call it `Custom Stencil 01`:

![custom stencil](../docassets/images/activiti-stencil-01.png)

_Note the `internal identifier` value as it will become a `field type` value when corresponding form is rendered._

Next put some simple html layout for [`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts)`runtime template` and [`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts)`editor template` fields:

```html
<div style="color: blue">Custom activiti stencil</div>
```

Now you are ready to design a test form based on your custom stencil:

![custom stencil form](../docassets/images/activiti-stencil-02.png)

Once wired with a new task it should look like the following within APS web application:

![custom stencil task](../docassets/images/activiti-stencil-03.png)

### Creating custom widget

If you load previously created task into ADF `<adf-form>` component you will see something like the following:

![adf stencil](../docassets/images/adf-stencil-01.png)

Let's create an Angular component to render missing content:

```ts
import { Component } from '@angular/core';
import { WidgetComponent } from '@alfresco/adf-core';

@Component({
    selector: 'custom-stencil-01',
    template: `<div style="color: green">ADF version of custom Activiti stencil</div>`
})
export class CustomStencil01 extends WidgetComponent {}
```

Put it inside custom module:

```ts
import { NgModule } from '@angular/core';
import { CustomStencil01 } from './custom-stencil-01.component';

@NgModule({
    declarations: [ CustomStencil01 ],
    exports: [ CustomStencil01 ]
})
export class CustomEditorsModule {}
```

And import into your Application Module

```ts
@NgModule({
    imports: [
        // ...
        CustomEditorsModule
        // ...
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
```

Now you can import [`FormRenderingService`](../core/services/form-rendering.service.md) in any of your Views and provide new mapping:

```ts
import { Component } from '@angular/core';
import { CustomStencil01 } from './custom-stencil-01.component';

@Component({...})
export class MyView {

    constructor(formRenderingService: FormRenderingService) {
        formRenderingService.setComponentTypeResolver('custom_stencil_01', () => CustomStencil01, true);
    }

}
```

At runtime you should now see your custom Angular component rendered in place of the stencils:

![adf stencil runtime](../docassets/images/adf-stencil-02.png)
