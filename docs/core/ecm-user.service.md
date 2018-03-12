---
Added: v2.0.0
Status: Active
---
# Ecm User service

Gets information about a Content Services user.

## Methods

-   `getUserInfo(userName: string): Observable<EcmUserModel>`  
    Gets information about a user identified by their username.  
    -   `userName` - Target username
-   `getCurrentUserInfo(): Observable<EcmUserModel>`  
    Gets information about the user who is currently logged-in.  

-   `getUserProfileImage(avatarId: string): string`  
    Returns a profile image as a URL.  
    -   `avatarId` - Target avatar

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
