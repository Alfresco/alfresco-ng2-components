# @alfresco/adf-core/shell

Secondary entry point of `@alfresco/adf-core`. It can be used by importing from `@alfresco/adf-core/shell`.

# Shell

[ShellModule](./src/lib/shell.module.ts) is designated as a main layout for the application.

I order to attach routes to appShell, `withRoutes(routes: Routes | AppShellRoutesConfig)` method should be used.

Passed routes are going to be attached to [shell main route](./src/lib/shell.routes.ts)

If you would like to provide custom app guard, you can provide your own using [SHELL_AUTH_TOKEN](./src/lib/shell.routes.ts)

## Shell Service

In order to use `shell`, you need to provide [SHELL_APP_SERVICE](./src/lib/services/shell-app.service.ts) which provides necessary options for shell component to work.
