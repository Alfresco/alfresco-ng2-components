---
Added: v2.0.0
Status: Active
---

# App Config service

Supports app configuration settings, stored server side.

## Class members

### Methods

-   **get**(key: `string`, defaultValue?: )<br/>
    Gets the value of a named property.
    -   _key:_ `string`  - Name of the property
    -   _defaultValue:_   - (Optional) Value to return if the key is not found
-   **getLocationHostname**(): `string`<br/>
    Gets the location.hostname property.
    -   **Returns** `string` - Value of the property
-   **getLocationPort**(prefix: `string` = `""`): `string`<br/>
    Gets the location.port property.
    -   _prefix:_ `string`  - Text added before port value
    -   **Returns** `string` - Port with prefix
-   **getLocationProtocol**(): `string`<br/>
    Gets the location.protocol value.
    -   **Returns** `string` - 
-   **load**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>`<br/>
    Loads the config file.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>` - Notification when loading is complete
-   **select**(property: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Requests notification of a property value when it is loaded.
    -   _property:_ `string`  - The desired property value
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Property value, when loaded

## Details

The [`AppConfigService`](../core/app-config.service.md) service provides support for loading and accessing global application configuration settings that you store on the server side in the form of a JSON file.

You may need this service when deploying your ADF-based application to production servers.

There can be more than one server running web apps with different settings, like different addresses for Alfresco Content/Process services.

Or there is a need to change global settings for all the clients.

The service is already pre-configured to look for the "app.config.json" file in the application root address.

That allows deploying ADF-based web applications to multiple servers together with different settings files, for example having development, staging or production environments.

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

Please note that settings above are default ones coming with the server. 
You can override the values in your custom `app.config.json` file if needed. 

You can also change the path or name of the configuration file when importing the [`CoreModule`](../../lib/core/core.module.ts) in your main application.

```ts
...
@NgModule({
    imports: [
        ...
        CoreModule.forRoot({
            appConfigFile: 'app.production.config.json'
        })
    ],
    ...
}
export class AppModule { }
```

Below is a simple example of using the [`AppConfigService`](../core/app-config.service.md) in practice. 

**[app.component](../../demo-shell/src/app/app.component.ts).ts**

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

Your custom components can also benefit from the [`AppConfigService`](../core/app-config.service.md),
you can put an unlimited number of settings and optionally a nested JSON hierarchy.

### Variable substitution in configuration strings

The [`AppConfigService`](../core/app-config.service.md) also supports a limited set of variable substitutions to greatly simplify certain scenarios.

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

| Variable name | Runtime value |
| ------------- | ------------- |
| protocol | `location.protocol` |
| hostname | `location.hostname` |
| port | `location.port` |

## App Config onLoad Stream

When the app config is loaded correctly an onChange event is sent with the whole set app config properties. This comes in handy when a component wants to react to some property change or interact with the app config when it's correctly loaded.

```ts
    appConfig.onLoad.subscribe((appConfig) => {
        console.log(appConfig); //this is the representation of the app-config
    });
```

We have added also the `select` method where the user can give the property name which wants to be notified the when the app config is loaded and get the value.

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
