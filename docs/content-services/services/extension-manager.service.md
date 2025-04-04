---
Title: Extension Manager service
Added: v2.0.0
Status: Active
Last reviewed: 2025-04-04
---

# [Extension Manager service](../../../lib/content-services/src/lib/extensions-manager/services/extension-manager.service.ts "Defined in document-actions.service.ts")

Implements the functionalities related to Extension Management

## Class members

### Methods

- **getPluginInfo**(nodeEntry: [`Observable<ExtensionInfoModel>`](#ExtensionInfoModel)): `boolean`<br/>
  Fetches the extension configuration from a running application
    - _instanceUrl:_ string - URL of the running application
    - **Returns** `Observable<ExtensionInfoModel>` - Observable emitting the extension configuration for the application
- **getSavedPluginState**(key: `string`): [`Observable<ExtensionCompositionEntry>`](#ExtensionCompositionEntry)<br/>
  Fetches the saved extension configuration from the database
    - _instanceId:_ `string`  - Unique id under which the extension configuration is saved
    - **Returns** `Observable<ExtensionCompositionEntry>` - Observable emitting the saved extension state
- **getDefaultPluginState**(instanceUrl: `string`: `Observable<AppConfigPluginRef>`<br/>
  Fetches the states of plugins from a running application
    - _instanceUrl:_ string - URL of the running application
    - **Returns** `Observable<AppConfigPluginRef>` - Observable emitting the plugin state of a running application
- **publishExtensionConfig**(key: `string`, pluginConfig: [`ExtensionComposition`](#ExtensionComposition)): `Observable<void>`<br/>
  Publishes the extensions configuration to the database
    - _instanceId:_ `string`  - Id to use to identify the application
    - _pluginConfig:_ [`ExtensionComposition`](#ExtensionComposition)  - The extension configuration to be saved
    - **Returns** `Observable<void>` - Observable emitting no value

## Details

This service provides methods necessary to publish and fetch extensions configuration

# Models

## ExtensionCompositionEntry

**Properties**

| Name      | Type                                          |
|-----------|-----------------------------------------------|
| **entry** | [ExtensionComposition](#ExtensionComposition) |

## ExtensionComposition

**Properties**

| Name          | Type                                                                       |
|---------------|----------------------------------------------------------------------------|
| **appConfig** | [AppConfigPluginRef](#AppConfigPluginRef)                                  |
| **rules**     | [RuleRef[]]((../../../lib/extensions/src/lib/config/rule.extensions.ts))   |
| **routes**    | [RouteRef[]](../../../lib/extensions/src/lib/config/routing.extensions.ts) |
| **actions**   | [ActionRef[]](../../../lib/extensions/src/lib/config/action.extensions.ts) |
| **features**  | [key: string]: any                                                         |

## ExtensionInfoModel

**Properties**

| Name                  | Type                                                                       |
|-----------------------|----------------------------------------------------------------------------|
| **$id**               | string                                                                     |
| **$name**             | string                                                                     |
| **$version**          | string                                                                     |
| **$vendor**           | string                                                                     |
| **$license**          | string                                                                     |
| **$description**      | string                                                                     |
| **$dependencies**     | Array<string>                                                              |
| **$$compatibilities** | Array<string>                                                              |
| **extensionId**       | string                                                                     |
| **appConfig**         | [AppConfigPluginRef](#AppConfigPluginRef)                                  |
| **rules**             | [RuleRef[]]((../../../lib/extensions/src/lib/config/rule.extensions.ts))   |
| **routes**            | [RouteRef[]](../../../lib/extensions/src/lib/config/routing.extensions.ts) |
| **actions**           | [ActionRef[]](../../../lib/extensions/src/lib/config/action.extensions.ts) |
| **features**          | [key: string]: any                                                         |

## AppConfigPluginRef

**Properties**

| Name        | Type                       |
|-------------|----------------------------|
| **plugins** | { [key: string]: boolean } |
