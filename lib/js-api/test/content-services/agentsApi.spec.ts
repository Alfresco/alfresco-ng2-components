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

import { AgentMock, EcmAuthMock } from '../mockObjects';
import { AgentsApi, AlfrescoApi } from '../../src';
import assert from 'assert';

describe('AgentsApi', () => {
    let agentMock: AgentMock;
    let agentsApi: AgentsApi;

    beforeEach((done) => {
        const hostEcm = 'https://127.0.0.1:8080';
        const authResponseMock = new EcmAuthMock(hostEcm);
        agentMock = new AgentMock(hostEcm);
        authResponseMock.get201Response();
        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });
        alfrescoJsApi.login('admin', 'admin').then(() => done());
        agentsApi = new AgentsApi(alfrescoJsApi);
    });

    describe('getAgents', () => {
        it('should load list of agents', (done) => {
            agentMock.getAgents200Response();
            agentsApi.getAgents().then((paging) => {
                assert.equal(paging.list.pagination.count, 2);
                assert.deepStrictEqual(paging.list.entries[0].entry, {
                    id: 'some id 1',
                    name: 'some name 1'
                });
                assert.deepStrictEqual(paging.list.entries[1].entry, {
                    id: 'some id 2',
                    name: 'some name 2'
                });
                done();
            });
        });
    });
});
