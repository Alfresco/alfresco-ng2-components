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

- **get**(id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>`<br/>
    Gets all comments that have been added to a task.
  - _id:_ `string`  - ID of the target task
  - **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>` - Details for each comment
- **add**(id: `string`, message: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>`<br/>
    Adds a comment to a process instance.
  - _id:_ `string`  - ID of the target task
  - _message:_ `string`  - Text for the comment
  - **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>` - Details of the comment added

## See also

- [Task comments component](../../../lib/process-services/src/lib/task-comments/task-comments.component.ts)
