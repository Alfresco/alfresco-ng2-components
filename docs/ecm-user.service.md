# Ecm User service

Gets information about a Content Services user.

## Methods

`getUserInfo(userName: string): Observable<EcmUserModel>`<br/>
Gets information about a user identified by their username.

`getCurrentUserInfo(): Observable<EcmUserModel>`<br/>
Gets information about the user who is currently logged-in.

`getUserProfileImage(avatarId: string)`<br/>
Returns a profile image as a URL.

## Details

The class returned by `getUserInfo` and `getCurrentUserInfo` is detailed
in the [Ecm User model docs](ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the `EcmUserModel` instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson)
method in the Alfresco JS API for more information about the REST calls used by this service.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Bpm user service](bpm-user.service.md)
- [Ecm user model](ecm-user.model.md)
<!-- seealso end -->