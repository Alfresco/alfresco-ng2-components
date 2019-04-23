# Configuring a Project for Dynamic Extensions

In this article, you are going to walk through the process of configuring your application to use dynamic extensions.
Dynamic in the current context means the application does not require re-compilation to deploy a new extension.

> Note that many steps should get automated in the next iterations.

## Installing SystemJS

[SystemJS](https://github.com/systemjs/systemjs) is a configurable module loader enabling backwards compatibility workflows for ES modules in browsers. 
You can install it by running the following command:

```sh
npm i systemjs
```

Next, update the "angular.json" file and register the following entries in the "scripts" section of your project:

```json
{
    "scripts": [
        "node_modules/systemjs/dist/s.js",
        "node_modules/systemjs/dist/extras/named-register.js",
        "node_modules/systemjs/dist/extras/amd.js"
    ]
}
```

## See Also

- [Dynamic Routes](dynamic-routes.md)
- [Dynamic Container](dynamic-container.md)
- [Dynamic Route Content](dynamic-route-content.md)
