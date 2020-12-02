---
Title: People Content service
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-06
---

# [People Content service](../../../lib/core/services/people-content.service.ts "Defined in people-content.service.ts")

Gets information about a Content Services user.

## Class members

### Methods

*   **getCurrentPerson**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets information about the user who is currently logged in.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - User information
*   **getPerson**(personId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets information about a user identified by their username.
    *   *personId:* `string`  - ID of the target user
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - User information

## Details

The class returned by `getPerson` and `getCurrentPerson` is detailed
in the [Ecm User model docs](../models/ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the [`EcmUserModel`](../../core/models/ecm-user.model.md) instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson)
method in the Alfresco JS API for more information about the REST calls used by this service.

## See also

*   [People process service](people-process.service.md)
*   [Ecm user model](../models/ecm-user.model.md)
