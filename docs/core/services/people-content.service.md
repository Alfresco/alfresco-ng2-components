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

-   **createPerson**(newPerson: [`PersonBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/model/personBodyCreate.ts), opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>
    Creates new person.
    -   _newPerson:_ [`PersonBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/model/personBodyCreate.ts)  - Object containing the new person details.
    -   _opts:_ `any`  - (Optional) Optional parameters
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - Created new person
-   **getCurrentPerson**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets information about the user who is currently logged in.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - User information
-   **getPerson**(personId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets information about a user identified by their username.
    -   _personId:_ `string`  - ID of the target user
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - User information
-   **isContentAdmin**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<boolean>`<br/>

    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<boolean>` - 

-   **listPeople**(requestQuery?: [`PeopleContentQueryRequestModel`](../../../lib/core/services/people-content.service.ts#32)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`[]>`<br/>
    Gets a list of people.
    -   _requestQuery:_ [`PeopleContentQueryRequestModel`](../../../lib/core/services/people-content.service.ts)  - (Optional) maxItems and skipCount used for pagination
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`[]>` - Array of people

## Details

The class returned by `getPerson` and `getCurrentPerson` is detailed
in the [Ecm User model docs](../models/ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the [`EcmUserModel`](../../core/models/ecm-user.model.md) instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson),
[listPeople](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/PeopleApi.md#listPeople) and
[createPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/PeopleApi.md#createPerson)
methods in the Alfresco JS API for more information about the REST calls used by this service.

## See also

-   [People process service](people-process.service.md)
-   [Ecm user model](../models/ecm-user.model.md)
