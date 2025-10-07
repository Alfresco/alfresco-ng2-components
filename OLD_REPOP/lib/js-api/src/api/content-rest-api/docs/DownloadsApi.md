# DownloadsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                            | HTTP request                       | Description           |
|-----------------------------------|------------------------------------|-----------------------|
| [cancelDownload](#cancelDownload) | **DELETE** /downloads/{downloadId} | Cancel a download     |
| [createDownload](#createDownload) | **POST** /downloads                | Create a new download |
| [getDownload](#getDownload)       | **GET** /downloads/{downloadId}    | Get a download        |

## cancelDownload

Cancel a download

> this endpoint is available in **Alfresco 5.2.1** and newer versions.

Cancels the creation of a download request.

> The download node can be deleted using the **DELETE /nodes/{downloadId}** endpoint

By default, if the download node is not deleted it will be picked up by a cleaner job which removes download nodes older than a configurable amount of time (default is 1 hour)

Information about the existing progress at the time of cancelling can be retrieved by calling the **GET /downloads/{downloadId}** endpoint

The cancel operation is done asynchronously.

**Parameters**

| Name           | Type   | Description                        |
|----------------|--------|------------------------------------|
| **downloadId** | string | The identifier of a download node. |

**Example**

```javascript
import { AlfrescoApi, DownloadsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const downloadsApi = new DownloadsApi(alfrescoApi);

downloadsApi.cancelDownload(`<downloadId>`).then(() => {
  console.log('API called successfully.');
});
```

## createDownload

Create a new download

> this endpoint is available in **Alfresco 5.2.1** and newer versions.

Creates a new download node asynchronously, the content of which will be the zipped content of the **nodeIds** specified in the JSON body like this:

```json
{
    "nodeIds":
     [
       "c8bb482a-ff3c-4704-a3a3-de1c83ccd84c",
       "cffa62db-aa01-493d-9594-058bc058eeb1"
     ]
}
```

> The content of the download node can be obtained using the **GET /nodes/{downloadId}/content** endpoint

**Parameters**

| Name                   | Type                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|------------------------|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **downloadBodyCreate** | [DownloadBodyCreate](#DownloadBodyCreate) | The nodeIds the content of which will be zipped, which zip will be set as the content of our download node.                                                                                                                                                                                                                                                                                                                             |
| opts.fields            | string[]                                  | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [DownloadEntry](#DownloadEntry)

**Example**

```javascript
import { AlfrescoApi, DownloadsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const downloadsApi = new DownloadsApi(alfrescoApi);
const downloadBodyCreate = {};
const opts = {};

downloadsApi.createDownload(downloadBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getDownload

Retrieve status information for download node

> this endpoint is available in **Alfresco 5.2.1** and newer versions.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **downloadId** | string   | The identifier of a download node.                                                                                                                                                                                                                                                                                                                                                                                                      |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [DownloadEntry](#DownloadEntry)

**Example**

```javascript
import { AlfrescoApi, DownloadsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const downloadsApi = new DownloadsApi(alfrescoApi);
const opts = {};

downloadsApi.getDownload(`<downloadId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## DownloadBodyCreate

**Properties**

| Name        | Type     |
|-------------|----------|
| **nodeIds** | string[] |

## DownloadEntry

**Properties**

| Name      | Type                  |
|-----------|-----------------------|
| **entry** | [Download](#Download) |

## Download

**Properties**

| Name       | Type   | Description                                      |
|------------|--------|--------------------------------------------------|
| filesAdded | number | number of files added so far in the zip          |
| bytesAdded | number | number of bytes added so far in the zip          |
| id         | string | the id of the download node                      |
| totalFiles | number | the total number of files to be added in the zip |
| totalBytes | number | the total number of bytes to be added in the zip |
| status     | string | the current status of the download node creation |

### Download.StatusEnum

* `PENDING` (value: `'PENDING'`)
* `CANCELLED` (value: `'CANCELLED'`)
* `INPROGRESS` (value: `'IN_PROGRESS'`)
* `DONE` (value: `'DONE'`)
* `MAXCONTENTSIZEEXCEEDED` (value: `'MAX_CONTENT_SIZE_EXCEEDED'`)