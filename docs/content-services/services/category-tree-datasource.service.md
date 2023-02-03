---
Title: Category tree datasource service
Added: v6.0.0.0
Status: Active
Last reviewed: 2023-01-25
---

# [Category tree datasource service](../../../lib/content-services/src/lib/category/services/category-tree-datasource.service.ts "Defined in category-tree-datasource.service.ts")

Datasource service for category tree.

## Class members

### Methods

-   **getSubNodes**(parentNodeId: `string`, skipCount?: `number`, maxItems?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TreeResponse<CategoryNode>`](../../../lib/content-services/src/lib/tree/models/tree-response.interface.ts)`>`<br/>
    Gets categories as nodes for category tree.
    -   _parentNodeId:_ `string`  - Identifier of a parent category
    -   _skipCount:_ `number`  - Number of top categories to skip
    -   _maxItems:_ `number`  - Maximum number of subcategories returned from Observable
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TreeResponse<CategoryNode>`](../../../lib/content-services/src/lib/tree/models/tree-response.interface.ts)`>` - TreeResponse object containing pagination object and list on nodes

## Details

Category tree datasource service acts as datasource for tree component utilizing category service. See the
[Tree component](../../../lib/content-services/src/lib/tree/components/tree.component.ts) and [Tree service](../../../lib/content-services/src/lib/tree/services/tree.service.ts) to get more details on how datasource is used.
