# Form Stencils

[`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) component provides basic support for custom stencils created with Activiti stencil editor.

## Contents

-   [Installing](#installing)
-   [Creating new stencil](#creating-new-stencil)
-   [Form runtime template](#form-runtime-template)
-   [Form editor template](#form-editor-template)
-   [Custom component controller](#custom-component-controller)
    -   [JavaScript code](#javascript-code)
    -   [TypeScript code](#typescript-code)
    -   [Mapping template with component class](#mapping-template-with-component-class)
    -   [Final result](#final-result)
-   [Runtime result](#runtime-result)

## Installing

Configuring support for stencils requires the following configuration for your `index.html` file:

```html
<!-- Stencils integration -->
<script src="node_modules/ng2-activiti-form/stencils/runtime.ng1.js"></script>
<script src="node_modules/ng2-activiti-form/stencils/runtime.adf.js"></script>
<script src="http://<activiti-app-root>/app/rest/script-files/controllers"></script>
```

Where `<activiti-app-root>` should be replaced with a valid url pointing to your Activiti installation, for example:

```html
<script src="http://localhost:9999/activiti-app/app/rest/script-files/controllers"></script>
```

-   `/app/rest/script-files/controllers`
    provides all stencil controllers stored within Activiti

-   `runtime.ng1.js`
    provides a compatibility layer for controllers created with AngularJS (aka Angular 1x)
    (this is to avoid runtime errors when loading AngularJS code into `<activiti-form>` component)

-   `runtime.adf.js`
    provides API for stencil management and registration,
    i.e. mapping html templates with corresponding controller classes

## Creating new stencil

Create a new stencil and add a new item called `ng2 component 01`.

The internal identifier in this case should be `ng2_component_01`.
This value will be used as field type when form gets rendered.


## Form editor template

This can be any html layout to be rendered as a component placeholder in Activiti [`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) Designer.

```html
<div>
    <div>Angular Component</div>
    <div>Created by: {{name}}</div>
</div>
```

```ts
@Component({
    templateUrl: "./your-component.component.html"
})
class CustomStencil implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log("OnInit called");
    }
}
```

ADF [`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) component will automatically assemble and compile a valid Angular component on the fly.

## Registering your custom stencils

Register your custom stencil using the FormRenderingService.
```ts
@Component({
    templateUrl: "./your-parent-component.component.html"
})
class CustomParentComponent  {
    constructor(private formRenderingService: FormRenderingService) {

        formRenderingService.setComponentTypeResolver('ng2_component_01', () => CustomStencil, true);
    }
}
```

## Runtime result

When rendered on the form this stencil item should look like the following:

```html
Angular Component 
Created by: Denys
```
