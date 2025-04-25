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

import { TestBed } from '@angular/core/testing';
import { AiAnswerEntry, KnowledgeRetrievalConfigEntry, Node, QuestionModel, QuestionRequest } from '@alfresco/js-api';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { SearchAiService } from './search-ai.service';
import { SearchAiInputState } from '../models/search-ai-input-state';
import { TranslateService } from '@ngx-translate/core';

describe('SearchAiService', () => {
    let service: SearchAiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        service = TestBed.inject(SearchAiService);
    });

    describe('ask', () => {
        it('should load information about question', (done) => {
            const question: QuestionModel = {
                question: 'some question',
                questionId: 'some id',
                restrictionQuery: { nodesIds: ['nodeId1', 'nodeId2'] }
            };
            spyOn(service.searchAiApi, 'ask').and.returnValue(Promise.resolve(question));
            const questionRequest: QuestionRequest = {
                question: 'some question',
                nodeIds: ['nodeId1', 'nodeId2'],
                agentId: 'some id'
            };

            service.ask(questionRequest).subscribe((questionResponse) => {
                expect(questionResponse).toBe(question);
                expect(service.searchAiApi.ask).toHaveBeenCalledWith([questionRequest]);
                done();
            });
        });
    });

    describe('getAnswer', () => {
        it('should load information about question', (done) => {
            const questionId = 'some id';
            const answer: AiAnswerEntry = {
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
            };
            spyOn(service.searchAiApi, 'getAnswer').and.returnValue(Promise.resolve(answer));

            service.getAnswer(questionId).subscribe((answerResponse) => {
                expect(answerResponse).toBe(answer);
                expect(service.searchAiApi.getAnswer).toHaveBeenCalledWith(questionId);
                done();
            });
        });
    });

    describe('getConfig', () => {
        it('should load knowledge retrieval configuration', (done) => {
            const config: KnowledgeRetrievalConfigEntry = {
                entry: {
                    knowledgeRetrievalUrl: 'https://some-url'
                }
            };
            spyOn(service.searchAiApi, 'getConfig').and.returnValue(Promise.resolve(config));

            service.getConfig().subscribe((configResponse) => {
                expect(configResponse).toBe(config);
                expect(service.searchAiApi.getConfig).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('updateSearchAiInputState', () => {
        it('should trigger toggleSearchAiInput$', () => {
            const state: SearchAiInputState = {
                active: true,
                selectedAgentId: 'some id'
            };
            service.updateSearchAiInputState(state);

            service.toggleSearchAiInput$.subscribe((receivedState) => {
                expect(receivedState).toBe(state);
            });
        });
    });

    describe('checkSearchAvailability', () => {
        let translateService: TranslateService;

        const tooManyFilesSelectedError = 'Please select no more than 100 files.';
        const folderSelectedError = 'Folders are not compatible with AI Agents.';

        beforeEach(() => {
            translateService = TestBed.inject(TranslateService);
            spyOn(translateService, 'instant').and.callFake((key) => {
                switch (key) {
                    case 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.TOO_MANY_FILES_SELECTED':
                        return tooManyFilesSelectedError;
                    case 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.FOLDER_SELECTED':
                        return folderSelectedError;
                    default:
                        return '';
                }
            });
        });

        it('should not return error if user did not select any files', () => {
            expect(
                service.checkSearchAvailability({
                    count: 0,
                    nodes: [],
                    libraries: [],
                    isEmpty: true
                })
            ).toEqual('');
        });

        it('should return error for too many files selected', () => {
            expect(
                service.checkSearchAvailability({
                    count: 101,
                    nodes: [],
                    libraries: [],
                    isEmpty: false
                })
            ).toBe(tooManyFilesSelectedError);
            expect(translateService.instant).toHaveBeenCalledWith('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.TOO_MANY_FILES_SELECTED', {
                maxFiles: 100,
                key: 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.TOO_MANY_FILES_SELECTED'
            });
        });

        it('should return error for folder selected', () => {
            expect(
                service.checkSearchAvailability({
                    count: 1,
                    nodes: [
                        {
                            entry: {
                                isFolder: true
                            } as Node
                        }
                    ],
                    libraries: [],
                    isEmpty: false
                })
            ).toBe(folderSelectedError);
        });

        it('should return error for folder and if non text mime type node is selected', () => {
            expect(
                service.checkSearchAvailability({
                    count: 1,
                    nodes: [
                        {
                            entry: {
                                isFolder: true,
                                content: {
                                    mimeType: 'some mime type',
                                    mimeTypeName: 'some mime type',
                                    sizeInBytes: 100
                                }
                            } as Node
                        }
                    ],
                    libraries: [],
                    isEmpty: false
                })
            ).toBe(folderSelectedError);
        });

        it('should return more than one error if more validators detected issues', () => {
            expect(
                service.checkSearchAvailability({
                    count: 101,
                    nodes: [
                        {
                            entry: {
                                isFolder: true,
                                content: {
                                    mimeType: 'image/jpeg',
                                    mimeTypeName: 'image/jpeg',
                                    sizeInBytes: 100
                                }
                            } as Node
                        }
                    ],
                    libraries: [],
                    isEmpty: false
                })
            ).toBe(`${tooManyFilesSelectedError} ${folderSelectedError}`);
        });
    });
});
