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
import { AlfrescoApi } from '../src';
import { EcmAuthMock, BpmAuthMock } from './mockObjects';

describe('Change config', () => {
    let authResponseBpmMock: BpmAuthMock;
    let authResponseMock: EcmAuthMock;
    let alfrescoJsApi: AlfrescoApi;

    beforeEach(async () => {
        const config = {
            hostBpm: 'https://127.0.0.1:9999',
            hostEcm: 'https://127.0.0.1:8080',
            provider: 'ALL'
        };

        authResponseBpmMock = new BpmAuthMock(config.hostBpm);
        authResponseMock = new EcmAuthMock(config.hostEcm);

        authResponseMock.get201Response();
        authResponseBpmMock.get200Response();

        alfrescoJsApi = new AlfrescoApi(config);
        await alfrescoJsApi.login('admin', 'admin');
    });

    describe('Change hosts', () => {
        it('Change host Ecm', () => {
            assert.equal(alfrescoJsApi.contentClient.basePath, 'https://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1');

            alfrescoJsApi.changeEcmHost('https://differenTserverEcm:9898');

            assert.equal(alfrescoJsApi.contentClient.basePath, 'https://differenTserverEcm:9898/alfresco/api/-default-/public/alfresco/versions/1');
        });

        it('Change host bpm', () => {
            assert.equal(alfrescoJsApi.processClient.basePath, 'https://127.0.0.1:9999/activiti-app');

            alfrescoJsApi.changeBpmHost('https://differenTserverBpm:2222');

            assert.equal(alfrescoJsApi.processClient.basePath, 'https://differenTserverBpm:2222/activiti-app');
        });

        it('Change host ecm bpm', () => {
            assert.equal(alfrescoJsApi.contentClient.basePath, 'https://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1');
            assert.equal(alfrescoJsApi.processClient.basePath, 'https://127.0.0.1:9999/activiti-app');

            alfrescoJsApi.changeEcmHost('https://differenTserverEcm:9898');
            alfrescoJsApi.changeBpmHost('https://differenTserverBpm:2222');

            assert.equal(alfrescoJsApi.contentClient.basePath, 'https://differenTserverEcm:9898/alfresco/api/-default-/public/alfresco/versions/1');
            assert.equal(alfrescoJsApi.processClient.basePath, 'https://differenTserverBpm:2222/activiti-app');
        });
    });
});
