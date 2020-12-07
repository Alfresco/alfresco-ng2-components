---
Title: Comment Content service
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-12
---

# [Comment Content service](../../../lib/core/services/comment-content.service.ts "Defined in comment-content.service.ts")

Adds and retrieves comments for nodes in Content Services.

## Class members

### Methods

*   **addNodeComment**(nodeId: `string`, message: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>`<br/>
    Adds a comment to a node.
    *   *nodeId:* `string`  - ID of the target node
    *   *message:* `string`  - Text for the comment
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>` - Details of the comment added
*   **getNodeComments**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>`<br/>
    Gets all comments that have been added to a node.
    *   *nodeId:* `string`  - ID of the target node
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>` - Details for each comment

## Details

See the Comments API section of the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/CommentsApi.md#addComment)
for more information about the underlying REST API.

## See also

*   [Comment process service](comment-process.service.md)
