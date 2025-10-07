# FavoritesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                                    | HTTP request                                          | Description            |
|-----------------------------------------------------------|-------------------------------------------------------|------------------------|
| [createFavorite](#createFavorite)                         | **POST** /people/{personId}/favorites                 | Create a favorite      |
| [createSiteFavorite](#createSiteFavorite)                 | **POST** /people/{personId}/favorite-sites            | Create a site favorite |
| [deleteFavorite](#deleteFavorite)                         | **DELETE** /people/{personId}/favorites/{favoriteId}  | Delete a favorite      |
| [deleteSiteFavorite](#deleteSiteFavorite)                 | **DELETE** /people/{personId}/favorite-sites/{siteId} | Delete a site favorite |
| [getFavorite](#getFavorite)                               | **GET** /people/{personId}/favorites/{favoriteId}     | Get a favorite         |
| [getFavoriteSite](#getFavoriteSite)                       | **GET** /people/{personId}/favorite-sites/{siteId}    | Get a favorite site    |
| [listFavoriteSitesForPerson](#listFavoriteSitesForPerson) | **GET** /people/{personId}/favorite-sites             | List favorite sites    |
| [listFavorites](#listFavorites)                           | **GET** /people/{personId}/favorites                  | List favorites         |

## createFavorite

Favorite a **site**, **file**, or **folder** in the repository.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Note:** You can favorite more than one entity by specifying a list of objects in the JSON body like this:

```json
[
  {
       "target": {
          "file": {
             "guid": "abcde-01234-...."
          }
       }
   },
   {
       "target": {
          "file": {
             "guid": "abcde-09863-...."
          }
       }
   }
]
```

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

```json
{
  "list": {
    "pagination": {
      "count": 2,
      "hasMoreItems": false,
      "totalItems": 2,
      "skipCount": 0,
      "maxItems": 100
    },
    "entries": [
      {
        "entry": {}
      },
      {
        "entry": {}
      }
    ]
  }
}
```

**Parameters**

| Name                   | Type                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|------------------------|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**           | string                                    | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             | 
| **favoriteBodyCreate** | [FavoriteBodyCreate](#FavoriteBodyCreate) | An object identifying the entity to be favorited. The object consists of a single property which is an object with the name site, file, or folder. The content of that object is the guid of the target entity. For example, to favorite a file the following body would be used.                                                                                                                                                       | 
| opts.include           | string[]                                  | Returns additional information about favorites, the following optional fields can be requested: `path` (note, this only applies to files and folders), `properties`                                                                                                                                                                                                                                                                     |
| opts.fields            | string[]                                  | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [FavoriteEntry](#FavoriteEntry)

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);
const favoriteBodyCreate = {};
const opts = {};

favoritesApi.createFavorite(`<personId>`, favoriteBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## createSiteFavorite

Create a site favorite

> this endpoint is deprecated as of **Alfresco 4.2**, and will be removed in the future.  
> Use **/people/{personId}/favorites** instead.

Create a site favorite for person **personId**.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

 **Note:** You can favorite more than one site by specifying a list of sites in the JSON body like this:

```json
[
  {
    "id": "test-site-1"
  },
  {
    "id": "test-site-2"
  }
]
```

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

```json
{
  "list": {
    "pagination": {
      "count": 2,
      "hasMoreItems": false,
      "totalItems": 2,
      "skipCount": 0,
      "maxItems": 100
    },
    "entries": [
      {
        "entry": {}
      },
      {
        "entry": {}
      }
    ]
  }
}
```

**Parameters**

| Name                       | Type                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**               | string                                            | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             | 
| **favoriteSiteBodyCreate** | [FavoriteSiteBodyCreate](#FavoriteSiteBodyCreate) | The id of the site to favorite.                                                                                                                                                                                                                                                                                                                                                                                                         | 
| opts.fields                | string[]                                          | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [FavoriteSiteEntry](#FavoriteSiteEntry)

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);
const favoriteSiteBodyCreate = {};
const opts = {};

favoritesApi.createSiteFavorite(`<personId>`, favoriteSiteBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteFavorite

Delete a favorite

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name           | Type   | Description                   |
|----------------|--------|-------------------------------|
| **personId**   | string | The identifier of a person.   |
| **favoriteId** | string | The identifier of a favorite. |

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);

favoritesApi.deleteFavorite(`<personId>`, `<favoriteId>`).then(() => {
  console.log('API called successfully.');
});
```

## deleteSiteFavorite

Delete a site favorite

> this endpoint is deprecated as of **Alfresco 4.2**, and will be removed in the future.  
> Use **/people/{personId}/favorites/{favoriteId}** instead.

Deletes site **siteId** from the favorite site list of person **personId**.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);

favoritesApi.deleteSiteFavorite(`<personId>`, `<siteId>`).then(() => {
  console.log('API called successfully.');
});
```

**Parameters**

| Name         | Type   | Description                 |
|--------------|--------|-----------------------------|
| **personId** | string | The identifier of a person. | 
| **siteId**   | string | The identifier of a site.   |

## getFavorite

Get a favorite

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**   | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             | 
| **favoriteId** | string   | The identifier of a favorite.                                                                                                                                                                                                                                                                                                                                                                                                           | 
| opts.include   | string[] | Returns additional information about favorites, the following optional fields can be requested: `path` (note, this only applies to files and folders), `properties`                                                                                                                                                                                                                                                                     | 
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [FavoriteEntry](#FavoriteEntry)

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);
const opts = {};

favoritesApi.getFavorite(`<personId>`, `<favoriteId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getFavoriteSite

Get a favorite site

> This endpoint is **deprecated** as of **Alfresco 4.2**, and will be removed in the future.  
> Use `/people/{personId}/favorites/{favoriteId}` instead.

Gets information on favorite site **siteId** of person **personId**.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId** | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             | 
| **siteId**   | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               | 
| opts.fields  | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteEntry](SiteEntry.md)

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);
const opts = {};

favoritesApi.getFavoriteSite(`<personId>`, `<siteId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listFavoriteSitesForPerson

List favorite sites

> This endpoint is **deprecated** as of Alfresco 4.2, and will be removed in the future.  
> Use **/people/{personId}/favorites** instead.

Gets a list of a person's favorite sites.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);
const opts = {};

favoritesApi.listFavoriteSitesForPerson(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**   | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [SitePaging](SitePaging.md)

## listFavorites

List favorites

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

The default sort order for the returned list of favorites is type ascending, createdAt descending.
You can override the default by using the **orderBy** parameter.

You can use any of the following fields to order the results:

*   type
*   createdAt
*   title

You can use the **where** parameter to restrict the list in the response
to entries of a specific kind. The **where** parameter takes a value.

The value is a single predicate that can include one or more **EXISTS**
conditions. The **EXISTS** condition uses a single operand to limit the
list to include entries that include that one property. The property values are:

*   target/file
*   target/folder
*   target/site

For example, the following **where** parameter restricts the returned list to the file favorites for a person:

```sql
(EXISTS(target/file))
```

You can specify more than one condition using **OR**. 
The predicate must be enclosed in parentheses.

For example, the following **where** parameter restricts the returned list to the file and folder favorites for a person:

```sql
(EXISTS(target/file) OR EXISTS(target/folder))
```

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **personId**   | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                                                      | 
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                | 
| opts.where     | string   | A string to restrict the returned objects by using a predicate.                                                                                                                                                                                                                                                                                                                                                                                                  |                |
| opts.include   | string[] | Returns additional information about favorites, the following optional fields can be requested: `path` (note, this only applies to files and folders), `properties`                                                                                                                                                                                                                                                                                              |                | 
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                | 

**Return type**: [FavoritePaging](#FavoritePaging)

**Example**

```javascript
import { AlfrescoApi, FavoritesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const favoritesApi = new FavoritesApi(alfrescoApi);
const opts = {};

favoritesApi.listFavorites(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## FavoritePaging

**Properties**

| Name | Type                                      |
|------|-------------------------------------------|
| list | [FavoritePagingList](#FavoritePagingList) |

## FavoritePagingList

**Properties**

| Name       | Type                              |
|------------|-----------------------------------|
| pagination | [Pagination](Pagination.md)       |
| entries    | [FavoriteEntry[]](#FavoriteEntry) |

## FavoriteEntry

**Properties**

| Name      | Type                  |
|-----------|-----------------------|
| **entry** | [Favorite](#Favorite) |

## Favorite

**Properties**

| Name           | Type   | Description                                                                                                                |
|----------------|--------|----------------------------------------------------------------------------------------------------------------------------|
| **targetGuid** | string | The guid of the object that is a favorite.                                                                                 |
| **target**     | any    |                                                                                                                            |
| createdAt      | Date   | The time the object was made a favorite.                                                                                   |
| properties     | any    | A subset of the target favorite properties, system properties and properties already available in the target are excluded. |


## FavoriteBodyCreate

**Properties**

| Name       | Type    |
|------------|---------|
| **target** | **any** |

## FavoriteSiteBodyCreate

**Properties**

| Name | Type   |
|------|--------|
| id   | string |

## FavoriteSiteEntry

**Properties**

| Name  | Type                          |
|-------|-------------------------------|
| entry | [FavoriteSite](#FavoriteSite) |

## FavoriteSite

**Properties**

| Name | Type   |
|------|--------|
| id   | string |


