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

import { NodePaging } from 'alfresco-js-api';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';

@Injectable()
export class DeletedNodesApiService {
    constructor(
        private apiService: AlfrescoApiService,
        private preferences: UserPreferencesService
    ) {}

    private get nodesApi() {
       return this.apiService.getInstance().core.nodesApi;
    }

    getDeletedNodes(options?: Object): Observable<NodePaging> {
        const { nodesApi, handleError } = this;
        const defaultOptions = {
            include: [ 'path', 'properties' ],
            maxItems: this.preferences.paginationSize,
            skipCount: 0
        };
        const queryOptions = Object.assign(defaultOptions, options);
        const promise = nodesApi.getDeletedNodes(queryOptions);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    private handleError(error: any): Observable<any> {
        return Observable.of(error);
    }
}
