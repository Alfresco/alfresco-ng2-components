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

import { ActionBodyExec, ActionDefinitionEntry, ActionDefinitionList, ActionExecResultEntry } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentPagingQuery } from './types';

/**
 * Actions service.
 */
export class ActionsApi extends BaseApi {
    /**
     * Retrieve the details of an action definition
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param actionDefinitionId The identifier of an action definition.
     * @returns Promise<ActionDefinitionEntry>
     */
    actionDetails(actionDefinitionId: string): Promise<ActionDefinitionEntry> {
        throwIfNotDefined(actionDefinitionId, 'actionDefinitionId');

        const pathParams = {
            actionDefinitionId
        };

        return this.get({
            path: '/action-definitions/{actionDefinitionId}',
            pathParams
        });
    }

    /**
     * Execute an action
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param actionBodyExec Action execution details
     * @returns Promise<ActionExecResultEntry>
     */
    actionExec(actionBodyExec: ActionBodyExec): Promise<ActionExecResultEntry> {
        throwIfNotDefined(actionBodyExec, 'actionBodyExec');

        return this.post({
            path: '/action-executions',
            bodyParam: actionBodyExec
        });
    }

    /**
     * Retrieve list of available actions
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     *
     * Gets a list of all available actions
     *
     * The default sort order for the returned list is for actions to be sorted by ascending name.
     * You can override the default by using the **orderBy** parameter.
     *
     * You can use any of the following fields to order the results:
     * - name
     * - title
     *
     *
     * @param opts Optional parameters
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @returns Promise<ActionDefinitionList>
     */
    listActions(opts?: { orderBy?: string[] } & ContentPagingQuery & ContentFieldsQuery): Promise<ActionDefinitionList> {
        opts = opts || { /* empty */ };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/action-definitions',
            queryParams,
            returnType: ActionDefinitionList
        });
    }

    /**
     * Retrieve actions for a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Retrieve the list of actions that may be executed against the given **nodeId**.
     * The default sort order for the returned list is for actions to be sorted by ascending name.
     * You can override the default by using the **orderBy** parameter.
     * You can use any of the following fields to order the results:
     * - name
     * - title
     *
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @returns Promise<ActionDefinitionList>
     */
    nodeActions(nodeId: string, opts?: { orderBy?: string[] } & ContentPagingQuery & ContentFieldsQuery): Promise<ActionDefinitionList> {
        throwIfNotDefined(nodeId, 'nodeId');
        opts = opts || { /* empty */ };

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/action-definitions',
            pathParams,
            queryParams,
            returnType: ActionDefinitionList
        });
    }
}
