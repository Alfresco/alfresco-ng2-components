# SettingsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1/*

| Method                                                 | HTTP request                   | Description                                           |
|--------------------------------------------------------|--------------------------------|-------------------------------------------------------|
| [getSavedExtensionState](#getSavedExtensionState)      | **GET** /settings/{instanceId} | Gets the extension configuration saved on the backend |
| [publishExtensionConfig](#publishExtensionComposition) | **PUT** /settings/{instanceId} | Saves an extension configuration on the backend       |

## getSavedExtensionState

Gets the extension configuration saved on the backend

> this endpoint is available in <GET VERSION INFO HERE>**Alfresco 7.0.0** and newer versions.

**Parameters**

| Name           | Type   | Description    | Notes |
|----------------|--------|----------------|-------|
| **instanceId** | string | The identifier |       |

**Return type**: [ExtensionCompositionEntry](#ExtensionCompositionEntry)

## publishExtensionComposition

Saves an extension configuration on the backend

**Parameters**

| Name                | Type                                          | Description                             |
|---------------------|-----------------------------------------------|-----------------------------------------|
| **instanceId**      | string                                        | The identifier                          |
| **extensionConfig** | [ExtensionComposition](#ExtensionComposition) | The extension configuration to be saved |

**Example**

```javascript
import {AlfrescoApi, SitesApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const settingsApi = new SettingsApi(alfrescoApi);

const extensionConfig = new ExtensionComposition();
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
