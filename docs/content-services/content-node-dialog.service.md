---
Added: v2.1.0
Status: Active
Last reviewed: 2018-03-13
---

# Content Node Dialog service

Displays and manages dialogs for selecting content to open, copy or upload.

## Methods

-   `openLockNodeDialog(nodeEntry: MinimalNodeEntryEntity): Observable<string>`
    Opens a dialog to lock or unlock file
    -   `nodeEntry` - Item to lock or unlock.
-   `openFileBrowseDialogByFolderId(folderNodeId: string): Observable<MinimalNodeEntryEntity[]>`  
    Opens a file browser at a chosen folder location.   
    -   `folderNodeId` - ID of the folder to use 
-   `openFileBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`  
    Opens a file browser at a chosen site location.   

-   `openFolderBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`  
    Opens a folder browser at a chosen site location.   

-   `openFolderBrowseDialogByFolderId(folderNodeId: string): Observable<MinimalNodeEntryEntity[]>`  
    Opens a folder browser at a chosen folder location.   
    -   `folderNodeId` - ID of the folder to use 
-   `openCopyMoveDialog(action: string, contentEntry: MinimalNodeEntryEntity, permission?: string): Observable<MinimalNodeEntryEntity[]>`  
    Opens a dialog to copy or move an item to a new location.   
    -   `action` - Name of the action (eg, "Copy" or "Move") to show in the title 
    -   `contentEntry` - Item to be copied or moved 
    -   `permission` - (Optional) Permission for the operation 
-   `getTitleTranslation(action: string, name: string): string`  
    Gets the translation of the dialog title.   
    -   `action` - Name of the action to display in the dialog title 
    -   `name` - Name of the item on which the action is being performed 
-   `openUploadFolderDialog(action: string, contentEntry: MinimalNodeEntryEntity): Observable<MinimalNodeEntryEntity[]>`  
    Opens a dialog to choose a folder to upload.   
    -   `action` - Name of the action to show in the title 
    -   `contentEntry` - Item to upload 
-   `openUploadFileDialog(action: string, contentEntry: MinimalNodeEntryEntity): Observable<MinimalNodeEntryEntity[]>`  
    Opens a dialog to choose a file to upload.   
    -   `action` - Name of the action to show in the title 
    -   `contentEntry` - Item to upload 
-   `close()`  
    Closes the currently open dialog.   


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
