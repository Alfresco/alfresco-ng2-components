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

@Injectable()
export class SearchApiService {

    constructor(private apiService: AlfrescoApiService) {}

    private get searchApi() {
       return this.apiService.getInstance().search.searchApi;
    }

    search(query: any): Observable<NodePaging> {
        const { searchApi, handleError } = this;
        const searchQuery = Object.assign(query);
        const promise = searchApi.search(searchQuery);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    private handleError(error): Observable<any> {
        return Observable.of(error);
    }
}
