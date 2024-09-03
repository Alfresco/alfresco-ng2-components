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

import { TestBed } from '@angular/core/testing';
import { AlfrescoApiService, CoreTestingModule } from '@alfresco/adf-core';
import { Agent, AgentPaging, AgentsApi, AgentWithAvatar } from '@alfresco/js-api';
import { AgentService } from '@alfresco/adf-content-services';

const agent1: Agent = {
    id: '1',
    name: 'HR Agent',
    description: 'Your Claims Doc Agent streamlines the extraction, analysis, and management of data from insurance claims documents.'
};

const agent2: Agent = {
    id: '2',
    name: 'Policy Agent',
    description: 'Your Claims Doc Agent streamlines the extraction, analysis, and management of data from insurance claims documents.'
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

const avatarAgentMock = '';

const agentWithAvatarListMock: AgentWithAvatar[] = [
    {
        ...agent1,
        avatar: avatarAgentMock
    },
    {
        ...agent2,
        avatar: avatarAgentMock
    }
];

describe('AgentService', () => {
    let agentService: AgentService;
    let apiService: AlfrescoApiService;
    let agentsApi: AgentsApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });

        agentService = TestBed.inject(AgentService);
        apiService = TestBed.inject(AlfrescoApiService);
        agentsApi = new AgentsApi(apiService.getInstance());

        spyOn(agentsApi, 'getAgentAvatar').and.returnValue(Promise.resolve(avatarAgentMock));
        spyOn(agentService.agentsApi, 'getAgentAvatar').and.returnValue(Promise.resolve(avatarAgentMock));
    });

    it('should load agents', (done) => {
        spyOn(agentService.agentsApi, 'getAgents').and.returnValue(Promise.resolve(agentPagingObjectMock));

        agentService.getAgents().subscribe((pagingResponse) => {
            expect(pagingResponse).toEqual(agentWithAvatarListMock);
            expect(agentService.agentsApi.getAgents).toHaveBeenCalled();
            done();
        });
    });

    it('should get agent avatar', (done) => {
        agentService.getAgentAvatar('avatarId').subscribe((response) => {
            expect(response).toEqual(avatarAgentMock);
            expect(agentService.agentsApi.getAgentAvatar).toHaveBeenCalledWith('avatarId');
            done();
        });
    });
});
