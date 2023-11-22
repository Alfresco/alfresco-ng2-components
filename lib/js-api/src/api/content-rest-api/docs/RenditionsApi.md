# RenditionsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                            | HTTP request                                                                | Description                                                          |
|---------------------------------------------------|-----------------------------------------------------------------------------|----------------------------------------------------------------------|
| [createRendition](#createRendition)               | **POST** /nodes/{nodeId}/renditions                                         | Create rendition                                                     |
| [getRendition](#getRendition)                     | **GET** /nodes/{nodeId}/renditions/{renditionId}                            | Get rendition information                                            |
| [getRenditionContent](#getRenditionContent)       | **GET** /nodes/{nodeId}/renditions/{renditionId}/content                    | Get rendition content                                                |
| [listRenditions](#listRenditions)                 | **GET** /nodes/{nodeId}/renditions                                          | List renditions                                                      |
| [requestDirectAccessUrl](#requestDirectAccessUrl) | **POST** /nodes/{nodeId}/renditions/{renditionId}/request-direct-access-url | Generate a direct access content url for a given rendition of a node |

## createRendition

Create rendition

> this endpoint is available in **Alfresco 5.2** and newer versions.

An asynchronous request to create a rendition for file **nodeId**.

The rendition is specified by name **id** in the request body:

```json
{
  "id": "doclib"
}
```

Multiple names may be specified as a comma separated list or using a list format:

```json
[
  {
     "id": "doclib"
  },
  {
     "id": "avatar"
  }
]
```

**Parameters**

| Name                    | Type                                          | Description               |
|-------------------------|-----------------------------------------------|---------------------------|
| **nodeId**              | string                                        | The identifier of a node. | 
| **renditionBodyCreate** | [RenditionBodyCreate](RenditionBodyCreate.md) | The rendition "id".       |

**Example**

```javascript
import { AlfrescoApi, RenditionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const renditionsApi = new RenditionsApi(alfrescoApi);
const renditionBodyCreate = {};

renditionsApi.createRendition(`<nodeId>`, renditionBodyCreate).then(() => {
  console.log('API called successfully.');
});
```

## getRendition

Get rendition information

> **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

**Parameters**

| Name            | Type   | Description                                                        |
|-----------------|--------|--------------------------------------------------------------------|
| **nodeId**      | string | The identifier of a node.                                          | 
| **renditionId** | string | The name of a thumbnail rendition, for example *doclib*, or *pdf*. | 

**Return type**: [RenditionEntry](RenditionEntry.md)

**Example**

```javascript
import { AlfrescoApi, RenditionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const renditionsApi = new RenditionsApi(alfrescoApi);

renditionsApi.getRendition(`<nodeId>`, `<renditionId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getRenditionContent

Get rendition content

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name                 | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|----------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**           | string  | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **renditionId**      | string  | The name of a thumbnail rendition, for example *doclib*, or *pdf*.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| opts.attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list; for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| opts.ifModifiedSince | Date    | Only returns the content if it has been modified since the date provided. Use the date format defined by HTTP. For example, `Wed, 09 Mar 2016 16:56:34 GMT`.                                                                                                                                                                                                                                                                                                                               | 
| opts.range           | string  | Default: true. The Range header indicates the part of a document that the server should return. Single part request supported, for example: bytes=1-10.                                                                                                                                                                                                                                                                                                                                    |
| opts.placeholder     | boolean | Default: false. If **true** and there is no rendition for this **nodeId** and **renditionId**, then the placeholder image for the mime type of this rendition is returned, rather than a 404 response.                                                                                                                                                                                                                                                                                     |

**Return type**: Blob

**Example**

```javascript
import { AlfrescoApi, RenditionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const renditionsApi = new RenditionsApi(alfrescoApi);
const opts = {};

renditionsApi.getRenditionContent(`<nodeId>`, `<renditionId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listRenditions

List renditions

**Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Gets a list of the rendition information for each rendition of the file **nodeId**, including the rendition id.

Each rendition returned has a **status**: `CREATED` means it is available to view or download, `NOT_CREATED` means the rendition can be requested.

You can use the **where** parameter to filter the returned renditions by **status**. For example, the following **where**
clause will return just the `CREATED` renditions:

```text
(status='CREATED')
```

**Parameters**

| Name       | Type   | Description                                                     |
|------------|--------|-----------------------------------------------------------------|
| **nodeId** | string | The identifier of a node.                                       | 
| where      | string | A string to restrict the returned objects by using a predicate. |

**Return type**: [RenditionPaging](RenditionPaging.md)

**Example**

```javascript
import { AlfrescoApi, RenditionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const renditionsApi = new RenditionsApi(alfrescoApi);

renditionsApi.listRenditions(`<nodeId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## requestDirectAccessUrl

Generate a direct access content url for a given rendition of a node

> this endpoint is available in **Alfresco 7.1** and newer versions.

**Parameters**

| Name            | Type   | Description                    |
|-----------------|--------|--------------------------------|
| **nodeId**      | string | The identifier of a node.      |
| **renditionId** | string | The identifier of a rendition. |

**Return type**: [DirectAccessUrlEntry](DirectAccessUrlEntry.md)

**Example**

```javascript
import { AlfrescoApi, RenditionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const renditionsApi = new RenditionsApi(alfrescoApi);

const nodeId = 'da2e6953-3850-408b-8284-3534dd777417';
const renditionId = 'avatar';

renditionsApi.requestDirectAccessUrl(nodeId, renditionId).then((data) => {
  console.log('URL generated successfully: ', data.contentUrl);
});
```