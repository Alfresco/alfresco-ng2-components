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

-   **appendNodes**(nodeToAppend: [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts), subNodes: [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]`)<br/>
    Append more child nodes to already expanded parent node
    -   _nodeToAppend:_ [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)  - Expanded parent node
    -   _subNodes:_ [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]`  - List of nodes that will be added as children of expanded node
-   **collapseNode**(nodeToCollapse: [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts))<br/>
    Collapses a node removing all children from it.
    -   _nodeToCollapse:_ [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)  - Node to be collapsed
-   **connect**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]>`<br/>

    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]>` - 

-   **disconnect**()<br/>

-   **expandNode**(nodeToExpand: [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts), subNodes: [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]`)<br/>
    Expands node applying subnodes to it.
    -   _nodeToExpand:_ [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)  - Node to be expanded
    -   _subNodes:_ [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]`  - List of nodes that will be added as children of expanded node
-   **getChildren**(parentNode: [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)): [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]`<br/>
    Gets children of the node
    -   _parentNode:_ [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)  - Parent node
    -   **Returns** [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`[]` - children of parent node
-   **getParentNode**(parentNodeId: `string`): [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`|undefined`<br/>
    Gets parent node of given node. If node with parentNodeId is not found it returns undefined.
    -   _parentNodeId:_ `string`  - Id of a parent node to be found
    -   **Returns** [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`|undefined` - parent node or undefined when not found
-   **getSubNodes**(parentNodeId: `string`, skipCount?: `number`, maxItems?: `number`, name?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TreeResponse`](../../../lib/content-services/src/lib/tree/models/tree-response.interface.ts)`<`[`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`>>`<br/>
    Gets categories as nodes for category tree.
    -   _parentNodeId:_ `string`  - Identifier of a parent category
    -   _skipCount:_ `number`  - (Optional) Number of top categories to skip
    -   _maxItems:_ `number`  - (Optional) Maximum number of subcategories returned from 
    -   _name:_ `string`  - (Optional) Optional parameter which specifies if categories should be filtered out by name or not. If not specified then returns categories without filtering.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TreeResponse`](../../../lib/content-services/src/lib/tree/models/tree-response.interface.ts)`<`[`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)`>>` - 
-   **isEmpty**(): `boolean`<br/>
    Checks if tree is empty
    -   **Returns** `boolean` - boolean
-   **removeNode**(node: [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts))<br/>
    Removes provided node from the tree
    -   _node:_ [`CategoryNode`](../../../lib/content-services/src/lib/category/models/category-node.interface.ts)  - Node to be removed

## Details

[Category tree datasource service](../../content-services/services/category-tree-datasource.service.md) acts as datasource for [tree component](../../content-services/components/tree.component.md) utilizing [category service](../../content-services/services/category.service.md). See the
[Tree component](../../../lib/content-services/src/lib/tree/components/tree.component.ts) and [Tree service](../../../lib/content-services/src/lib/tree/services/tree.service.ts) to get more details on how datasource is used.
