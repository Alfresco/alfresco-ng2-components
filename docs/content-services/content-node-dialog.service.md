---
Added: v2.1.0
Status: Active
Last reviewed: 2018-11-14
---

# Content Node Dialog service

Displays and manages dialogs for selecting content to open, copy or upload.

## Class members

### Methods

-   **close**()<br/>
    Closes the currently open dialog.
-   **getTitleTranslation**(action: `string`, name: `string`): `string`<br/>
    Gets the translation of the dialog title.
    -   _action:_ `string`  - Name of the action to display in the dialog title
    -   _name:_ `string`  - Name of the item on which the action is being performed
    -   **Returns** `string` - Translated version of the title
-   **openCopyMoveDialog**(action: `string`, contentEntry: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md), permission?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a dialog to copy or move an item to a new location.
    -   _action:_ `string`  - Name of the action (eg, "Copy" or "Move") to show in the title
    -   _contentEntry:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - Item to be copied or moved
    -   _permission:_ `string`  - (Optional) Permission for the operation
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>` - Information about files that were copied/moved
-   **openFileBrowseDialogByFolderId**(folderNodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a file browser at a chosen folder location.
    -   _folderNodeId:_ `string`  - ID of the folder to use
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>` - Information about the selected file(s)
-   **openFileBrowseDialogBySite**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a file browser at a chosen site location.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>` - Information about the selected file(s)
-   **openFolderBrowseDialogByFolderId**(folderNodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a folder browser at a chosen folder location.
    -   _folderNodeId:_ `string`  - ID of the folder to use
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>` - Information about the selected folder(s)
-   **openFolderBrowseDialogBySite**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a folder browser at a chosen site location.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>` - Information about the selected folder(s)
-   **openLockNodeDialog**(contentEntry: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)): [`Subject`](http://reactivex.io/documentation/subject.html)`<string>`<br/>
    Opens a lock node dialog.
    -   _contentEntry:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - Node to lock
    -   **Returns** [`Subject`](http://reactivex.io/documentation/subject.html)`<string>` - Error/status message (if any)
-   **openUploadFileDialog**(action: `string`, contentEntry: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a dialog to choose a file to upload.
    -   _action:_ `string`  - Name of the action to show in the title
    -   _contentEntry:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - Item to upload
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>` - Information about the chosen file(s)
-   **openUploadFolderDialog**(action: `string`, contentEntry: [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>`<br/>
    Opens a dialog to choose folders to upload.
    -   _action:_ `string`  - Name of the action to show in the title
    -   _contentEntry:_ [`MinimalNodeEntryEntity`](../content-services/document-library.model.md)  - Item to upload
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`[]>` - Information about the chosen folder(s)

## Details

The `openXXX` methods return an 
[`Observable`](http://reactivex.io/documentation/observable.html) that you can subscribe
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
[`MinimalNodeEntryEntity`](../content-services/document-library.model.md) object (returned from a previous
dialog operation, say) or be set to one of the well-known names "-my-" , "-shared-" or
"-root-".

## See Also

-   [Content node selector panel component](content-node-selector-panel.component.md)
-   [Content node selector component](content-node-selector.component.md)
