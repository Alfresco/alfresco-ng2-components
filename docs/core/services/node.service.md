---
Title: Node Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Node Service](../../../lib/core/form/services/node.service.ts "Defined in node.service.ts")

Gets Alfresco Repository node metadata and creates nodes with metadata. 

## Class members

### Methods

-   **createNode**(name: `string`, nodeType: `string`, properties: `any`, path: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Create a new Node from form metadata
    -   _name:_ `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) name
    -   _nodeType:_ `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) type
    -   _properties:_ `any`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) body properties
    -   _path:_ `string`  - Path to the node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - The created node
-   **createNodeMetadata**(nodeType: `string`, nameSpace: `any`, data: `any`, path: `string`, name?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Create a new Node from form metadata.
    -   _nodeType:_ `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) type
    -   _nameSpace:_ `any`  - Namespace for properties
    -   _data:_ `any`  - [Property](../../../lib/content-services/content-metadata/interfaces/property.interface.ts) data to store in the node under namespace
    -   _path:_ `string`  - Path to the node
    -   _name:_ `string`  - (Optional) [Node](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) name
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - The created node
-   **getNodeMetadata**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeMetadata`](../../../lib/core/form/models/node-metadata.model.ts)`>`<br/>
    Get the metadata and the nodeType for a nodeId cleaned by the prefix.
    -   _nodeId:_ `string`  - ID of the target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeMetadata`](../../../lib/core/form/models/node-metadata.model.ts)`>` - Node metadata

## Details

Note that this service cannot be used to create nodes with content.

The `path` parameter to `createNode` and `createNodeMetadata` specifies an intermediate
path of folders to create between the root and the target node.

### Importing

```ts
import { NodeService } from '@alfresco/adf-core';

export class SomePageComponent implements OnInit {

  constructor(private nodeService: NodeService) {
  }
```

## See also

-   [Nodes api service](nodes-api.service.md)
-   [Deleted nodes api service](deleted-nodes-api.service.md)
