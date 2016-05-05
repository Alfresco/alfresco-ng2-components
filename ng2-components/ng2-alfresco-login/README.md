# Alfresco Login Component for Angular 2

Components included:

* Alfresco Login Component
* Alfresco Authentication Service

### Custom Login Component

```ts
import {Component} from 'angular2/core';
import {AlfrescoLoginComponent} from 'ng2-alfresco-login/ng2-alfresco-login';

@Component({
    selector: 'my-login',
    template: ' <alfresco-login method="{{methodName}}" (onSuccess)="mySuccessMethod($event)" (onError)="myErrorMethod($event)"></alfresco-login>',
    directives: [Login]
})
export class MyLoginComponent {
    methodName: string = 'POST';
    
    mySuccessMethod($event) {
            console.log('Success Login EventEmitt called with: '+$event.value);
        }
    
    myErrorMethod($event) {
        console.log('Error Login EventEmitt called with: '+$event.value);
    }
}
```

### Build
```sh
npm install
npm npm run build
```

### Test
```sh
npm test
```

### Demo

## Configuring development environment

*All scripts assume you are at the project root folder*

**Install symlinks for Alfresco components**

*ng2-alfresco-core:*

```sh
cd ng2-components/ng2-alfresco-core
npm link
cd ../ng2-alfresco-login/demo
npm link ng2-alfresco-core
```


*ng2-alfresco-login component:*

```sh
cd ng2-components/ng2-alfresco-login
npm link
cd ../ng2-alfresco-login/demo
npm link ng2-alfresco-login
```

**Start the demo**

```sh
cd demo
npm install
npm start
```