---
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-12
---

# Comment Content service

Adds and retrieves comments for nodes in Content Services.

## Class members

### Methods

-   `addNodeComment(nodeId: string = null, message: string = null): Observable<CommentModel>`<br/>

    -   `nodeId: string = null` -  
    -   `message: string = null` -  
    -   **Returns** `Observable<CommentModel>` - 

-   `getNodeComments(nodeId: string = null): Observable<CommentModel[]>`<br/>

    -   `nodeId: string = null` -  
    -   **Returns** `Observable<CommentModel[]>` -

## Details

See the Comments API section of the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/CommentsApi.md#addComment)
for more information about the underlying REST API.

## See also

-   [Comment process service](comment-process.service.md)
