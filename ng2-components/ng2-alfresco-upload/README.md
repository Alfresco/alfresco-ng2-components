# Alfresco Upload Component for Angular 2

Components included:

* Upload Component

### Custom Upload Component

```ts
import {Component} from 'angular2/core';
import {Login} from 'ng2-alfresco-login/ng2-alfresco-login';

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

```
$ npm install
$ npm run build
```