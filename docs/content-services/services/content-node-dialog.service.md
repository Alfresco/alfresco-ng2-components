---
Title: Content Node Dialog service
Added: v2.1.0
Status: Active
Last reviewed: 2018-11-14
---

# [Content Node Dialog service](../../../lib/content-services/src/lib/content-node-selector/content-node-dialog.service.ts "Defined in content-node-dialog.service.ts")

Displays and manages dialogs for selecting content to open, copy or upload.

## Class members

### Methods

*   **close**()<br/>
    Closes the currently open dialog.
*   **getTitleTranslation**(action: `string`, name: `string`): `string`<br/>
    Gets the translation of the dialog title.
    *   *action:* `string`  - Name of the action to display in the dialog title
    *   *name:* `string`  - Name of the item on which the action is being performed
    *   **Returns** `string` - Translated version of the title
*   **openCopyMoveDialog**(action: `string`, contentEntry: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), permission?: `string`, excludeSiteContent?: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a dialog to copy or move an item to a new location.
    *   *action:* `string`  - Name of the action (eg, "Copy" or "Move") to show in the title
    *   *contentEntry:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - Item to be copied or moved
    *   *permission:* `string`  - (Optional) Permission for the operation
    *   *excludeSiteContent:* `string[]`  - (Optional) The site content that should be filtered out
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about files that were copied/moved
*   **openFileBrowseDialogByDefaultLocation**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a file browser at a default myFile location. shows files and folders in the dialog search result.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about the selected file(s)
*   **openFileBrowseDialogByFolderId**(folderNodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a file browser at a chosen folder location. shows files and folders in the dialog search result.
    *   *folderNodeId:* `string`  - ID of the folder to use
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about the selected file(s)
*   **openFileBrowseDialogBySite**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a file browser at a chosen site location. shows files and folders in the dialog search result.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about the selected file(s)
*   **openFolderBrowseDialogByFolderId**(folderNodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a folder browser at a chosen folder location.
    *   *folderNodeId:* `string`  - ID of the folder to use
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about the selected folder(s)
*   **openFolderBrowseDialogBySite**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a folder browser at a chosen site location.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about the selected folder(s)
*   **openLockNodeDialog**(contentEntry: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)): [`Subject`](http://reactivex.io/documentation/subject.html)`<string>`<br/>
    Opens a lock node dialog.
    *   *contentEntry:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) to lock
    *   **Returns** [`Subject`](http://reactivex.io/documentation/subject.html)`<string>` - Error/status message (if any)
*   **openUploadFileDialog**(action: `string`, contentEntry: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md), showFilesInResult: `boolean` = `false`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a dialog to choose a file to upload.
    *   *action:* `string`  - Name of the action to show in the title
    *   *contentEntry:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - Item to upload
    *   *showFilesInResult:* `boolean`  - Show files in dialog search result
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about the chosen file(s)
*   **openUploadFolderDialog**(action: `string`, contentEntry: [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>`<br/>
    Opens a dialog to choose folders to upload.
    *   *action:* `string`  - Name of the action to show in the title
    *   *contentEntry:* [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)  - Item to upload
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md)`[]>` - Information about the chosen folder(s)

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
            .subscribe((selections: MinimalNode[]) => {
                // place your action here on operation success!
            });
}
```

The `openXXXByFolderId` methods let you set the initial folder location of the browser
using a folder ID string. This can be obtained from the `id` property of a
[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md) object (returned from a previous
dialog operation, say) or be set to one of the well-known names "-my-" , "-shared-" or
"-root-".

## See Also

*   [Content node selector panel component](../components/content-node-selector-panel.component.md)
*   [Content node selector component](../components/content-node-selector.component.md)
