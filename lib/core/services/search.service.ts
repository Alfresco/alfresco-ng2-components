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
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import 'rxjs/add/observable/throw';

/**
 * Internal service used by Document List component.
 */
@Injectable()
export class SearchService {

    constructor(public authService: AuthenticationService,
                private apiService: AlfrescoApiService) {
    }

    getNodeQueryResults(term: string, options?: SearchOptions): Observable<NodePaging> {
        return Observable.fromPromise(this.apiService.getInstance().core.queriesApi.findNodes(term, options))
            .map(res => <NodePaging> res)
            .catch(err => this.handleError(err));
    }

    search(query: QueryBody): Observable<NodePaging> {
        const searchQuery = Object.assign(query);
        const promise = this.apiService.getInstance().search.searchApi.search(searchQuery);

        return Observable
            .fromPromise(promise)
            .catch(err => this.handleError(err));
    }

    private handleError(error: any): Observable<any> {
        return Observable.throw(error || 'Server error');
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
