---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Upload Service

Provides access to various APIs related to file upload features.

## Class members

### Methods

-   **addToQueue**(files: [`FileModel`](../../lib/core/models/file.model.ts)`[]` = `null`): [`FileModel`](../../lib/core/models/file.model.ts)`[]`<br/>
    Adds files to the uploading queue to be uploaded
    -   _files:_ [`FileModel`](../../lib/core/models/file.model.ts)`[]`  - One or more separate parameters or an array of files to queue
    -   **Returns** [`FileModel`](../../lib/core/models/file.model.ts)`[]` - Array of files that were not blocked from upload by the ignore list
-   **cancelUpload**(files: [`FileModel`](../../lib/core/models/file.model.ts)`[]` = `null`)<br/>
    Cancels uploading of files.
    -   _files:_ [`FileModel`](../../lib/core/models/file.model.ts)`[]`  - One or more separate parameters or an array of files specifying uploads to cancel
-   **clearQueue**()<br/>
    Clears the upload queue
-   **getQueue**(): [`FileModel`](../../lib/core/models/file.model.ts)`[]`<br/>
    Gets the file Queue
    -   **Returns** [`FileModel`](../../lib/core/models/file.model.ts)`[]` - Array of files that form the queue
-   **getUploadPromise**(file: [`FileModel`](../../lib/core/models/file.model.ts) = `null`): `any`<br/>
    Gets an upload promise for a file.
    -   _file:_ [`FileModel`](../../lib/core/models/file.model.ts)  - The target file
    -   **Returns** `any` - Promise that is resolved if the upload is successful or error otherwise
-   **isUploading**(): `boolean`<br/>
    Checks whether the service is uploading a file.
    -   **Returns** `boolean` - True if a file is uploading, false otherwise
-   **uploadFilesInTheQueue**(emitter?: [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` = `null`)<br/>
    Finds all the files in the queue that are not yet uploaded and uploads them into the directory folder.
    -   _emitter:_ [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`  - (Optional) (Deprecated) Emitter to invoke on file status change

## Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| queueChanged | FileModel\[] | Emitted when the file queue changes. |
| fileUpload | FileUploadEvent | Emitted when a File model changes its state. |
| fileUploadStarting | FileUploadEvent | Emitted when an upload starts. |
| fileUploadCancelled | FileUploadEvent | Emitted when an upload gets cancelled by the user. |
| fileUploadProgress | FileUploadEvent | Emitted during the file upload process and contains the current progress for a particular File model. |
| fileUploadAborted | FileUploadEvent | Emitted when a file upload gets aborted by the server. |
| fileUploadError | FileUploadEvent | Emitted when an error occurs during a file upload. |
| fileUploadComplete | FileUploadCompleteEvent | Emitted when a file upload is complete. |
| fileUploadDelete | FileUploadDeleteEvent | Emitted when an uploaded file is removed from server. |
| fileDeleted | string | This can be invoked when a file is deleted from an external source to upload the file dialog status. |

## Details

### Ignore list configuration

You can add an ignore list for files that you don't want to be uploaded on your CS.
The configuration of this service is saved in the `app.config.json` file
(see the [App Config service](app-config.service.md) for more information).

The example below shows how to filter out the : '.git', '.DS_Store' and 'desktop.ini' files.
Each element of the ignore list is a glob pattern string, so you could exclude all the `.txt`
files, for example, by adding a `*.txt` pattern to the list.
There is also the possibility to add some more option to how perform the check via the `match-options` parameter.
For example in this case we have added the ignore case so `*.TXT` will match all the txt files ignoring the case for the extension.
For more information about the options available please check [minimatch](https://www.npmjs.com/package/minimatch#options) documentation.

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

Note that all standard glob patterns work and you can end patterns with a forward
slash `/` character to specify a directory.
