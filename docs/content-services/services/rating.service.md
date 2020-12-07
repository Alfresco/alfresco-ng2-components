---
Title: Rating service
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-04
---

# [Rating service](../../../lib/content-services/src/lib/social/services/rating.service.ts "Defined in rating.service.ts")

Manages ratings for items in Content Services.

## Class members

### Methods

*   **deleteRating**(nodeId: `string`, ratingType: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Removes the current user's rating for a node.
    *   *nodeId:* `string`  - Target node
    *   *ratingType:* `any`  - Type of rating to remove (can be "likes" or "fiveStar")
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response indicating that the operation is complete
*   **getRating**(nodeId: `string`, ratingType: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RatingEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/RatingEntry.md)`|Function>`<br/>
    Gets the current user's rating for a node.
    *   *nodeId:* `string`  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) to get the rating from
    *   *ratingType:* `any`  - Type of rating (can be "likes" or "fiveStar")
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RatingEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/RatingEntry.md)`|Function>` - The rating value
*   **postRating**(nodeId: `string`, ratingType: `string`, vote: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RatingEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/RatingEntry.md)`|Function>`<br/>
    Adds the current user's rating for a node.
    *   *nodeId:* `string`  - Target node for the rating
    *   *ratingType:* `string`  - Type of rating (can be "likes" or "fiveStar")
    *   *vote:* `any`  - Rating value (boolean for "likes", numeric 0..5 for "fiveStar")
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RatingEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/RatingEntry.md)`|Function>` - Details about the rating, including the new value

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

*   [Like component](../components/like.component.md)
*   [Rating component](../components/rating.component.md)
