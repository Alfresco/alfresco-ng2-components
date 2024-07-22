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
            searchAiMock.getAsk200Response();
            searchAiApi
                .ask([
                    {
                        question: 'some question 1',
                        nodeIds: ['some node id 1']
                    },
                    {
                        question: 'some question 2',
                        nodeIds: ['some node id 2', 'some node id 3']
                    }
                ])
                .then((questions) => {
                    assert.equal(questions.length, 2);
                    assert.deepStrictEqual(questions[0], {
                        questionId: 'some id 1',
                        question: 'some question 1',
                        restrictionQuery: 'some node id 1'
                    });
                    assert.deepStrictEqual(questions[1], {
                        questionId: 'some id 2',
                        question: 'some question 2',
                        restrictionQuery: 'some node id 2,some node id 3'
                    });
                    done();
                });
        });
    });

    describe('getAnswer', () => {
        it('should load question answer', (done) => {
            searchAiMock.getAsk200Response();
            searchAiApi.getAnswer('some id').then((questions) => {
                assert.equal(questions.length, 2);
                assert.deepStrictEqual(questions[0], {
                    questionId: 'some id 1',
                    question: 'some question 1',
                    restrictionQuery: 'some node id 1'
                });
                assert.deepStrictEqual(questions[1], {
                    questionId: 'some id 2',
                    question: 'some question 2',
                    restrictionQuery: 'some node id 2,some node id 3'
                });
                done();
            });
        });
    });
});
