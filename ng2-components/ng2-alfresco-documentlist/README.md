# Document List Component for Angular 2

## Install

```sh
npm install --save <TBD>
```

## Basic usage

```html
<alfresco-document-list
    #list
    [thumbnails]="thumbnails"
    [breadcrumb]="breadcrumb"
    [navigate]="navigation"
    [downloads]="downloads"
    (itemClick)="onItemClick($event)">
</alfresco-document-list>
```

Example of the component that declares document list and provides values for bindings:

```ts
import {Component} from 'angular2/core';
import {
    DOCUMENT_LIST_DIRECTIVES,
    DOCUMENT_LIST_PROVIDERS
} from 'ng2-alfresco-documentlist/ng2-alfresco-documentlist';

@Component({
    selector: 'my-view',
    template: '<YOUR TEMPLATE>',
    directives: [DOCUMENT_LIST_DIRECTIVES],
    providers: [DOCUMENT_LIST_PROVIDERS]
})
export class MyView {
    thumbnails: boolean = true;
    breadcrumb: boolean = false;
    navigation: boolean = true;
    downloads: boolean = true;

    events: any[] = [];

    onItemClick($event) {
        console.log($event.value);
        this.events.push({
            name: 'Item Clicked',
            value: $event.value
        });
    }
}
```

Note the use of ```DOCUMENT_LIST_DIRECTIVES``` barrel that consolidates all the document list related directives together.
It gives you access to ```<document-actions>```, ```<folder-actions>``` and many other directives.
In addition ```DOCUMENT_LIST_PROVIDERS``` exports all primary services and providers needed for component to function.

### Custom columns

It is possible to reorder, extend or completely redefine data columns displayed by the component.
By default special `$thumbnail` and `displayName` columns are rendered.

A custom set of columns can look like the following:

```html
<alfresco-document-list ...>
    <content-columns>
        <content-column source="$thumbnail"></content-column>
        <content-column title="Name" source="displayName" class="full-width name-column"></content-column>
        <content-column title="Created By" source="createdBy"></content-column>
        <content-column title="Created On" source="createdOn"></content-column>
    </content-columns>
</alfresco-document-list>
```

![Custom columns](docs/assets/custom-columns.png)

### Custom folder icon

Document list element exposes `folder-icon` property that accepts a CSS class list value with
[folder_open](https://design.google.com/icons/#ic_folder_open) by default.

![Default folder icon](docs/assets/folder-icon-default.png)

You can provide any list of classes in order to customize look and feel of the icon.
Example below shows the use of [folder_special](https://design.google.com/icons/#ic_folder_special) icon instead of the default one:

```html
<alfresco-document-list folder-icon="folder_special" ...>
</alfresco-document-list>
```

![Custom folder icon](docs/assets/folder-icon-custom.png)

### Actions

Document List supports declarative actions for Documents and Folders.
Each action can be bound to either default out-of-box handler or a custom behavior.
You can define both folder and document actions at the same time.

#### Menu actions

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="document"
            type="menu"
            title="System action"
            handler="system2">
        </content-action>

        <content-action
            target="document"
            type="menu"
            title="Custom action"
            (execute)="myCustomAction1($event)">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

```ts
export class MyView {
    // ...

    myCustomAction1(event) {
        alert('Custom document action for ' + event.value.displayName);
    }
}
```

All document actions with `type="menu"` are rendered as a dropdown menu as on the picture below:

![Document Actions](docs/assets/document-actions.png)


#### Default action handlers

The following action handlers are provided out-of-box:

- Download

All system handler names are case-insensitive, `handler="download"` and `handler="DOWNLOAD"`
will trigger the same `download` action.

##### Download

Initiates download of the corresponding document file.

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="document"
            type="menu"
            title="Download"
            handler="download">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

![Download document action](docs/assets/document-action-download.png)


#### Document action buttons

It is also possible to display most frequent actions within a separate buttons panel:

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="document"
            type="button"
            icon="extension"
            handler="system1">
        </content-action>

        <content-action
            target="document"
            type="button"
            icon="thumb_up"
            handler="system2">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

Button actions provide same support for system and custom handlers.

![Quick document Actions](docs/assets/quick-document-actions.png)

#### Folder actions

Folder actions have the same declaration as document actions except ```taget="folder"``` attribute value.

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="folder"
            type="menu"
            title="Default folder action 1"
            handler="system1">
        </content-action>

        <content-action
            target="folder"
            type="menu"
            title="Custom folder action"
            (execute)="myFolderAction1($event)">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

```ts
export class MyView {
    // ...

    myFolderAction1(event) {
        alert('Custom folder action for ' + event.value.displayName);
    }
}
```

![Folder Actions](docs/assets/folder-actions.png)

#### Folder action buttons

Every folder action is rendered as a separate button.

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="folder"
            type="button"
            icon="delete"
            title="Delete"
            handler="system1">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

![Quick folder Actions](docs/assets/quick-folder-actions.png)

## Advanced usage and customization

### Customizing default actions

It is possible extending or replacing the list of available system actions for documents and folders.
Actions for the documents and folders can be accessed via the following services:

- `DocumentActionsService`, document action menu and quick document actions
- `FolderActionsService`, folder action menu and quick folder actions

Example below demonstrates how a new action handler can be registered with the
`DocumentActionsService`.

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="document"
            type="button"
            icon="account_circle"
            handler="my-handler">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

You register custom handler called `my-handler` that will be executing `myDocumentActionHandler`
function each time upon being invoked.

```ts
import {
    DocumentActionsService
} from 'ng2-alfresco-documentlist/ng2-alfresco-documentlist';

export class MyView {

    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler(
            'my-handler',
            this.myDocumentActionHandler.bind(this)
        );
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }
}
```

![Custom handler 1](docs/assets/custom-doc-handler-1.png)

Upon execution users will see the following dialog:

![Custom handler 2](docs/assets/custom-doc-handler-2.png)

The same approach allows changing the way out-of-box action handlers behave.
Registering custom action with the name `download` replaces default one:

```ts
export class MyView {

    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler(
            'download',
            this.customDownloadBehavior.bind(this)
        );
    }

    customDownloadBehavior(obj: any) {
        window.alert('my custom download behavior');
    }
}
```

Typically you may want populating all your custom actions at the application root level or
by means of custom application service.


## Build from sources

Alternatively you can build component from sources with the following commands:

```sh
npm install
npm run build
```

## Running unit tests

You can run test with the

```sh
npm test
```

or alternatively if you want to enable watchers and live reload:

```sh
npm run test:w
```
