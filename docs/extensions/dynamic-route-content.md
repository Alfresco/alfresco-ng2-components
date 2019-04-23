# Dynamic Route Content

The Dynamic Route Container component allows you to declare an Angular Route instance
that loads and displays a component you distribute as part of the dynamic extension library. 

You need to provide only two parameters to load the content: 
plugin identifier as `pluginId`, and component identifier as `componentId` properties.

The properties need to be part of the route `data` object:

```ts
import { DynamicContainerComponent } from '@alfresco/adf-extensions';

const routes = [
    {
        path: 'plugin/1',
        component: DynamicRouteContentComponent,
        data: {
            plugin1: 'myPlugin`,
            component1: 'myComponent`
        }
    }
];
```

The declaration above constructs the `/plugin/1` route
and displays a `myComponent` component coming with the `myPlugin.js` library.

## See Also

- [Dynamic Routes](dynamic-routes.md)
- [Dynamic Container](dynamic-container.md)
