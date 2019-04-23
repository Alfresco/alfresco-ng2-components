# Dynamic Container

The Dynamic Container component allows to load and display a component
that is distributed as part of the dynamic extension library. 

You need to provide only two parameters to load the content: 
plugin identifier as `pluginId`, and component identifier as `componentId` properties:

```html
<adf-dynamic-container
    pluginId="plugin1"
    componentId="entry">
</adf-dynamic-container>
```

At runtime, the extensibility layer is going to download the `plugin1.js` library,
construct and render the `entry` component as part of the `adf-dynamic-container` element content.

## See Also

- [Dynamic Routes](dynamic-routes.md)
- [Dynamic Route Content](dynamic-route-content.md)
