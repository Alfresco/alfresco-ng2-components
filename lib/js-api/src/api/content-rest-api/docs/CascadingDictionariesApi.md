# CascadingDictionariesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

**Note:** these endpoints are available in Alfresco Enterprise 26.2 and newer versions.
Read operations are available to any authenticated user; write operations require admin rights.

| Method                                                                  | HTTP request                                                  | Description                                            |
|-------------------------------------------------------------------------|---------------------------------------------------------------|--------------------------------------------------------|
| [listCascadingDictionaries](#listCascadingDictionaries)                 | **GET** /cascading-dictionaries                               | List registered cascading dictionaries                 |
| [getCascadingDictionary](#getCascadingDictionary)                       | **GET** /cascading-dictionaries/{aspectId}                    | Get a registered cascading dictionary                  |
| [getCascadingDictionaryVersion](#getCascadingDictionaryVersion)         | **GET** /cascading-dictionaries/{aspectId}/versions/{versionId} | Get a specific version of a cascading dictionary      |
| [createCascadingDictionary](#createCascadingDictionary)                 | **POST** /cascading-dictionaries                              | Create a cascading dictionary definition               |
| [updateCascadingDictionary](#updateCascadingDictionary)                 | **PUT** /cascading-dictionaries/{aspectId}                    | Update a cascading dictionary definition               |
| [createCascadingDictionaryContent](#createCascadingDictionaryContent)   | **POST** /cascading-dictionaries/{aspectId}/content           | Create cascading dictionary content                    |
| [deleteCascadingDictionary](#deleteCascadingDictionary)                 | **DELETE** /cascading-dictionaries/{aspectId}                 | Delete a cascading dictionary definition and content   |

# listCascadingDictionaries

Gets a list of registered cascading dictionaries available in the system. The latest version of each
cascading dictionary is returned. The dictionary entries are never included in this response.

**Parameters**

| Name          | Type     | Description                                      | Notes      |
|---------------|----------|--------------------------------------------------|------------|
| opts.skipCount | number  | The number of entities to skip.                  | [optional] |
| opts.maxItems  | number  | The maximum number of items to return.           | [optional] |

**Return type**: [CascadingDictionaryList](#CascadingDictionaryList)

**Example**

```javascript
import { AlfrescoApi, CascadingDictionariesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi({ hostEcm: 'http://127.0.0.1:8080' });
const cascadingDictionariesApi = new CascadingDictionariesApi(alfrescoApi);

cascadingDictionariesApi.listCascadingDictionaries({ maxItems: 100 }).then((data) => {
    console.log('API called successfully. Returned data: ', data);
}, (error) => {
    console.error(error);
});
```

# getCascadingDictionary

Gets the cascading dictionary registered in the system for **aspectId**. The latest version is returned.
Pass `include: ['data']` to return the dictionary entries alongside the metadata.

**Parameters**

| Name         | Type                  | Description                                                                              | Notes      |
|--------------|-----------------------|------------------------------------------------------------------------------------------|------------|
| aspectId     | string                | The prefixed name of an aspect (`prefix:name`), e.g. `cdict:account`.                    |            |
| opts.include | Array&lt;'data'&gt;   | Returns additional information. The only supported value is `data`.                      | [optional] |

**Return type**: [CascadingDictionaryEntry](#CascadingDictionaryEntry)

**Example**

```javascript
cascadingDictionariesApi.getCascadingDictionary('cdict:account', { include: ['data'] }).then((data) => {
    console.log('API called successfully. Returned data: ', data);
}, (error) => {
    console.error(error);
});
```

# getCascadingDictionaryVersion

Gets a specific version of the cascading dictionary registered in the system for **aspectId**.

**Parameters**

| Name         | Type                | Description                                                                  | Notes      |
|--------------|---------------------|------------------------------------------------------------------------------|------------|
| aspectId     | string              | The prefixed name of an aspect (`prefix:name`), e.g. `cdict:account`.        |            |
| versionId    | string              | The version label, e.g. `1.0`.                                               |            |
| opts.include | Array&lt;'data'&gt; | Returns additional information. The only supported value is `data`.          | [optional] |

**Return type**: [CascadingDictionaryEntry](#CascadingDictionaryEntry)

# createCascadingDictionary

Creates a new cascading dictionary definition for the specified aspect. The aspect must already be
defined in the repository and registered as a cascading dictionary, and only one definition can be
created per aspect. You must have admin rights.

The response contains only the creation timestamp — call
[getCascadingDictionary](#getCascadingDictionary) to read the created dictionary back.

**Parameters**

| Name                          | Type                                                        | Description                                       |
|-------------------------------|-------------------------------------------------------------|---------------------------------------------------|
| cascadingDictionaryBodyCreate | [CascadingDictionaryBodyCreate](#CascadingDictionaryBodyCreate) | The cascading dictionary information to create. |

**Return type**: [CascadingDictionaryCreateEntry](#CascadingDictionaryCreateEntry)

**Example**

```javascript
cascadingDictionariesApi.createCascadingDictionary({
    name: 'Accounts',
    aspect: 'cdict:account',
    keyProperty: 'cdict:accountNumber',
    versionProperty: 'cdict:accountDictVersion'
}).then((data) => {
    console.log('API called successfully. Returned data: ', data);
}, (error) => {
    console.error(error);
});
```

# updateCascadingDictionary

Updates the metadata of an existing cascading dictionary definition. You must have admin rights.

The response contains only the modification timestamp — call
[getCascadingDictionary](#getCascadingDictionary) to read the updated dictionary back.

**Parameters**

| Name                          | Type                                                             | Description                                       |
|-------------------------------|------------------------------------------------------------------|---------------------------------------------------|
| aspectId                      | string                                                           | The prefixed name of an aspect (`prefix:name`).   |
| cascadingDictionaryBodyUpdate | [CascadingDictionaryBodyUpdate](#CascadingDictionaryBodyUpdate)  | The cascading dictionary information to update.   |

**Return type**: [CascadingDictionaryUpdateEntry](#CascadingDictionaryUpdateEntry)

# createCascadingDictionaryContent

Creates a new content version of the cascading dictionary registered by **aspectId**. Without the
`majorVersion` option a new minor version is created. You must have admin rights.

**Parameters**

| Name                           | Type                                                             | Description                                            | Notes      |
|--------------------------------|------------------------------------------------------------------|---------------------------------------------------------|------------|
| aspectId                       | string                                                           | The prefixed name of an aspect (`prefix:name`).          |            |
| cascadingDictionaryContentBody | [CascadingDictionaryContentBody](#CascadingDictionaryContentBody)| The content of the cascading dictionary.                 |            |
| opts.majorVersion              | boolean                                                          | If **true**, create a major version. Defaults to false.  | [optional] |

**Return type**: [CascadingDictionaryEntry](#CascadingDictionaryEntry)

**Example**

```javascript
cascadingDictionariesApi.createCascadingDictionaryContent('cdict:account', {
    definition: {
        levels: [
            { level: 0, properties: ['cdict:accountCategory'] },
            { level: 1, properties: ['cdict:accountNumber', 'cdict:accountName'] }
        ]
    },
    data: [
        {
            properties: { 'cdict:accountCategory': 'Current Assets' },
            children: [
                { properties: { 'cdict:accountNumber': 1000, 'cdict:accountName': 'Cash' } }
            ]
        }
    ]
}, { majorVersion: true }).then((data) => {
    console.log('API called successfully. Returned data: ', data);
}, (error) => {
    console.error(error);
});
```

Beyond the usual `400`, `401`, `403` and `404` responses, this endpoint can return `413` when the
content exceeds the configured size limit, `422` when the content fails validation against the
registered dictionary, and `507` when the storage quota is exceeded.

# deleteCascadingDictionary

Deletes the cascading dictionary metadata and all of its content versions. The aspect properties used
to classify nodes are not deleted. You must have admin rights.

**Parameters**

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| aspectId | string | The prefixed name of an aspect (`prefix:name`).  |

**Return type**: null (empty response body)

# Models

## CascadingDictionaryList

**Properties**

| Name     | Type                                                          |
|----------|---------------------------------------------------------------|
| **list** | [CascadingDictionaryListList](#CascadingDictionaryListList)   |

## CascadingDictionaryListList

**Properties**

| Name           | Type                                                                        |
|----------------|-----------------------------------------------------------------------------|
| **pagination** | [Pagination](Pagination.md)                                                 |
| **entries**    | [CascadingDictionaryDefinitionEntry[]](#CascadingDictionaryDefinitionEntry) |

## CascadingDictionaryDefinitionEntry

**Properties**

| Name      | Type                                                            |
|-----------|-----------------------------------------------------------------|
| **entry** | [CascadingDictionaryDefinition](#CascadingDictionaryDefinition) |

## CascadingDictionaryDefinition

**Properties**

| Name                | Type                                                  | Description                                                        |
|---------------------|-------------------------------------------------------|--------------------------------------------------------------------|
| **name**            | string                                                | The name of the cascading dictionary, e.g. `Accounts`.             |
| **aspect**          | string                                                | The prefixed name of the aspect, e.g. `cdict:account`.             |
| **keyProperty**     | string                                                | The prefixed name of the key property.                             |
| **versionProperty** | string                                                | The prefixed name of the version property.                         |
| **version**         | string                                                | The version of the definition, e.g. `1.5`.                         |
| **levels**          | [CascadingDictionaryLevel[]](#CascadingDictionaryLevel) | The hierarchy levels and the properties at each level.           |
| **createdAt**       | Date                                                  |                                                                    |
| **modifiedAt**      | Date                                                  |                                                                    |

## CascadingDictionaryEntry

**Properties**

| Name      | Type                                        |
|-----------|---------------------------------------------|
| **entry** | [CascadingDictionary](#CascadingDictionary) |

## CascadingDictionary

Same properties as [CascadingDictionaryDefinition](#CascadingDictionaryDefinition), plus:

| Name | Type                                                  | Description                                                         |
|------|-------------------------------------------------------|---------------------------------------------------------------------|
| data | [CascadingDictionaryItem[]](#CascadingDictionaryItem) | Only returned when `data` is requested via the `include` parameter. |

## CascadingDictionaryLevel

**Properties**

| Name           | Type     | Description                                                       |
|----------------|----------|-------------------------------------------------------------------|
| **level**      | number   | The level number, starting with 0 for the top level.              |
| **properties** | string[] | The prefixed names of all properties at this level.               |

## CascadingDictionaryItem

**Properties**

| Name           | Type                                                  | Description                                                           |
|----------------|-------------------------------------------------------|-----------------------------------------------------------------------|
| **properties** | { [key: string]: string \| number }                   | A map of property values keyed by the prefixed name of the property.  |
| children       | [CascadingDictionaryItem[]](#CascadingDictionaryItem) | The child items. Empty or absent for leaf items.                      |

## CascadingDictionaryBodyCreate

**Properties**

| Name                | Type   |
|---------------------|--------|
| **name**            | string |
| **aspect**          | string |
| **keyProperty**     | string |
| **versionProperty** | string |

## CascadingDictionaryBodyUpdate

**Properties**

| Name     | Type   |
|----------|--------|
| **name** | string |

## CascadingDictionaryContentBody

**Properties**

| Name           | Type                                                                          |
|----------------|-------------------------------------------------------------------------------|
| **definition** | [CascadingDictionaryContentDefinition](#CascadingDictionaryContentDefinition) |
| **data**       | [CascadingDictionaryItem[]](#CascadingDictionaryItem)                         |

## CascadingDictionaryContentDefinition

**Properties**

| Name       | Type                                                    |
|------------|---------------------------------------------------------|
| **levels** | [CascadingDictionaryLevel[]](#CascadingDictionaryLevel) |

## CascadingDictionaryCreateEntry

**Properties**

| Name      | Type                                                    |
|-----------|---------------------------------------------------------|
| **entry** | [CascadingDictionaryCreate](#CascadingDictionaryCreate) |

## CascadingDictionaryCreate

**Properties**

| Name          | Type |
|---------------|------|
| **createdAt** | Date |

## CascadingDictionaryUpdateEntry

**Properties**

| Name      | Type                                                    |
|-----------|---------------------------------------------------------|
| **entry** | [CascadingDictionaryUpdate](#CascadingDictionaryUpdate) |

## CascadingDictionaryUpdate

**Properties**

| Name           | Type |
|----------------|------|
| **modifiedAt** | Date |
