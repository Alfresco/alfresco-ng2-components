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

    describe('ask', () => {
        it('should load question information', (done) => {
            searchAiMock.mockGetAsk200Response();

            searchAiApi
                .ask([
                    {
                        question: 'some question 1',
                        nodeIds: ['some node id 1'],
                        agentId: 'id1'
                    }
                ])
                .then((questions) => {
                    assert.deepStrictEqual(questions, {
                        questionId: 'some id 1',
                        question: 'some question 1',
                        restrictionQuery: {
                            nodesIds: ['some node id 1']
                        }
                    });
                    done();
                });
        });
    });

    describe('getAnswer', () => {
        it('should load question answer', (done) => {
            searchAiMock.mockGetAnswer200Response();

            searchAiApi.getAnswer('id1').then((answer) => {
                assert.deepStrictEqual(answer, {
                    entry: {
                        answer: 'Some answer 1',
                        complete: true,
                        question: 'Some question',
                        objectReferences: [
                            {
                                objectId: 'some id 1',
                                references: [
                                    {
                                        referenceId: 'some reference id 1',
                                        rank: 1,
                                        rankScore: 0.005
                                    },
                                    {
                                        referenceId: 'some reference id 2',
                                        rank: 2,
                                        rankScore: 0.004
                                    }
                                ]
                            },
                            {
                                objectId: 'some id 2',
                                references: [
                                    {
                                        referenceId: 'some reference id 3',
                                        rank: 1,
                                        rankScore: 0.005
                                    },
                                    {
                                        referenceId: 'some reference id 4',
                                        rank: 2,
                                        rankScore: 0.004
                                    }
                                ]
                            }
                        ]
                    }
                });
                done();
            });
        });
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
