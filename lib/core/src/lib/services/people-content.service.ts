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
import { AlfrescoApiService } from './alfresco-api.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PeopleContentService {

    constructor(private apiService: AlfrescoApiService) {}

    private get peopleApi() {
       return this.apiService.getInstance().core.peopleApi;
    }

    /**
     * Gets information about a user identified by their username.
     * @param personId ID of the target user
     * @returns User information
     */
    getPerson(personId: string): Observable<any> {
        const promise = this.peopleApi.getPerson(personId);

        return from(promise).pipe(
            catchError((err) => of(err))
        );
    }

    /**
     * Gets information about the user who is currently logged in.
     * @returns User information
     */
    getCurrentPerson(): Observable<any> {
        return this.getPerson('-me-');
    }
}
