---
Title: Image Resolver Model
Added: v2.0.0
Status: Active
Last reviewed: 2019-02-08
---

# [Image Resolver Model](../../../lib/content-services/document-list/data/image-resolver.model.ts "Defined in image-resolver.model.ts")

Defines the Image Resolver function used by the [Document List Component](../components/document-list.component.md).

## Definitions

-   `type` **[`ImageResolver`](../../../lib/content-services/src/lib/document-list/data/image-resolver.model.ts)** = (row: [`DataRow`](../../../lib/core/src/lib/datatable/data/data-row.model.ts), column: [`DataColumn`](../../../lib/core/src/lib/datatable/data/data-column.model.ts)) => `string`
    -   _row:_ [`DataRow`](../../../lib/core/src/lib/datatable/data/data-row.model.ts) - Data that defines the row
    -   _column:_ [`DataColumn`](../../../lib/core/src/lib/datatable/data/data-column.model.ts) - Data that defines the column
    -   **Returns** File path for the image

## Details

An image resolver function selects an image file path for an item in
a [Document List Component](../components/document-list.component.md)
or another component that uses the Document List (such as the
[Content Node Selector Panel Component](../components/content-node-selector-panel.component.md)). You can supply your own image resolver 
to manage the way folder/file icons and thumbnails are resolved (ie, which image is shown for which item). 

**Note:** Image resolvers are executed only for columns of the `image` type.

A typical image resolver implementation receives [`DataRow`](../../../lib/core/src/lib/datatable/data/data-row.model.ts) and [`DataColumn`](../../../lib/core/src/lib/datatable/data/data-column.model.ts) objects as parameters:

```ts
myImageResolver(row: DataRow, col: DataColumn): string {
    return '/path/to/image';
}
```

Your function can return `null` or `false` values to fall back to the default image
resolving behavior.

_Note that for the sake of simplicity the example code below was reduced to the main points of interest only._

**View1.component.html**

```html
<adf-document-list 
    [imageResolver]="folderImageResolver">
    
    <data-columns>
        <data-column key="name" type="image"></data-column>
    </data-columns>
    
</adf-document-list>
```

**View1.component.ts**

```ts
import { DataColumn, DataRow } from '@alfresco/adf-core';
import { ImageResolver } from '@alfresco/adf-content-services';

export class View1 {

    folderImageResolver: ImageResolver;
    
    constructor() {
        
        // Customize folder icons, leave file icons untouched
        
        this.folderImageResolver = (row: DataRow, col: DataColumn) => {
            let isFolder = <boolean> row.getValue('isFolder');
            if (isFolder) {
                
                // (optional) You may want dynamically getting the column value
                let name = row.getValue(col.key);
                
                // Format image url
                return `http://<my custom path to folder icon>/${name}`;
            }
            
            // For the rest of the cases just fallback to default behaviour.
            return null;
        };
        
    }

}
```

## See also

-   [Document List Component](../components/document-list.component.md)
-   [Content Node Selector Panel Component](../components/content-node-selector-panel.component.md)
