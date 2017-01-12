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
import { Observable } from 'rxjs/Rx';
import { AuthService, AlfrescoApiService } from 'ng2-alfresco-core';

/**
 * Internal service used by Document List component.
 */
@Injectable()
export class AlfrescoSearchService {

    constructor(public authService: AuthService,
                private apiService: AlfrescoApiService) {
    }

    /**
     * Execute a search against the repository
     *
     * @param term Search term
     * @param options Additional options passed to the search
     * @returns {Observable<NodePaging>} Search results
     */
    public getNodeQueryResults(term: string, options?: SearchOptions): Observable<any> {
        return Observable.fromPromise(this.getQueryNodesPromise(term, options))
            .map(res => <any> res)
            .catch(err => this.handleError(err));
    }

    private getQueryNodesPromise(term: string, opts: SearchOptions) {
        return this.apiService.getInstance().core.queriesApi.findNodes(term, opts);
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
