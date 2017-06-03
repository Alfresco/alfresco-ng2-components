# Alfresco Core Component for Angular 2

<p>
  <a title='Build Status Travis' href="https://travis-ci.org/Alfresco/alfresco-ng2-components">
    <img src='https://travis-ci.org/Alfresco/alfresco-ng2-components.svg?branch=master'  alt='travis
    Status' />
  </a>
  <a title='Build Status AppVeyor' href="https://ci.appveyor.com/project/alfresco/alfresco-ng2-components">
    <img src='https://ci.appveyor.com/api/projects/status/github/Alfresco/alfresco-ng2-components'  alt='travis
    Status' />
  </a>
  <a href='https://codecov.io/gh/Alfresco/alfresco-ng2-components'>
    <img src='https://img.shields.io/codecov/c/github/Alfresco/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
  </a>
  <a href='https://www.npmjs.com/package/ng2-alfresco-login'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-login.svg' alt='npm downloads' />
  </a>
  <a href='https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='alfresco component' />
  </a>
  <a href='https://angular.io/'>
     <img src='https://img.shields.io/badge/style-2-red.svg?label=angular' alt='angular 2' />
  </a>
  <a href='https://www.typescriptlang.org/docs/tutorial.html'>
     <img src='https://img.shields.io/badge/style-lang-blue.svg?label=typescript' alt='typescript' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-%3E5.0.0-blue.svg?label=node%20version' alt='node version' />
  </a>
</p>

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

