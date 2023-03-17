---
Title: Comment Process service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-14
---

# [Comment Process service](../../../lib/process-services/src/lib/process-comments/services/comment-process.service.ts "Defined in comment-process.service.ts")

Adds and retrieves comments for task and process instances in Process Services.

## Class members

### Methods

-   **add**(id: `string`, message: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`>`<br/>
    Adds a comment to a process instance.
    -   _id:_ `string`  - 
    -   _message:_ `string`  - Text for the comment
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`>` - Details of the comment added
-   **get**(id: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`[]>`<br/>
    Gets all comments that have been added to a process instance.
    -   _id:_ `string`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`[]>` - Details for each comment
-   **getUserImage**(user: `any`): `string`<br/>

    -   _user:_ `any`  - 
    -   **Returns** `string` -

## Details

See the Comments API section of the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api)
for further details about the underlying REST API.
