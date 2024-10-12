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

import { AgentPaging } from '../model/agentPaging';
import { BaseApi } from '../../hxi-connector-api/api/base.api';

/**
 * Agents Api.
 * In order to use this api, you need to have the HX Insights Connector (additional ACS module) installed.
 */
export class AgentsApi extends BaseApi {
    /**
     * Gets all agents.
     * @returns AgentPaging object containing the agents.
     */
    getAgents(): Promise<AgentPaging> {
        return this.get({
            path: '/agents'
        });
    }
}
