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
    private toggleSearchAiInput = new BehaviorSubject<SearchAiInputState>({
        active: false
    });
    private readonly textFileMimeTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'application/rtf',
        'text/plain',
        'application/pdf'
    ];
    private _searchAiApi: SearchAiApi;

    get searchAiApi(): SearchAiApi {
        this._searchAiApi = this._searchAiApi ?? new SearchAiApi(this.apiService.getInstance());
        return this._searchAiApi;
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
     * @param mocked temporary parameter to mock returned information about question. Should be removed when backend implemented.
     * @returns QuestionModel object containing information about questions.
     */
    ask(question: QuestionRequest, mocked = true): Observable<QuestionModel> {
        return mocked
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
     * @param mocked temporary parameter to mock answer on question. Should be removed when backend implemented.
     * @returns AiAnswerPaging object containing the answer.
     */
    getAnswer(questionId: string, mocked = true): Observable<AiAnswerPaging> {
        return mocked
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
                                          referenceId: '6adde3ef-a7b0-42f8-85a2-f9882dc531d4',
                                          referenceText: 'some type'
                                      },
                                      {
                                          referenceId: '3a00859f-b012-4b0c-b7a5-6bd02d022dc6',
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
     * @returns string with error if any condition is not met, empty string otherwise.
     */
    checkSearchAvailability(selectedNodesState: SelectionState): string {
        const messages: string[] = [];
        if (selectedNodesState.count === 0) {
            messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.NO_FILES_SELECTED');
        }
        if (selectedNodesState.count > 100) {
            messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.TOO_MANY_FILES_SELECTED');
        }
        if (selectedNodesState.nodes.some((node) => !node.entry.isFolder && !this.textFileMimeTypes.includes(node.entry.content.mimeType))) {
            messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.NON_TEXT_FILE_SELECTED');
        }
        if (selectedNodesState.nodes.some((node) => node.entry.isFolder)) {
            messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.FOLDER_SELECTED');
        }
        return messages.map((message) => this.translateService.instant(message)).join(' ');
    }
}
