# VersionsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                                    | HTTP request                                                                  | Description                                                        |
|-----------------------------------------------------------|-------------------------------------------------------------------------------|--------------------------------------------------------------------|
| [createVersionRendition](#createVersionRendition)         | **POST** /nodes/{nodeId}/versions/{versionId}/renditions                      | Create rendition for a file version                                |
| [deleteVersion](#deleteVersion)                           | **DELETE** /nodes/{nodeId}/versions/{versionId}                               | Delete a version                                                   |
| [getVersion](#getVersion)                                 | **GET** /nodes/{nodeId}/versions/{versionId}                                  | Get version information                                            |
| [getVersionContent](#getVersionContent)                   | **GET** /nodes/{nodeId}/versions/{versionId}/content                          | Get version content                                                |
| [getVersionRendition](#getVersionRendition)               | **GET** /nodes/{nodeId}/versions/{versionId}/renditions/{renditionId}         | Get rendition information for a file version                       |
| [getVersionRenditionContent](#getVersionRenditionContent) | **GET** /nodes/{nodeId}/versions/{versionId}/renditions/{renditionId}/content | Get rendition content for a file version                           |
| [listVersionHistory](#listVersionHistory)                 | **GET** /nodes/{nodeId}/versions                                              | List version history                                               |
| [listVersionRenditions](#listVersionRenditions)           | **GET** /nodes/{nodeId}/versions/{versionId}/renditions                       | List renditions for a file version                                 |
| [requestDirectAccessUrl](#requestDirectAccessUrl)         | **POST** /nodes/{nodeId}/versions/{versionId}/request-direct-access-url       | Generate a direct access content url for a given version of a node |
| [revertVersion](#revertVersion)                           | **POST** /nodes/{nodeId}/versions/{versionId}/revert                          | Revert a version                                                   |

## createVersionRendition

Create rendition for a file version

> this endpoint is available in **Alfresco 7.0.0** and newer versions.

An asynchronous request to create a rendition for version of file **nodeId** and **versionId**.

The version rendition is specified by name **id** in the request body:

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

| Name                    | Type                                          | Description                                                                           |
|-------------------------|-----------------------------------------------|---------------------------------------------------------------------------------------|
| **nodeId**              | string                                        | The identifier of a node.                                                             | 
| **versionId**           | string                                        | The identifier of a version, ie. version label, within the version history of a node. | 
| **renditionBodyCreate** | [RenditionBodyCreate](RenditionBodyCreate.md) | The rendition "id".                                                                   |

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);
const renditionBodyCreate = {};

versionsApi.createVersionRendition(`<nodeId>`, `<versionId>`, renditionBodyCreate).then(() => {
  console.log('API called successfully.');
});
```

## deleteVersion

Delete a version

> this endpoint is available in **Alfresco 5.2** and newer versions.

Delete the version identified by **versionId** and **nodeId*.

**Parameters**

| Name          | Type   | Description                                                                           | Notes |
|---------------|--------|---------------------------------------------------------------------------------------|-------|
| **nodeId**    | string | The identifier of a node.                                                             |
| **versionId** | string | The identifier of a version, ie. version label, within the version history of a node. |

If the version is successfully deleted then the content and metadata for that versioned node
will be deleted and will no longer appear in the version history. This operation cannot be undone.

If the most recent version is deleted the live node will revert to the next most recent version.

We currently do not allow the last version to be deleted. If you wish to clear the history then you
can remove the `cm:versionable` aspect (via update node) which will also disable versioning. In this
case, you can re-enable versioning by adding back the `cm:versionable` aspect or using the version
params (majorVersion and comment) on a subsequent file content update.

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);

versionsApi.deleteVersion(nodeId, versionId).then(() => {
  console.log('API called successfully.');
});
```

## getVersion

Get version information

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name          | Type       | Description                                                                           |
|---------------|------------|---------------------------------------------------------------------------------------|
| **nodeId**    | **string** | The identifier of a node.                                                             | 
| **versionId** | **string** | The identifier of a version, ie. version label, within the version history of a node. | 

**Return type**: [VersionEntry](#VersionEntry)

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);

versionsApi.getVersion(`<nodeId>`, `<versionId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getVersionContent

Get version content

> this endpoint is available in **Alfresco 5.2** and newer versions.

Gets the version content for **versionId** of file node **nodeId**.

**Parameters**

| Name            | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**      | string  | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **versionId**   | string  | The identifier of a version, ie. version label, within the version history of a node.                                                                                                                                                                                                                                                                                                                                                                                                      |
| attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list; for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| ifModifiedSince | Date    | Only returns the content if it has been modified since the date provided.Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.                                                                                                                                                                                                                                                                                                                                  |
| range           | string  | The Range header indicates the part of a document that the server should return. Single part request supported, for example: bytes=1-10.                                                                                                                                                                                                                                                                                                                                                   |

**Return type**: Blob

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);
const opts = {};

versionsApi.getVersionContent(`<nodeId>`, `<versionId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getVersionRendition

Get rendition information for a file version

> this endpoint is available in **Alfresco 7.0.0** and newer versions.

Gets the rendition information for **renditionId** of version of file **nodeId** and **versionId**.

**Parameters**

| Name            | Type   | Description                                                                           |
|-----------------|--------|---------------------------------------------------------------------------------------|
| **nodeId**      | string | The identifier of a node.                                                             |
| **versionId**   | string | The identifier of a version, ie. version label, within the version history of a node. |
| **renditionId** | string | The name of a thumbnail rendition, for example *doclib*, or *pdf*.                    |

**Return type**: [RenditionEntry](RenditionEntry.md)

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);

versionsApi.getVersionRendition(`<nodeId>`, `<versionId>`, `<renditionId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getVersionRenditionContent

Get rendition content for a file version

> this endpoint is available in **Alfresco 7.0.0** and newer versions.

Gets the rendition content for **renditionId** of version of file **nodeId** and **versionId**.

**Parameters**

| Name            | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**      | string  | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **versionId**   | string  | The identifier of a version, ie. version label, within the version history of a node.                                                                                                                                                                                                                                                                                                                                                                                                      |
| **renditionId** | string  | The name of a thumbnail rendition, for example *doclib*, or *pdf*.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list; for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| ifModifiedSince | Date    | Only returns the content if it has been modified since the date provided. Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.                                                                                                                                                                                                                                                                                                                                 |
| range           | string  | The Range header indicates the part of a document that the server should return. Single part request supported, for example: bytes=1-10.                                                                                                                                                                                                                                                                                                                                                   |
| placeholder     | boolean | If **true** (default: false) and there is no rendition for this **nodeId** and **renditionId**, then the placeholder image for the mime type of this rendition is returned, rather than a 404 response.                                                                                                                                                                                                                                                                                    |

**Return type**: Blob

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);
const opts = {};

versionsApi.getVersionRenditionContent(`<nodeId>`, `<versionId>`, `<renditionId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listVersionHistory

List version history

> this endpoint is available in **Alfresco 5.2** and newer versions.

Gets the version history as an ordered list of versions for the specified **nodeId**.

The list is ordered in descending modified order. So the most recent version is first and
the original version is last in the list.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**     | string   | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |
| opts.include   | string[] | Returns additional information about the version node. The following optional fields can be requested: `properties`, `aspectNames`                                                                                                                                                                                                                                                                                                      |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       |

**Return type**: [VersionPaging](#VersionPaging)

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);
const opts = {};

versionsApi.listVersionHistory(`<nodeId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listVersionRenditions

List renditions for a file version

> this endpoint is available in **Alfresco 7.0.0** and newer versions.

Gets a list of the rendition information for each rendition of the version of file **nodeId** and **versionId**, including the rendition id.

Each rendition returned has a **status**: `CREATED` means it is available to view or download, `NOT_CREATED` means the rendition can be requested.

You can use the **where** parameter to filter the returned renditions by **status**. For example, the following **where**
clause will return just the `CREATED` renditions:

```text
(status='CREATED')
```

**Parameters**

| Name          | Type   | Description                                                                           | Notes      |
|---------------|--------|---------------------------------------------------------------------------------------|------------|
| **nodeId**    | string | The identifier of a node.                                                             |            |
| **versionId** | string | The identifier of a version, ie. version label, within the version history of a node. |            |
| opts.where    | string | A string to restrict the returned objects by using a predicate.                       | [optional] |

**Return type**: [RenditionPaging](RenditionPaging.md)

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);
const opts = {};

versionsApi.listVersionRenditions(`<nodeId>`, `<versionId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## requestDirectAccessUrl

Generate a direct access content url for a given version of a node

> this endpoint is available in **Alfresco 7.1** and newer versions.

**Parameters**

| Name          | Type       | Description                  |
|---------------|------------|------------------------------|
| **nodeId**    | **string** | The identifier of a node.    |
| **versionId** | **string** | The identifier of a version. |

**Return type**: [DirectAccessUrlEntry](DirectAccessUrlEntry.md)

### Example

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);

const nodeId = 'da2e6953-3850-408b-8284-3534dd777417';
const versionId = '1.0';

versionsApi.requestDirectAccessUrl(nodeId, versionId).then((data) => {
  console.log('URL generated successfully: ', data.contentUrl);
});
```

## revertVersion

Revert a version

> this endpoint is available in **Alfresco 5.2** and newer versions.

Attempts to revert the version identified by **versionId** and **nodeId** to the live node.

If the node is successfully reverted then the content and metadata for that versioned node
will be promoted to the live node and a new version will appear in the version history.

**Parameters**

| Name           | Type                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**     | string                    | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |  
| **versionId**  | string                    | The identifier of a version, ie. version label, within the version history of a node.                                                                                                                                                                                                                                                                                                                                                   | 
| **revertBody** | [RevertBody](#RevertBody) | Optionally, specify a version comment and whether this should be a major version, or not.                                                                                                                                                                                                                                                                                                                                               | 
| opts.fields    | string[]                  | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |  

**Return type**: [VersionEntry](#VersionEntry)

**Example**

```javascript
import { AlfrescoApi, VersionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const versionsApi = new VersionsApi(alfrescoApi);
const revertBody = {};
const opts = {};

versionsApi.revertVersion(`<nodeId>`, `<versionId>`, revertBody, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## RevertBody

**Properties**

| Name         | Type    |
|--------------|---------|
| majorVersion | boolean |
| comment      | string  |

## VersionPaging

**Properties**

| Name | Type                                    |
|------|-----------------------------------------|
| list | [VersionPagingList](#VersionPagingList) |

## VersionPagingList

**Properties**

| Name       | Type                            |
|------------|---------------------------------|
| pagination | [Pagination](Pagination.md)     |
| entries    | [VersionEntry[]](#VersionEntry) |

## VersionEntry

**Properties**

| Name  | Type                |
|-------|---------------------|
| entry | [Version](#Version) |

## Version

**Properties**

| Name               | Type                          | Description                                                                                                                                                   |
|--------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **id**             | string                        |                                                                                                                                                               |
| versionComment     | string                        |                                                                                                                                                               |
| **name**           | string                        | The name must not contain spaces or the following special characters: `* \" < > \\ / ? :` and `\|` . The character . must not be used at the end of the name. |
| **nodeType**       | string                        |                                                                                                                                                               |
| **isFolder**       | boolean                       |                                                                                                                                                               |
| **isFile**         | boolean                       |                                                                                                                                                               |
| **modifiedAt**     | Date                          |                                                                                                                                                               |
| **modifiedByUser** | [UserInfo](UserInfo.md)       |                                                                                                                                                               |
| content            | [ContentInfo](ContentInfo.md) |                                                                                                                                                               |
| aspectNames        | string[]                      |                                                                                                                                                               |
| properties         | any                           |                                                                                                                                                               |