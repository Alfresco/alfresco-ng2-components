---
Title: Comment Process service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-14
---

# [Comment Process service](../../../lib/core/services/comment-process.service.ts "Defined in comment-process.service.ts")

Adds and retrieves comments for task and process instances in Process Services.

## Class members

### Methods

*   **addProcessInstanceComment**(processInstanceId: `string`, message: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>`<br/>
    Adds a comment to a process instance.
    *   *processInstanceId:* `string`  - ID of the target process instance
    *   *message:* `string`  - Text for the comment
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>` - Details of the comment added
*   **addTaskComment**(taskId: `string`, message: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>`<br/>
    Adds a comment to a task.
    *   *taskId:* `string`  - ID of the target task
    *   *message:* `string`  - Text for the comment
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`>` - Details about the comment
*   **getProcessInstanceComments**(processInstanceId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>`<br/>
    Gets all comments that have been added to a process instance.
    *   *processInstanceId:* `string`  - ID of the target process instance
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>` - Details for each comment
*   **getTaskComments**(taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>`<br/>
    Gets all comments that have been added to a task.
    *   *taskId:* `string`  - ID of the target task
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/models/comment.model.ts)`[]>` - Details for each comment

## Details

See the Comments API section of the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api)
for further details about the underlying REST API.
