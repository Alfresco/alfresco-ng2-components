# Authentication Service

Provides authentication for use with the Login component.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

**app.component.ts**

```ts
import { AuthenticationService } from 'ng2-alfresco-core';

@Component({...})
export class AppComponent {
    constructor(authService: AuthenticationService) {
        this.AuthenticationService.login('admin', 'admin').subscribe(
            token => {
                console.log(token);
            },
            error => {
                console.log(error);
            }
        );
    }
}
```

### Events

| Name | Description |
| --- | --- |
| onLogin | Raised when user logs in |
| onLogout | Raised when user logs out |

## Details

The authentication service is used inside the [login component](../ng2-components/ng2-alfresco-login/README.md) and is possible to find there an example of how to use it.
