# RatingsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                        | HTTP request                                  | Description     |
|-------------------------------|-----------------------------------------------|-----------------|
| [createRating](#createRating) | **POST** /nodes/{nodeId}/ratings              | Create a rating |
| [deleteRating](#deleteRating) | **DELETE** /nodes/{nodeId}/ratings/{ratingId} | Delete a rating |
| [getRating](#getRating)       | **GET** /nodes/{nodeId}/ratings/{ratingId}    | Get a rating    |
| [listRatings](#listRatings)   | **GET** /nodes/{nodeId}/ratings               | List ratings    |

## createRating

Create a rating

**Parameters**

| Name                 | Type                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**           | string                    | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **ratingBodyCreate** | [RatingBody](#RatingBody) | For "myRating" the type is specific to the rating scheme, boolean for the likes and an integer for the fiveStar. For example, to "like" a file the following body would be used: `{ "id": "likes", "myRating": true }`                                                                                                                                                                                                                  |
| opts.fields          | string[]                  | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [RatingEntry](#RatingEntry)

**Example**

```javascript
import { AlfrescoApi, RatingsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const ratingsApi = new RatingsApi(alfrescoApi);
const ratingBodyCreate = {};
const opts = {};

ratingsApi.createRating(`<nodeId>`, ratingBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteRating

Delete a rating

**Parameters**

| Name         | Type   | Description                 | Notes |
|--------------|--------|-----------------------------|-------|
| **nodeId**   | string | The identifier of a node.   |       |
| **ratingId** | string | The identifier of a rating. |       |

**Example**

```javascript
import { AlfrescoApi, RatingsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const ratingsApi = new RatingsApi(alfrescoApi);

ratingsApi.deleteRating(`<nodeId>`, `<ratingId>`).then(() => {
  console.log('API called successfully.');
});
```

## getRating

Get a rating

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**   | string   | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **ratingId** | string   | The identifier of a rating.                                                                                                                                                                                                                                                                                                                                                                                                             |
| opts.fields  | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [RatingEntry](#RatingEntry)

**Example**

```javascript
import { AlfrescoApi, RatingsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const ratingsApi = new RatingsApi(alfrescoApi);
const opts = {};

ratingsApi.getRating(`<nodeId>`, `<ratingId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listRatings

List ratings

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **nodeId**     | string   | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [RatingPaging](#RatingPaging)

**Example**

```javascript
import { AlfrescoApi, RatingsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const ratingsApi = new RatingsApi(alfrescoApi);
const opts = {};

ratingsApi.listRatings(`<nodeId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## RatingPaging

**Properties**

| Name | Type                                  |
|------|---------------------------------------|
| list | [RatingPagingList](#RatingPagingList) |

## RatingPagingList

**Properties**

| Name           | Type                          |
|----------------|-------------------------------|
| **pagination** | [Pagination](Pagination.md)   |
| **entries**    | [RatingEntry[]](#RatingEntry) |

## RatingEntry

**Properties**

| Name      | Type              |
|-----------|-------------------|
| **entry** | [Rating](#Rating) |

## Rating

**Properties**

| Name      | Type                                | Description                                                                                                   |
|-----------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| **id**    | string                              |                                                                                                               |
| aggregate | [RatingAggregate](#RatingAggregate) |                                                                                                               |
| ratedAt   | Date                                |                                                                                                               |
| myRating  | string                              | The rating. The type is specific to the rating scheme, boolean for the likes and an integer for the fiveStar. |

## RatingAggregate

**Properties**

| Name                | Type   |
|---------------------|--------|
| **numberOfRatings** | number |
| average             | number |

## RatingBody

**Properties**

| Name         | Type   | Description                                                                                                  |
|--------------|--------|--------------------------------------------------------------------------------------------------------------|
| **id**       | string | The rating scheme type. Possible values are likes and fiveStar.                                              |
| **myRating** | string | The rating. The type is specific to the rating scheme, boolean for the likes and an integer for the fiveStar |

### RatingBody.IdEnum

* `Likes` (value: `'likes'`)
* `FiveStar` (value: `'fiveStar'`)