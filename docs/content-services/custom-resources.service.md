---
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-12
---

# Custom Resources service

Manages Document List information that is specific to a user.

## Class members

### Methods

-   `getCorrespondingNodeIds(nodeId: string = null, pagination: PaginationModel = null): Observable<string[]>`<br/>

    -   `nodeId: string = null` -  
    -   `pagination: PaginationModel = null` -  
    -   **Returns** `Observable<string[]>` - 

-   `getRecentFiles(personId: string = null, pagination: PaginationModel = null): Observable<NodePaging>`<br/>

    -   `personId: string = null` -  
    -   `pagination: PaginationModel = null` -  
    -   **Returns** `Observable<NodePaging>` - 

-   `isCustomSource(folderId: string = null): boolean`<br/>

    -   `folderId: string = null` -  
    -   **Returns** `boolean` - 

-   `loadFavorites(pagination: PaginationModel = null, includeFields: string[] =  []): Observable<NodePaging>`<br/>

    -   `pagination: PaginationModel = null` -  
    -   `includeFields: string[] =  []` -  
    -   **Returns** `Observable<NodePaging>` - 

-   `loadFolderByNodeId(nodeId: string = null, pagination: PaginationModel = null, includeFields: string[] = null): Observable<NodePaging>`<br/>

    -   `nodeId: string = null` -  
    -   `pagination: PaginationModel = null` -  
    -   `includeFields: string[] = null` -  
    -   **Returns** `Observable<NodePaging>` - 

-   `loadMemberSites(pagination: PaginationModel = null): Observable<NodePaging>`<br/>

    -   `pagination: PaginationModel = null` -  
    -   **Returns** `Observable<NodePaging>` - 

-   `loadSharedLinks(pagination: PaginationModel = null, includeFields: string[] =  []): Observable<NodePaging>`<br/>

    -   `pagination: PaginationModel = null` -  
    -   `includeFields: string[] =  []` -  
    -   **Returns** `Observable<NodePaging>` - 

-   `loadSites(pagination: PaginationModel = null): Observable<NodePaging>`<br/>

    -   `pagination: PaginationModel = null` -  
    -   **Returns** `Observable<NodePaging>` - 

-   `loadTrashcan(pagination: PaginationModel = null, includeFields: string[] =  []): Observable<DeletedNodesPaging>`<br/>

    -   `pagination: PaginationModel = null` -  
    -   `includeFields: string[] =  []` -  
    -   **Returns** `Observable<DeletedNodesPaging>` -

## Details

The `includeFields` parameter used by some of the methods lets you specify which data fields
you want in the result objects. See the
[Alfresco JSAPI](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findSharedLinks)
for further details of the returned data and the available fields.

## See also

-   [Document List component](document-list.component.md)
