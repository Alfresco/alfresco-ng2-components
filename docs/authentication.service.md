---
Added: v2.0.0
Status: Active
---
# Authentication Service

Provides authentication for use with the Login component.

## Basic Usage

**app.component.ts**

```ts
import { AuthenticationService } from '@alfresco/adf-core';

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
| ---- | ----------- |
| onLogin | Raised when user logs in |
| onLogout | Raised when user logs out |

## Details

The authentication service is used inside the [login component](login.component.md) and is possible to find there an example of how to use it.
