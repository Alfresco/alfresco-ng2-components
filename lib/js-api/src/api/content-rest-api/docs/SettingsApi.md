# SitesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1/*

| Method                                            | HTTP request                   | Description                                                                         |
|---------------------------------------------------|--------------------------------|-------------------------------------------------------------------------------------|
| [getSavedExtensionState](#getSavedExtensionState) | **GET** /settings/{instanceId} | Gets the extension configuration saved for a running instance of ADW on the backend |
| [publishExtensionConfig](#publishExtensionConfig) | **PUT** /settings/{instanceId} | Saves an extension configuration for a running instance of ADW on the backend       |

## getSavedExtensionState

Gets the extension configuration saved on the backend

> this endpoint is available in <GET VERSION INFO HERE>**Alfresco 7.0.0** and newer versions.

**Parameters**

| Name           | Type   | Description                                  | Notes |
|----------------|--------|----------------------------------------------|-------|
| **instanceId** | string | The identifier of a running instance of ADW. |       |

**Return type**: [ExtensionConfigEntry](#ExtensionConfigEntry)

## publishExtensionConfig

Saves an extension configuration on the backend

**Parameters**

| Name                | Type                                | Description                                  |
|---------------------|-------------------------------------|----------------------------------------------|
| **instanceId**      | string                              | The identifier of a running instance of ADW. |
| **extensionConfig** | [ExtensionConfig](#ExtensionConfig) | The extension configuration to be saved.     |

**Example**

```javascript
import {AlfrescoApi, SitesApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const settingsApi = new SettingsApi(alfrescoApi);

const extensionConfig = new ExtensionConfig();
extensionConfig = {
    appConfig: {},
    features: {},
    actions: [],
    rules: [],
    routes: []
}

settingsApi.publishExtensionConfig(`<instanceId>`, extensionConfig).then(() => {
    console.log('API called successfully.');
});
```

# Models

## ExtensionConfigEntry

**Properties**

| Name      | Type                                |
|-----------|-------------------------------------|
| **entry** | [ExtensionConfig](#ExtensionConfig) |

## ExtensionConfig

**Properties**

| Name          | Type                                      |
|---------------|-------------------------------------------|
| **appConfig** | [AppConfigPluginRef](#AppConfigPluginRef) |
| **rules**     | [RuleRef[]](#RuleRef)                     |
| **routes**    | [RouteRef[]](#RouteRef)                   |
| **actions**   | [ActionRef[]](#ActionRef)                 |
| **features**  | [key: string]: any                        |

## AppConfigPluginRef

**Properties**

| Name        | Type                       |
|-------------|----------------------------|
| **plugins** | { [key: string]: boolean } |

## RouteRef

**Properties**

| Name          | Type                      |
|---------------|---------------------------|
| **id**        | string                    |
| **path**      | string                    |
| **component** | string                    |
| parentRoute   | string                    |
| layout        | string                    |
| auth          | string[]                  |
| data          | { [key: string]: string } |

## RuleRef

**Properties**

| Name       | Type                              |
|------------|-----------------------------------|
| **type**   | string                            |
| id         | string                            |
| parameters | [RuleParameter[]](#RuleParameter) |

## RuleParameter

**Properties**

| Name       | Type                              |
|------------|-----------------------------------|
| **type**   | string                            |
| **value**  | string                            |
| parameters | [RuleParameter[]](#RuleParameter) |

## ActionRef

**Properties**

| Name        | Type   |
|-------------|--------|
| **id**      | string |
| **type**    | string |
| **payload** | string |
