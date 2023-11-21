# SharedlinksApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                                          | HTTP request                                                      | Description                           |
|-----------------------------------------------------------------|-------------------------------------------------------------------|---------------------------------------|
| [createSharedLink](#createSharedLink)                           | **POST** /shared-links                                            | Create a shared link to a file        |
| [deleteSharedLink](#deleteSharedLink)                           | **DELETE** /shared-links/{sharedId}                               | Deletes a shared link                 |
| [emailSharedLink](#emailSharedLink)                             | **POST** /shared-links/{sharedId}/email                           | Email shared link                     |
| [getSharedLink](#getSharedLink)                                 | **GET** /shared-links/{sharedId}                                  | Get a shared link                     |
| [getSharedLinkContent](#getSharedLinkContent)                   | **GET** /shared-links/{sharedId}/content                          | Get shared link content               |
| [getSharedLinkRendition](#getSharedLinkRendition)               | **GET** /shared-links/{sharedId}/renditions/{renditionId}         | Get shared link rendition information |
| [getSharedLinkRenditionContent](#getSharedLinkRenditionContent) | **GET** /shared-links/{sharedId}/renditions/{renditionId}/content | Get shared link rendition content     |
| [listSharedLinkRenditions](#listSharedLinkRenditions)           | **GET** /shared-links/{sharedId}/renditions                       | List renditions for a shared link     |
| [listSharedLinks](#listSharedLinks)                             | **GET** /shared-links                                             | List shared links                     |

## createSharedLink

Create a shared link to a file

> this endpoint is available in **Alfresco 5.2** and newer versions.

Create a shared link to the file **nodeId** in the request body. Also, an optional expiry date could be set,
so the shared link would become invalid when the expiry date is reached. For example:

```json
{
  "nodeId": "1ff9da1a-ee2f-4b9c-8c34-3333333333",
  "expiresAt": "2017-03-23T23:00:00.000+0000"
}
```

**Note:** You can create shared links to more than one file
specifying a list of **nodeId**s in the JSON body like this:

```json
[
  {
    "nodeId": "1ff9da1a-ee2f-4b9c-8c34-4444444444"
  },
  {
    "nodeId": "1ff9da1a-ee2f-4b9c-8c34-5555555555"
  }
]
```

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

```json
{
  "list": {
    "pagination": {
      "count": 2,
      "hasMoreItems": false,
      "totalItems": 2,
      "skipCount": 0,
      "maxItems": 100
    },
    "entries": [
      {
        "entry": {
        }
      },
      {
        "entry": {
        }
      }
    ]
  }
}
```

**Parameters**

| Name                     | Type                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **sharedLinkBodyCreate** | [SharedLinkBodyCreate](#SharedLinkBodyCreate) | The nodeId to create a shared link for.                                                                                                                                                                                                                                                                                                                                                                                                 |
| opts.include             | string[]                                      | Returns additional information about the shared link, the following optional fields can be requested: `allowableOperations`, `path`, `properties`, `isFavorite`, `aspectNames`                                                                                                                                                                                                                                                          |
| opts.fields              | string[]                                      | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SharedLinkEntry](#SharedLinkEntry)

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);
const sharedLinkBodyCreate = {};
const opts = {};

sharedlinksApi.createSharedLink(sharedLinkBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteSharedLink

Deletes a shared link

> this endpoint is available in Alfresco 5.2 and newer versions.

**Parameters**

| Name         | Type   | Description                                |
|--------------|--------|--------------------------------------------|
| **sharedId** | string | The identifier of a shared link to a file. |

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);

sharedlinksApi.deleteSharedLink(`<sharedId>`).then(() => {
  console.log('API called successfully.');
});
```

## emailSharedLink

Email shared link

> this endpoint is available in **Alfresco 5.2** and newer versions.

Sends email with app-specific url including identifier **sharedId**.

The client and recipientEmails properties are mandatory in the request body. For example, to email a shared link with minimum info:

```json
{
    "client": "myClient",
    "recipientEmails": ["john.doe@acme.com", "joe.bloggs@acme.com"]
}
```

A plain text message property can be optionally provided in the request body to customise the email being sent.
Also, a locale property can be optionally provided in the request body to send the emails in a particular language (if the locale is supported by Alfresco).
For example, to email a shared link with a messages and a locale:

```json
{
    "client": "myClient",
    "recipientEmails": ["john.doe@acme.com", "joe.bloggs@acme.com"],
    "message": "myMessage",
    "locale":"en-GB"
}
```

>The client must be registered before you can send a shared link email. See [server documentation]. However, out-of-the-box
 share is registered as a default client, so you could pass **share** as the client name:

```json
{
    "client": "share",
    "recipientEmails": ["john.doe@acme.com"]
}
```

**Parameters**

| Name                    | Type                                        | Description                                |
|-------------------------|---------------------------------------------|--------------------------------------------|
| **sharedId**            | string                                      | The identifier of a shared link to a file. |
| **sharedLinkBodyEmail** | [SharedLinkBodyEmail](#SharedLinkBodyEmail) | The shared link email to send.             |

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);
const sharedLinkBodyEmail = {};

sharedlinksApi.emailSharedLink(`<sharedId>`, sharedLinkBodyEmail).then(() => {
  console.log('API called successfully.');
});
```

## getSharedLink

Get a shared link

> this endpoint is available in **Alfresco 5.2** and newer versions.  
> No authentication is required to call this endpoint.

Gets minimal information for the file with shared link identifier **sharedId**.

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **sharedId** | string   | The identifier of a shared link to a file.                                                                                                                                                                                                                                                                                                                                                                                              |
| opts.fields  | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | | 

**Return type**: [SharedLinkEntry](#SharedLinkEntry)

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);
const opts = {};

sharedlinksApi.getSharedLink(`<sharedId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSharedLinkContent

Get shared link content

> this endpoint is available in **Alfresco 5.2** and newer versions.  
> No authentication is required to call this endpoint.

Gets the content of the file with shared link identifier **sharedId**.

**Parameters**

| Name                 | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|----------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **sharedId**         | string  | The identifier of a shared link to a file.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| opts.attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list; for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| opts.ifModifiedSince | Date    | Only returns the content if it has been modified since the date provided. Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.                                                                                                                                                                                                                                                                                                                                 |
| opts.range           | string  | The Range header indicates the part of a document that the server should return. Single part request supported, for example: bytes=1-10.                                                                                                                                                                                                                                                                                                                                                   |

**Return type**: Blob

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);
const opts = {};

sharedlinksApi.getSharedLinkContent(`<sharedId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSharedLinkRendition

Get shared link rendition information

> this endpoint is available in **Alfresco 5.2** and newer versions.  
> No authentication is required to call this endpoint.

Gets rendition information for the file with shared link identifier **sharedId**.

This API method returns rendition information where the rendition status is CREATED,
which means the rendition is available to view/download.

**Parameters**

| Name            | Type   | Description                                                        |
|-----------------|--------|--------------------------------------------------------------------|
| **sharedId**    | string | The identifier of a shared link to a file.                         |
| **renditionId** | string | The name of a thumbnail rendition, for example `doclib`, or `pdf`. |

**Return type**: [RenditionEntry](RenditionEntry.md)

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);

sharedlinksApi.getSharedLinkRendition(`<sharedId>`, `<renditionId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSharedLinkRenditionContent

Get shared link rendition content

> this endpoint is available in **Alfresco 5.2** and newer versions.  
> No authentication is required to call this endpoint.

Gets the rendition content for file with shared link identifier **sharedId**.

**Parameters**

| Name                 | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|----------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **sharedId**         | string  | The identifier of a shared link to a file.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **renditionId**      | string  | The name of a thumbnail rendition, for example *doclib*, or *pdf*.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| opts.attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list; for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| opts.ifModifiedSince | Date    | Only returns the content if it has been modified since the date provided. Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.                                                                                                                                                                                                                                                                                                                                 |
| opts.range           | string  | The Range header indicates the part of a document that the server should return. Single part request supported, for example: bytes=1-10.                                                                                                                                                                                                                                                                                                                                                   |

**Return type**: Blob

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);
const opts = {};

sharedlinksApi.getSharedLinkRenditionContent(`<sharedId>`, `<renditionId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listSharedLinkRenditions

List renditions for a shared link

> this endpoint is available in **Alfresco 5.2** and newer versions.  
> No authentication is required to call this endpoint.

Gets a list of the rendition information for the file with shared link identifier **sharedId**.

This API method returns rendition information, including the rendition id, for each rendition
where the rendition status is `CREATED`, which means the rendition is available to view/download.

**Parameters**

| Name         | Type   | Description                                |
|--------------|--------|--------------------------------------------|
| **sharedId** | string | The identifier of a shared link to a file. |

**Return type**: [RenditionPaging](RenditionPaging.md)

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);

sharedlinksApi.listSharedLinkRenditions(`<sharedId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listSharedLinks

List shared links

> this endpoint is available in Alfresco 5.2 and newer versions.

Get a list of links that the current user has read permission on source node.

The list is ordered in descending modified order.

> The list of links is eventually consistent so newly created shared links may not appear immediately.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                            | Notes          |
|----------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                   | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                      | default to 100 |
| opts.where     | string   | Optionally filter the list by "sharedByUser" userid of person who shared the link (can also use -me-)`where=(sharedByUser='jbloggs')`, `where=(sharedByUser='-me-')`                                                                                                                                                                                                                                                                   |                |
| opts.include   | string[] | Returns additional information about the shared link, the following optional fields can be requested: `allowableOperations`, `path`, `properties`, `isFavorite`, `aspectNames`                                                                                                                                                                                                                                                         |                |
| opts.fields    | string[] | A list of field names.You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [SharedLinkPaging](#SharedLinkPaging)

**Example**

```javascript
import { AlfrescoApi, SharedlinksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sharedlinksApi = new SharedlinksApi(alfrescoApi);
const opts = {};

sharedlinksApi.listSharedLinks(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## SharedLinkPaging

**Properties**

| Name | Type                                          |
|------|-----------------------------------------------|
| list | [SharedLinkPagingList](#SharedLinkPagingList) |

## SharedLinkPagingList

**Properties**

| Name           | Type                                  |
|----------------|---------------------------------------|
| **pagination** | [Pagination](Pagination.md)           |
| **entries**    | [SharedLinkEntry[]](#SharedLinkEntry) |

## SharedLinkEntry

**Properties**

| Name      | Type                      |
|-----------|---------------------------|
| **entry** | [SharedLink](#SharedLink) |

## SharedLinkBodyEmail

**Properties**

| Name            | Type     |
|-----------------|----------|
| client          | string   |
| message         | string   |
| locale          | string   |
| recipientEmails | string[] |

## SharedLinkBodyCreate

**Properties**

| Name       | Type   |
|------------|--------|
| **nodeId** | string |
| expiresAt  | Date   |

## SharedLink

**Properties**

| Name                        | Type                          | Description                                                                                                                                                  |
|-----------------------------|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                          | string                        |                                                                                                                                                              |
| expiresAt                   | Date                          |                                                                                                                                                              |
| nodeId                      | string                        |                                                                                                                                                              |
| name                        | string                        | The name must not contain spaces or the following special characters: `* " < > \\ / ? :` and `\|`. The character . must not be used at the end of the name.  |
| title                       | string                        |                                                                                                                                                              |
| description                 | string                        |                                                                                                                                                              |
| modifiedAt                  | Date                          |                                                                                                                                                              |
| modifiedByUser              | [UserInfo](UserInfo.md)       |                                                                                                                                                              |
| sharedByUser                | [UserInfo](UserInfo.md)       |                                                                                                                                                              |
| content                     | [ContentInfo](ContentInfo.md) |                                                                                                                                                              |
| allowableOperations         | string[]                      | The allowable operations for the Quickshare link itself. See allowableOperationsOnTarget for the allowable operations pertaining to the linked content node. |
| allowableOperationsOnTarget | string[]                      | The allowable operations for the content node being shared.                                                                                                  |
| isFavorite                  | boolean                       |                                                                                                                                                              |
| properties                  | any                           | A subset of the target node's properties, system properties and properties already available in the SharedLink are excluded.                                 |
| aspectNames                 | string[]                      |                                                                                                                                                              |
