# TrashcanApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                                              | HTTP request                                                                        | Description                                                                  |
|---------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| [deleteDeletedNode](#deleteDeletedNode)                             | **DELETE** /deleted-nodes/{nodeId}                                                  | Permanently delete a deleted node                                            |
| [getArchivedNodeRendition](#getArchivedNodeRendition)               | **GET** /deleted-nodes/{nodeId}/renditions/{renditionId}                            | Get rendition information for a deleted node                                 |
| [getArchivedNodeRenditionContent](#getArchivedNodeRenditionContent) | **GET** /deleted-nodes/{nodeId}/renditions/{renditionId}/content                    | Get rendition content of a deleted node                                      |
| [getDeletedNode](#getDeletedNode)                                   | **GET** /deleted-nodes/{nodeId}                                                     | Get a deleted node                                                           |
| [getDeletedNodeContent](#getDeletedNodeContent)                     | **GET** /deleted-nodes/{nodeId}/content                                             | Get deleted node content                                                     |
| [listDeletedNodeRenditions](#listDeletedNodeRenditions)             | **GET** /deleted-nodes/{nodeId}/renditions                                          | List renditions for a deleted node                                           |
| [listDeletedNodes](#listDeletedNodes)                               | **GET** /deleted-nodes                                                              | List deleted nodes                                                           |
| [requestDirectAccessUrl](#requestDirectAccessUrl)                   | **POST** /deleted-nodes/{nodeId}/request-direct-access-url                          | Generate a direct access content url for a given deleted node                |
| [requestRenditionDirectAccessUrl](#requestRenditionDirectAccessUrl) | **POST** /deleted-nodes/{nodeId}/renditions/{renditionId}/request-direct-access-url | Generate a direct access content url for a given rendition of a deleted node |
| [restoreDeletedNode](#restoreDeletedNode)                           | **POST** /deleted-nodes/{nodeId}/restore                                            | Restore a deleted node                                                       |

## deleteDeletedNode

Permanently delete a deleted node

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name        | Type   | Description                                                        |
|-------------|--------|--------------------------------------------------------------------|
| nodeId      | string | The identifier of a node.                                          |

**Example**

```javascript
import { AlfrescoApi, TrashcanApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);

trashcanApi.deleteDeletedNode(`<nodeId>`).then(() => {
  console.log('API called successfully.');
});
```

## getArchivedNodeRendition

Get rendition information for a deleted node

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name        | Type   | Description                                                        |
|-------------|--------|--------------------------------------------------------------------|
| nodeId      | string | The identifier of a node.                                          | 
| renditionId | string | The name of a thumbnail rendition, for example *doclib*, or *pdf*. | 

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);

trashcanApi.getArchivedNodeRendition('node-id', 'rendition-id').then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

**Return type**: [RenditionEntry](RenditionEntry.md)

## getArchivedNodeRenditionContent

Get rendition content of a deleted node

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name            | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| nodeId          | string  | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 
| renditionId     | string  | The name of a thumbnail rendition, for example *doclib*, or *pdf*.                                                                                                                                                                                                                                                                                                                                                                                                                         | 
| attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list; for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| ifModifiedSince | boolean | Only returns the content if it has been modified since the date provided. Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.                                                                                                                                                                                                                                                                                                                                 | 
| range           | string  | The Range header indicates the part of a document that the server should return. Single part request supported, for example: bytes=1-10.                                                                                                                                                                                                                                                                                                                                                   | 
| placeholder     | boolean | If **true** and there is no rendition for this **nodeId** and **renditionId**, then the placeholder image for the mime type of this rendition is returned, rather than a 404 response.                                                                                                                                                                                                                                                                                                     |

**Return type**: **Blob**

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);

trashcanApi.getArchivedNodeRenditionContent('node-id', 'rendition-id').then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getDeletedNode

Get a deleted node

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name       | Type   | Description                                                                                                                                                                                                 |
|------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId** | string | The identifier of a node.                                                                                                                                                                                   | 
| include    | string | Returns additional information about the node. The following optional fields can be requested: `allowableOperations`, `association`, `isLink`, `isFavorite`,`isLocked`, `path`, `permissions`, `definition` | 

**Return type**: [DeletedNodeEntry](#DeletedNodeEntry)

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);

trashcanApi.getDeletedNode('nodeId').then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getDeletedNodeContent

Get deleted node content

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name            | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-----------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**      | string  | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 
| attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| ifModifiedSince | Date    | Only returns the content if it has been modified since the date provided. Use the date format defined by HTTP. For example, `Wed, 09 Mar 2016 16:56:34 GMT`.                                                                                                                                                                                                                                                                                                                              |
| range           | string  | The Range header indicates the part of a document that the server should return. Single part request supported, for example: bytes=1-10.                                                                                                                                                                                                                                                                                                                                                  | 

**Return type**: Blob

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);

trashcanApi.getDeletedNodeContent('nodeId').then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listDeletedNodeRenditions

List renditions for a deleted node

> this endpoint is available in **Alfresco 5.2** and newer versions.

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
| opts.where | string | A string to restrict the returned objects by using a predicate. | 

**Return type**: [RenditionPaging](RenditionPaging.md)

**Example**

```javascript
import { AlfrescoApi, TrashcanApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);

trashcanApi.listDeletedNodeRenditions(`<nodeId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listDeletedNodes

List deleted nodes

> this endpoint is available in **Alfresco 5.2** and newer versions.

Gets a list of deleted nodes for the current user.

If the current user is an administrator deleted nodes for all users will be returned.

The list of deleted nodes will be ordered with the most recently deleted node at the top of the list.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                 | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                        | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                           | default to 100 |
| opts.include   | string[] | Returns additional information about the node. The following optional fields can be requested: `allowableOperations`, `aspectNames`, `association`, `isLink`, `isFavorite`, `isLocked`, `path`, `properties`, `permissions` |                |

**Return type**: [DeletedNodesPaging](#DeletedNodesPaging)

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);
const opts = {};

trashcanApi.listDeletedNodes(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## requestDirectAccessUrl

Generate a direct access content url for a given deleted node

> this endpoint is available in **Alfresco 7.1** and newer versions.

**Parameters**

| Name       | Type   | Description               |
|------------|--------|---------------------------|
| **nodeId** | string | The identifier of a node. |

**Return type**: [DirectAccessUrlEntry](DirectAccessUrlEntry.md)

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);
const nodeId = 'da2e6953-3850-408b-8284-3534dd777417';

trashcanApi.requestDirectAccessUrl(nodeId).then((data) => {
  console.log('URL generated successfully: ', data.contentUrl);
});
```

## requestRenditionDirectAccessUrl

Generate a direct access content url for a given rendition of a deleted node

> this endpoint is available in **Alfresco 7.1** and newer versions.

**Parameters**

| Name            | Type   | Description                    |
|-----------------|--------|--------------------------------|
| **nodeId**      | string | The identifier of a node.      |
| **renditionId** | string | The identifier of a rendition. |

**Return type**: [**DirectAccessUrlEntry**](DirectAccessUrlEntry.md)

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);

const nodeId = 'da2e6953-3850-408b-8284-3534dd777417';
const renditionId = 'avatar';

trashcanApi.requestRenditionDirectAccessUrl(nodeId, renditionId).then((data) => {
  console.log('URL generated successfully: ', data.contentUrl);
});
```

## restoreDeletedNode

Restore a deleted node

> this endpoint is available in **Alfresco 5.2** and newer versions.

Attempts to restore the deleted node **nodeId** to its original location or to a new location.

If the node is successfully restored to its former primary parent, then only the
primary child association will be restored, including recursively for any primary
children. It should be noted that no other secondary child associations or peer
associations will be restored, for any of the nodes within the primary parent-child
hierarchy of restored nodes, irrespective of whether these associations were to
nodes within or outside the restored hierarchy.

Also, any previously shared link will not be restored since it is deleted at the time
of delete of each node.

**Parameters**

| Name                        | Type                                              | Description                                                   |
|-----------------------------|---------------------------------------------------|---------------------------------------------------------------|
| nodeId                      | string                                            | The identifier of a node.                                     | 
| opts.fields                 | string                                            | A list of field names.                                        |
| opts.deletedNodeBodyRestore | [DeletedNodeBodyRestore](#DeletedNodeBodyRestore) | The targetParentId if the node is restored to a new location. |

**Return type**: [NodeEntry](NodeEntry.md)

**Example**

```javascript
import { AlfrescoApi, TrashcanApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const trashcanApi = new TrashcanApi(alfrescoApi);
const nodeId = '<guid>';

trashcanApi.restoreDeletedNode(nodeId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## DeletedNodesPaging

**Properties**

| Name | Type                                                |
|------|-----------------------------------------------------|
| list | [DeletedNodesPagingList](DeletedNodesPagingList.md) |


## DeletedNodesPagingList

**Properties**

| Name       | Type                                    |
|------------|-----------------------------------------|
| pagination | [Pagination](Pagination.md)             |
| entries    | [DeletedNodeEntry[]](#DeletedNodeEntry) |

## DeletedNodeEntry

**Properties**

| Name      | Type                        |
|-----------|-----------------------------|
| **entry** | [DeletedNode](#DeletedNode) |

## DeletedNode

**Properties**

| Name                | Type                                  | Description                                                                                                                                                      |
|---------------------|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **id**              | string                                |                                                                                                                                                                  |
| **name**            | string                                | The name must not contain spaces or the following special characters: `* \" < > \\ / ?` : and ` \| `. The character `.` must not be used at the end of the name. |
| **nodeType**        | string                                |                                                                                                                                                                  |
| **isFolder**        | boolean                               |                                                                                                                                                                  |
| **isFile**          | boolean                               |                                                                                                                                                                  |
| isLocked            | boolean                               |                                                                                                                                                                  |
| **modifiedAt**      | Date                                  |                                                                                                                                                                  |
| **modifiedByUser**  | [UserInfo](UserInfo.md)               |                                                                                                                                                                  |
| **createdAt**       | Date                                  |                                                                                                                                                                  |
| **createdByUser**   | [UserInfo](UserInfo.md)               |                                                                                                                                                                  |
| parentId            | string                                |                                                                                                                                                                  |
| isLink              | boolean                               |                                                                                                                                                                  |
| isFavorite          | boolean                               |                                                                                                                                                                  |
| content             | [ContentInfo](ContentInfo.md)         |                                                                                                                                                                  |
| aspectNames         | string[]                              |                                                                                                                                                                  |
| properties          | any                                   |                                                                                                                                                                  |
| allowableOperations | string[]                              |                                                                                                                                                                  |
| path                | [PathInfo](PathInfo.md)               |                                                                                                                                                                  |
| permissions         | [PermissionsInfo](PermissionsInfo.md) |                                                                                                                                                                  |
| definition          | [Definition](Definition.md)           |                                                                                                                                                                  |
| **archivedByUser**  | [UserInfo](UserInfo.md)               |                                                                                                                                                                  |
| **archivedAt**      | Date                                  |                                                                                                                                                                  |

## DeletedNodeBodyRestore

**Properties**

| Name           | Type   |
|----------------|--------|
| targetParentId | string |
| assocType      | string |


