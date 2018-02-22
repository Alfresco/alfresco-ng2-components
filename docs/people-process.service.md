---
Added: v2.0.0
Status: Active
---
# People Process service

Gets information about Process Services users.

## Methods

-   `getWorkflowUsers(taskId?: string, searchWord?: string): Observable<UserProcessModel[]>`  
    Gets information about users across all tasks.  
    -   `taskId` - (Optional) ID of the task
    -   `searchWord` - (Optional) Filter text to search for
-   `getUserImage(user: UserProcessModel): string`  
    Gets the profile picture URL for the specified user.  
    -   `user` - The target user
-   `involveUserWithTask(taskId: string, idToInvolve: string): Observable<UserProcessModel[]>`  
    Sets a user to be involved with a task.  
    -   `taskId` - ID of the target task
    -   `idToInvolve` - ID of the user to involve
-   `removeInvolvedUser(taskId: string, idToRemove: string): Observable<UserProcessModel[]>`  
    Removes a user who is currently involved with a task.  
    -   `taskId` - ID of the target task
    -   `idToRemove` - ID of the user to remove

## Details

Use `getWorkflowUsers` to find users across all tasks, optionally filtering by the `searchWord`
in the task name. The `taskId` parameter, if used, specifies a task to be _excluded_ from the
results. You would typically use this feature to find new users to assign to a task, in which
case you would want to exclude users already assigned to that task.

The [User Process model](user-process.model.md) class used by the methods is seen throughout
ADF's Process Services features. Note that for `involveUserWithTask` and `removeInvolvedUser`,
null data is returned rather than usable details about users.

You can find more information about the REST API methods used by this service in the
[Task Actions API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/TaskActionsApi.md#involveUser)
(for `involveUserWithTask` and `removeInvolvedUser`), the
[User Workflow API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/UsersWorkflowApi.md#getUsers)
(for `getWorkflowUsers`) and the
[User API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/UserApi.md#getuserprofilepictureurl)(for `getUserImage`).

## See also

-   [User process model](user-process.model.md)
-   [Bpm user model](bpm-user.model.md)
-   [People content service](people-content.service.md)
