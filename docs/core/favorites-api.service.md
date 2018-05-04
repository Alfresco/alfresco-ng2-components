---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-04
---

# Favorites Api service

Gets a list of items a user has marked as their favorites.

## Class members

### Methods

-   `getFavorites(personId: string = null, options?: any = null): Observable<NodePaging>`<br/>
    Gets the favorites for a user.
    -   `personId: string = null` -  ID of the user
    -   `options?: any = null` - (Optional) Options supported by JSAPI
    -   **Returns** `Observable<NodePaging>` - List of favorites

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
