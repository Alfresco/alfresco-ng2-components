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

import { Injectable } from '@angular/core';
import { AiAnswerEntry, KnowledgeRetrievalConfigEntry, QuestionModel, QuestionRequest, SearchAiApi } from '@alfresco/js-api';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { TranslateService } from '@ngx-translate/core';
import { SearchAiInputState } from '../models/search-ai-input-state';
import { AlfrescoApiService } from '../../services';

@Injectable({
    providedIn: 'root'
})
export class SearchAiService {
    private toggleSearchAiInput = new BehaviorSubject<SearchAiInputState>({
        active: false
    });
    private _searchAiApi: SearchAiApi;

    get searchAiApi(): SearchAiApi {
        this._searchAiApi = this._searchAiApi ?? new SearchAiApi(this.apiService.getInstance());
        return this._searchAiApi;
    }

    toggleSearchAiInput$ = this.toggleSearchAiInput.asObservable();

    constructor(private apiService: AlfrescoApiService, private translateService: TranslateService) {}

    /**
     * Update the state of the search AI input.
     * @param state The new state of the search AI input.
     */
    updateSearchAiInputState(state: SearchAiInputState): void {
        this.toggleSearchAiInput.next(state);
    }

    /**
     * Ask a question to the AI.
     * @param question The question to ask.
     * @returns QuestionModel object containing information about questions.
     */
    ask(question: QuestionRequest): Observable<QuestionModel> {
        return from(this.searchAiApi.ask([question]));
    }

    /**
     * Get an answer to specific question.
     * @param questionId The ID of the question to get an answer for.
     * @returns AiAnswerEntry object containing the answer.
     */
    getAnswer(questionId: string): Observable<AiAnswerEntry> {
        return from(this.searchAiApi.getAnswer(questionId));
    }

    /**
     * Get the knowledge retrieval configuration.
     * @returns KnowledgeRetrievalConfigEntry object containing the configuration.
     */
    getConfig(): Observable<KnowledgeRetrievalConfigEntry> {
        return from(this.searchAiApi.getConfig());
    }

    /**
     * Check if using of search is possible (if all conditions are met).
     * @param selectedNodesState information about selected nodes.
     * @param maxSelectedNodes max number of selected nodes. Default 100.
     * @returns string with error if any condition is not met, empty string otherwise.
     */
    checkSearchAvailability(selectedNodesState: SelectionState, maxSelectedNodes = 100): string {
        const messages: {
            key: string;
            [parameter: string]: number | string;
        }[] = [];
        if (selectedNodesState.count > maxSelectedNodes) {
            messages.push({
                key: 'KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.TOO_MANY_FILES_SELECTED',
                maxFiles: maxSelectedNodes
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
