---
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-12
---

# Custom Resources service

Manages Document List information that is specific to a user.

## Class members

### Methods

-   `getRecentFiles(personId: string, pagination: PaginationModel): Observable<NodePaging>`<br/>
    Gets files recently accessed by a user.
    -   `personId: string` -  ID of the user
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   **Returns** `Observable<NodePaging>` - List of nodes for the recently used files
-   `loadFavorites(pagination: PaginationModel, includeFields: string[] = []): Observable<NodePaging>`<br/>
    Gets favorite files for the current user.
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   `includeFields: string[] = []` -  List of data field names to include in the results
    -   **Returns** `Observable<NodePaging>` - List of favorite files
-   `loadMemberSites(pagination: PaginationModel): Observable<NodePaging>`<br/>
    Gets sites that the current user is a member of.
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   **Returns** `Observable<NodePaging>` - List of sites
-   `loadSites(pagination: PaginationModel): Observable<NodePaging>`<br/>
    Gets all sites in the respository.
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   **Returns** `Observable<NodePaging>` - List of sites
-   `loadTrashcan(pagination: PaginationModel, includeFields: string[] = []): Observable<DeletedNodesPaging>`<br/>
    Gets all items currently in the trash.
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   `includeFields: string[] = []` -  List of data field names to include in the results
    -   **Returns** `Observable<DeletedNodesPaging>` - List of deleted items
-   `loadSharedLinks(pagination: PaginationModel, includeFields: string[] = []): Observable<NodePaging>`<br/>
    Gets shared links for the current user.
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   `includeFields: string[] = []` -  List of data field names to include in the results
    -   **Returns** `Observable<NodePaging>` - List of shared links
-   `isCustomSource(folderId: string): boolean`<br/>
    Is the folder ID one of the well-known aliases?
    -   `FolderId` -  Folder ID name to check
    -   **Returns** `Observable<NodePaging>` - True if the ID is a well-known name, false otherwise
-   `loadFolderByNodeId(nodeId: string, pagination: PaginationModel, includeFields: string[]): Observable<NodePaging>`<br/>
    Gets a folder's contents.
    -   `nodeId: string` -  ID of the target folder node
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   `includeFields: string[] = []` -  List of data field names to include in the results
    -   **Returns** `Observable<NodePaging>` - List of items contained in the folder
-   `getCorrespondingNodeIds(nodeId: string, pagination: PaginationModel): Observable<string[]>`<br/>
    Gets the contents of one of the well-known aliases in the form of node ID strings.
    -   `nodeId: string` -  ID of the target folder node
    -   `pagination: PaginationModel` -  Specifies how to paginate the results
    -   **Returns** `Observable<string[]>` - List of node IDs

## Details

The `includeFields` parameter used by some of the methods lets you specify which data fields
you want in the result objects. See the
[Alfresco JSAPI](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findSharedLinks)
for further details of the returned data and the available fields.

## See also

-   [Document List component](document-list.component.md)
