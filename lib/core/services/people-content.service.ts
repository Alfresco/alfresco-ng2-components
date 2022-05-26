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
import { ApiClientsService } from '@alfresco/adf-core/api';
import { catchError, map } from 'rxjs/operators';
import { PersonEntry, PersonBodyCreate, Pagination, PersonBodyUpdate } from '@alfresco/js-api';
import { EcmUserModel } from '../models/ecm-user.model';
import { LogService } from './log.service';
import { AuthenticationService } from './authentication.service';

// eslint-disable-next-line no-shadow
export enum ContentGroups {
    ALFRESCO_ADMINISTRATORS = 'ALFRESCO_ADMINISTRATORS'
}

export interface PeopleContentQueryResponse {
    pagination: Pagination;
    entries: EcmUserModel[];
}

export interface PeopleContentSortingModel {
    orderBy: string;
    direction: string;
}

export interface PeopleContentQueryRequestModel {
    skipCount?: number;
    maxItems?: number;
    sorting?: PeopleContentSortingModel;
}

@Injectable({
    providedIn: 'root'
})
export class PeopleContentService {
    private hasContentAdminRole: boolean = false;
    hasCheckedIsContentAdmin: boolean = false;

    get peopleApi() {
        return this.apiClientsService.get('ContentClient.people');
    }

    constructor(
        private apiClientsService: ApiClientsService,
        authenticationService: AuthenticationService,
        private logService: LogService
    ) {
        authenticationService.onLogout.subscribe(() => {
            this.hasCheckedIsContentAdmin = false;
            this.hasContentAdminRole = false;
        });
    }

    /**
     * Gets information about a user identified by their username.
     *
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
     *
     * @returns User information
     */
    getCurrentPerson(): Observable<any> {
        return this.getPerson('-me-');
    }

    /**
     * Gets a list of people.
     *
     * @param requestQuery maxItems and skipCount parameters supported by JS-API
     * @returns Response containing pagination and list of entries
     */
    listPeople(requestQuery?: PeopleContentQueryRequestModel): Observable<PeopleContentQueryResponse> {
        const requestQueryParams = { skipCount: requestQuery?.skipCount, maxItems: requestQuery?.maxItems };
        const orderBy = this.buildOrderArray(requestQuery?.sorting);
        if (orderBy.length) {
            requestQueryParams['orderBy'] = orderBy;
        }

        const promise = this.peopleApi.listPeople(requestQueryParams);
        return from(promise).pipe(
            map(response => ({
                pagination: response.list.pagination,
                entries: response.list.entries.map((person) => person.entry as EcmUserModel)
            })),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Creates new person.
     *
     * @param newPerson Object containing the new person details.
     * @param opts Optional parameters
     * @returns Created new person
     */
    createPerson(newPerson: PersonBodyCreate, opts?: any): Observable<EcmUserModel> {
        return from(this.peopleApi.createPerson(newPerson, opts)).pipe(
            map((res) => res?.entry as EcmUserModel),
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Updates the person details
     *
     * @param personId The identifier of a person
     * @param details The person details
     * @param opts Optional parameters
     * @returns Updated person model
     */
    updatePerson(personId: string, details: PersonBodyUpdate, opts?: any): Observable<EcmUserModel> {
        return from(this.peopleApi.updatePerson(personId, details, opts)).pipe(
            map((res) => res?.entry as EcmUserModel),
            catchError((error) => this.handleError(error))
        );
    }

    async isContentAdmin(): Promise<boolean> {
        if (!this.hasCheckedIsContentAdmin) {
            const user: PersonEntry = await this.getCurrentPerson().toPromise();
            this.hasContentAdminRole = user?.entry?.capabilities?.isAdmin;
            this.hasCheckedIsContentAdmin = true;
        }
        return this.hasContentAdminRole;
    }

    private buildOrderArray(sorting: PeopleContentSortingModel): string[] {
        return sorting?.orderBy && sorting?.direction ? [`${sorting.orderBy} ${sorting.direction.toUpperCase()}`] : [];
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