See it live: [Login Quickstart](http://embed.plnkr.co/PfZytJyHcl3xIsa8pdMo/)

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-alfresco-login --save
    ```

2. Html

    Include these dependencies in your index.html page:

    ```html

    <!-- Google Material Design Lite -->
    <link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
    <script src="node_modules/material-design-lite/material.min.js"></script>
    <link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">

    <!-- Load the Angular Material 2 stylesheet -->
    <link href="node_modules/@angular/material/core/theming/prebuilt/deeppurple-amber.css" rel="stylesheet">

    <!-- Polyfill(s) for Safari (pre-10.x) -->
    <script src="node_modules/intl/dist/Intl.min.js"></script>
    <script src="node_modules/intl/locale-data/jsonp/en.js"></script>

    <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js"></script>
    <script src="node_modules/element.scrollintoviewifneeded-polyfill/index.js"></script>

    <!-- Polyfill(s) for dialogs -->
    <script src="node_modules/dialog-polyfill/dialog-polyfill.js"></script>
    <link rel="stylesheet" type="text/css" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
    <style>._dialog_overlay { position: static !important; } </style>

    <!-- Modules  -->
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    ```

3. SystemJs

    Add the following components to your systemjs.config.js file:

    - ng2-translate
    - ng2-alfresco-core
    - alfresco-js-api
    - ng2-alfresco-login

    Please refer to the following example file: [systemjs.config.js](demo/systemjs.config.js) .


## Basic usage

This component allow to authenticate to Alfresco One and Alfresco Activiti.

```html
<alfresco-login [providers]="'ALL'"></alfresco-login>
```

Usage example of this component :

**main.ts**

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { LoginModule } from 'ng2-alfresco-login';

@Component({
    selector: 'my-app',
    template: `
       <alfresco-login [providers]="'ALL'"
                       [disableCsrf]="true"
                       (onSuccess)="mySuccessMethod($event)"
                       (onError)="myErrorMethod($event)">
        </alfresco-login>`
})
export class AppComponent {

    constructor(public auth: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080/';
        settingsService.bpmHost = 'http://localhost:9999/';
    }

    mySuccessMethod($event) {
        console.log('Success Login EventEmitt called with: ' + $event.value);
    }

    myErrorMethod($event) {
        console.log('Error Login EventEmitt called with: ' + $event.value);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        LoginModule
    ],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
```

#### Properties

| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| `providers` | string | ECM | Possible valid value are ECM, BPM or ALL. The default behaviour of this component will logged in only in the ECM . If you want log in in both system the correct value to use is ALL |
| `disableCsrf` | boolean | false | To prevent the CSRF Token from been submitted. Only for Activiti call |
| `needHelpLink` | string | '' | It will change the url of the NEED HELP link in the footer  |
| `registerLink` | string | '' | It will change the url of the REGISTER link in the footer |
| `logoImageUrl` | string | Alfresco logo image | To change the logo image with a customised image |
| `backgroundImageUrl` | string | Alfresco background image | To change the background image with a customised image |
| `fieldsValidation` | { [key: string]: any; }, extra?: { [key: string]: any; } |  | Use it to customise the validation rules of the login form |
| `showRememberMe` | boolean | false | Toggle `Remember me` checkbox visibility |
| `showLoginActions` | boolean | false | Toggle extra actions visibility (`Need Help`, `Register`, etc.) |

#### Events

| Name | Description |
| --- | --- |
| `onSuccess` | The event is emitted when the login is done |
| `onError` | The event is emitted when the login fails |
| `executeSubmit` | The event is emitted when the form is submitted |

## Change footer content

<img src="assets/custom-footer.png" width="400" />

You can replace the entire content in the footer of the login component with your custom content.

```html
<alfresco-login ...>
    <login-footer><template>My custom HTML for the footer</template></login-footer>
</alfresco-login>`
```

## Change header content

<img src="assets/custom-header.png" width="400" />

You can replace the entire content in the header of the login component with your custom content.

```html
<alfresco-login ...>
    <login-header><template>My custom HTML for the header</template></login-header>
</alfresco-login>`
```

## Extra content

You can put additional html content between `alfresco-login` tags to get it rendered as part of the login dialog.
This becomes handy in case you need extending it with custom input fields handled by your application or parent component:

```html
<alfresco-login ...>
    <div>
        <div>You extra content</div>
    </div>
</alfresco-login>
```

Here's an example of custom content:

<img src="assets/login-extra-content.png" height="400" />

## Custom logo and background

It is possible changing logo and background images to custom values.

```html
<alfresco-login 
    [backgroundImageUrl]="'http://images.freeimages.com/images/previews/638/wood-wall-for-background-1634466.jpg'"
    [logoImageUrl]="'http://images.freeimages.com/images/previews/eac/honeybee-with-a-house-1633609.jpg'">
</alfresco-login>
```

Should give you something like the following:

<img src="assets/custom-login.png" width="600" />

Alternatively you can bind to your component properties and provide values dynamically if needed:

```html
<alfresco-login
    [backgroundImageUrl]="myCustomBackground"
    [logoImageUrl]="myCustomLogo">
</alfresco-login>
```

#### Customize Validation rules

If needed it is possible customise the validation rules of the login
form. You can add/modify the default rules of the login form.

**MyCustomLogin.component.html**

```html
<alfresco-login 
    [fieldsValidation]="customValidation"
    #alfrescologin>
</alfresco-login>
```

**MyCustomLogin.component.ts**
```ts

export class MyCustomLogin {
    customValidation: any;

    constructor(public router: Router) {
        this.customValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(10)])],
            password: ['', Validators.required]
        };
    }

    ngOnInit() {
        this.alfrescologin.addCustomValidationError('username', 'minlength', 'Username must be at least 8 characters.');
        this.alfrescologin.addCustomValidationError('username', 'maxlength', 'Username must not be longer than 11 characters.');
    }
}
```

#### Controlling form submit execution behaviour

If absolutely needed it is possible taking full control over form 
submit execution by means of `executeSubmit` event. 
This event is fired on form submit.

You can prevent default behaviour by calling `event.preventDefault()`. 
This allows for example having custom form validation scenarios and/or additional validation summary presentation.

Alternatively you may want just running additional code without suppressing default one.

**MyCustomLogin.component.html**

```html
<alfresco-login 
    (executeSubmit)="validateForm($event)" 
    #alfrescologin>
</alfresco-login>
```

**MyCustomLogin.component.ts**

```ts
export class MyCustomLogin {

    validateForm(event: any) {
        let values = event.values;
        
        // check if the username is in the blacklist
        if (values.controls['username'].value === 'invalidUsername') {
            this.alfrescologin.addCustomFormError('username', 'the
            username is in blacklist');
            event.preventDefault();
        }
    }
    
}
```

**Please note that if `event.preventDefault()` is not called then default behaviour 
will also be executed after your custom code.**

## Build from sources

Alternatively you can build component from sources with the following commands:


```sh
npm install
npm run build
```

## Running unit tests

```sh
npm test
```

### Running unit tests in browser

```sh
npm test-browser
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools 
before performing unit testing. 

### Code coverage

```sh
npm run coverage
```

## Demo

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```

## NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
