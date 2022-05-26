/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { Observable, from, of } from 'rxjs';

import { NodePaging } from '@alfresco/js-api';
import { UserPreferencesService } from './user-preferences.service';
import { catchError } from 'rxjs/operators';
import { ApiClientsService } from '@alfresco/adf-core/api';

@Injectable({
    providedIn: 'root'
})
export class DeletedNodesApiService {

    get nodesApi() {
        return this.apiClientsService.get('ContentClient.nodes');
    }

    get trashcanApi() {
        return this.apiClientsService.get('ContentClient.trashcan');
    }

    constructor(
        private preferences: UserPreferencesService,
        private apiClientsService: ApiClientsService
    ) {}

    /**
     * Gets a list of nodes in the trash.
     *
     * @param options Options for JS-API call
     * @returns List of nodes in the trash
     */
    getDeletedNodes(options?: any): Observable<NodePaging> {
        const defaultOptions = {
            include: ['path', 'properties'],
            maxItems: this.preferences.paginationSize,
            skipCount: 0
        };
        const queryOptions = Object.assign(defaultOptions, options);
        const promise = this.trashcanApi.listDeletedNodes(queryOptions);

        return from(promise).pipe(
            catchError((err) => of(err))
        );
    }
}
