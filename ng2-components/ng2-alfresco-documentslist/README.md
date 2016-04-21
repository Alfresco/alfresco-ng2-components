# Alfresco Components for Angular 2

Components included:

* Document List Component
* Hello World component
* Alfresco Service

### Document List Component

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
