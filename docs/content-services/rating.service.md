---
Added: v2.0.0
Status: Active
---
# Rating service

Manages ratings for items in Content Services.

## Class members

## Methods

-   `getRating(nodeId: string, ratingType: any): any`  
    Gets the current user's rating for a node.  
    -   `nodeId` - Node to get the rating from
    -   `ratingType` - Type of rating (can be "likes" or "fiveStar")
-   `postRating(nodeId: string, ratingType: any, vote: any): any`  
    Adds the current user's rating for a node.  
    -   `nodeId` - Target node for the rating
    -   `ratingType` - Type of rating (can be "likes" or "fiveStar")
    -   `vote` - Rating value (boolean for "likes", numeric 0..5 for "fiveStar")
-   `deleteRating(nodeId: string, ratingType: any): any`  
    Removes the current user's rating for a node.  
    -   `nodeId` - Target node
    -   `ratingType` - Type of rating to remove (can be "likes" or "fiveStar")

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
