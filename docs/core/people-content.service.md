---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# People Content service

Gets information about a Content Services user.  

## Class members

### Methods

-   **getCurrentPerson**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets information about the user who is currently logged in.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - User information
-   **getPerson**(personId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets information about a user identified by their username.
    -   _personId:_ `string`  - ID of the target user
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - User information

## Details

The class returned by `getPerson` and `getCurrentPerson` is detailed
in the [Ecm User model docs](ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the [`EcmUserModel`](../core/ecm-user.model.md) instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson)
method in the Alfresco JS API for more information about the REST calls used by this service.

## See also

-   [People process service](people-process.service.md)
-   [Ecm user model](ecm-user.model.md)
