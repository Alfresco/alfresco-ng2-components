---
Title: Row Filter Model
Added: v2.0.0
Status: Active
Last reviewed: 2019-02-08
---

# [Row Filter Model](../../../lib/content-services/document-list/data/row-filter.model.ts "Defined in row-filter.model.ts")

Defines the Row Filter function used by the [Document List Component](../components/document-list.component.md).

## Definitions

-   `type` **[`RowFilter`](../../../lib/content-services/src/lib/document-list/data/row-filter.model.ts)** = (value: [`ShareDataRow`](../../../lib/content-services/src/lib/document-list/data/share-data-row.model.ts), index: `number`, array: [`ShareDataRow`](../../../lib/content-services/src/lib/document-list/data/share-data-row.model.ts)`[]`) => any
    -   _value:_ [`ShareDataRow`](../../../lib/content-services/src/lib/document-list/data/share-data-row.model.ts) - Data that defines the row
    -   _index:_ `number` - Index of the row within the list
    -   _array:_ [`ShareDataRow`](../../../lib/content-services/src/lib/document-list/data/share-data-row.model.ts)`[]` - The full set of rows for the list
    -   **Returns** True if the row should be shown, false otherwise

## Details

A row filter function selectively hides or shows rows from a [Document List Component](../components/document-list.component.md)
or another component that uses the Document List (such as the
[Content Node Selector Panel Component](../components/content-node-selector-panel.component.md)).
You can supply your own row filter to customize the behavior of the list.

The function returns `true` if the row should be
displayed or `false` if it should be hidden.
A typical row filter implementation receives at least a [`ShareDataRow`](../../../lib/content-services/src/lib/document-list/data/share-data-row.model.ts) object as a parameter:

```ts
myFilter(row: ShareDataRow): boolean {
    return true;
}
```

_Note that for the sake of simplicity the example code below was reduced to the main points of interest only._

**View1.component.html**

```html
<adf-document-list 
    [rowFilter]="folderFilter">
</adf-document-list>
```

**View1.component.ts**

```ts
import { RowFilter, ShareDataRow } from '@alfresco/adf-content-services';

export class View1 {

    folderFilter: RowFilter;

    constructor() {
    
        // This filter will make the document list show only folders
        
        this.folderFilter = (row: ShareDataRow) => {
            let node = row.node.entry;
            
            if (node && node.isFolder) {
                return true;
            }
            
            return false;
        };
    }
}
```

## See also

-   [Document List Component](../components/document-list.component.md)
-   [Content Node Selector Panel Component](../components/content-node-selector-panel.component.md)
