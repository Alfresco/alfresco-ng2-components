---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Ecm User service

Gets information about a Content Services user.

## Class members

### Methods

-   `getCurrentUserInfo(): any`<br/>
    Gets information about the user who is currently logged-in.
    -   **Returns** `any` - User information as for getUserInfo
-   `getUserInfo(userName: string = null): Observable<EcmUserModel>`<br/>
    Gets information about a user identified by their username.
    -   `userName: string = null` -  Target username
    -   **Returns** `Observable<EcmUserModel>` - User information
-   `getUserProfileImage(avatarId: string = null): string`<br/>
    Returns a profile image as a URL.
    -   `avatarId: string = null` -  Target avatar
    -   **Returns** `string` - Image URL

## Details

The class returned by `getUserInfo` and `getCurrentUserInfo` is detailed
in the [Ecm User model docs](ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the `EcmUserModel` instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson)
method in the Alfresco JS API for more information about the REST calls used by this service.

## See also

-   [Bpm user service](bpm-user.service.md)
-   [Ecm user model](ecm-user.model.md)
