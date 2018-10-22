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
import { Observable, Subject, from, throwError } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { SearchConfigurationService } from './search-configuration.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    dataLoaded: Subject<NodePaging> = new Subject();

    constructor(private apiService: AlfrescoApiService,
                private searchConfigurationService: SearchConfigurationService) {
    }

    getNodeQueryResults(term: string, options?: SearchOptions): Observable<NodePaging> {
        const promise = this.apiService.getInstance().core.queriesApi.findNodes(term, options);

        promise.then((data: any) => {
            this.dataLoaded.next(data);
        });

        return from(promise).pipe(
            catchError(err => this.handleError(err))
        );
    }

    search(searchTerm: string, maxResults: number, skipCount: number): Observable<NodePaging> {
        const searchQuery = Object.assign(this.searchConfigurationService.generateQueryBody(searchTerm, maxResults, skipCount));
        const promise = this.apiService.getInstance().search.searchApi.search(searchQuery);

        promise.then((data: any) => {
            this.dataLoaded.next(data);
        });

        return from(promise).pipe(
            catchError(err => this.handleError(err))
        );
    }

    searchByQueryBody(queryBody: QueryBody): Observable<NodePaging> {
        const promise = this.apiService.getInstance().search.searchApi.search(queryBody);

        promise.then((data: any) => {
            this.dataLoaded.next(data);
        });

        return from(promise).pipe(
            catchError(err => this.handleError(err))
        );
    }

    private handleError(error: any): Observable<any> {
        return throwError(error || 'Server error');
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
