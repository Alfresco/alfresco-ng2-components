# Alfresco Login Component for Angular 2

Components included:

* Login Component
* Alfresco Authentication Service (TBD)

### Custom Login Component

```ts
import {Component} from 'angular2/core';
import {Login} from 'ng2-alfresco-login/ng2-alfresco-login';

@Component({
    selector: 'my-login',
    template: ' <alfresco-login></alfresco-login>',
    directives: [Login]
})
export class MyLoginComponent {
}
```

### Build

npm install
npm run build
