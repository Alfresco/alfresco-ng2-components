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
import { NodePaging } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';

@Injectable()
export class SharedLinksApiService {

    constructor(
        private apiService: AlfrescoApiService,
        private preferences: UserPreferencesService) {}

    private get sharedLinksApi() {
       return this.apiService.getInstance().core.sharedlinksApi;
    }

    getSharedLinks(options: any = {}): Observable<NodePaging> {
        const { sharedLinksApi, handleError } = this;
        const defaultOptions = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            include: [ 'properties', 'allowableOperations' ]
        };
        const queryOptions = Object.assign({}, defaultOptions, options);
        const promise = sharedLinksApi
            .findSharedLinks(queryOptions);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    private handleError(error: any): Observable<any> {
        return Observable.of(error);
    }
}
