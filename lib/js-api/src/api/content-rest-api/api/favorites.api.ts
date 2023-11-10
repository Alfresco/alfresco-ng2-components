/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FavoriteBodyCreate } from '../model/favoriteBodyCreate';
import { FavoriteEntry } from '../model/favoriteEntry';
import { FavoritePaging } from '../model/favoritePaging';
import { FavoriteSiteBodyCreate } from '../model/favoriteSiteBodyCreate';
import { FavoriteSiteEntry } from '../model/favoriteSiteEntry';
import { SiteEntry } from '../model/siteEntry';
import { SitePaging } from '../model/sitePaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * Favorites service.
 * @module FavoritesApi
 */
export class FavoritesApi extends BaseApi {
    /**
    * Create a favorite
    *
    * Favorite a **site**, **file**, or **folder** in the repository.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

**Note:** You can favorite more than one entity by
specifying a list of objects in the JSON body like this:

JSON
[
  {
       \"target\": {
          \"file\": {
             \"guid\": \"abcde-01234-....\"
          }
       }
   },
   {
       \"target\": {
          \"file\": {
             \"guid\": \"abcde-09863-....\"
          }
       }
   },
]

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}

    *
    * @param personId The identifier of a person.
    * @param favoriteBodyCreate An object identifying the entity to be favorited.

The object consists of a single property which is an object with the name site, file, or folder.
The content of that object is the guid of the target entity.

For example, to favorite a file the following body would be used:

JSON
{
   \"target\": {
      \"file\": {
         \"guid\": \"abcde-01234-....\"
      }
   }
}

    * @param opts Optional parameters
    * @param opts.include Returns additional information about favorites, the following optional fields can be requested:
* path (note, this only applies to files and folders)
* properties

    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<FavoriteEntry>
    */
    createFavorite(personId: string, favoriteBodyCreate: FavoriteBodyCreate, opts?: { include?: string[]; fields?: string[] }): Promise<FavoriteEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(favoriteBodyCreate, 'favoriteBodyCreate');

        const pathParams = {
            personId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/people/{personId}/favorites',
            pathParams,
            queryParams,
            bodyParam: favoriteBodyCreate,
            returnType: FavoriteEntry
        });
    }
    /**
    * Create a site favorite
    *
    * **Note:** this endpoint is deprecated as of Alfresco 4.2, and will be removed in the future.
Use /people/{personId}/favorites instead.

Create a site favorite for person **personId**.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

 **Note:** You can favorite more than one site by
specifying a list of sites in the JSON body like this:

JSON
[
  {
    \"id\": \"test-site-1\"
  },
  {
    \"id\": \"test-site-2\"
  }
]

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}

    *
    * @param personId The identifier of a person.
    * @param favoriteSiteBodyCreate The id of the site to favorite.
    * @param opts Optional parameters
    * @return Promise<FavoriteSiteEntry>
    */
    createSiteFavorite(personId: string, favoriteSiteBodyCreate: FavoriteSiteBodyCreate, opts?: ContentFieldsQuery): Promise<FavoriteSiteEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(favoriteSiteBodyCreate, 'favoriteSiteBodyCreate');

        const pathParams = {
            personId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/people/{personId}/favorite-sites',
            pathParams,
            queryParams,
            bodyParam: favoriteSiteBodyCreate,
            returnType: FavoriteSiteEntry
        });
    }

    /**
     * Delete a favorite
     *
     * Deletes **favoriteId** as a favorite of person **personId**.
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param favoriteId The identifier of a favorite.
     * @return Promise<{}>
     */
    deleteFavorite(personId: string, favoriteId: string): Promise<void> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(favoriteId, 'favoriteId');

        const pathParams = {
            personId,
            favoriteId
        };

        return this.delete({
            path: '/people/{personId}/favorites/{favoriteId}',
            pathParams
        });
    }

    /**
     * Delete a site favorite
     *
     * **Note:** this endpoint is deprecated as of Alfresco 4.2, and will be removed in the future.
     * Use /people/{personId}/favorites/{favoriteId} instead.
     *
     * Deletes site **siteId** from the favorite site list of person **personId**.
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @return Promise<{}>
     */
    deleteSiteFavorite(personId: string, siteId: string): Promise<void> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            personId,
            siteId
        };

        return this.delete({
            path: '/people/{personId}/favorite-sites/{siteId}',
            pathParams
        });
    }
    /**
    * Get a favorite
    *
    * Gets favorite **favoriteId** for person **personId**.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

    *
    * @param personId The identifier of a person.
    * @param favoriteId The identifier of a favorite.
    * @param opts Optional parameters
    * @param opts.include Returns additional information about favorites, the following optional fields can be requested:
* path (note, this only applies to files and folders)
* properties

    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<FavoriteEntry>
    */
    getFavorite(personId: string, favoriteId: string, opts?: { include?: string[]; fields?: string[] }): Promise<FavoriteEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(favoriteId, 'favoriteId');

        const pathParams = {
            personId,
            favoriteId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/favorites/{favoriteId}',
            pathParams,
            queryParams,
            returnType: FavoriteEntry
        });
    }
    /**
    * Get a favorite site
    *
    * **Note:** this endpoint is deprecated as of Alfresco 4.2, and will be removed in the future.
Use /people/{personId}/favorites/{favoriteId} instead.

Gets information on favorite site **siteId** of person **personId**.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

    *
    * @param personId The identifier of a person.
    * @param siteId The identifier of a site.
    * @param opts Optional parameters
    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<SiteEntry>
    */
    getFavoriteSite(personId: string, siteId: string, opts?: { fields?: string[] }): Promise<SiteEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            personId,
            siteId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/favorite-sites/{siteId}',
            pathParams,
            queryParams,
            returnType: SiteEntry
        });
    }
    /**
    * List favorite sites
    *
    * **Note:** this endpoint is deprecated as of Alfresco 4.2, and will be removed in the future.
Use /people/{personId}/favorites instead.

Gets a list of a person's favorite sites.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

    *
    * @param personId The identifier of a person.
    * @param opts Optional parameters
    * @return Promise<SitePaging>
    */
    listFavoriteSitesForPerson(personId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<SitePaging> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/favorite-sites',
            pathParams,
            queryParams,
            returnType: SitePaging
        });
    }
    /**
    * List favorites
    *
    * Gets a list of favorites for person **personId**.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

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

SQL
(EXISTS(target/file))

You can specify more than one condition using **OR**. The predicate must be enclosed in parentheses.

For example, the following **where** parameter restricts the returned list to the file and folder favorites for a person:

SQL
(EXISTS(target/file) OR EXISTS(target/folder))

    *
    * @param personId The identifier of a person.
    * @param opts Optional parameters
    * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

    * @param opts.where A string to restrict the returned objects by using a predicate.
    * @return Promise<FavoritePaging>
    */
    listFavorites(
        personId: string,
        opts?: {
            orderBy?: string[];
            where?: string;
        } & ContentPagingQuery &
            ContentIncludeQuery &
            ContentFieldsQuery
    ): Promise<FavoritePaging> {
        throwIfNotDefined(personId, 'personId');
        opts = opts || {};

        const pathParams = {
            personId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/favorites',
            pathParams,
            queryParams,
            returnType: FavoritePaging
        });
    }
}
