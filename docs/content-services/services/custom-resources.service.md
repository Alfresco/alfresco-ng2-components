---
Title: Custom Resources service
Added: v2.3.0
Status: Active
Last reviewed: 2018-11-16
---

# [Custom Resources service](../../../lib/content-services/src/lib/document-list/services/custom-resources.service.ts "Defined in custom-resources.service.ts")

Manages Document List information that is specific to a user.

## Class members

### Methods

*   **getCorrespondingNodeIds**(nodeId: `string`, pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts) = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets the contents of one of the well-known aliases in the form of node ID strings.
    *   *nodeId:* `string`  - ID of the target folder node
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - List of node IDs
*   **getIdFromEntry**(node: `any`, nodeId: `string`): `string`<br/>
    Chooses the correct ID for a node entry.
    *   *node:* `any`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) object
    *   *nodeId:* `string`  - ID of the node object
    *   **Returns** `string` - ID value
*   **getRecentFiles**(personId: `string`, pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts), filters?: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets files recently accessed by a user.
    *   *personId:* `string`  - ID of the user
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   *filters:* `string[]`  - (Optional) Specifies additional filters to apply (joined with **AND**)
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of nodes for the recently used files
*   **hasCorrespondingNodeIds**(nodeId: `string`): `boolean`<br/>
    Does the well-known alias have a corresponding node ID?
    *   *nodeId:* `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) to check
    *   **Returns** `boolean` - True if the alias has a corresponding node ID, false otherwise
*   **isCustomSource**(folderId: `string`): `boolean`<br/>
    Is the folder ID one of the well-known aliases?
    *   *folderId:* `string`  - Folder ID name to check
    *   **Returns** `boolean` - True if the ID is a well-known name, false otherwise
*   **isSupportedSource**(folderId: `string`): `boolean`<br/>
    Is the folder ID a "-my", "-root-", or "-shared-" alias?
    *   *folderId:* `string`  - Folder ID name to check
    *   **Returns** `boolean` - True if the ID is one of the supported sources, false otherwise
*   **loadFavorites**(pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts), includeFields: `string[]` = `[]`, where?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets favorite files for the current user.
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   *includeFields:* `string[]`  - List of data field names to include in the results
    *   *where:* `string`  - (Optional) A string to restrict the returned objects by using a predicate
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of favorite files
*   **loadFolderByNodeId**(nodeId: `string`, pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts), includeFields: `string[]` = `[]`, where?: `string`): `any`<br/>
    Gets a folder's contents.
    *   *nodeId:* `string`  - ID of the target folder node
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   *includeFields:* `string[]`  - List of data field names to include in the results
    *   *where:* `string`  - (Optional) Filters the [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) list using the *where* condition of the REST API (for example, isFolder=true). See the REST API documentation for more information.
    *   **Returns** `any` - List of items contained in the folder
*   **loadMemberSites**(pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts), where?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberPaging.md)`>`<br/>
    Gets sites that the current user is a member of.
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   *where:* `string`  - (Optional) A string to restrict the returned objects by using a predicate
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberPaging.md)`>` - List of sites
*   **loadSharedLinks**(pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts), includeFields: `string[]` = `[]`, where?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SharedLinkPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SharedLinkPaging.md)`>`<br/>
    Gets shared links for the current user.
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   *includeFields:* `string[]`  - List of data field names to include in the results
    *   *where:* `string`  - (Optional) A string to restrict the returned objects by using a predicate
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SharedLinkPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SharedLinkPaging.md)`>` - List of shared links
*   **loadSites**(pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts), where?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets all sites in the repository.
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   *where:* `string`  - (Optional) A string to restrict the returned objects by using a predicate
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of sites
*   **loadTrashcan**(pagination: [`PaginationModel`](../../../lib/core/models/pagination.model.ts), includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DeletedNodesPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/DeletedNodesPaging.md)`>`<br/>
    Gets all items currently in the trash.
    *   *pagination:* [`PaginationModel`](../../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    *   *includeFields:* `string[]`  - List of data field names to include in the results
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DeletedNodesPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/DeletedNodesPaging.md)`>` - List of deleted items

## Details

The `includeFields` parameter used by some of the methods lets you specify which data fields
you want in the result objects. See the
[Alfresco JSAPI](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findSharedLinks)
for further details of the returned data and the available fields.

## See also

*   [Document List component](../components/document-list.component.md)
