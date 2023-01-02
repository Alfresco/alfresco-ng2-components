---
Title: Bpm User service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Bpm User service](../../../lib/core/src/lib/services/bpm-user.service.ts "Defined in bpm-user.service.ts")

Gets information about the current Process Services user.

## Class members

### Methods

-   **getCurrentUserInfo**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BpmUserModel`](../../core/models/bpm-user.model.md)`>`<br/>
    Gets information about the current user.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BpmUserModel`](../../core/models/bpm-user.model.md)`>` - User information object
-   **getCurrentUserProfileImage**(): `string`<br/>
    Gets the current user's profile image as a URL.
    -   **Returns** `string` - URL string

## Details

The class returned by `getCurrentUserInfo` is detailed
in the [Bpm User model docs](../models/bpm-user.model.md).

See the
[getProfile](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/ProfileApi.md#getProfile)
and
[getProfilePictureUrl](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/ProfileApi.md#getProfilePictureUrl)
methods in the Alfresco JS API for more information about the REST calls used by this service.

## See also

-   [Ecm user service](../services/ecm-user.service.md)
-   [Bpm user model](../models/bpm-user.model.md)
