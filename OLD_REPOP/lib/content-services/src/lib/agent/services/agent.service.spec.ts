/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed } from '@angular/core/testing';
import { AgentService } from './agent.service';
import { Agent, AgentPaging } from '@alfresco/js-api';

const agent1: Agent = {
    id: '1',
    name: 'HR Agent',
    description: 'Your Claims Doc Agent streamlines the extraction, analysis, and management of data from insurance claims documents.',
    avatarUrl: ''
};

const agent2: Agent = {
    id: '2',
    name: 'Policy Agent',
    description: 'Your Claims Doc Agent streamlines the extraction, analysis, and management of data from insurance claims documents.',
    avatarUrl: ''
};

const agentPagingObjectMock: AgentPaging = {
    list: {
        entries: [
            {
                entry: agent1
            },
            {
                entry: agent2
            }
        ]
    }
};

const agentListMock: Agent[] = [agent1, agent2];

describe('AgentService', () => {
    let agentService: AgentService;

    beforeEach(() => {
        agentService = TestBed.inject(AgentService);
    });

    it('should load agents', (done) => {
        spyOn(agentService.agentsApi, 'getAgents').and.returnValue(Promise.resolve(agentPagingObjectMock));

        agentService.getAgents().subscribe((pagingResponse) => {
            expect(pagingResponse).toEqual(agentListMock);
            expect(agentService.agentsApi.getAgents).toHaveBeenCalled();
            done();
        });
    });
});
