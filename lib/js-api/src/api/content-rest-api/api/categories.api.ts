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

import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { CategoryBody, CategoryEntry, CategoryLinkBody, CategoryPaging } from '../model';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

export type CategoryQuery = ContentFieldsQuery & ContentIncludeQuery;

/**
 * Categories service.
 */
export class CategoriesApi extends BaseApi {
    /**
     * List of subcategories within category
     *
     * Gets a list of subcategories with category **categoryId**.
     * The parameter categoryId can be set to the alias -root- to obtain a list of top level categories.
     *
     * You can use the **include** parameter to return additional **values** information.
     *
     * @param categoryId The identifier of a category.
     * @param opts Optional parameters
     * @returns Promise<CategoryPaging>
     */
    getSubcategories(categoryId: string, opts?: ContentPagingQuery & CategoryQuery): Promise<CategoryPaging> {
        throwIfNotDefined(categoryId, 'categoryId');

        const pathParams = {
            categoryId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/categories/{categoryId}/subcategories',
            pathParams,
            queryParams,
            returnType: CategoryPaging
        });
    }

    /**
     * Get a category
     *
     * Get a specific category with categoryId.
     * You can use the **include** parameter to return additional **values** information.
     *
     * @param categoryId The identifier of a category.
     * @param opts Optional parameters
     * @returns Promise<CategoryEntry>
     */
    getCategory(categoryId: string, opts?: CategoryQuery): Promise<CategoryEntry> {
        throwIfNotDefined(categoryId, 'categoryId');

        const pathParams = {
            categoryId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/categories/{categoryId}',
            pathParams,
            queryParams,
            returnType: CategoryEntry
        });
    }

    /**
     * List of categories that node is assigned to
     *
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @returns Promise<CategoryPaging>
     */
    getCategoryLinksForNode(nodeId: string, opts?: ContentPagingQuery & CategoryQuery): Promise<CategoryPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/category-links',
            pathParams,
            queryParams,
            returnType: CategoryPaging
        });
    }

    /**
     * Deletes the category **categoryId**.
     *
     * This will cause everything to be removed from the category.
     * You must have admin rights to delete a category.
     *
     * @param categoryId The identifier of a category.
     * @returns Promise<{ }>
     */
    deleteCategory(categoryId: string): Promise<void> {
        throwIfNotDefined(categoryId, 'categoryId');

        const pathParams = {
            categoryId
        };

        return this.delete({
            path: '/categories/{categoryId}',
            pathParams
        });
    }

    /**
     * Unassign a node from category
     *
     * @param nodeId The identifier of a node.
     * @param categoryId The identifier of a category.
     * @returns Promise<{ }>
     */
    unlinkNodeFromCategory(nodeId: string, categoryId: string): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(categoryId, 'categoryId');

        const pathParams = {
            nodeId,
            categoryId
        };

        return this.delete({
            path: '/nodes/{nodeId}/category-links/{categoryId}',
            pathParams
        });
    }

    /**
     * Update a category
     *
     * Updates the category **categoryId**.
     * You must have admin rights to update a category.
     *
     * @param categoryId The identifier of a category.
     * @param categoryBodyUpdate The updated category
     * @param opts Optional parameters
     * @returns Promise<CategoryEntry>
     */
    updateCategory(categoryId: string, categoryBodyUpdate: CategoryBody, opts?: CategoryQuery): Promise<CategoryEntry> {
        throwIfNotDefined(categoryId, 'categoryId');
        throwIfNotDefined(categoryBodyUpdate, 'categoryBodyUpdate');

        const pathParams = {
            categoryId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.put({
            path: '/categories/{categoryId}',
            pathParams,
            queryParams,
            bodyParam: categoryBodyUpdate,
            returnType: CategoryEntry
        });
    }

    /**
     * Create new categories
     *
     * Creates new categories within the category **categoryId**.
     * The parameter categoryId can be set to the alias -root- to create a new top level category.
     * You must have admin rights to create a category.
     *
     * @param categoryId The identifier of a category.
     * @param categoryBodyCreate List of categories to create.
     * @param opts Optional parameters.
     * @returns Promise<CategoryPaging | CategoryEntry>
     */
    createSubcategories(categoryId: string, categoryBodyCreate: CategoryBody[], opts?: CategoryQuery): Promise<CategoryPaging | CategoryEntry> {
        throwIfNotDefined(categoryId, 'categoryId');
        throwIfNotDefined(categoryBodyCreate, 'categoryBodyCreate');

        const pathParams = {
            categoryId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.post({
            path: '/categories/{categoryId}/subcategories',
            pathParams,
            queryParams,
            bodyParam: categoryBodyCreate,
            returnType: CategoryEntry
        });
    }

    /**
     * Assign a node to a category
     *
     * @param nodeId The identifier of a node.
     * @param categoryLinkBodyCreate The new category link
     * @param opts Optional parameters
     * @returns Promise<CategoryPaging | CategoryEntry>
     */
    linkNodeToCategory(nodeId: string, categoryLinkBodyCreate: CategoryLinkBody[], opts?: CategoryQuery): Promise<CategoryPaging | CategoryEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(categoryLinkBodyCreate, 'categoryLinkBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/category-links',
            pathParams,
            queryParams,
            bodyParam: categoryLinkBodyCreate,
            returnType: CategoryEntry
        });
    }
}
