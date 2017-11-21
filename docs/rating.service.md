# Rating service

Manages ratings for items in Content Services.

## Methods

`getRating(nodeId: string, ratingType: any): any`<br/>
Gets the current user's rating for a node.

`postRating(nodeId: string, ratingType: any, vote: any): any`<br/>
Adds the current user's rating for a node.

`deleteRating(nodeId: string, ratingType: any): any`<br/>
Removes the current user's rating for a node.

## Details

The `ratingType` string currently has two possible options, "likes"
and "fiveStar". When the "likes" scheme is used, the result of
`getRating` and the `vote` parameter of `postRating` are boolean
values. When "fiveStar" is used, the value is an integer representing
the number of stars out of five.

See the [Ratings API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RatingsApi.md)
in the Alfresco JS API for more information about the returned data and the
REST API that this service is based on.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Like component](like.component.md)
- [Rating component](rating.component.md)
<!-- seealso end -->