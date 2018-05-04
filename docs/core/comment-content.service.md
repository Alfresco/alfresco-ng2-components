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
    Adds a comment to a node.
    -   `nodeId: string = null` -  ID of the target node
    -   `message: string = null` -  Text for the comment
    -   **Returns** `Observable<CommentModel>` - Details of the comment added
-   `getNodeComments(nodeId: string = null): Observable<CommentModel[]>`<br/>
    Gets all comments that have been added to a node.
    -   `nodeId: string = null` -  ID of the target node
    -   **Returns** `Observable<CommentModel[]>` - Details for each comment

## Details

See the Comments API section of the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/CommentsApi.md#addComment)
for more information about the underlying REST API.

## See also

-   [Comment process service](comment-process.service.md)
