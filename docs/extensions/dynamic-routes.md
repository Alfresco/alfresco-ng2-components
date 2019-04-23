# Dynamic Routes

In this section, we are going to setup dynamic routes that requires Content Services authentication
and displays a content from the dynamically loaded extension.

## Authentication Guard

It is possible to provide a default `app.auth` authentication guard
to apply to all the dynamic routes in case no specific configuration provided. 

You can provide the `app.auth` implementation from the main application module constructor, or any other module. 

```ts
import { ExtensionService } from '@alfresco/adf-extensions';
import { AuthGuardEcm } from '@alfresco/adf-core';

export class AppModule {
    constructor(extensionService: ExtensionService) {
        extensionService.setAuthGuards({
            'app.auth': AuthGuardEcm
        });
    }
}
```

The configuration above is going to set `AuthGuardEcm` to all the routes by default.

## Application Layout

Similar to the Authentication Guards, you can provide a default layout component for every route.
The default layout must have the `app.layout.main` id:

```ts
import { ExtensionService } from '@alfresco/adf-extensions';
import { AuthGuardEcm } from '@alfresco/adf-core';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';

export class AppModule {
    constructor(extensionService: ExtensionService) {

        extensionService.setAuthGuards({
            'app.auth': AuthGuardEcm
        });

        extensionService.setComponents({
            'app.layout.main': AppLayoutComponent
        });

    }
}
```

As you can see, we use `AppLayoutComponent` to wrap each dynamically rendered route component at runtime.

## Registering Routes

Let's register a new application route `/plugins/route1`
pointing to the component called `entry` that comes with the `plugin1.js` extension.

Create or update `/src/assets/app.extensions.json` file with the following content:

```json
{
    "routes": [
        {
            "id": "plugin.route.1",
            "path": "plugins/route1",
            "component": "plugin1#entry"
        }
    ]
}
```

> The `id` value can be anything as long as it is a unique string.
> The main point to declare an `id` value is to allow external plugins
> to customize this route.

Note the format of the component addressing, it should be in the following form:

```text
<FILE>#<COMPONENT>
```

If you have an extension called `myLib.js` that exposes a `myComponent` component,
the address should in this case be as in the next listing:

```text
myLib#myComponent
```

## Loading Routes

The "AppExtensionService" service from the `@alfresco/adf-extensions` package
already provides you with the API to fetch all dynamic routes (coming from the extension files).

In the main application component, import the `AppExtensionService`
and use it to fetch and register route like in the next example:

```ts
export class AppComponent implements OnInit {

    constructor(private appExtensions: AppExtensionService) {}

    ngOnInit() {
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.config.unshift(
            ...this.appExtensions.getApplicationRoutes()
        );
    }
}
```

> Important note: You should register routes only once at the application startup.
> Registering routes multiple times may lead to unexpected behaviors and/or issues.

## See Also

- [Dynamic Route Content](dynamic-route-content.md)
- [Dynamic Container](dynamic-container.md)
