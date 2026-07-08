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

import { Injectable, inject } from '@angular/core';
import { KnowledgeRetrievalConfigEntry, LazyApi, SearchAiApi } from '@alfresco/js-api';
import { from, Observable } from 'rxjs';
import { AlfrescoApiService } from '../../services';

@Injectable({
    providedIn: 'root'
})
export class SearchAiService {
    private readonly apiService = inject(AlfrescoApiService);

    @LazyApi((self: SearchAiService) => new SearchAiApi(self.apiService.getInstance()))
    declare readonly searchAiApi: SearchAiApi;

    /**
     * Get the knowledge retrieval configuration.
     *
     * @returns KnowledgeRetrievalConfigEntry object containing the configuration.
     */
    getConfig(): Observable<KnowledgeRetrievalConfigEntry> {
        return from(this.searchAiApi.getConfig());
    }
}
