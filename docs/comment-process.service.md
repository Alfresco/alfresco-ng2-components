# Comment Process service

Adds and retrieves comments for task and process instances in Process Services.

## Methods

`addTaskComment(taskId: string, message: string): Observable<CommentProcessModel>`<br/>
Adds a comment to a task.

`getTaskComments(taskId: string): Observable<CommentProcessModel[]>`<br/>
Gets all comments that have been added to a task.

`addProcessInstanceComment(processInstanceId: string, message: string): Observable<CommentProcessModel>`<br/>
Adds a comment to a process instance.

`getProcessInstanceComments(processInstanceId: string): Observable<CommentProcessModel[]>`<br/>
Gets all comments that have been added to a process instance.

## Details

See the [Comment Process model](comment-process.model.md) for more information about the
comments returned by the methods of this service. Also, the Comments API section of the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api)
has further details about the underlying REST API.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Comment process model](comment-process.model.md)
<!-- seealso end -->



