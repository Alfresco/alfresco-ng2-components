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
import { Observable, from, throwError } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { catchError, map } from 'rxjs/operators';
import { PersonEntry, PeopleApi, PersonBodyCreate } from '@alfresco/js-api';
import { EcmUserModel } from '../models/ecm-user.model';
import { LogService } from './log.service';

@Injectable({
    providedIn: 'root'
})
export class PeopleContentService {

    private _peopleApi: PeopleApi;

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {}

    get peopleApi() {
        return this._peopleApi || (this._peopleApi = new PeopleApi(this.apiService.getInstance()));
    }

    /**
     * Gets information about a user identified by their username.
     * @param personId ID of the target user
     * @returns User information
     */
    getPerson(personId: string): Observable<any> {
        const promise = this.peopleApi.getPerson(personId);

        return from(promise).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Gets information about the user who is currently logged in.
     * @returns User information
     */
    getCurrentPerson(): Observable<any> {
        return this.getPerson('-me-');
    }

    /**
     * Creates new person.
     * @param newPerson Object containing the new person details.
     * @returns Created new person
     */
    createPerson(newPerson: PersonBodyCreate, opts?: any): Observable<EcmUserModel> {;
        return from(this.peopleApi.createPerson(newPerson, opts)).pipe(
            map((res: PersonEntry) => <EcmUserModel> res?.entry),
            catchError((error) => this.handleError(error))
        );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
