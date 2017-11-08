# People Process service

Gets information about Process Services users.

## Methods

`getWorkflowUsers(taskId?: string, searchWord?: string): Observable<UserProcessModel[]>`<br/>
Gets information about users across all tasks.

`getUserImage(user: UserProcessModel): string`<br/>
Gets the profile picture URL for the specified user.

`involveUserWithTask(taskId: string, idToInvolve: string): Observable<UserProcessModel[]>`<br/>
Sets a user to be involved with a task.

`removeInvolvedUser(taskId: string, idToRemove: string): Observable<UserProcessModel[]>`<br/>
Removes a user who is currently involved with a task.

## Details

Use `getWorkflowUsers` to find users across all tasks, optionally filtering by the `searchWord`
in the task name. The `taskId` parameter, if used, specifies a task to be *excluded* from the
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


<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [User process model](user-process.model.md)
- [Bpm user model](bpm-user.model.md)
- [People content service](people-content.service.md)
<!-- seealso end -->