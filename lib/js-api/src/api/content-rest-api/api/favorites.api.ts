/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FavoriteBodyCreate, FavoriteEntry, FavoritePaging, FavoriteSiteBodyCreate, FavoriteSiteEntry, SiteEntry, SitePaging } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * Favorites service.
 */
export class FavoritesApi extends BaseApi {
    /**
     * Create a favorite
     *
     * Favorite a **site**, **file**, or **folder** in the repository.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param favoriteBodyCreate An object identifying the entity to be favorited.
     * The object consists of a single property which is an object with the name site, file, or folder.
     * The content of that object is the guid of the target entity.
     * @param opts Optional parameters
     * @param opts.include Returns additional information about favorites, the following optional fields can be requested:
     * - path (note, this only applies to files and folders)
     * - properties
     * @param opts.fields A list of field names. You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     * The list applies to a returned individual entity or entries within a collection.
     * If the API method also supports the **include** parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     * @returns Promise<FavoriteEntry>
     */
    createFavorite(
        personId: string,
        favoriteBodyCreate: FavoriteBodyCreate,
        opts?: { include?: string[]; fields?: string[] }
    ): Promise<FavoriteEntry> {
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
     * **Note:** this endpoint is deprecated as of Alfresco 4.2, and will be removed in the future. Use /people/{personId}/favorites instead.
     *
     * @param personId The identifier of a person.
     * @param favoriteSiteBodyCreate The id of the site to favorite.
     * @param opts Optional parameters
     * @returns Promise<FavoriteSiteEntry>
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
            bodyParam: favoriteSiteBodyCreate
        });
    }

    /**
     * Delete a favorite
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param favoriteId The identifier of a favorite.
     * @returns Promise<{ }>
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
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @returns Promise<{ }>
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
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param favoriteId The identifier of a favorite.
     * @param opts Optional parameters
     * @param opts.include Returns additional information about favorites, the following optional fields can be requested:
     * - path (note, this only applies to files and folders)
     * - properties
     * @param opts.fields A list of field names. You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     * The list applies to a returned individual entity or entries within a collection.
     * If the API method also supports the **include** parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     * @returns Promise<FavoriteEntry>
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
     * Use /people/{personId}/favorites/{favoriteId} instead.
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @param opts Optional parameters
     * @param opts.fields A list of field names. You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     * The list applies to a returned individual entity or entries within a collection.
     * If the API method also supports the **include** parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     * @returns Promise<SiteEntry>
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
     * Use /people/{personId}/favorites instead.
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @returns Promise<SitePaging>
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
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param opts optional parameters
     * @returns Promise<FavoritePaging>
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
        opts =
            opts ||
            {
                /* empty */
            };

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
