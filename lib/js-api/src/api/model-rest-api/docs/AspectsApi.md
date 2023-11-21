# AspectsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                      | HTTP request                | Description   |
|-----------------------------|-----------------------------|---------------|
| [getAspect](#getAspect)     | **GET** /aspects/{aspectId} | Get an aspect |
| [listAspects](#listAspects) | **GET** /aspects            | List aspects  |

## getAspect

Get an aspect

> This is available in Alfresco 7.0.0 and newer versions.

**Parameters**

| Name         | Type   | Description                                        |
|--------------|--------|----------------------------------------------------|
| **aspectId** | string | The Qname of an aspect(prefix:name) e.g 'cm:title' |  

**Return type**: [AspectEntry](AspectEntry.md)

**Example**

```javascript
import { AlfrescoApi, AspectsApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi({
    hostEcm: 'http://127.0.0.1:8080'
});

const aspectsApi = new AspectsApi(alfrescoApi);

aspectsApi.getAspect(aspectId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listAspects

List aspects

> This is available in Alfresco 7.0.0 and newer versions.

Gets a list of aspects from the data dictionary. The System aspects will be ignored by default.

```json
{
  "list": {
    "pagination": {
      "count": 0,
      "hasMoreItems": true,
      "totalItems": 0,
      "skipCount": 0,
      "maxItems": 0
    },
    "entries": [
      {
        "entry": {
          "associations": [],
          "mandatoryAspects": [],
          "includedInSupertypeQuery": true,
          "description": "Titled",
          "isContainer": false,
          "model": {
              "id": "cm:contentmodel",
              "author": "Alfresco",
              "description": "Alfresco Content Domain Model",
              "namespaceUri": "http://www.alfresco.org/model/content/1.0",
              "namespacePrefix": "cm"
          },
          "id": "cm:titled",
          "title": "Titled",
          "properties": [
            {
              "id": "cm:title",
              "title": "Title",
              "description": "Content Title",
              "dataType": "d:mltext",
              "isMultiValued": false,
              "isMandatory": false,
              "isMandatoryEnforced": false,
              "isProtected": false
            }
          ]
        }
      }
    ]
  }
}
```

**Parameters**

| Name  | Type   | Description                 | Notes      |
|-------|--------|-----------------------------|------------|
| where | string | Optionally filter the list. | [optional] |

Here are some examples:

An aspect should represented in the following format(prefix:name). e.g 'cm:title'.

The following where clause will only return aspects from the namespace1:model and namespace2:model.

```text
  where=(modelId in ('namespace1:model','namespace2:model'))
  where=(modelId in ('namespace1:model INCLUDESUBASPECTS','namespace2:model'))
```

The following where clause will only return sub aspects for the given parents.

```text
  where=(parentId in ('namespace1:parent','namespace2:parent'))
```  

The following where clause will only return aspects that match the pattern.

```text
  where=(namespaceUri matches('http://www.alfresco.*'))
```  

The following where clause will only return aspects that don't match the pattern.

```text
  where=(not namespaceUri matches('http://www.alfresco.*'))
```

| Name          | Type   | Description                                                                                                                                       | Notes                       |
|---------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| **skipCount** | number | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.              | [optional] [default to 0]   |
| **maxItems**  | number | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                 | [optional] [default to 100] |
| **include**   | string | Returns additional information about the aspect. The following optional fields can be requested: `properties`, `mandatoryAspects`, `associations` | [optional]                  |

**Return type**: [AspectPaging](AspectPaging.md)

**Example**

```javascript
import { AlfrescoApi, AspectsApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi({
    hostEcm: 'http://127.0.0.1:8080'
});

const aspectsApi = new AspectsApi(alfrescoApi);

aspectsApi.listAspects(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```