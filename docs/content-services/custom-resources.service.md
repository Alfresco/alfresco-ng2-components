---
Added: v2.3.0
Status: Active
Last reviewed: 2018-05-03
---

# Custom Resources service

Manages Document List information that is specific to a user.

## Class members

### Methods

-   `getCorrespondingNodeIds(nodeId: string = null, pagination: PaginationModel = null): Observable<string[]>`<br/>
    Gets the contents of one of the well-known aliases in the form of node ID strings.
    -   `nodeId: string = null` -  ID of the target folder node
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   **Returns** `Observable<string[]>` - List of node IDs
-   `getRecentFiles(personId: string = null, pagination: PaginationModel = null): Observable<NodePaging>`<br/>
    Gets files recently accessed by a user.
    -   `personId: string = null` -  ID of the user
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   **Returns** `Observable<NodePaging>` - List of nodes for the recently used files
-   `isCustomSource(folderId: string = null): boolean`<br/>
    Is the folder ID one of the well-known aliases?
    -   `folderId: string = null` -  Folder ID name to check
    -   **Returns** `boolean` - True if the ID is a well-known name, false otherwise
-   `loadFavorites(pagination: PaginationModel = null, includeFields: string[] =  []): Observable<NodePaging>`<br/>
    Gets favorite files for the current user.
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   `includeFields: string[] =  []` -  List of data field names to include in the results
    -   **Returns** `Observable<NodePaging>` - List of favorite files
-   `loadFolderByNodeId(nodeId: string = null, pagination: PaginationModel = null, includeFields: string[] = null): Observable<NodePaging>`<br/>
    Gets a folder's contents.
    -   `nodeId: string = null` -  ID of the target folder node
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   `includeFields: string[] = null` -  List of data field names to include in the results
    -   **Returns** `Observable<NodePaging>` - List of items contained in the folder
-   `loadMemberSites(pagination: PaginationModel = null): Observable<NodePaging>`<br/>
    Gets sites that the current user is a member of.
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   **Returns** `Observable<NodePaging>` - List of sites
-   `loadSharedLinks(pagination: PaginationModel = null, includeFields: string[] =  []): Observable<NodePaging>`<br/>
    Gets shared links for the current user.
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   `includeFields: string[] =  []` -  List of data field names to include in the results
    -   **Returns** `Observable<NodePaging>` - List of shared links
-   `loadSites(pagination: PaginationModel = null): Observable<NodePaging>`<br/>
    Gets all sites in the respository.
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   **Returns** `Observable<NodePaging>` - List of sites
-   `loadTrashcan(pagination: PaginationModel = null, includeFields: string[] =  []): Observable<DeletedNodesPaging>`<br/>
    Gets all items currently in the trash.
    -   `pagination: PaginationModel = null` -  Specifies how to paginate the results
    -   `includeFields: string[] =  []` -  List of data field names to include in the results
    -   **Returns** `Observable<DeletedNodesPaging>` - List of deleted items

## Details

The `includeFields` parameter used by some of the methods lets you specify which data fields
you want in the result objects. See the
[Alfresco JSAPI](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findSharedLinks)
for further details of the returned data and the available fields.

## See also

-   [Document List component](document-list.component.md)
