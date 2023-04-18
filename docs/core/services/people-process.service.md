---
Title: People Process service
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# [People Process service](../../../lib/process-services/src/lib/common/services/people-process.service.ts "Defined in people-process.service.ts")

Gets information about Process Services users.

## Class members

### Methods

-   **getCurrentUserInfo**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BpmUserModel`](../../core/models/bpm-user.model.md)`>`<br/>
    Gets information about the current user.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BpmUserModel`](../../core/models/bpm-user.model.md)`>` - User information object
-   **getCurrentUserProfileImage**(): `string`<br/>
    Gets the current user's profile image as a URL.
    -   **Returns** `string` - URL string
-   **getUserImage**(user: [`UserProcessModel`](../../core/models/user-process.model.md)): `string`<br/>
    Gets the profile picture URL for the specified user.
    -   _user:_ [`UserProcessModel`](../../core/models/user-process.model.md)  - The target user
    -   **Returns** `string` - Profile picture URL
-   **getWorkflowGroups**(filter: `string`, groupId?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupModel`](../../../lib/core/src/lib/form/components/widgets/core/group.model.ts)`[]>`<br/>
    Gets a list of groups in a workflow.
    -   _filter:_ `string`  - Filter to select specific groups
    -   _groupId:_ `string`  - (Optional) Group ID for the search
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupModel`](../../../lib/core/src/lib/form/components/widgets/core/group.model.ts)`[]>` - Array of groups
-   **getWorkflowUsers**(taskId?: `string`, searchWord?: `string`, groupId?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserProcessModel`](../../core/models/user-process.model.md)`[]>`<br/>
    Gets information about users across all tasks.
    -   _taskId:_ `string`  - (Optional) ID of the task
    -   _searchWord:_ `string`  - (Optional) Filter text to search for
    -   _groupId:_ `string`  - (Optional)
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserProcessModel`](../../core/models/user-process.model.md)`[]>` - Array of user information objects
-   **involveUserWithTask**(taskId: `string`, idToInvolve: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserProcessModel`](../../core/models/user-process.model.md)`[]>`<br/>
    Sets a user to be involved with a task.
    -   _taskId:_ `string`  - ID of the target task
    -   _idToInvolve:_ `string`  - ID of the user to involve
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserProcessModel`](../../core/models/user-process.model.md)`[]>` - Empty response when the update completes
-   **removeInvolvedUser**(taskId: `string`, idToRemove: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserProcessModel`](../../core/models/user-process.model.md)`[]>`<br/>
    Removes a user who is currently involved with a task.
    -   _taskId:_ `string`  - ID of the target task
    -   _idToRemove:_ `string`  - ID of the user to remove
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserProcessModel`](../../core/models/user-process.model.md)`[]>` - Empty response when the update completes

## Details

Use `getWorkflowUsers` to find users across all tasks, optionally filtering by the `searchWord`
in the task name. The `taskId` parameter, if used, specifies a task to be _excluded_ from the
results. You would typically use this feature to find new users to assign to a task, in which
case you would want to exclude users already assigned to that task.

The [User Process model](../models/user-process.model.md) class used by the methods is seen throughout
ADF's Process Services features. Note that for `involveUserWithTask` and `removeInvolvedUser`,
null data is returned rather than usable details about users.

You can find more information about the REST API methods used by this service in the
[Task Actions API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/TaskActionsApi.md#involveUser)
(for `involveUserWithTask` and `removeInvolvedUser`), the
[User Workflow API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/UsersWorkflowApi.md#getUsers)
(for `getWorkflowUsers`) and the
[User API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/UserApi.md#getuserprofilepictureurl)(for `getUserImage`).

## See also

-   [User process model](../models/user-process.model.md)
-   [Bpm user model](../models/bpm-user.model.md)
-   [People content service](people-content.service.md)
