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

import { DecisionAuditRepresentation } from '../model/decisionAuditRepresentation';
import { ResultListDataRepresentationDecisionAuditRepresentation } from '../model/resultListDataRepresentationDecisionAuditRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
* Decisionaudits service.
* @module DecisionauditsApi
*/
export class DecisionAuditsApi extends BaseApi {
    /**
    * Get an audit trail
    *
    * @param auditTrailId auditTrailId
    * @return Promise<DecisionAuditRepresentation>
    */
    getAuditTrail(auditTrailId: number): Promise<DecisionAuditRepresentation> {
        throwIfNotDefined(auditTrailId, 'taskId');

        const pathParams = {
            auditTrailId
        };

        return this.get({
            path: '/api/enterprise/decisions/audits/{auditTrailId}',
            pathParams,
            returnType: DecisionAuditRepresentation
        });
    }

    /**
    * Query decision table audit trails
    *
    * @param decisionKey decisionKey
    * @param dmnDeploymentId dmnDeploymentId
    * @return Promise<ResultListDataRepresentationDecisionAuditRepresentation>
    */
    getAuditTrails(decisionKey: string, dmnDeploymentId: number): Promise<ResultListDataRepresentationDecisionAuditRepresentation> {
        throwIfNotDefined(decisionKey, 'decisionKey');
        throwIfNotDefined(dmnDeploymentId, 'dmnDeploymentId');

        const queryParams = {
            decisionKey,
            dmnDeploymentId
        };

        return this.get({
            path: '/api/enterprise/decisions/audits',
            queryParams,
            returnType: ResultListDataRepresentationDecisionAuditRepresentation
        });
    }
}
