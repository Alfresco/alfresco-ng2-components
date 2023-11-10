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

import { expect } from 'chai';
import { AlfrescoApi } from '../../src/alfrescoApi';
import { ModelJsonBpmnApi } from '../../src/api/activiti-rest-api';
import { BpmAuthMock, ModelJsonBpmMock } from '../mockObjects';

describe('Activiti Model JsonBpmn Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let modelJsonBpmMock: ModelJsonBpmMock;
    let modelJsonBpmnApi: ModelJsonBpmnApi;

    beforeEach(async () => {
        const hostBpm = 'http://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(hostBpm);
        authResponseBpmMock.get200Response();

        modelJsonBpmMock = new ModelJsonBpmMock(hostBpm);

        const alfrescoJsApi = new AlfrescoApi({
            hostBpm,
            provider: 'BPM'
        });

        modelJsonBpmnApi = new ModelJsonBpmnApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    it('get Model JsonBpmn', async () => {
        modelJsonBpmMock.get200EditorDisplayJsonClient();
        const data = await modelJsonBpmnApi.getEditorDisplayJsonClient(1);
        expect(data).not.equal(null);
    });

    it('get Model JsonBpmn history', async () => {
        modelJsonBpmMock.get200HistoricEditorDisplayJsonClient();
        const data = await modelJsonBpmnApi.getHistoricEditorDisplayJsonClient(1, 1);
        expect(data).not.equal(null);
    });
});
