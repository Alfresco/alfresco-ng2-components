---
Title: People Process service
Added: v2.0.0
Status: Active
Last reviewed: 2024-05-14
---

# People Process Service

Gets information about Process Services users.

## API

-   **getCurrentUserInfo**(): `Observable<UserRepresentation>`<br/>
    Gets information about the current user.
    -   **Returns** `Observable<UserRepresentation>` - User information object
-   **getCurrentUserProfileImage**(): `string`<br/>
    Gets the current user's profile image as a URL.
    -   **Returns** `string` - URL string
-   **getUserImage**(userId: string): `string`<br/>
    Gets a user's profile image as a URL.
    -   _userId:_ `string`  - User ID
    -   **Returns** `string` - URL string
-   **getWorkflowGroups**(filter: `string`, groupId?: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupModel`](../../../lib/core/src/lib/form/components/widgets/core/group.model.ts)`[]>`<br/>
    Gets a list of groups in a workflow.
    -   _filter:_ `string`  - Filter to select specific groups
    -   _groupId:_ `string`  - (Optional) Group ID for the search
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`GroupModel`](../../../lib/core/src/lib/form/components/widgets/core/group.model.ts)`[]>` - Array of groups
-   **getWorkflowUsers**(taskId?: `string`, searchWord?: `string`, groupId?: `string`): `Observable<LightUserRepresentation[]>`<br/>
    Gets information about users across all tasks.
    -   _taskId:_ `string`  - (Optional) ID of the task
    -   _searchWord:_ `string`  - (Optional) Filter text to search for
    -   _groupId:_ `string`  - (Optional)
    -   **Returns** `Observable<LightUserRepresentation[]>` - Array of user information objects
-   **involveUserWithTask**(taskId: `string`, idToInvolve: `string`): `Observable<LightUserRepresentation[]>`<br/>
    Sets a user to be involved with a task.
    -   _taskId:_ `string`  - ID of the target task
    -   _idToInvolve:_ `string`  - ID of the user to involve
    -   **Returns** `Observable<LightUserRepresentation>` - Empty response when the update completes
-   **removeInvolvedUser**(taskId: `string`, idToRemove: `string`): `Observable<LightUserRepresentation[]>`<br/>
    Removes a user who is currently involved with a task.
    -   _taskId:_ `string`  - ID of the target task
    -   _idToRemove:_ `string`  - ID of the user to remove
    -   **Returns** `Observable<LightUserRepresentation>` - Empty response when the update completes

## See also

-   [People content service](people-content.service.md)
