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
import { PersonEntry, PeopleApi, PersonBodyCreate, Pagination, GroupsApi, GroupEntry } from '@alfresco/js-api';
import { EcmUserModel } from '../models/ecm-user.model';
import { LogService } from './log.service';
import { ContentGroupModel } from '../models/content-group.model';

export enum ContentGroups {
    ALFRESCO_ADMINISTRATORS = 'ALFRESCO_ADMINISTRATORS'
}

export interface PeopleContentQueryResponse {
    pagination: Pagination;
    entries: EcmUserModel[];
}

export interface PeopleContentQueryRequestModel {
    skipCount: number;
    maxItems: number;
}

export interface PeopleContentGroupsQueryResponse {
    pagination: Pagination;
    entries: ContentGroupModel[];
}

@Injectable({
    providedIn: 'root'
})
export class PeopleContentService {
    private hasContentAdminRole: boolean = false;
    hasCheckedIsContentAdmin: boolean = false;

    private _peopleApi: PeopleApi;
    private _groupsApi: GroupsApi;

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {}

    get peopleApi() {
        return this._peopleApi || (this._peopleApi = new PeopleApi(this.apiService.getInstance()));
    }

    get groupsApi() {
        return this._groupsApi || (this._groupsApi = new GroupsApi(this.apiService.getInstance()));
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
     * Gets a list of groups a user is a member of
     * @param personId ID of the target user
     * @param options Optional parameters
     * @returns Response containing pagination and list of entries
     */
    listGroupMemberships(personId: string, options?: any): Observable<PeopleContentGroupsQueryResponse> {
        const promise = this.groupsApi.listGroupMembershipsForPerson(personId, options);

        return from(promise).pipe(
            map(response => {
                return {
                    pagination: response.list.pagination,
                    entries: response.list.entries.map((group: GroupEntry) => <ContentGroupModel> group.entry)
                };
            }),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Gets a list of people.
     * @param requestQuery maxItems and skipCount parameters supported by JS-API
     * @returns Response containing pagination and list of entries
     */
    listPeople(requestQuery?: PeopleContentQueryRequestModel): Observable<PeopleContentQueryResponse> {
        const promise = this.peopleApi.listPeople(requestQuery);
        return from(promise).pipe(
            map(response => {
                return {
                    pagination: response.list.pagination,
                    entries: response.list.entries.map((person: PersonEntry) => <EcmUserModel> person.entry)
                };
            }),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Creates new person.
     * @param newPerson Object containing the new person details.
     * @param opts Optional parameters
     * @returns Created new person
     */
    createPerson(newPerson: PersonBodyCreate, opts?: any): Observable<EcmUserModel> {
        return from(this.peopleApi.createPerson(newPerson, opts)).pipe(
            map((res: PersonEntry) => <EcmUserModel> res?.entry),
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

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
