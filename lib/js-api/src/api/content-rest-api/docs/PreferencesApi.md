# PreferencesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                              | HTTP request                                            | Description      |
|-------------------------------------|---------------------------------------------------------|------------------|
| [getPreference](#getPreference)     | **GET** /people/{personId}/preferences/{preferenceName} | Get a preference |
| [listPreferences](#listPreferences) | **GET** /people/{personId}/preferences                  | List preferences |

## getPreference

Get a preference

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

### Parameters

| Name               | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**       | string | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **preferenceName** | string | The name of the preference.                                                                                                                                                                                                                                                                                                                                                                                                             |
| opts.fields        | string | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [PreferenceEntry](#PreferenceEntry)

**Example**

```javascript
import { AlfrescoApi, PreferencesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const preferencesApi = new PreferencesApi(alfrescoApi);
const opts = {};

preferencesApi.getPreference(`<personId>`, `<preferenceName>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listPreferences

Gets a list of preferences for person.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.
Note that each preference consists of an **id** and a **value**.

The **value** can be of any JSON type.

### Parameters

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **personId**   | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [PreferencePaging](#PreferencePaging)

**Example**

```javascript
import { AlfrescoApi, PreferencesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const preferencesApi = new PreferencesApi(alfrescoApi);
const opts = {};

preferencesApi.listPreferences(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## PreferencePaging

**Properties**

| Name | Type                                          |
|------|-----------------------------------------------|
| list | [PreferencePagingList](#PreferencePagingList) |

## PreferencePagingList

**Properties**

| Name           | Type                                  |
|----------------|---------------------------------------|
| **pagination** | [Pagination](Pagination.md)           |
| **entries**    | [PreferenceEntry[]](#PreferenceEntry) |

## PreferenceEntry

**Properties**

| Name      | Type                      |
|-----------|---------------------------|
| **entry** | [Preference](#Preference) |

# Preference

**Properties**

| Name   | Type   | Description                                                          |
|--------|--------|----------------------------------------------------------------------|
| **id** | string | The unique id of the preference                                      |
| value  | string | The value of the preference. Note that this can be of any JSON type. |