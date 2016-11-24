# Form Stencils with Angular 2

Form component provides basic support for custom stencils created with Activiti stencil editor.

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
- `/app/rest/script-files/controllers`  
    provides all stencil controllers stored within Activiti

- `runtime.ng1.js`  
    provides a compatibility layer for controllers created with Angular 1  
    (this is to avoid runtime errors when loading Angular 1 code into `<activiti-form>` component)

- `runtime.adf.js`  
    provides API for stencil management and registration, 
    i.e. mapping html templates with corresponding controller classes

## Creating new stencil

Create a new stencil and add a new item called `ng2 component 01`.  

The internal identifier in this case should be `ng2_component_01`. 
This value will be used as field type when form gets rendered.

## Form runtime template 

This should be a valid Angular 2 component template that you want to render in `<activiti-form>` component:

```html
<div>
    <div>Angular2 Component</div>
    <div>Created by: {{name}}</div>
</div>
```

## Form editor template

This can be any html layout to be rendered as a component placeholder in Activiti Form Designer.

```html
<div>
    <div style="color: blue">
        Angular2 Component 01
    </div>
</div>
```

## Custom component controller

This field should contain JavaScript code for Angular 2 component class.

_Note: If you are using TypeScript then you should be putting transpiled JavaScript code here,
you can try official [TypeScript playground](http://www.typescriptlang.org/play/) 
to see how TS code gets transpiled into JS._

### JavaScript code

```js
var SampleClass1 = (function () {
    function SampleClass1() {
        this.name = 'Denys';
        console.log('ng2_component_01 ctor');
    }
    SampleClass1.prototype.ngOnInit = function () {
      console.log('OnInit called');  
    };
    return SampleClass1;
}());
```

### TypeScript code

The TypeScript version of the code above is:

```ts
import { OnInit } from '@angular/core';

class Component1 implements OnInit {

  constructor() {
    console.log('ctor called');
  }

  ngOnInit() {
    console.log('OnInit called');
  }

}
```


In order to map **form runtime template** with the corresponding component class
you will need registering both parts with `adf.registerComponent` api:

```js
if (adf) {
    adf.registerComponent('ng2_component_01', SampleClass1);
}
```

### Final result

```js
var SampleClass1 = (function () {
    function SampleClass1() {
        this.name = 'Denys';
        console.log('ng2_component_01 ctor');
    }
    SampleClass1.prototype.ngOnInit = function () {
      console.log('OnInit called');  
    };
    return SampleClass1;
}());

if (adf) {
    adf.registerComponent('ng2_component_01', SampleClass1);
}
```

## Runtime result

When rendered on the form this stencil item should look like the following:

```html
Angular2 Component
Created by: Denys
```

ADF Form component will automatically assemble and compile a valid Angular 2 component on the fly.