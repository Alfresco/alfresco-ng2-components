---
Title: Node Comments Service
Added: v6.0.0
Status: Active
Last reviewed: 2022-12-19
---

# [Node Comments service](../../../lib/content-services/src/lib/node-comments/services/node-comments.service.ts "Defined in node-comments.service.ts")

Adds and retrieves comments for nodes in Content Services.

## Class members

### Methods

-   **add**(id: `string`, message: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`>`<br/>
    Adds a comment to a task.
    -   _id:_ `string`  - ID of the target task
    -   _message:_ `string`  - Text for the comment
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`>` - Details about the comment
-   **get**(id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`[]>`<br/>
    Gets all comments that have been added to a task.
    -   _id:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`[]>` - Details for each comment
-   **getUserImage**(avatarId: `string`): `string`<br/>

    -   _avatarId:_ `string`  - 
    -   **Returns** `string` -

## See also

-   [Node comments component](../../../lib/content-services/src/lib/node-comments/node-comments.component.ts)
