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
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';

/**
 * Internal service used by Document List component.
 */
@Injectable()
export class AlfrescoSearchService {

    constructor(private authService: AlfrescoAuthenticationService) {
    }

    /**
     * Execute a search against the repository
     *
     * @param term Search term
     * @returns {Observable<NodePaging>} Search results
     */
    public getLiveSearchResults(term: string): Observable<any> {
        return Observable.fromPromise(this.getSearchNodesPromise(term))
            .map(res => <any> res)
            .catch(this.handleError);
    }

    private getSearchNodesPromise(term: string) {
        let nodeId = '-root-';
        let opts = {
            include: ['path'],
            rootNodeId: nodeId,
            nodeType: 'cm:content'
        };
        return this.authService.getAlfrescoApi().core.searchApi.liveSearchNodes(term, opts);
    }

    private handleError(error: any): Observable<any> {
        return Observable.throw(error || 'Server error');
    }
}
