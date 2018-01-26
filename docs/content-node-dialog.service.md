# Content Node Dialog service

Displays and manages dialogs for selecting content to open, copy or upload.

## Methods

`openFileBrowseDialogByFolderId(folderNodeId: string): Observable<MinimalNodeEntryEntity[]>`<br/>
Opens a file browser at a chosen folder location.

`openFolderBrowseDialogByFolderId(folderNodeId: string): Observable<MinimalNodeEntryEntity[]>`<br/>
Opens a folder browser at a chosen folder location.

`openFileBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`<br/>
Opens a file browser at a chosen site location.

`openFolderBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`<br/>
Opens a folder browser at a chosen site location.

`openCopyMoveDialog(action: string, contentEntry: MinimalNodeEntryEntity, permission?: string): Observable<MinimalNodeEntryEntity[]>`<br/>
Opens a dialog to copy or move an item to a new location.

`openUploadFileDialog(action: string, contentEntry: MinimalNodeEntryEntity): Observable<MinimalNodeEntryEntity[]>`<br/>
Opens a dialog to choose a file to upload.

`openUploadFolderDialog(action: string, contentEntry: MinimalNodeEntryEntity): Observable<MinimalNodeEntryEntity[]>`<br/>
Opens a dialog to choose a folder to upload.

`close()`<br/>
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
