# AppConfigService

Supports app configuration settings, stored server side.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Details](#details)
  * [Variable substitution in configuration strings](#variable-substitution-in-configuration-strings)

<!-- tocstop -->

<!-- markdown-toc end -->

## Details

The `AppConfigService` service provides support for loading and accessing global application configuration settings that you store on the server side in the form of a JSON file.

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

You can also change the path or name of the configuration file when importing the CoreModule in your main application.

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

Below is a simple example of using the AppConfigService in practice. 

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

Your custom components can also benefit from the `AppConfigService`,
you can put an unlimited number of settings and optionally a nested JSON hierarchy.

### Variable substitution in configuration strings

The `AppConfigService` also supports a limited set of variable substitutions to greatly simplify certain scenarios.

```json
{
    "ecmHost": "http://{hostname}:{port}/ecm",
    "bpmHost": "http://{hostname}:{port}/bpm",
    "application": {
        "name": "Alfresco"
    }
}
```

The supported variables are:

| Variable name | Runtime value |
| --- | --- |
| hostname | `location.hostname` |
| port | `location.port` |
