# Node Service
Gets Alfresco Repository node metadata and creates nodes with metadata. 

This service cannot be used to create nodes with content.

## Importing

```ts
import { NodeService } from '@alfresco/adf-core';

export class SomePageComponent implements OnInit {

  constructor(private nodeService: NodeService) {
  }
```

## Methods

#### getNodeMetadata(nodeId: string): Observable`<NodeMetadata>`
Get the metadata and type for passed in node ID (e.g. 3062d73b-fe47-4040-89d2-79efae63869c): 

```ts
// Get the node reference from somewhere...
const nodeId = '3062d73b-fe47-4040-89d2-79efae63869c';

this.nodeService2.getNodeMetadata(nodeId).subscribe(data => {
    const nodeMetadata = data.metadata;
    const nodeType = data.nodeType;

    console.log('nodeMetadata', nodeMetadata);
    console.log('nodeType', nodeType);
  }, error => {
    console.log('Error: ', error);
});
```

The metadata response doesn't include the `cm:auditable` properties (i.e. created, creator, modified, modifier, last access) 
or the name of the node (i.e. `cm:name`). 

The `metadata` response looks like in this example:

```
author: "Martin"
description: "Installation guide for Alfresco 3.3 on Linux"
lastThumbnailModification: "doclib:1505900632400"
title: "Install 3.3 Linux"
versionLabel: "1.0"
versionType: "MAJOR"
```

Note that the properties are missing namespace prefix. The `nodeType` response will be returned with namespace prefix, 
such as `cm:content`.

Executing this method on a folder node returns no metadata, just the type.

#### createNode(name: string, nodeType: string, properties: any, path: string): Observable`<any>`
Creates a node in the Alfresco Repository with passed in `name`, `nodeType`, and metadata `properties`.
It will be created in the folder `path` that is passed in. 

```ts
const nodePath = '/Guest Home';
const nodeName = 'someFolder';
const nodeType = 'cm:folder';
const properties = {
  'cm:title': 'Some title',
  'cm:description': 'Some description'
};
this.nodeService2.createNode(nodeName, nodeType, properties, nodePath).subscribe(nodeInfo => {
    console.log('New Node info: ', nodeInfo);
  }, error => {
  console.log('Error: ', error);
});
```
Note that the `path` property should not include the **/Company Home** bit.

The response includes all metadata about the new node:

```
entry: 
    aspectNames: (2) ["cm:titled", "cm:auditable"]
    createdAt: Mon Nov 06 2017 13:04:49 GMT+0000 (GMT) {}
    createdByUser: {id: "admin@app.activiti.com", displayName: "ADF User"}
    id: "1ab71bb1-d67f-4147-95f6-b5801830ca08"
    isFile: false
    isFolder: true
    modifiedAt: Mon Nov 06 2017 13:04:49 GMT+0000 (GMT) {}
    modifiedByUser: {id: "admin@app.activiti.com", displayName: "ADF User"}
    name: "someFolder"
    nodeType: "cm:folder"
    parentId: "a29b5fe3-81f6-46a7-9bed-6a53620acb32"
    properties: {cm:title: "Some title", cm:description: "Some description"}
```

#### createNodeMetadata(nodeType: string, nameSpace: any, data: any, path: string, name?: string): Observable`<any>`
This is a convenience method if your property list is missing namespace prefix for property names. 
The namespace prefix can then be supplied separately and this method will prepend it automatically.
This method calls the `createNode` method internally: 

```ts
const nodePath = '/Guest Home';
const nodeName = 'someOtherFolder';
const nodeType = 'cm:folder';
const propNamespacePrefix = 'cm';
const properties = {
  'title': 'Some title',
  'description': 'Some description'
};
this.nodeService2.createNodeMetadata(nodeType, propNamespacePrefix, properties, nodePath, nodeName).subscribe(nodeInfo => {
    console.log('New Node info: ', nodeInfo);
  }, error => {
  console.log('Error: ', error);
});
```

See the `createNode` method for information about the response object.
 
<!-- seealso start -->
## See also

- [Nodes api service](nodes-api.service.md)
- [Deleted nodes api service](deleted-nodes-api.service.md)
<!-- seealso end -->