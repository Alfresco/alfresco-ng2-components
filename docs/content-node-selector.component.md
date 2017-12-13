# Content Node Selector component

Allows a user to select items from a Content Services repository.

![Content Node Selector screenshot](docassets/images/ContentNodeSelector.png)

## Basic Usage

# Using Content node dialog service - recommended

```ts
import { ContentNodeDialogService } from '@adf/content-services'


constructor(private contentDialogService: ContentNodeDialogService,...)

        this.contentDialogService
            .openCopyMoveDialog(actionName, minimalNode, permission)
            .subscribe((selections: MinimalNodeEntryEntity[]) => {

                ...
            });

```

# Using ContentNodeSelectorComponent

```ts
import { MatDialog } from '@angular/material';
 ...

constructor(dialog: MatDialog ... ) {}

openSelectorDialog() {
    data: ContentNodeSelectorComponentData = {
        title: "Choose an item",
        currentFolderId: someFolderId,
        select: new EventEmitter<MinimalNodeEntryEntity[]>()
    };

    this.dialog.open(
        ContentNodeSelectorComponent,
        {
            data, panelClass: 'adf-content-node-selector-dialog',
            width: '630px'
        }
    );

    data.select.subscribe((selections: MinimalNodeEntryEntity[]) => {
        // Use or store selection...

        this.dialog.closeAll();
    });
}

```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| title | string | "" | Text shown at the top of the selector |
| currentFolderId | string | null | Node ID of the folder currently listed |
| rowFilter | RowFilter | null | Custom row filter function |
| imageResolver | ImageResolver | null | Custom image resolver function |
| pageSize | number | 10 | Number of items shown per page in the list |

### Events

| Name | Description |
| --- | --- |
| select | Emitted when the user has selected an item |

## Details

The Content Node Selector component works a lot like the standard File Open/Save
dialog used by desktop applications except that it chooses items from a Content Services
repository rather than the filesystem. For example, the
[Document List component](document-list.component.md) uses a selector to choose the targets
of Copy/Move actions (see the [Content Action component](content-action.component.md) for
more information).

Unlike most components, the Content Node Selector is typically shown in a dialog box
rather than the main page. You can use the
[Angular Material Dialog](https://material.angular.io/components/dialog/overview) for this,
as shown in the usage example. ADF provides the `ContentNodeSelectorComponentData` interface
to work with the Dialog's
[data option](https://material.angular.io/components/dialog/overview#sharing-data-with-the-dialog-component-):

```ts
interface ContentNodeSelectorComponentData {
    title: string;
    currentFolderId?: string;
    rowFilter?: RowFilter;
    imageResolver?: ImageResolver;
    select: EventEmitter<MinimalNodeEntryEntity[]>;
}
```

### RowFilter and ImageResolver

The Content Node Selector uses a [Document List](document-list.component.md) to display the
items that the user can choose. As with the standard Document List, you can supply a custom
**row filter** function (to hide items that can't be chosen) and a custom **image resolver**
function (to select an image to show in a particular list cell). For example, you could use
a row filter to hide document nodes in a folder selector. See the
[Advanced Usage and Customization](document-list.component.md#advanced-usage-and-customization)
section of the Document List page to learn how these functions are implemented.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Document list component](document-list.component.md)
<!-- seealso end -->