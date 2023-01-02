---
Title: Process Content Service
Added: v2.0.0
Status: Active
---

# [Process Content Service](../../../lib/process-services/src/lib/form/services/process-content.service.ts "Defined in process-content.service.ts")

Manipulates content related to a Process Instance or Task Instance in APS.

## Class members

### Methods

-   **createProcessRelatedContent**(processInstanceId: `string`, content: `any`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Associates an uploaded file with a process instance.
    -   _processInstanceId:_ `string`  - ID of the target process instance
    -   _content:_ `any`  - File to associate
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Details of created content
-   **createTaskRelatedContent**(taskId: `string`, file: `any`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Associates an uploaded file with a task instance.
    -   _taskId:_ `string`  - ID of the target task
    -   _file:_ `any`  - File to associate
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Details of created content
-   **createTemporaryRawRelatedContent**(file: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RelatedContentRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/RelatedContentRepresentation.md)`>`<br/>
    Create temporary related content from an uploaded file.
    -   _file:_ `any`  - File to use for content
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RelatedContentRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/RelatedContentRepresentation.md)`>` - The created content data
-   **deleteRelatedContent**(contentId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes related content.
    -   _contentId:_ `number`  - Identifier of the content to delete
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response that notifies when the deletion is complete
-   **getContentPreview**(contentId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>`<br/>
    Gets the preview for a related content file.
    -   _contentId:_ `number`  - ID of the related content
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>` - Binary data of the content preview
-   **getContentThumbnail**(contentId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>`<br/>
    Gets the thumbnail for a related content file.
    -   _contentId:_ `number`  - ID of the related content
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>` - Binary data of the thumbnail image
-   **getFileContent**(contentId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RelatedContentRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/RelatedContentRepresentation.md)`>`<br/>
    Gets the metadata for a related content item.
    -   _contentId:_ `number`  - ID of the content item
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RelatedContentRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/RelatedContentRepresentation.md)`>` - Metadata for the content
-   **getFileRawContent**(contentId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>`<br/>
    Gets raw binary content data for a related content file.
    -   _contentId:_ `number`  - ID of the related content
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>` - Binary data of the related content
-   **getFileRawContentUrl**(contentId: `number`): `string`<br/>
    Gets a URL for direct access to a related content file.
    -   _contentId:_ `number`  - ID of the related content
    -   **Returns** `string` - URL to access the content
-   **getProcessRelatedContent**(processId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets related content items for a process instance.
    -   _processId:_ `string`  - ID of the target process
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Metadata for the content
-   **getTaskRelatedContent**(taskId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets related content items for a task instance.
    -   _taskId:_ `string`  - ID of the target task
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Metadata for the content
-   **handleError**(error: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Reports an error message.
    -   _error:_ `any`  - Data object with optional `message` and `status` fields for the error
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Callback when an error occurs
-   **toJson**(res: `any`): `any`<br/>
    Creates a JSON representation of data.
    -   _res:_ `any`  - Object representing data
    -   **Returns** `any` - JSON object
-   **toJsonArray**(res: `any`): `any`<br/>
    Creates a JSON array representation of data.
    -   _res:_ `any`  - Object representing data
    -   **Returns** `any` - JSON array object

## Methods

#### createProcessRelatedContent(processInstanceId: string, content: any, opts?: any): Observable`<any>`

Associate an uploaded file with a Process Instance.

Let's say we have an upload button as follows:

```html
  <div>
    <button mat-button color="accent" mat-mini-fab (click)="fileInput.click()">
      <mat-icon>attachment</mat-icon>
    </button>
    <input hidden type="file" #fileInput (change)="onUploadFile($event)"/>
  </div>
```

We can then create related content as follows:

```ts
export class SomePageComponent implements OnInit {

  @ViewChild('fileInput') fileInput;

...

  onUploadFile() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const file: File =  fileBrowser.files[0];
      const processInstanceId = '11337';
      const opts = {
        isRelatedContent: true
      };
      this.contentService.createProcessRelatedContent(processInstanceId, file, opts).subscribe(
        (relContent: RelatedContentRepresentation)  => {
          console.log('Related content: ', relContent);
       }, error => {
            console.log('Error: ', error);
       });
    }
  }
```

In the above sample code the `file` is uploaded via an HTML input element.
The `processInstanceId` refers to a process instance ID for a running process in APS.
The returned `relContent` object looks like in this sample:

    Related content:     
        contentAvailable: true
        created: Wed Nov 08 2017 10:50:30 GMT+0000 (GMT) {}
        createdBy: {id: 1, firstName: null, lastName: "Administrator", email: "admin@app.activiti.com"}
        id: 6007
        link: false
        mimeType: "application/pdf"
        name: "simple.pdf"
        previewStatus: "queued"
        relatedContent: true
        simpleType: "pdf"
        thumbnailStatus: "queued"

The related content `id` can be used by other methods in this service to get to the content and to
delete it. It is referred to as the `contentId`.

If you look at attachments for the process instance it should now display the new file.

#### createTaskRelatedContent(taskId: string, file: any, opts?: any)

Associate an uploaded file with a Task Instance. This is in effect very similar
to the `createProcessRelatedContent` call. Just use `taskInstanceId` instead of `processInstanceId`.

```ts
onUploadFile() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const file: File =  fileBrowser.files[0];
      const taskInstanceId = '15303';
      const opts = {
        isRelatedContent: true
      };
      this.contentService.createTaskRelatedContent(taskInstanceId, file, opts).subscribe(
        (relContent: RelatedContentRepresentation)  => {
          console.log('Related content: ', relContent);
       }, error => {
            console.log('Error: ', error);
       });
    }
}
```

For more information see the docs for `createProcessRelatedContent`.

#### createTemporaryRawRelatedContent(file: any): Observable`<RelatedContentRepresentation>`

Create temporary related content from an uploaded file. This means that the related content
is not yet associated with a process instance or a task instance.

```ts
  onUploadFile() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const file: File =  fileBrowser.files[0];
      this.contentService.createTemporaryRawRelatedContent(file).subscribe(
        (relContent: RelatedContentRepresentation)  => {
          console.log('Related content: ', relContent);
        }, error => {
             console.log('Error: ', error);
        });
    }
  }
```

For more information see the docs for `createProcessRelatedContent`.

#### deleteRelatedContent(contentId: number): Observable`<any>`

Delete related content via the content identifier:

```ts
 const contentId = 6008;
 this.contentService.deleteRelatedContent(contentId).subscribe(
    res  => {
      console.log('Delete response: ', res);
    }, error => {
         console.log('Error: ', error);
    });
```

The response is going to be `null` if the delete was successful.

See `getProcessRelatedContent` and `getTaskRelatedContent` for how to get to the `contentId`.

#### getFileContent(contentId: number): Observable`<RelatedContentRepresentation>`

Get the metadata for a related content item in the format of a [`RelatedContentRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/RelatedContentRepresentation.md) object:

```ts
const contentId = 6008;
this.contentService.getFileContent(contentId).subscribe(
   res  => {
     console.log('Response Metadata: ', res);
   }, error => {
     console.log('Error: ', error);
   });
```

The metadata response looks like in this example:

    contentAvailable: true
    created: Wed Nov 08 2017 11:26:14 GMT+0000 (GMT) {}
    createdBy: {id: 1, firstName: null, lastName: "Administrator", email: "admin@app.activiti.com"}
    id: 6008
    link: false
    mimeType: "application/pdf"
    name: "simple.pdf"
    previewStatus: "created"
    relatedContent: true
    simpleType: "pdf"
    thumbnailStatus: "created"

See `getProcessRelatedContent` and `getTaskRelatedContent` for how to get to the `contentId`.

#### getFileRawContentUrl(contentId: number): string

Get the URL for direct access to a related content file:

```ts
const contentId = 6008;
const url = this.contentService.getFileRawContentUrl(contentId);
console.log('URL: ', url);
```

The URL response looks something like this:

`http://localhost:4200/bpm/activiti-app/api/enterprise/content/6008/raw`

This URL can be used to directly access the content file, such as from a browser.

See `getProcessRelatedContent` and `getTaskRelatedContent` for how to get to the `contentId`.

#### getFileRawContent(contentId: number): Observable`<Blob>`

Get the raw content bytes as a BLOB for a related content file:

```ts
const contentId = 5006;
this.contentService.getFileRawContent(contentId).subscribe(
   res  => {
     console.log('Response BLOB: ', res);
   }, error => {
     console.log('Error: ', error);
   });
```

The BLOB response looks something like this:

`Blob(205824) {size: 205824, type: "application/msword"}`

See `getProcessRelatedContent` and `getTaskRelatedContent` for how to get to the `contentId`.

#### getContentPreview(contentId: number): Observable`<Blob>`

Get the preview file for a related content file. A content file might be for example a
MS Word document. This method would give you the PDF preview for this document,
if it has been generated:

```ts
const contentId = 5006;
this.contentService.getContentPreview(contentId).subscribe(
   res  => {
     console.log('Response Preview BLOB: ', res);
   }, error => {
     console.log('Error: ', error);
   });
```

The preview BLOB response looks something like this:

`Blob(44101) {size: 44101, type: "application/pdf"}`

See `getProcessRelatedContent` and `getTaskRelatedContent` for how to get to the `contentId`.

#### getContentThumbnail(contentId: number): Observable`<Blob>`

Get the thumbnail file for a related content file. A content file might be for example a
MS Word document. This method would give you the image thumbnail for this document,
if it has been generated:

```ts
 const contentId = 5006;
 this.contentService.getContentThumbnail(contentId).subscribe(
   res  => {
     console.log('Response thumbnail BLOB: ', res);
   }, error => {
     console.log('Error: ', error);
   });
```

The response looks like in this sample:

`Blob(13780) {size: 13780, type: "image/png"}`

See `getProcessRelatedContent` and `getTaskRelatedContent` for how to get to the `contentId`.

#### getProcessRelatedContent(processId: string): Observable`<any>`

Get related content items for passed in Process Instance ID, only metadata for related content is returned:

```ts
const processId = '11337';
this.contentService.getProcessRelatedContent(processId).subscribe(
   res  => {
    console.log('Response: ', res);
   }, error => {
    console.log('Error: ', error);
   });
```

The response looks like in the following sample:

    size: 2
    start:0
    total:2
    data:
        0:
            contentAvailable: true
            created: "2017-10-29T07:28:15.546+0000"
            createdBy: {id: 1, firstName: null, lastName: "Administrator", email: "admin@app.activiti.com"}
            id: 5006
            link: false
            mimeType: "application/msword"
            name: "More info for Invoice.doc"
            previewStatus: "created"
            relatedContent: true
            simpleType: "word"
            thumbnailStatus: "created"
        1:
            id: 6008, 
            name: "simple.pdf", 
            created: "2017-11-08T11:26:14.162+0000", 
            createdBy: {…}, 
            relatedContent: true, 
            …}

The `id` property corresponds to the `contentId` property used in many of the other methods of this service.

#### getTaskRelatedContent(taskId: string): Observable`<any>`

Get related content items for passed in Task Instance ID, only metadata for related content is returned:

```ts
const taskId = '15303';
this.contentService.getTaskRelatedContent(taskId).subscribe(
   res  => {
     console.log('Response: ', res);
   }, error => {
     console.log('Error: ', error);
   });
```

The response format is the same as for the `getProcessRelatedContent` method, see its docs.

## Details

## Importing

```ts
import { RelatedContentRepresentation } from '@alfresco/js-api';
import { ProcessContentService } from '@alfresco/adf-core';

export class SomePageComponent implements OnInit {

  constructor(private contentService: ProcessContentService) {
  }
```
