---
Title: People Content service
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-06
---

# [People Content service](../../../lib/content-services/src/lib/common/services/people-content.service.ts "Defined in people-content.service.ts")

Gets information about a Content Services user.

## Class members

### Methods

-   **createPerson**(newPerson: [`PersonBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/model/personBodyCreate.ts), opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>
    Creates new person.
    -   _newPerson:_ [`PersonBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/model/personBodyCreate.ts)  - Object containing the new person details.
    -   _opts:_ `any`  - (Optional) Optional parameters
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - Created new person
-   **getCurrentPerson**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>

    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - 

-   **getCurrentUserInfo**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>
    Gets information about the current user alias -me-
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - User information
-   **getPerson**(personId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>
    Gets information about a user identified by their username.
    -   _personId:_ `string`  - ID of the target user
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - User information
-   **getUserProfileImage**(avatarId: `string`): `string`<br/>
    Returns a profile image as a URL.
    -   _avatarId:_ `string`  - Target avatar
    -   **Returns** `string` - Image URL
-   **isCurrentUserAdmin**(): `boolean`<br/>
    Used to know if the current user has the admin capability
    -   **Returns** `boolean` - true or false
-   **listPeople**(requestQuery?: [`PeopleContentQueryRequestModel`](../../../lib/content-services/src/lib/common/services/people-content.service.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`PeopleContentQueryResponse`](../../../lib/content-services/src/lib/common/services/people-content.service.ts)`>`<br/>
    Gets a list of people.
    -   _requestQuery:_ [`PeopleContentQueryRequestModel`](../../../lib/content-services/src/lib/common/services/people-content.service.ts)  - (Optional) maxItems and skipCount parameters supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`PeopleContentQueryResponse`](../../../lib/content-services/src/lib/common/services/people-content.service.ts)`>` - Response containing pagination and list of entries
-   **resetLocalCurrentUser**()<br/>
    Reset the local current user object
-   **updatePerson**(personId: `string`, details: `PersonBodyUpdate`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>`<br/>
    Updates the person details
    -   _personId:_ `string`  - The identifier of a person
    -   _details:_ `PersonBodyUpdate`  - The person details
    -   _opts:_ `any`  - (Optional) Optional parameters
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`EcmUserModel`](../../core/models/ecm-user.model.md)`>` - Updated person model

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
