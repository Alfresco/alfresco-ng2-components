---
Added: v2.3.0
Status: Active
Last reviewed: 2018-05-03
---

# Custom Resources service

Manages Document List information that is specific to a user.

## Class members

### Methods

-   **getCorrespondingNodeIds**(nodeId: `string`, pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>`<br/>
    Gets the contents of one of the well-known aliases in the form of node ID strings.
    -   _nodeId:_ `string`  - ID of the target folder node
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string[]>` - List of node IDs
-   **getRecentFiles**(personId: `string`, pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets files recently accessed by a user.
    -   _personId:_ `string`  - ID of the user
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of nodes for the recently used files
-   **isCustomSource**(folderId: `string`): `boolean`<br/>
    Is the folder ID one of the well-known aliases?
    -   _folderId:_ `string`  - Folder ID name to check
    -   **Returns** `boolean` - True if the ID is a well-known name, false otherwise
-   **loadFavorites**(pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts), includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets favorite files for the current user.
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   _includeFields:_ `string[]`  - List of data field names to include in the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of favorite files
-   **loadFolderByNodeId**(nodeId: `string`, pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts), includeFields: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets a folder's contents.
    -   _nodeId:_ `string`  - ID of the target folder node
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   _includeFields:_ `string[]`  - List of data field names to include in the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of items contained in the folder
-   **loadMemberSites**(pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets sites that the current user is a member of.
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of sites
-   **loadSharedLinks**(pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts), includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets shared links for the current user.
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   _includeFields:_ `string[]`  - List of data field names to include in the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of shared links
-   **loadSites**(pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>`<br/>
    Gets all sites in the respository.
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` - List of sites
-   **loadTrashcan**(pagination: [`PaginationModel`](../../lib/core/models/pagination.model.ts), includeFields: `string[]` = `[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DeletedNodesPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/DeletedNodesPaging.md)`>`<br/>
    Gets all items currently in the trash.
    -   _pagination:_ [`PaginationModel`](../../lib/core/models/pagination.model.ts)  - Specifies how to paginate the results
    -   _includeFields:_ `string[]`  - List of data field names to include in the results
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`DeletedNodesPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/DeletedNodesPaging.md)`>` - List of deleted items

## Details

The `includeFields` parameter used by some of the methods lets you specify which data fields
you want in the result objects. See the
[Alfresco JSAPI](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findSharedLinks)
for further details of the returned data and the available fields.

## See also

-   [Document List component](document-list.component.md)
