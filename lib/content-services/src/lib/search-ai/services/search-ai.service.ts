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

import { Injectable } from '@angular/core';
import { AiAnswerPaging, QuestionModel, QuestionRequest, SearchAiApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionState } from '@alfresco/adf-extensions';
import { TranslateService } from '@ngx-translate/core';
import { SearchAiInputState } from '../models/search-ai-input-state';

@Injectable({
    providedIn: 'root'
})
export class SearchAiService {
    private readonly textFileMimeTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'application/rtf',
        'text/plain',
        'application/pdf'
    ];

    private toggleSearchAiInput = new BehaviorSubject<SearchAiInputState>({
        active: false
    });
    private _searchAiApi: SearchAiApi;
    private _mocked = true;

    get searchAiApi(): SearchAiApi {
        this._searchAiApi = this._searchAiApi ?? new SearchAiApi(this.apiService.getInstance());
        return this._searchAiApi;
    }

    set mocked(mocked: boolean) {
        this._mocked = mocked;
    }

    toggleSearchAiInput$ = this.toggleSearchAiInput.asObservable();

    constructor(private apiService: AlfrescoApiService, private translateService: TranslateService) {}

    /**
     * Update the state of the search AI input.
     *
     * @param state The new state of the search AI input.
     */
    updateSearchAiInputState(state: SearchAiInputState): void {
        this.toggleSearchAiInput.next(state);
    }

    /**
     * Ask a question to the AI.
     *
     * @param question The question to ask.
     * @returns QuestionModel object containing information about questions.
     */
    ask(question: QuestionRequest): Observable<QuestionModel> {
        return this._mocked
            ? of({
                  question: 'Some question',
                  questionId: 'some id',
                  restrictionQuery: 'Some restriction query'
              })
            : from(this.searchAiApi.ask([question])).pipe(map((questions) => questions[0]));
    }

    /**
     * Get an answer to specific question.
     *
     * @param questionId The ID of the question to get an answer for.
     * @returns AiAnswerPaging object containing the answer.
     */
    getAnswer(questionId: string): Observable<AiAnswerPaging> {
        return this._mocked
            ? of({
                  list: {
                      pagination: {
                          count: 1,
                          hasMoreItems: false,
                          totalItems: 1,
                          skipCount: 0,
                          maxItems: 100
                      },
                      entries: [
                          {
                              entry: {
                                  answer: 'Some answer',
                                  questionId: 'some id',
                                  references: [
                                      {
                                          referenceId: '6ee094b5-f51b-411e-88f8-31b41784ff18',
                                          referenceText: 'some type'
                                      },
                                      {
                                          referenceId: '853518e9-071a-41bb-a30c-7e564d4f3382',
                                          referenceText: 'some type'
                                      }
                                  ]
                              }
                          }
                      ]
                  }
              })
            : from(this.searchAiApi.getAnswer(questionId));
    }

    /**
     * Check if using of search is possible (if all conditions are met).
     *
     * @param selectedNodesState information about selected nodes.
     * @param maxSelectedNodes max number of selected nodes. Default 100.
     * @returns string with error if any condition is not met, empty string otherwise.
     */
    checkSearchAvailability(selectedNodesState: SelectionState, maxSelectedNodes = 100): string {
        const messages: {
            key: string;
            [parameter: string]: number | string;
        }[] = [];
        if (selectedNodesState.count === 0) {
            messages.push({
                key: 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.NO_FILES_SELECTED'
            });
        }
        if (selectedNodesState.count > maxSelectedNodes) {
            messages.push({
                key: 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.TOO_MANY_FILES_SELECTED',
                maxFiles: maxSelectedNodes
            });
        }
        if (selectedNodesState.nodes.some((node) => !node.entry.isFolder && !this.textFileMimeTypes.includes(node.entry.content.mimeType))) {
            messages.push({
                key: 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.NON_TEXT_FILE_SELECTED'
            });
        }
        if (selectedNodesState.nodes.some((node) => node.entry.isFolder)) {
            messages.push({
                key: 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.FOLDER_SELECTED'
            });
        }
        return messages.map((message) => this.translateService.instant(message.key, message)).join(' ');
    }
}
