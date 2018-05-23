---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Comment Process service

Adds and retrieves comments for task and process instances in Process Services.

## Class members

### Methods

-   **addProcessInstanceComment**(processInstanceId: `string` = `null`, message: `string` = `null`): [`Observable<CommentModel>`](../../lib/core/models/comment.model.ts)<br/>
    Adds a comment to a process instance.
    -   _processInstanceId:_ `string`  - ID of the target process instance
    -   _message:_ `string`  - Text for the comment
    -   **Returns** [`Observable<CommentModel>`](../../lib/core/models/comment.model.ts) - Details of the comment added
-   **addTaskComment**(taskId: `string` = `null`, message: `string` = `null`): [`Observable<CommentModel>`](../../lib/core/models/comment.model.ts)<br/>
    Adds a comment to a task.
    -   _taskId:_ `string`  - ID of the target task
    -   _message:_ `string`  - Text for the comment
    -   **Returns** [`Observable<CommentModel>`](../../lib/core/models/comment.model.ts) - Details about the comment
-   **getProcessInstanceComments**(processInstanceId: `string` = `null`): [`Observable<CommentModel[]>`](../../lib/core/models/comment.model.ts)<br/>
    Gets all comments that have been added to a process instance.
    -   _processInstanceId:_ `string`  - ID of the target process instance
    -   **Returns** [`Observable<CommentModel[]>`](../../lib/core/models/comment.model.ts) - Details for each comment
-   **getTaskComments**(taskId: `string` = `null`): [`Observable<CommentModel[]>`](../../lib/core/models/comment.model.ts)<br/>
    Gets all comments that have been added to a task.
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable<CommentModel[]>`](../../lib/core/models/comment.model.ts) - Details for each comment

## Details

See the [Comment Process model](comment-process.model.md) for more information about the
comments returned by the methods of this service. Also, the Comments API section of the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api)
has further details about the underlying REST API.

## See also

-   [Comment process model](comment-process.model.md)
