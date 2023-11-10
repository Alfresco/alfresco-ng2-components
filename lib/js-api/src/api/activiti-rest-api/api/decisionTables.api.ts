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

import { JsonNode } from '../model/jsonNode';
import { ResultListDataRepresentationRuntimeDecisionTableRepresentation } from '../model/resultListDataRepresentationRuntimeDecisionTableRepresentation';
import { RuntimeDecisionTableRepresentation } from '../model/runtimeDecisionTableRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

export interface GetDecisionTablesOpts {
    nameLike?: string;
    keyLike?: string;
    tenantIdLike?: string;
    deploymentId?: number;
    sort?: string;
    order?: string;
    start?: number;
    size?: number;
}

/**
* DecisionTablesApi service.
* @module DecisionTablesApi
*/
export class DecisionTablesApi extends BaseApi {
    /**
    * Get definition for a decision table
    *
    * @param decisionTableId decisionTableId
    * @return Promise<JsonNode>
    */
    getDecisionTableEditorJson(decisionTableId: number): Promise<JsonNode> {
        throwIfNotDefined(decisionTableId, 'decisionTableId');

        const pathParams = {
            decisionTableId
        };

        return this.get({
            path: '/api/enterprise/decisions/decision-tables/{decisionTableId}/editorJson',
            pathParams,
            returnType: JsonNode
        });
    }

    /**
    * Get a decision table
    *
    * @param decisionTableId decisionTableId
    * @return Promise<RuntimeDecisionTableRepresentation>
    */
    getDecisionTable(decisionTableId: number): Promise<RuntimeDecisionTableRepresentation> {
        throwIfNotDefined(decisionTableId, 'decisionTableId');

        const pathParams = {
            decisionTableId
        };

        return this.get({
            path: '/api/enterprise/decisions/decision-tables/{decisionTableId}',
            pathParams,
            returnType: RuntimeDecisionTableRepresentation
        });
    }

    /**
    * Query decision tables
    *
    * @param opts Optional parameters
    * @return Promise<ResultListDataRepresentationRuntimeDecisionTableRepresentation>
    */
    getDecisionTables(opts?: GetDecisionTablesOpts): Promise<ResultListDataRepresentationRuntimeDecisionTableRepresentation> {
        return this.get({
            path: '/api/enterprise/decisions/decision-tables',
            queryParams: opts,
            returnType: ResultListDataRepresentationRuntimeDecisionTableRepresentation
        });
    }
}
