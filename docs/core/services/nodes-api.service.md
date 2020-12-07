---
Title: Nodes Api service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Nodes Api service](../../../lib/core/services/nodes-api.service.ts "Defined in nodes-api.service.ts")

Accesses and manipulates ACS document nodes using their node IDs.

## Contents

*   [Class members](#class-members)
    *   [Methods](#methods)
*   [Details](#details)
    *   [Getting node information](#getting-node-information)
    *   [Getting folder node contents](#getting-folder-node-contents)
    *   [Creating and updating nodes](#creating-and-updating-nodes)
    *   [Deleting and restoring nodes](#deleting-and-restoring-nodes)
*   [See also](#see-also)

## Class members

### Methods

*   **createFolder**(parentNodeId: `string`, nodeBody: `any`, options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`<br/>
    Creates a new folder node inside a parent folder.
    *   *parentNodeId:* `string`  - ID of the parent folder node
    *   *nodeBody:* `any`  - Data for the new folder
    *   *options:* `any`  - Optional parameters supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>` - Details of the new folder
*   **createNode**(parentNodeId: `string`, nodeBody: `any`, options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`<br/>
    Creates a new document node inside a folder.
    *   *parentNodeId:* `string`  - ID of the parent folder node
    *   *nodeBody:* `any`  - Data for the new node
    *   *options:* `any`  - Optional parameters supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>` - Details of the new node
*   **createNodeInsideRoot**(name: `string`, nodeType: `string`, properties: `any`, path: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Create a new Node inside `-root-` folder
    *   *name:* `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) name
    *   *nodeType:* `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) type
    *   *properties:* `any`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) body properties
    *   *path:* `string`  - Path to the node
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - The created node
*   **createNodeMetadata**(nodeType: `string`, nameSpace: `any`, data: `any`, path: `string`, name?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>`<br/>
    Create a new Node from form metadata.
    *   *nodeType:* `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) type
    *   *nameSpace:* `any`  - Namespace for properties
    *   *data:* `any`  - [Property](../../../lib/content-services/src/lib/content-metadata/interfaces/property.interface.ts) data to store in the node under namespace
    *   *path:* `string`  - Path to the node
    *   *name:* `string`  - (Optional) [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) name
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`>` - The created node
*   **deleteNode**(nodeId: `string`, options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Moves a node to the trashcan.
    *   *nodeId:* `string`  - ID of the target node
    *   *options:* `any`  - Optional parameters supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Empty result that notifies when the deletion is complete
*   **getNode**(nodeId: `string`, options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`<br/>
    Gets the stored information about a node.
    *   *nodeId:* `string`  - ID of the target node
    *   *options:* `any`  - Optional parameters supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>` - Node information
*   **getNodeChildren**(nodeId: `string`, options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets the items contained in a folder node.
    *   *nodeId:* `string`  - ID of the target node
    *   *options:* `any`  - Optional parameters supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of child items from the folder
*   **getNodeMetadata**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeMetadata`](../../../lib/core/models/node-metadata.model.ts)`>`<br/>
    Get the metadata and the nodeType for a nodeId cleaned by the prefix.
    *   *nodeId:* `string`  - ID of the target node
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodeMetadata`](../../../lib/core/models/node-metadata.model.ts)`>` - Node metadata
*   **restoreNode**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`<br/>
    Restores a node previously moved to the trashcan.
    *   *nodeId:* `string`  - ID of the node to restore
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>` - Details of the restored node
*   **updateNode**(nodeId: `string`, nodeBody: `any`, options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>`<br/>
    Updates the information about a node.
    *   *nodeId:* `string`  - ID of the target node
    *   *nodeBody:* `any`  - New data for the node
    *   *options:* `any`  - Optional parameters supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)`>` - Updated node information

## Details

Each node (ie, document or folder) in an ACS repository is identified by
its own unique node ID value. The ID is a long string of hex values separated
by dashes, eg:

`53ef6110-ed9c-4739-a520-e7b4336229c0`

The string is convenient for storage, for passing as an
[Angular route parameter](https://angular.io/guide/router)
and other purposes but doesn't enable you to do very much with the node itself.
The [Nodes Api Service](nodes-api.service.md) has methods for getting information about nodes and
managing them within the repository (creating, deleting, etc).

Other lower level interfaces to the ACS nodes API are also available - see the
[Alfresco Api service](alfresco-api.service.md), the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-core-rest-api)
and the
[REST API Explorer](https://api-explorer.alfresco.com/api-explorer/#/nodes)
for more information.

### Getting node information

The `getNode` method gives access to the [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md) object that represents the
details of a node:

```ts
interface MinimalNode extends Node {
   id: string;
   parentId: string;
   name: string;
   nodeType: string;
   isFolder: boolean;
   isFile: boolean;
   modifiedAt: Date;
   modifiedByUser: UserInfo;
   createdAt: Date;
   createdByUser: UserInfo;
   content: ContentInfo;
   path: PathInfoEntity;
   properties: NodeProperties;
}
```

This provides useful information about the node, such as its name, creation and
modification dates, etc. Also, the `id` and `parentId` properties contain the node
ID strings for the current node and its enclosing folder.

Sometimes, a [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md) is provided directly, for example, the `folderNode` property
of a [Document List component](../../content-services/components/document-list.component.md) or the data context of a
[Document List row](../../content-services/components/document-list.component.md#underlying-node-object). In these cases,
you might pass the `id` or `parentId` as a [route parameter](https://angular.io/guide/router)
to a page describing the node in full detail. The component receiving the node ID can
use the [Nodes Api service](nodes-api.service.md) to "decode" the ID string into a [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md):

```ts
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NodesApiService } from '@alfresco/adf-core';
import { MinimalNode } from '@alfresco/js-api';
    ...

export class RepositoryDetailsPageComponent implements OnInit {
 nodeId: string;
 nodeName: string;
 isFile: boolean;
    ...

 constructor(private router: Router,
             private activatedRoute: ActivatedRoute,
             private nodeService: NodesApiService) {
 }

 ngOnInit() {
   this.nodeId = this.activatedRoute.snapshot.params['node-id'];
   this.nodeService.getNode(this.nodeId).subscribe((entry: MinimalNode) => {
     const node: MinimalNode = entry;
     this.nodeName = node.name;
     this.isFile = node.isFile;
        ...
   });
 }
```

You can supply a number of extra options using the `options` parameter. See the
[getNode](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getNode)
page in the Alfresco JS API docs for more information.

### Getting folder node contents

The `getNodeChildren` method returns the contents of a folder
as a list of items. The
[getNodeChildren](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getNodeChildren)
page in the Alfresco JS API gives more information about the structure of the
`options` parameter.

### Creating and updating nodes

You can use the `createNode` and `createFolder` methods to add new nodes
within a parent folder node, and the `updateNode` method to update an
existing node. See the
[addNode](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#addNode)
and
[updateNode](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#updateNode)
entries in the Alfresco JS API for further information about the available options and
the format of the new node data.

### Deleting and restoring nodes

The Content Services repository maintains a "trashcan" where items are
temporarily held after they have been deleted. This means you can
restore a deleted item if you remove it from the trashcan before it
gets deleted permanently.

By default, the `deleteNode` method moves an item into the trash, where it can
be retrieved using `restoreNode`. However, you can set an option for `deleteNode`
to delete the node immediately if you have the right permissions. See the
[deleteNode](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#deleteNode)
and
[restoreNode](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#restoreNode)
pages in the Alfresco JS API for further details and options. Note that you can also use the
[Deleted Nodes Api service](deleted-nodes-api.service.md) get a list of all items currently in the trashcan.

## See also

*   [Deleted nodes api service](deleted-nodes-api.service.md)
*   [Document list component](../../content-services/components/document-list.component.md)
*   [Node service](node.service.md)
