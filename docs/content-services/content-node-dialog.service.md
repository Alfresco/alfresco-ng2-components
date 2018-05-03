---
Added: v2.1.0
Status: Active
Last reviewed: 2018-05-03
---

# Content Node Dialog service

Displays and manages dialogs for selecting content to open, copy or upload.

## Class members

### Methods

-   `close()`<br/>
    Closes the currently open dialog.
-   `getTitleTranslation(action: string = null, name: string = null): string`<br/>
        Gets the translation of the dialog title.
    -   `action: string = null` -  Name of the action to display in the dialog title
    -   `name: string = null` -  Name of the item on which the action is being performed
    -   **Returns** `string` - Translated version of the title
-   `openCopyMoveDialog(action: string = null, contentEntry: MinimalNodeEntryEntity = null, permission?: string = null): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a dialog to copy or move an item to a new location.
    -   `action: string = null` -  Name of the action (eg, "Copy" or "Move") to show in the title
    -   `contentEntry: MinimalNodeEntryEntity = null` -  Item to be copied or moved
    -   `permission?: string = null` - (Optional) Permission for the operation
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - Information about files that were copied/moved
-   `openFileBrowseDialogByFolderId(folderNodeId: string = null): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a file browser at a chosen folder location.
    -   `folderNodeId: string = null` -  ID of the folder to use
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - Information about the selected file(s)
-   `openFileBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a file browser at a chosen site location.
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - Information about the selected file(s)
-   `openFolderBrowseDialogByFolderId(folderNodeId: string = null): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a folder browser at a chosen folder location.
    -   `folderNodeId: string = null` -  ID of the folder to use
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - Information about the selected folder(s)
-   `openFolderBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a folder browser at a chosen site location.
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - Information about the selected folder(s)
-   `openLockNodeDialog(contentEntry: MinimalNodeEntryEntity = null): Subject<string>`<br/>
    Opens a lock node dialog.
    -   `contentEntry: MinimalNodeEntryEntity = null` -  Node to lock
    -   **Returns** `Subject<string>` - Error/status message (if any)
-   `openUploadFileDialog(action: string = null, contentEntry: MinimalNodeEntryEntity = null): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a dialog to choose a file to upload.
    -   `action: string = null` -  Name of the action to show in the title
    -   `contentEntry: MinimalNodeEntryEntity = null` -  Item to upload
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - Information about the chosen file(s)
-   `openUploadFolderDialog(action: string = null, contentEntry: MinimalNodeEntryEntity = null): Observable<MinimalNodeEntryEntity[]>`<br/>
    Opens a dialog to choose folders to upload.
    -   `action: string = null` -  Name of the action to show in the title
    -   `contentEntry: MinimalNodeEntryEntity = null` -  Item to upload
    -   **Returns** `Observable<MinimalNodeEntryEntity[]>` - Information about the chosed folder(s)

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

## See Also

-   [Content node selector panel component](content-node-selector-panel.component.md)
-   [Content node selector component](content-node-selector.component.md)
