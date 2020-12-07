---
Title: Upload Service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Upload Service](../../../lib/core/services/upload.service.ts "Defined in upload.service.ts")

Provides access to various APIs related to file upload features.

## Class members

### Methods

*   **addToQueue**(files: [`FileModel`](../../../lib/core/models/file.model.ts)`[]`): [`FileModel`](../../../lib/core/models/file.model.ts)`[]`<br/>
    Adds files to the uploading queue to be uploaded
    *   *files:* [`FileModel`](../../../lib/core/models/file.model.ts)`[]`  - One or more separate parameters or an array of files to queue
    *   **Returns** [`FileModel`](../../../lib/core/models/file.model.ts)`[]` - Array of files that were not blocked from upload by the ignore list
*   **cancelUpload**(files: [`FileModel`](../../../lib/core/models/file.model.ts)`[]`)<br/>
    Cancels uploading of files. If the file is smaller than 1 MB the file will be uploaded and then the node deleted to prevent having files that were aborted but still uploaded.
    *   *files:* [`FileModel`](../../../lib/core/models/file.model.ts)`[]`  - One or more separate parameters or an array of files specifying uploads to cancel
*   **clearQueue**()<br/>
    Clears the upload queue
*   **getQueue**(): [`FileModel`](../../../lib/core/models/file.model.ts)`[]`<br/>
    Gets the file Queue
    *   **Returns** [`FileModel`](../../../lib/core/models/file.model.ts)`[]` - Array of files that form the queue
*   **getUploadPromise**(file: [`FileModel`](../../../lib/core/models/file.model.ts)): `any`<br/>
    Gets an upload promise for a file.
    *   *file:* [`FileModel`](../../../lib/core/models/file.model.ts)  - The target file
    *   **Returns** `any` - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) that is resolved if the upload is successful or error otherwise
*   **isUploading**(): `boolean`<br/>
    Checks whether the service is uploading a file.
    *   **Returns** `boolean` - True if a file is uploading, false otherwise
*   **uploadFilesInTheQueue**(emitter?: [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`)<br/>
    Finds all the files in the queue that are not yet uploaded and uploads them into the directory folder.
    *   *emitter:* [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`  - (Optional) Emitter to invoke on file status change

## Events

| Name                | Type                                                                | Description                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| queueChanged        | [`FileModel`](../../../lib/core/models/file.model.ts)\[]            | Emitted when the file queue changes.                                                                                                            |
| fileUpload          | [`FileUploadEvent`](../../../lib/core/events/file.event.ts)         | Emitted when a [File model](../../../lib/core/models/file.model.ts) changes its state.                                                          |
| fileUploadStarting  | [`FileUploadEvent`](../../../lib/core/events/file.event.ts)         | Emitted when an upload starts.                                                                                                                  |
| fileUploadCancelled | [`FileUploadEvent`](../../../lib/core/events/file.event.ts)         | Emitted when an upload gets cancelled by the user.                                                                                              |
| fileUploadProgress  | [`FileUploadEvent`](../../../lib/core/events/file.event.ts)         | Emitted during the file upload process and contains the current progress for a particular [File model](../../../lib/core/models/file.model.ts). |
| fileUploadAborted   | [`FileUploadEvent`](../../../lib/core/events/file.event.ts)         | Emitted when a file upload gets aborted by the server.                                                                                          |
| fileUploadError     | [`FileUploadEvent`](../../../lib/core/events/file.event.ts)         | Emitted when an error occurs during a file upload.                                                                                              |
| fileUploadComplete  | [`FileUploadCompleteEvent`](../../../lib/core/events/file.event.ts) | Emitted when a file upload is complete.                                                                                                         |
| fileUploadDelete    | [`FileUploadDeleteEvent`](../../../lib/core/events/file.event.ts)   | Emitted when an uploaded file is removed from server.                                                                                           |
| fileDeleted         | string                                                              | This can be invoked when a file is deleted from an external source to upload the file dialog status.                                            |

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

From vesion 3.8.0 It's  possible filter also for the folder whilst uploading a whole folder.

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
Please note that the filtering options available for the folders is the same as the one for the files.
