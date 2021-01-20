---
Title: Aspect List Dialog component
Added: v2.0.0
Status: Active
Last reviewed: 2021-01-20
---

# [Aspect List Dialog component](../../../lib/content-services/src/lib/aspect-list/aspect-list-dialog.component.ts "Defined in aspect-list-dialog.component.ts")

Allows a user to choose aspects for a node.

## Details

The [Aspect List Dialog component](aspect-list-dialog.component.md) works as a dialog showing the list of aspects available.
It is possible to filter the aspect showed via the app.config.json.
### Showing the dialog

Unlike most components, the [Aspect List Dialog component](aspect-list-dialog.component.md) is typically shown in a dialog box
rather than the main page and you are responsible for opening the dialog yourself. You can use the
[Angular Material Dialog](https://material.angular.io/components/dialog/overview) for this,
as shown in the usage example. ADF provides the [`AspectListDialogComponentData`](../../../lib/content-services/src/lib/aspect-list/aspect-list-dialog-data.interface.ts) interface
to work with the Dialog's
[data option](https://material.angular.io/components/dialog/overview#sharing-data-with-the-dialog-component-):

```ts
export interface AspectListDialogComponentData {
    title: string;
    description: string;
    overTableMessage: string;
    select: Subject<string[]>;
    nodeId?: string;
}
```

The properties are described in the table below:

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` | "" | Dialog title |
| description | `string` | "" | Text to appear as description under the dialog title |
| overTableMessage | `string` | "" | Text that will be showed on the top of the aspect list table |
| select | [`Subject<Node>`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) |  | Event emitted with the current node selection when the dialog closes |
| nodeId | `string` | "" | Identifier of a node to apply aspects to. |

If you don't want to manage the dialog yourself then it is easier to use the
[Aspect List component](aspect-list.component.md), or the
methods of the [Aspect List service](../services/aspect-list.service.md), which create
the dialog for you.

### Usage example

```ts
import { MatDialog } from '@angular/material/dialog';
import { AspectListDialogComponentData, AspectListDialogComponent} from '@adf/content-services'
import { Subject } from 'rxjs/Subject';
 ...

constructor(dialog: MatDialog ... ) {}

openSelectorDialog() {
    data: AspectListDialogComponentData = {
        title: "Choose an item",
        description: "Choose",
        overTableMessage: "Over Table Message",
        nodeId: currentNodeID,
        select: new Subject<Node[]>()
    };

    this.dialog.open(
        AspectListDialogComponent,
        {
            data, panelClass: 'adf-aspect-list-dialog',
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

All the results will be streamed to the select [subject](http://reactivex.io/rxjs/manual/overview.html#subject) present in the [`AspectListDialogComponentData`](../../../lib/content-services/src/lib/aspect-list/aspect-list-dialog-data.interface.ts) object passed to the dialog.
When the dialog action is selected by clicking, the `data.select` stream will be completed.
## See also

-   [Aspect list component](aspect-list.component.md)
