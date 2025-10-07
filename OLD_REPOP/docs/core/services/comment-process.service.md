---
Title: Comment Process service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-14
---

# Comment Process Service

Adds and retrieves comments for task and process instances in Process Services.

## API

-   **add**(id: `string`, message: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`>`<br/>
    Adds a comment to a process instance.
    -   _id:_ `string`  - 
    -   _message:_ `string`  - Text for the comment
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`>` - Details of the comment added
-   **get**(id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`[]>`<br/>
    Gets all comments that have been added to a process instance.
    -   _id:_ `string`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`[]>` - Details for each comment
-   **getUserImage**(userId: `string`): `string`<br/>
    Gets the URL for the user image.
    -   _userId:_ `string`  - 
    -   **Returns** `string` - URL for the user image
