/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { NodePaging, QueryBody } from 'alfresco-js-api';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';

import { AlfrescoApiService } from './alfresco-api.service';
import { SearchConfigurationService } from './search-configuration.service';

@Injectable()
export class SearchService {

    dataLoaded: Subject<NodePaging> = new Subject();

    constructor(private apiService: AlfrescoApiService,
                private searchConfigurationService: SearchConfigurationService) {
    }

    async getNodeQueryResults(term: string, options?: SearchOptions): Promise<NodePaging> {
        const data = await this.apiService.getInstance().core.queriesApi.findNodes(term, options);

        this.dataLoaded.next(data);
        return data;
    }

    async search(searchTerm: string, maxResults: number, skipCount: number): Promise<NodePaging> {
        const searchQuery = this.searchConfigurationService.generateQueryBody(searchTerm, maxResults, skipCount);
        const data = await this.apiService.searchApi.search(searchQuery);

        this.dataLoaded.next(data);
        return data;
    }

    async searchByQueryBody(queryBody: QueryBody): Promise<NodePaging> {
        const data = await this.apiService.searchApi.search(queryBody);

        this.dataLoaded.next(data);
        return data;
    }
}

export interface SearchOptions {
    skipCount?: number;
    maxItems?: number;
    rootNodeId?: string;
    nodeType?: string;
    include?: string[];
    orderBy?: string;
    fields?: string[];
}
