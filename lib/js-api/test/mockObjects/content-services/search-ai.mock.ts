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

import { BaseMock } from '../base.mock';
import nock from 'nock';

export class SearchAiMock extends BaseMock {
    mockGetAsk200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/private/hxi/versions/1/agents/id1/questions', [
                {
                    question: 'some question 1',
                    restrictionQuery: {
                        nodesIds: ['some node id 1']
                    }
                }
            ])
            .reply(200, {
                entry: {
                    question: 'some question 1',
                    questionId: 'some id 1',
                    restrictionQuery: {
                        nodesIds: ['some node id 1']
                    }
                }
            });
    }

    mockGetAnswer200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/private/hxi/versions/1/questions/id1/answers/-default-')
            .reply(200, {
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
    }

    mockGetConfig200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/private/hxi/versions/1/config/-default-')
            .reply(200, {
                entry: {
                    knowledgeRetrievalUrl: 'https://some-url'
                }
            });
    }
}
