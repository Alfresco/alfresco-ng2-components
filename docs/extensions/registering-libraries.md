# Registering Libraries

Create or update the `src/assets/plugins/plugins-config.json` to provide extension libraries
that do not require application compilation and can be loaded at runtime:

```json
{
    "plugin1": {
        "name": "Plugin 1",
        "path": "/assets/plugins/plugin1.js",
        "deps": ["shared"]
    },
    "plugin2": {
        "name": "Plugin 2",
        "path": "/assets/plugins/plugin2.js",
        "deps": ["shared"]
    },
    "shared": {
        "name": "Shared",
        "path": "/assets/plugins/shared.js"
    }
}
```

Each `key` represents unique identifier of the library.
The format of the value entry is as follows:

- `name`: public name
- `path`: path to the file, can be also an URL
- `deps`: (optional) list of dependencies

In the example above, the `plugin1` entry requires `shared` library as a dependency.

Upon loading a content from the `plugin1.js` the extension loader is going to also fetch and resolve the `shared.js` library.

> All fetched libraries are loaded only once and then cached for further reuse.
