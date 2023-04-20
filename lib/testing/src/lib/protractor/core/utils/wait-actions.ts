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

import { NodeEntry, NodesApi } from '@alfresco/js-api';
import { ApiService } from '../../../shared/api/api.service';
import { ApiUtil } from '../../../shared/api/api.util';
import { Logger } from './logger';

const DELAY_API_CALL = 5000;
export class WaitActions {
    apiService: ApiService;
    nodesApi: NodesApi;

    constructor(apiService: ApiService) {
        this.nodesApi = new NodesApi(apiService.getInstance());
        this.apiService = apiService;
    }

    async nodeIsPresent(nodeId: string): Promise<NodeEntry | null> {
        const predicate = (result) => result.entry.id === nodeId;

        const apiCall = async () => {
            try {
                return this.nodesApi.getNode(nodeId);
            } catch (error) {
                Logger.error('Node not present');
                return null;
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate, DELAY_API_CALL);
    }

    async nodeIsUnlock(nodeId: string): Promise<NodeEntry | null> {
        const predicate = (result) => result.entry.isLocked === false;

        const apiCall = async () => {
            try {
                return this.nodesApi.getNode(nodeId);
            } catch (error) {
                Logger.error('Node not present');
                return null;
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate, DELAY_API_CALL);
    }
}
