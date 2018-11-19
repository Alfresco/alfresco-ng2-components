---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# Rating service

Manages ratings for items in Content Services.

## Class members

### Methods

-   **deleteRating**(nodeId: `string`, ratingType: `any`): `any`<br/>
    Removes the current user's rating for a node.
    -   _nodeId:_ `string`  - Target node
    -   _ratingType:_ `any`  - Type of rating to remove (can be "likes" or "fiveStar")
    -   **Returns** `any` - Null response indicating that the operation is complete
-   **getRating**(nodeId: `string`, ratingType: `any`): `any`<br/>
    Gets the current user's rating for a node.
    -   _nodeId:_ `string`  - Node to get the rating from
    -   _ratingType:_ `any`  - Type of rating (can be "likes" or "fiveStar")
    -   **Returns** `any` - The rating value
-   **postRating**(nodeId: `string`, ratingType: `any`, vote: `any`): `any`<br/>
    Adds the current user's rating for a node.
    -   _nodeId:_ `string`  - Target node for the rating
    -   _ratingType:_ `any`  - Type of rating (can be "likes" or "fiveStar")
    -   _vote:_ `any`  - Rating value (boolean for "likes", numeric 0..5 for "fiveStar")
    -   **Returns** `any` - Details about the rating, including the new value

## Details

The `ratingType` string currently has two possible options, "likes"
and "fiveStar". When the "likes" scheme is used, the result of
`getRating` and the `vote` parameter of `postRating` are boolean
values. When "fiveStar" is used, the value is an integer representing
the number of stars out of five.

See the [Ratings API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RatingsApi.md)
in the Alfresco JS API for more information about the returned data and the
REST API that this service is based on.

## See also

-   [Like component](like.component.md)
-   [Rating component](rating.component.md)
