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
import { AlfrescoApi, ModelsApi } from '../../src';
import { BpmAuthMock, ModelsMock } from '../mockObjects';
import nock from 'nock';

describe('Activiti Models Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let modelsMock: ModelsMock;
    let modelsApi: ModelsApi;

    beforeEach(async () => {
        nock.cleanAll();
        const hostBpm = 'https://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(hostBpm);
        authResponseBpmMock.get200Response();

        modelsMock = new ModelsMock(hostBpm);

        const alfrescoJsApi = new AlfrescoApi({
            hostBpm,
            provider: 'BPM'
        });

        modelsApi = new ModelsApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    it('get activiti model', async () => {
        modelsMock.get200getModels();

        const opts = {
            filter: 'myReusableForms',
            modelType: 2
        };

        const data = await modelsApi.getModels(opts);
        assert.equal(data.data[0].name, 'Metadata');
    });
});
