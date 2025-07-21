# @alfresco/adf-core/shell

Namespace: `@alfresco/adf-core/shell`.

This module provides the main layout for the application, allowing you to define routes and guards for your application shell.

# Shell

Passed routes are going to be attached to shell main route.

```typescript
import { provideShellRoutes } from '@alfresco/adf-core/shell';

provideShellRoutes([/*Your Routes*/])
```

If you would like to provide custom app guard, you can provide your own using `SHELL_AUTH_TOKEN`.

## Shell Service

In order to use `shell`, you need to provide `SHELL_APP_SERVICE` which provides necessary options for shell component to work.
