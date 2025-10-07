---
Title: Download zip service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-08
---

# [Download zip service](../../../lib/content-services/src/lib/dialogs/download-zip/services/download-zip.service.ts "Defined in download-zip.service.ts")

Creates and manages downloads.

## Class members

### Methods

-   **cancelDownload**(downloadId: `string`)<br/>
    Cancels a download.
    -   _downloadId:_ `string`  - ID of the target download node
-   **createDownload**(payload: [`DownloadBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadBodyCreate.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DownloadEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadEntry.md)`>`<br/>
    Creates a new download.
    -   _payload:_ [`DownloadBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadBodyCreate.md)  - Object containing the node IDs of the items to add to the ZIP file
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DownloadEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadEntry.md)`>` - Status object for the download
-   **getDownload**(downloadId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DownloadEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadEntry.md)`>`<br/>
    Gets status information for a download node.
    -   _downloadId:_ `string`  - ID of the download node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DownloadEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadEntry.md)`>` - Status object for the download

## Details

Use `createDownload` to create a node that will represent the downloadable
ZIP data. The ZIP archive includes the content of all node IDs passed in via
the [`DownloadBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadBodyCreate.md) parameter.

The [`DownloadEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/DownloadEntry.md) object returned by `createDownload` has an
`id` field that you can use to identify the download node (eg,
to cancel it later or get the node URL when the download is complete) and
other information about the progress of the download.
