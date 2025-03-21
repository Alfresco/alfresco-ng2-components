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

import assert from 'assert';
import { BpmAuthMock, ProcessMock } from '../mockObjects';
import { AlfrescoApi, ProcessDefinitionsApi, ProcessInstanceQueryRepresentation, ProcessInstancesApi } from '../../src';

describe('Activiti Process Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let processMock: ProcessMock;
    let alfrescoJsApi: AlfrescoApi;
    let processInstancesApi: ProcessInstancesApi;
    let processDefinitionsApi: ProcessDefinitionsApi;

    beforeEach(async () => {
        const BPM_HOST = 'https://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        processMock = new ProcessMock(BPM_HOST);

        authResponseBpmMock.get200Response();

        alfrescoJsApi = new AlfrescoApi({
            hostBpm: BPM_HOST,
            provider: 'BPM'
        });

        processInstancesApi = new ProcessInstancesApi(alfrescoJsApi);
        processDefinitionsApi = new ProcessDefinitionsApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    it('get activiti Process list filtered', (done) => {
        processMock.get200Response();

        const requestNode: ProcessInstanceQueryRepresentation = {
            page: 0,
            sort: 'created-desc',
            state: 'completed'
        };

        processInstancesApi.getProcessInstances(requestNode).then((data) => {
            assert.equal(data.data[0].name, 'Process Test Api - July 26th 2016');
            assert.equal(data.data[1].name, 'Process Test Api - July 26th 2016');
            assert.equal(data.size, 2);
            done();
        });
    });

    it('get activiti Process list', (done) => {
        processMock.get200Response();

        processInstancesApi.getProcessInstances({}).then((data) => {
            assert.equal(data.data[0].name, 'Process Test Api - July 26th 2016');
            assert.equal(data.data[1].name, 'Process Test Api - July 26th 2016');
            done();
        });
    });

    it('get process definition startForm', (done) => {
        processMock.get200getProcessDefinitionStartForm();
        const processDefinitionId = 'testProcess:1:7504';

        processDefinitionsApi.getProcessDefinitionStartForm(processDefinitionId).then((data) => {
            assert.equal(data.processDefinitionId, 'testProcess:1:7504');
            done();
        });
    });
});
