# Bpm User service

Gets information about the current Process Services user.

## Methods

`getCurrentUserInfo(): Observable<BpmUserModel>`<br/>
Gets information about the current user.

`getCurrentUserProfileImage(): string`<br/>
Returns the current user's profile image as a URL.

## Details

The class returned by `getCurrentUserInfo` is detailed
in the [Bpm User model docs](bpm-user.model.md).

See the
[getProfile](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/ProfileApi.md#getProfile)
and
[getProfilePictureUrl](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/ProfileApi.md#getProfilePictureUrl)
methods in the Alfresco JS API for more information about the REST calls used by this service.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Ecm user service](ecm-user.service.md)
- [Bpm user model](bpm-user.model.md)
<!-- seealso end -->