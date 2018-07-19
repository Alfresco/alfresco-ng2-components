---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Ecm User service

Gets information about a Content Services user.

## Class members

### Methods

-   **getCurrentUserInfo**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../core/ecm-user.model.md)`>`<br/>
    Gets information about the user who is currently logged-in.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../core/ecm-user.model.md)`>` - User information as for getUserInfo
-   **getUserInfo**(userName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../core/ecm-user.model.md)`>`<br/>
    Gets information about a user identified by their username.
    -   _userName:_ `string`  - Target username
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../core/ecm-user.model.md)`>` - User information
-   **getUserProfileImage**(avatarId: `string`): `string`<br/>
    Returns a profile image as a URL.
    -   _avatarId:_ `string`  - Target avatar
    -   **Returns** `string` - Image URL

## Details

The class returned by `getUserInfo` and `getCurrentUserInfo` is detailed
in the [Ecm User model docs](ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the [`EcmUserModel`](../core/ecm-user.model.md) instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson)
method in the Alfresco JS API for more information about the REST calls used by this service.

## See also

-   [Bpm user service](bpm-user.service.md)
-   [Ecm user model](ecm-user.model.md)
