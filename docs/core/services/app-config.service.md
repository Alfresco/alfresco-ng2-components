---
Title: App Config service
Added: v2.0.0
Status: Active
Last reviewed: 2018-09-13
---

# [App Config service](../../../lib/core/app-config/app-config.service.ts "Defined in app-config.service.ts")

Supports app configuration settings, stored server side.

## Class members

### Methods

*   **get**(key: `string`, defaultValue?: \`\`)<br/>
    Gets the value of a named property.
    *   *key:* `string`  - Name of the property
    *   *defaultValue:* \`\`  - (Optional) Value to return if the key is not found
*   **getLocationHostname**(): `string`<br/>
    Gets the location.hostname property.
    *   **Returns** `string` - Value of the property
*   **getLocationPort**(prefix: `string` = `""`): `string`<br/>
    Gets the location.port property.
    *   *prefix:* `string`  - Text added before port value
    *   **Returns** `string` - Port with prefix
*   **getLocationProtocol**(): `string`<br/>
    Gets the location.protocol value.
    *   **Returns** `string` - The location.protocol string
*   **load**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>`<br/>
    Loads the config file.
    *   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>` - Notification when loading is complete
*   **select**(property: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Requests notification of a property value when it is loaded.
    *   *property:* `string`  - The desired property value
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Property value, when loaded

## Details

The [`AppConfigService`](../../core/services/app-config.service.md) service provides support for loading and accessing global application configuration settings that you store on the server side in the form of a JSON file.

You may need this service when deploying your ADF-based application to production servers.
There can be more than one server running web apps with different settings, like different addresses for Alfresco Content/Process services.

You may also use the service if there is a need to change global settings for all the clients.

The service is already pre-configured to look for the "app.config.json" file in the application
root address. This allows you to deploy ADF-based web applications to multiple servers together with
different settings files. You could use this, for example, to create separate development, staging,
and production environments.

Example of the default settings file content:

**app.config.json**

```json
{
    "ecmHost": "http://localhost:3000/ecm",
    "bpmHost": "http://localhost:3000/bpm",
    "application": {
        "name": "Alfresco"
    }
}
```

Note that the settings in the example above are the default ones supplied with the server.
You can override the values in your custom `app.config.json` file if necessary.

Below is a simple example of using the [`AppConfigService`](../../core/services/app-config.service.md) in practice.

**app.component.ts**

```ts
import { AppConfigService } from '@alfresco/adf-core';

@Component({...})
export class AppComponent {

    constructor(appConfig: AppConfigService) {

        // get nested properties by the path
        console.log(appConfig.get('application.name'));

        // use generics for type safety 
        let version: number = appConfig.get<number>('version');
        console.log(version);
    }
}
```

Your custom components can also benefit from the [`AppConfigService`](../../core/services/app-config.service.md).
You can create an unlimited number of settings and optionally organize them as a nested JSON hierarchy.

### Variable substitution in configuration strings

The [`AppConfigService`](../../core/services/app-config.service.md) supports a limited set of variable substitutions to greatly simplify certain scenarios.

```json
{
    "ecmHost": "{protocol}//{hostname}:{port}/ecm",
    "bpmHost": "{protocol}//{hostname}:{port}/bpm",
    "application": {
        "name": "Alfresco"
    }
}
```

The supported variables are:

| Variable name | Runtime value       |
| ------------- | ------------------- |
| protocol      | `location.protocol` |
| hostname      | `location.hostname` |
| port          | `location.port`     |

## App Config onLoad Stream

When the app config is loaded correctly, an `onChange` event is emitted with the whole set of app
config properties. This comes in handy when a component needs to react to some property change or
interact with the app config when it is finished loading:

```ts
    appConfig.onLoad.subscribe((appConfig) => {
        console.log(appConfig); //this is the representation of the app-config
    });
```

The `select` method lets you specify the name of a variable that should be set with the value
of a property when the app config is loaded:

```json
    appconfig : {
        logLevel : 'trace'
    }
```

```ts
    
    appConfig.select('logLevel').subscribe((logLevelValue) => {
        console.log(logLevelValue); //this will be 'trace';
    });
```

## XMLHttpRequest.withCredentials

In the configuration file, you can enable [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
for @alfresco/js-api calls and PDF Viewer.

```json
{
    "auth": {
      "withCredentials": true
    }
}
```
