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
    template: ' <alfresco-login method="{{methodName}}"></alfresco-login>',
    directives: [Login]
})
export class MyLoginComponent {
    methodName: string = 'POST';
}
```

### Build

npm install
npm run build
