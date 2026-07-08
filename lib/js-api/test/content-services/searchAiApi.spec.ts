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

import { AlfrescoApi, SearchAiApi } from '../../src';
import { EcmAuthMock, SearchAiMock } from '../mockObjects';
import assert from 'assert';

describe('SearchAiApi', () => {
    let searchAiApi: SearchAiApi;
    let searchAiMock: SearchAiMock;

    beforeEach((done) => {
        const hostEcm = 'https://127.0.0.1:8080';
        const authResponseMock = new EcmAuthMock(hostEcm);
        searchAiMock = new SearchAiMock(hostEcm);
        authResponseMock.get201Response();
        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });
        alfrescoJsApi.login('admin', 'admin').then(() => done());
        searchAiApi = new SearchAiApi(alfrescoJsApi);
    });

    describe('getConfig', () => {
        it('should load knowledge retrieval configuration', (done) => {
            searchAiMock.mockGetConfig200Response();

            searchAiApi.getConfig().then((config) => {
                assert.deepStrictEqual(config, {
                    entry: {
                        knowledgeRetrievalUrl: 'https://some-url'
                    }
                });
                done();
            });
        });
    });
});
