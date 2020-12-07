---
Title: Ecm User service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Ecm User service](../../../lib/core/services/ecm-user.service.ts "Defined in ecm-user.service.ts")

Gets information about a Content Services user.

## Class members

### Methods

*   **getCurrentUserInfo**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>
    Gets information about the user who is currently logged-in.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - User information as for getUserInfo
*   **getUserInfo**(userName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>
    Gets information about a user identified by their username.
    *   *userName:* `string`  - Target username
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - User information
*   **getUserProfileImage**(avatarId: `string`): `string`<br/>
    Returns a profile image as a URL.
    *   *avatarId:* `string`  - Target avatar
    *   **Returns** `string` - Image URL

## Details

The class returned by `getUserInfo` and `getCurrentUserInfo` is detailed
in the [Ecm User model docs](../models/ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the [`EcmUserModel`](../../core/models/ecm-user.model.md) instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson)
method in the Alfresco JS API for more information about the REST calls used by this service.

## See also

*   [Bpm user service](../services/bpm-user.service.md)
*   [Ecm user model](../models/ecm-user.model.md)
