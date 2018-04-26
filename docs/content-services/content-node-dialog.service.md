---
Added: v2.1.0
Status: Active
Last reviewed: 2018-03-13
---

# Content Node Dialog service

Displays and manages dialogs for selecting content to open, copy or upload.

## Class members

### Methods

-   `close()`<br/>
    Closes the currently open dialog.

    -   `getTitleTranslation(action: string = null, name: string = null): string`<br/>

    -   `action: string = null` -  
    -   `name: string = null` -  Name of the item on which the action is being performed
    -   **Returns** `string` - 

-   `openCopyMoveDialog(action: string = null, contentEntry: MinimalNodeEntryEntity = null, permission?: string = null): Observable<MinimalNodeEntryEntity[]>`<br/>

    -   `action: string = null` -  
    -   `contentEntry: MinimalNodeEntryEntity = null` -  
    -   `permission?: string = null` - (Optional) Permission for the operation
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - 

-   `openFileBrowseDialogByFolderId(folderNodeId: string = null): Observable<MinimalNodeEntryEntity[]>`<br/>

    -   `folderNodeId: string = null` -  ID of the folder to use
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - 

-   `openFileBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a file browser at a chosen site location.
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - 
-   `openFolderBrowseDialogByFolderId(folderNodeId: string = null): Observable<MinimalNodeEntryEntity[]>`<br/>

    -   `folderNodeId: string = null` -  ID of the folder to use
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - 

-   `openFolderBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a folder browser at a chosen site location.
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - 
-   `openLockNodeDialog(contentEntry: MinimalNodeEntryEntity = null): Subject<string>`<br/>
    Opens a lock node dialog
    -   `contentEntry: MinimalNodeEntryEntity = null` -  Node to lock
    -   **Returns** `Subject<string>` - 
-   `openUploadFileDialog(action: string = null, contentEntry: MinimalNodeEntryEntity = null): Observable<MinimalNodeEntryEntity[]>`<br/>

    -   `action: string = null` -  
    -   `contentEntry: MinimalNodeEntryEntity = null` -  Item to upload
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - 

-   `openUploadFolderDialog(action: string = null, contentEntry: MinimalNodeEntryEntity = null): Observable<MinimalNodeEntryEntity[]>`<br/>

    -   `action: string = null` -  
    -   `contentEntry: MinimalNodeEntryEntity = null` -  Item to upload
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - 

## Details

The `openXXX` methods return an 
[Observable](http://reactivex.io/rxjs/manual/overview.html#observable) that you can subscribe
to in order to get the information from the result:

```ts
import { ContentNodeDialogService } from '@adf/content-services'


constructor(private contentDialogService: ContentNodeDialogService){}

yourFunctionOnCopyOrMove(){
        this.contentDialogService
            .openCopyMoveDialog(actionName, targetNode, neededPermissionForAction)
            .subscribe((selections: MinimalNodeEntryEntity[]) => {
                // place your action here on operation success!
            });
}
```

The `openXXXByFolderId` methods let you set the initial folder location of the browser
using a folder ID string. This can be obtained from the `id` property of a
[MinimalNodeEntryEntity](document-library.model.md) object (returned from a previous
dialog operation, say) or be set to one of the well-known names "-my-" , "-shared-" or
"-root-".

The `openCopyMoveDialog` and `openUploadXXX` methods require the following parameters:

| Name | Type | Description |
| ---- | ---- | ----------- |
| action | string | The label for the confirm button of the dialog. |
| contentEntry | [MinimalNodeEntryEntity](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/MinimalNode.md) | The node we want to be copied/moved or uploaded. |
| neededPermissionForAction | string | (`openCopyMoveDialog` only) Permission required to perform the relative action (eg: copy will need the 'update' permission ). |

## See Also

-   [Content node selector panel component](content-node-selector-panel.component.md)
-   [Content node selector component](content-node-selector.component.md)
