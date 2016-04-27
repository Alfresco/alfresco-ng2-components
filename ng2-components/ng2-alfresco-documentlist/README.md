# Document List Component for Angular 2

## Build

```sh
npm install
npm run build
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

```ts
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
