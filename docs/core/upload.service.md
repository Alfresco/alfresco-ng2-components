---
Added: v2.0.0
Status: Active
---
# Upload Service

Provides access to various APIs related to file upload features.

## Methods

-   `isUploading(): boolean`  
    Checks whether the service is uploading a file.  

-   `getQueue(): FileModel[]`  
    Returns the file Queue  

-   `addToQueue(files: FileModel[]): FileModel[]`  
    Adds files to the uploading queue to be uploaded  
    -   `files` - One or more separate parameters or an array of files to queue
-   `uploadFilesInTheQueue(emitter: EventEmitter<any>)`  
    Finds all the files in the queue that are not yet uploaded and uploads them into the directory folder.  
    -   `emitter` - (Deprecated) Emitter to invoke on file status change
-   `cancelUpload(files: FileModel[])`  
    Cancels uploading of files.  
    -   `files` - One or more separate parameters or an array of files
-   `clearQueue()`  
    Clears the upload queue   

-   `getUploadPromise(file: FileModel): any`  
    Gets an upload promise for a file.  
    -   `file` - The target file

## Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| queueChanged | FileModel\[] | Raised every time the file queue changes. |
| fileUpload | FileUploadEvent | Raised every time a File model changes its state. |
| fileUploadStarting | FileUploadEvent | Raised when upload starts. |
| fileUploadCancelled | FileUploadEvent | Raised when upload gets cancelled by user. |
| fileUploadProgress | FileUploadEvent | Raised during file upload process and contains the current progress for the particular File model. |
| fileUploadAborted | FileUploadEvent | Raised when file upload gets aborted by the server. |
| fileUploadError | FileUploadEvent | Raised when an error occurs to file upload. |
| fileUploadComplete | FileUploadCompleteEvent | Raised when file upload is complete. |
| fileUploadDelete | FileUploadDeleteEvent | Raised when uploaded file is removed from server. |
| fileDeleted | string | This can be invoked when a file is deleted from an external source to upload the file dialog status. |

## Details

### Ignore list configuration

Is possible add an ignore list for files that you don't want to allow upload on your CS.
The configuration of this service is saved in the **_app.config.json file_**.If you want more details about the configuration service follow this [link](https://github.com/Alfresco/alfresco-ng2-components/tree/master/ng2-components/ng2-alfresco-core#appconfigservice).
In the example below you can see how filtered out the : '.git', '.DS_Store' and 'desktop.ini'. **Every element is a glob pattern string.** So, if you want to exclude all the txt files, you can add the "\*.txt". (notice the asterisk at the beginning of the pattern!)

**app.config.json**

```json
{
    "ecmHost": "http://localhost:3000/ecm",
    "bpmHost": "http://localhost:3000/bpm",
    "application": {
        "name": "Alfresco"
    },
    "files": {
          "excluded": [".DS_Store", "desktop.ini", ".git", "*.txt"]
    }
}
```

Note:

-   Standard glob patterns work.
-   You can end patterns with a forward slash / to specify a directory.
