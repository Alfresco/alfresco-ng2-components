/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Observable, from, throwError, of } from 'rxjs';
import { AuthenticationService, AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { catchError, map, tap } from 'rxjs/operators';
import { PeopleApi, PersonBodyCreate, Pagination, PersonBodyUpdate } from '@alfresco/js-api';
import { EcmUserModel } from '../models/ecm-user.model';
import { ContentService } from './content.service';

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
    private currentUser: EcmUserModel;

    private _peopleApi: PeopleApi;
    get peopleApi(): PeopleApi {
        this._peopleApi = this._peopleApi ?? new PeopleApi(this.apiService.getInstance());
        return this._peopleApi;
    }

    constructor(
        private apiService: AlfrescoApiService,
        authenticationService: AuthenticationService,
        private logService: LogService,
        private contentService: ContentService
    ) {
        authenticationService.onLogout.subscribe(() => {
            this.resetLocalCurrentUser();
        });
    }

    /**
     * Gets information about a user identified by their username.
     *
     * @param personId ID of the target user
     * @returns User information
     */
    getPerson(personId: string): Observable<EcmUserModel> {
        return from(this.peopleApi.getPerson(personId))
            .pipe(
                map((personEntry) => new EcmUserModel(personEntry.entry)),
                tap(user => this.currentUser = user),
                catchError((error) => this.handleError(error)));
    }

    getCurrentPerson(): Observable<EcmUserModel> {
        return this.getCurrentUserInfo();
    }

    /**
     * Gets information about the current user alias -me-
     *
     * @returns User information
     */
    getCurrentUserInfo(): Observable<EcmUserModel> {
        if (this.currentUser) {
            return of(this.currentUser);
        }
        return this.getPerson('-me-');
    }

    /**
     * Used to know if the current user has the admin capability
     *
     * @returns true or false
     */
    isCurrentUserAdmin(): boolean {
        return this.currentUser?.isAdmin() ?? false;
    }

    /**
     * Reset the local current user object
     */
    resetLocalCurrentUser() {
        this.currentUser = undefined;
    }

    /**
     * Gets a list of people.
     *
     * @param requestQuery maxItems and skipCount parameters supported by JS-API
     * @returns Response containing pagination and list of entries
     */
    listPeople(requestQuery?: PeopleContentQueryRequestModel): Observable<PeopleContentQueryResponse> {
        const requestQueryParams = {skipCount: requestQuery?.skipCount, maxItems: requestQuery?.maxItems};
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

    /**
     * Returns a profile image as a URL.
     *
     * @param avatarId Target avatar
     * @returns Image URL
     */
    getUserProfileImage(avatarId: string): string {
        return this.contentService.getContentUrl(avatarId);
    }

    private buildOrderArray(sorting: PeopleContentSortingModel): string[] {
        return sorting?.orderBy && sorting?.direction ? [`${sorting.orderBy} ${sorting.direction.toUpperCase()}`] : [];
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
