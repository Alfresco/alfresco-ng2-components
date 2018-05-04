---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-04
---

# Rating service

Manages ratings for items in Content Services.

## Class members

### Methods

-   `deleteRating(nodeId: string = null, ratingType: any = null): any`<br/>
    Removes the current user's rating for a node.
    -   `nodeId: string = null` -  Target node
    -   `ratingType: any = null` -  Type of rating to remove (can be "likes" or "fiveStar")
    -   **Returns** `any` - Null response indicating that the operation is complete
-   `getRating(nodeId: string = null, ratingType: any = null): any`<br/>
    Gets the current user's rating for a node.
    -   `nodeId: string = null` -  Node to get the rating from
    -   `ratingType: any = null` -  Type of rating (can be "likes" or "fiveStar")
    -   **Returns** `any` - The rating value
-   `postRating(nodeId: string = null, ratingType: any = null, vote: any = null): any`<br/>
    Adds the current user's rating for a node.
    -   `nodeId: string = null` -  Target node for the rating
    -   `ratingType: any = null` -  Type of rating (can be "likes" or "fiveStar")
    -   `vote: any = null` -  Rating value (boolean for "likes", numeric 0..5 for "fiveStar")
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
