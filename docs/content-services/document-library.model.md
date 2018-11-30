---
Title: Document Library model
Added: v2.0.0
Status: Active
---

# [Document Library model](../../lib/content-services/document-list/models/document-library.model.ts "Defined in document-library.model.ts")

Defines classes for use with the Content Services node API.

## Details

ADF provides several services that give higher-level access to
underlying [Alfresco JS Api](../core/alfresco-api.service.md) functionality.
The classes defined below are used in some of these services to access
the Content Services nodes API. You can use these services to access
the nodes (ie, documents and folders) of a repository using their
associated ID strings. See [Nodes Api service](../core/nodes-api.service.md)
for more detail about the usage of these classes.

## Node information

These classes contain basic information about nodes (see
[Item information](#item-information) below for more detail
about some of the properties). For example, this is used by the
[Document List component](document-list.component.md) to supply
a [data context](document-list.component.md#underlying-node-object)
for each row of the list. The [Nodes Api service](../core/nodes-api.service.md)
has methods for getting the full information for a node ID string.

```ts
class NodeMinimalEntry implements MinimalNodeEntity {
    entry: NodeMinimal;
}

class NodeMinimal implements MinimalNodeEntryEntity {
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
    properties: NodeProperties = {};
}

interface NodeProperties {
    [key: string]: any;
}
```

## Paging

These classes are used to handle a list of nodes, such as the
contents of a folder node. For example, the `node` property of
the [Document List component](document-list.component.md) contains
the node whose contents are currently shown in the document list.

```ts
class NodePaging {
    list: NodePagingList;
}

class NodePagingList {
    pagination: Pagination;
    entries: NodeMinimalEntry[];
}

class Pagination {
    count: number;
    hasMoreItems: boolean;
    totalItems: number;
    skipCount: number;
    maxItems: number;
}
```

## Item information

These classes hold information about specific items related to
a node.

```ts
class UserInfo {
    displayName: string;
    id: string;
}

class ContentInfo {
    mimeType: string;
    mimeTypeName: string;
    sizeInBytes: number;
    encoding: string;
}

class PathInfoEntity {
    elements: PathElementEntity[];
    isComplete: boolean;
    name: string;
}

class PathElementEntity {
    id: string;
    name: string;
}
```

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->

<!-- seealso start -->

## See also

-   [Document list component](document-list.component.md)
-   [Nodes api service](../core/nodes-api.service.md)
    <!-- seealso end -->
