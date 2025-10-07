---
Title: Upload Service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Upload Service](../../../lib/content-services/src/lib/common/services/upload.service.ts "Defined in upload.service.ts")

Provides access to various APIs related to file upload features.

## Class members

### Methods

-   **addToQueue**(files: [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]`): [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]`<br/>
    Adds files to the uploading queue to be uploaded
    -   _files:_ [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]`  - One or more separate parameters or an array of files to queue
    -   **Returns** [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]` - Array of files that were not blocked from upload by the ignore list
-   **cancelUpload**(files: [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]`)<br/>
    Cancels uploading of files. If the file is smaller than 1 MB the file will be uploaded and then the node deleted to prevent having files that were aborted but still uploaded.
    -   _files:_ [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]`  - One or more separate parameters or an array of files specifying uploads to cancel
-   **clearCache**()<br/>

-   **clearQueue**()<br/>
    Clears the upload queue
-   **getQueue**(): [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]`<br/>
    Gets the file Queue
    -   **Returns** [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)`[]` - Array of files that form the queue
-   **getThreadsCount**(): `number`<br/>
    Returns the number of concurrent threads for uploading.
    -   **Returns** `number` - Number of concurrent threads (default 1)
-   **getUploadPromise**(file: [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)): `any`<br/>
    Gets an upload promise for a file.
    -   _file:_ [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)  - The target file
    -   **Returns** `any` - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) that is resolved if the upload is successful or error otherwise
-   **isUploading**(): `boolean`<br/>
    Checks whether the service still has files uploading or awaiting upload.
    -   **Returns** `boolean` - True if files in the queue are still uploading, false otherwise
-   **uploadFilesInTheQueue**(successEmitter?: [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`, errorEmitter?: [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`)<br/>
    Finds all the files in the queue that are not yet uploaded and uploads them into the directory folder.
    -   _successEmitter:_ [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`  - (Optional) Emitter to invoke on file success status change
    -   _errorEmitter:_ [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`  - (Optional) Emitter to invoke on file error status change

## Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| queueChanged | [`FileModel`](../../../lib/content-services/src/lib/common/models/file.model.ts)\[] | Emitted when the file queue changes. |
| fileUpload | [`FileUploadEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted when a [File model](lib/content-services/src/lib/common/models/file.model.ts) changes its state. |
| fileUploadStarting | [`FileUploadEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted when an upload starts. |
| fileUploadCancelled | [`FileUploadEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted when an upload gets cancelled by the user. |
| fileUploadProgress | [`FileUploadEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted during the file upload process and contains the current progress for a particular [File model](lib/content-services/src/lib/common/models/file.model.ts). |
| fileUploadAborted | [`FileUploadEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted when a file upload gets aborted by the server. |
| fileUploadError | [`FileUploadEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted when an error occurs during a file upload. |
| fileUploadComplete | [`FileUploadCompleteEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted when a file upload is complete. |
| fileUploadDelete | [`FileUploadDeleteEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts) | Emitted when an uploaded file is removed from server. |
| fileDeleted | string | This can be invoked when a file is deleted from an external source to upload the file dialog status. |

## Details

### Ignore list configuration

You can add an ignore list for files that you don't want to be uploaded on your CS.
The configuration of this service is saved in the `app.config.json` file
(see the [App Config service](app-config.service.md) for more information).

The example below shows how to filter out the : '.git', '.DS_Store' and 'desktop.ini' files.
Each element of the ignore list is a glob pattern string, so you could exclude all the `.txt`
files, for example, by adding a `*.txt` pattern to the list.
You can also specify some more options about how to perform the check via the `match-options` parameter.

In the example below, we have added the `nocase` option (ie, ignore case when performing the
glob match), so `*.TXT` will also match `.txt`, etc.
For more information about the options available please check the documentation for the
[minimatch](https://www.npmjs.com/package/minimatch#options)
node module.

**app.config.json**

```json
{
    "ecmHost": "http://localhost:3000/ecm",
    "bpmHost": "http://localhost:3000/bpm",
    "application": {
        "name": "Alfresco"
    },
    "files": {
          "excluded": [".DS_Store", "desktop.ini", ".git", "*.txt"],
          "match-options": {
            "nocase": true
          }
    }
}
```

From version `3.8.0` it is also possible to filter out the folders:

**app.config.json**

```json
{
    "ecmHost": "http://localhost:3000/ecm",
    "bpmHost": "http://localhost:3000/bpm",
    "application": {
        "name": "Alfresco"
    },
    "folders": {
          "excluded": [".git"],
          "match-options": {
            "nocase": true
          }
    }
}
```

In this way all the files present in the .git folder won't be uploaded.

> Please note that the filtering options available for the folders is the same as the one for the files.

### Toggling Versioning Support

It is also possible to provide the `versioningEnabled` value as part of the [`FileUploadOptions`](../../../lib/content-services/src/lib/common/models/file.model.ts) when using [upload service](../../core/services/upload.service.md) from the code.

> Note: When creating a new node using multipart/form-data by default versioning is enabled and set to MAJOR Version.
> Since Alfresco 6.2.3 versioningEnabled flag was introduced offering better control over the new node Versioning.

### Concurrent Uploads

By default, the [Upload Service](../../core/services/upload.service.md) processes one file at a time.
You can increase the number of concurrent threads by changing the `upload.threads` configuration parameter:

**app.config.json**

```json
{
    "upload": {
        "threads": 2
    }
}
```
