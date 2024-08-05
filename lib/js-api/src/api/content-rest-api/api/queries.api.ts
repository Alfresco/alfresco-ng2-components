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

import { NodePaging } from '../model/nodePaging';
import { PersonPaging } from '../model/personPaging';
import { SitePaging } from '../model/sitePaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

export type FindQuery = {
    /**
     * The term to search for.
     */
    term?: string;
    /**
     * A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     *
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     *
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     */
    orderBy?: string[];
} & ContentPagingQuery &
    ContentFieldsQuery;

export type FindNodesQuery = {
    /**
     * The id of the node to start the search from.
     * Supports the aliases **-my-**, **-root-** and **-shared-**.
     */
    rootNodeId?: string;
    /**
     * Restrict the returned results to only those of the given node type and its sub-types
     */
    nodeType?: string;
} & FindQuery;

/**
 * Queries service.
 */
export class QueriesApi extends BaseApi {
    /**
     * Find nodes
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of nodes that match the given search criteria.
     *
     * The search term is used to look for nodes that match against name, title, description, full text content or tags.
     *
     * The search term:
     * - must contain a minimum of 3 alphanumeric characters
     * - allows \"quoted term\"
     * - can optionally use '*' for wildcard matching
     *
     * By default, file and folder types will be searched unless a specific type is provided as a query parameter.
     *
     * By default, the search will be across the repository unless a specific root node id is provided to start the search from.
     *
     * You can sort the result list using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:
     * - name
     * - modifiedAt
     * - createdAt
     *
     * @param term The term to search for.
     * @param opts Optional parameters
     * @returns Promise<NodePaging>
     */
    findNodes(term: string, opts?: FindNodesQuery & ContentPagingQuery & ContentIncludeQuery & ContentFieldsQuery): Promise<NodePaging> {
        throwIfNotDefined(term, 'term');

        const queryParams = {
            term,
            rootNodeId: opts?.rootNodeId,
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            nodeType: opts?.nodeType,
            include: buildCollectionParam(opts?.include, 'csv'),
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/queries/nodes',
            queryParams,
            returnType: NodePaging
        });
    }

    /**
     * Find people
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of people that match the given search criteria.
     *
     * The search term is used to look for matches against person id, firstname and lastname.
     *
     * The search term:
     * - must contain a minimum of 2 alphanumeric characters
     * - can optionally use '*' for wildcard matching within the term
     *
     * You can sort the result list using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:
     * - id
     * - firstName
     * - lastName
     *
     * @param term The term to search for.
     * @param opts Optional parameters
     * @returns Promise<PersonPaging>
     */
    findPeople(term: string, opts?: FindQuery): Promise<PersonPaging> {
        throwIfNotDefined(term, 'term');
        opts = opts || { /* empty */ };

        const queryParams = {
            term,
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv'),
            orderBy: buildCollectionParam(opts?.orderBy, 'csv')
        };

        return this.get({
            path: '/queries/people',
            queryParams,
            returnType: PersonPaging
        });
    }

    /**
     * Find sites
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of sites that match the given search criteria.
     *
     * The search term is used to look for sites that match against site id, title or description.
     *
     * The search term:
     * - must contain a minimum of 2 alphanumeric characters
     * - can optionally use '*' for wildcard matching within the term
     *
     * The default sort order for the returned list is for sites to be sorted by ascending id.
     * You can override the default by using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:
     * - id
     * - title
     * - description
     *
     * @param term The term to search for.
     * @param opts Optional parameters
     * @returns Promise<SitePaging>
     */
    findSites(term: string, opts?: FindQuery): Promise<SitePaging> {
        throwIfNotDefined(term, 'term');

        const queryParams = {
            term,
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/queries/sites',
            queryParams,
            returnType: SitePaging
        });
    }
}
