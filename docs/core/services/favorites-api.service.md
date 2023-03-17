---
Title: Favorites Api service
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-04
---

# [Favorites Api service](../../../lib/content-services/src/lib/common/services/favorites-api.service.ts "Defined in favorites-api.service.ts")

Gets a list of items a user has marked as their favorites.

## Class members

### Methods

-   **getFavorites**(personId: `string`, options?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets the favorites for a user.
    -   _personId:_ `string`  - ID of the user
    -   _options:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of favorites
-   **remapFavoriteEntries**(entries: `any[]`): `any[]`<br/>

    -   _entries:_ `any[]`  - 
    -   **Returns** `any[]` - 

-   **remapFavoritesData**(data: `FavoritePaging` = `{}`): [`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)<br/>

    -   _data:_ `FavoritePaging`  - 
    -   **Returns** [`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md) - 

-   **remapEntry**(\_\_namedParameters: `Function`): `any`<br/>

    -   _\_\_namedParameters:_ `Function`  - 
    -   **Returns** `any` -

## Details

Process Services allows users to mark items as "favorites". These are typically
items that are important or frequently used.

Use `getFavorites` to find a user's favorite items. You could use this, for example,
to create a menu for the user to access their favorites quickly rather than by
navigating or searching. Using "-me-" for the `personId` indicates that the target
person is the currently logged-in user.

You can specify a number of `options` to modify the search further. See the
[Alfresco JS API page](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/FavoritesApi.md#getfavorites)
for `getFavorites` for more information.
