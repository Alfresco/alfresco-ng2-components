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

/**
 * ModelsBpmnApi service.
 */
export class ModelsBpmnApi extends BaseApi {
    /**
     * Export a historic version of a process definition as BPMN 2.0 XML
     * @param processModelId processModelId
     * @param processModelHistoryId processModelHistoryId
     * @return Promise<{}>
     */
    getHistoricProcessModelBpmn20Xml(processModelId: number, processModelHistoryId: number): Promise<any> {
        throwIfNotDefined(processModelId, 'processModelId');
        throwIfNotDefined(processModelHistoryId, 'processModelHistoryId');

        const pathParams = {
            processModelId,
            processModelHistoryId
        };

        const accepts = ['application/xml'];

        return this.get({
            path: '/api/enterprise/models/{processModelId}/history/{processModelHistoryId}/bpmn20',
            pathParams,
            accepts
        });
    }

    /**
     * Export a process definition as BPMN 2.0 XML
     * @param processModelId processModelId
     * @return Promise<{}>
     */
    getProcessModelBpmn20Xml(processModelId: number): Promise<any> {
        throwIfNotDefined(processModelId, 'processModelId');

        const pathParams = {
            processModelId
        };

        const accepts = ['application/xml'];

        return this.get({
            path: '/api/enterprise/models/{processModelId}/bpmn20',
            pathParams,
            accepts
        });
    }
}
