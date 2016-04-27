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
import {DOCUMENT_LIST_DIRECTIVES} from 'ng2-alfresco-documentlist/ng2-alfresco-documentlist';

@Component({
    selector: 'my-view',
    template: '<YOUR TEMPLATE>',
    directives: [DOCUMENT_LIST_DIRECTIVES]
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

### Actions

Document List supports declarative actions for Documents and Folders.
Each action can be bound to either default out-of-box handler or a custom behavior.
You can define both folder and document actions at the same time.

#### Document actions

```html
<alfresco-document-list ...>
    <document-actions>
        <document-action title="System action" handler="system2"></document-action>
        <document-action title="Custom action" (execute)="myCustomAction1($event)"></document-action>
    </document-actions>
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

![Document Actions](docs/assets/document-actions.png)

#### Folder actions

```html
<alfresco-document-list ...>
    <folder-actions>
        <folder-action title="Default folder action 1" handler="system1"></folder-action>
        <folder-action title="Custom folder action" (execute)="myFolderAction1($event)"></folder-action>
    </folder-actions>
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

## Build from sources

```sh
npm install
npm run build
```
