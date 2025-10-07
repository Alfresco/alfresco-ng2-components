---
Title: Content Type Dialog component
Added: v2.0.0
Status: Active
Last reviewed: 2021-01-20
---

# [Content Type Dialog component](../../../lib/content-services/src/lib/content-type/content-type-dialog.component.ts "Defined in content-type-dialog.component.ts")

Confirm dialog when user changes content type of a node.

## Details

The [Content Type Dialog component](content-type-dialog.component.md) works as a dialog showing a confirm message when the user changes the content type of a node. It is showing the properties of the new content type selected.

### Showing the dialog

Unlike most components, the [Content Type Dialog component](content-type-dialog.component.md) is typically shown in a dialog box
rather than the main page and you are responsible for opening the dialog yourself. You can use the
[Angular Material Dialog](https://material.angular.io/components/dialog/overview) for this,
as shown in the usage example. ADF provides the [`ContentTypeDialogComponentData`](../../../lib/content-services/src/lib/content-type/content-type-metadata.interface.ts) interface
to work with the Dialog's
[data option](https://material.angular.io/components/dialog/overview#sharing-data-with-the-dialog-component-):

```ts
export interface ContentTypeDialogComponentData {
    title: string;
    description: string;
    confirmMessage: string;
    select: Subject<boolean>;
    nodeType?: string;
}
```

The properties are described in the table below:

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` | "" | Dialog title |
| description | `string` | "" | Text to appear as description under the dialog title |
| confirmMessage | `string` | "" | Text that will be showed on the top of properties list accordion |
| select | [`Subject<Node>`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) |  | Event emitted when apply button is clicked |
| nodeType | `string` | "" | current prefixed name of the content type selected |

If you don't want to manage the dialog yourself then it is easier to use the
methods of the Content Type [`Property`](../../../lib/content-services/src/lib/content-metadata/interfaces/property.interface.ts) Service, which create
the dialog for you.

### Usage example

```ts
import { MatDialog } from '@angular/material/dialog';
import { AspectListDialogComponentData, AspectListDialogComponent} from '@adf/content-services'
import { Subject } from 'rxjs/Subject';
 ...
constructor(dialog: MatDialog ... ) {}
openSelectorDialog() {
    const data: ContentTypeDialogComponentData = {
        title: 'CORE.METADATA.CONTENT_TYPE.DIALOG.TITLE',
        description: 'CORE.METADATA.CONTENT_TYPE.DIALOG.DESCRIPTION',
        confirmMessage: 'CORE.METADATA.CONTENT_TYPE.DIALOG.CONFIRM',
        select: select,
        nodeType
    };
    this.dialog.open(
        ContentTypeDialogComponent,
        {
            data, panelClass: 'adf-content-type-dialog',
            width: '630px'
        }
    );
    data.select.subscribe((selections: Node[]) => {
        // Use or store selection...
    }, 
    (error)=>{
        //your error handling
    }, 
    ()=>{
        //action called when an action or cancel is clicked on the dialog
        this.dialog.closeAll();
    });
}
```

All the results will be streamed to the select [subject](http://reactivex.io/rxjs/manual/overview.html#subject) present in the [`ContentTypeDialogData`](../../../lib/content-services/src/lib/content-type/content-type-metadata.interface.ts) object passed to the dialog.
When the dialog action is selected by clicking, the `data.select` stream will be completed.
