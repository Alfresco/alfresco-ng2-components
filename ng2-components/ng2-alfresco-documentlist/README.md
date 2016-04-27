# Alfresco Components for Angular 2

TODO: basic overview

## Build

```sh
npm install
npm run build
```

## Basic usage

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

### Document actions

```html
<alfresco-document-list ...>
    <document-actions>
        <document-action title="System action" handler="system2"></document-action>
        <document-action title="Custom action" (execute)="myCustomAction1($event)"></document-action>
    </document-actions>
</alfresco-document-list>
```

TODO: more details on declaring and using actions
