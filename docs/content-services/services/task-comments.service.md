---
Title: Task Comments service
Added: v6.0.0
Status: Active
Last reviewed: 2022-12-19
---

# [Task Comments service](../../../lib/process-services/src/lib/task-comments/services/task-comments.service.ts "Defined in task-comments.service.ts")

Adds and retrieves comments for task and process instances in Process Services.

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
-   **getUserImage**(user: [`UserProcessModel`](../../core/models/user-process.model.md)): `string`<br/>

    -   _user:_ [`UserProcessModel`](../../core/models/user-process.model.md)  - 
    -   **Returns** `string` -

## See also

-   [Task comments component](../../../lib/process-services/src/lib/task-comments/task-comments.component.ts)
