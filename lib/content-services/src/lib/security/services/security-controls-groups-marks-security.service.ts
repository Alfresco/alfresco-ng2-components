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
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { SecurityControlsGroupResponse } from './models/security-controls-group-response.interface';
import { SecurityControlsMarkResponse } from './models/security-controls-mark-response.interface';
import {
    SecurityGroupsApi,
    SecurityMarksApi,
    SecurityGroupEntry,
    SecurityMarkEntry,
    SecurityGroupBody,
    SecurityMarkPaging,
    SecurityMarkBody,
    SecurityGroupPaging,
    AuthorityClearanceApi,
    AuthorityClearanceGroupPaging,
    NodeSecurityMarkBody
} from '@alfresco/js-api';
import { AlfrescoApiService, UserPreferencesService } from '@alfresco/adf-core';
import { finalize } from 'rxjs/operators';

const DEFAULT_SKIP_COUNT = 0;
const DEFAULT_INCLUDE = 'inUse';

@Injectable({ providedIn: 'root' })
export class SecurityControlsService {
    private groupsPaginatedSource = new Subject<SecurityControlsGroupResponse>();
    groupsPaginated$ = this.groupsPaginatedSource.asObservable();

    private reloadSecurityControls: Subject<void> = new Subject<void>();
    reloadSecurityControls$ = this.reloadSecurityControls.asObservable();

    private _reloadAuthorityClearance: Subject<void> = new Subject<void>();
    reloadAuthorityClearance$ = this._reloadAuthorityClearance.asObservable();

    private marksPaginatedSource = new Subject<SecurityControlsMarkResponse>();
    marksPaginated$ = this.marksPaginatedSource.asObservable();

    private loadingSource = new BehaviorSubject<boolean>(true);
    loading$ = this.loadingSource.asObservable();

    private securityGroup: SecurityGroupsApi;
    private securityMark: SecurityMarksApi;
    private authorityClearance: AuthorityClearanceApi;
    constructor(private apiService: AlfrescoApiService, private userPreferencesService: UserPreferencesService) {}

    get groupsApi(): SecurityGroupsApi {
        return this.securityGroup || (this.securityGroup = new SecurityGroupsApi(this.apiService.getInstance()));
    }

    get marksApi(): SecurityMarksApi {
        return this.securityMark || (this.securityMark = new SecurityMarksApi(this.apiService.getInstance()));
    }

    get authorityClearanceApi(): AuthorityClearanceApi {
        return this.authorityClearance || (this.authorityClearance = new AuthorityClearanceApi(this.apiService.getInstance()));
    }

    get reloadAuthorityClearance(): Subject<void> {
        return this._reloadAuthorityClearance;
    }

    /**
     * Get All security groups
     *
     * @param include Additional information about the security group
     * @param skipCount The number of entities that exist in the collection before those included in this list.
     * @param maxItems The maximum number of items to return in the list. Default is specified by UserPreferencesService.
     * @return Promise<SecurityControlsGroupResponse>
     */
    getSecurityGroup(
        skipCount = DEFAULT_SKIP_COUNT,
        maxItems = this.userPreferencesService.paginationSize,
        include = DEFAULT_INCLUDE
    ): Promise<SecurityControlsGroupResponse> {
        let securityControlsGroupResponse: SecurityControlsGroupResponse;
        return new Promise((resolve, reject) => {
            this.groupsApi
                .getSecurityGroups({
                    include,
                    skipCount,
                    maxItems
                })
                .then((response: SecurityGroupPaging) => {
                    this.groupsPaginatedSource.next(
                        (securityControlsGroupResponse = {
                            pagination: response.list.pagination,
                            entries: response.list.entries.map(
                                (group: SecurityGroupEntry) => group.entry
                            )
                        })
                    );
                    resolve(securityControlsGroupResponse);
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Create security group
     *
     * @param input securityGroupBody.
     * @return Observable<SecurityGroupEntry>
     */
    createSecurityGroup(
        input: SecurityGroupBody
    ): Observable<SecurityGroupEntry> {
        this.loadingSource.next(true);
        const payload: SecurityGroupBody = {
            ...input
        };
        const opts = {
            DEFAULT_INCLUDE
        };
        const promise = this.groupsApi.createSecurityGroup(payload, opts);

        return from(promise).pipe(
            finalize(() => this.loadingSource.next(false))
        );
    }

    /**
     * Create security marks
     *
     * @param securityGroupId The key for the security group id.
     * @param input securityMarkBody[].
     * @return Promise<SecurityMarkPaging | SecurityMarkEntry>
     */
    createSecurityMarks(
        securityGroupId: string,
        input: SecurityMarkBody[]
    ): Promise<SecurityMarkPaging | SecurityMarkEntry> {
        this.loadingSource.next(true);
        const promise = this.marksApi.createSecurityMarks(
            securityGroupId,
            input
        )
            .then((result) => {
                this.loadingSource.next(false);
                return result;
            })
            .catch((error) => {
                this.loadingSource.next(false);
                return error;
            });

        return promise;
    }

    /**
     * Get security mark value
     * Gets the value for a selected **securityGroupId**.
     *
     * @param securityGroupId The key for the security group id.
     * @param skipCount The number of entities that exist in the collection before those included in this list.
     * @param include The key for the security mark is in use or not
     * @return Promise<SecurityControlsMarkResponse>
     */
    getSecurityMark(
        securityGroupId: string,
        skipCount = DEFAULT_SKIP_COUNT,
        include = DEFAULT_INCLUDE
    ): Promise<SecurityControlsMarkResponse> {
        let securityControlsMarkResponse: SecurityControlsMarkResponse;
        return new Promise((resolve, reject) => {
            this.marksApi
                .getSecurityMarks(securityGroupId, {
                    include,
                    skipCount
                })
                .then((response: SecurityMarkPaging) => {
                    this.marksPaginatedSource.next(
                        (securityControlsMarkResponse = {
                            pagination: response.list.pagination,
                            entries: response.list.entries.map(
                                (mark: SecurityMarkEntry) => mark.entry
                            )
                        })
                    );
                    resolve(securityControlsMarkResponse);
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Update a security groups information
     *
     * @param securityGroupId The Key of Security Group id for which info is required
     * @param input SecurityGroupBody
     * @param opts additional information about the security group
     * @return Promise<SecurityGroupEntry>
     */
    updateSecurityGroup(
        securityGroupId: string,
        input: SecurityGroupBody,
        opts?: any
    ): Promise<SecurityGroupEntry> {
        this.loadingSource.next(true);
        const payload: SecurityGroupBody = {
            ...input
        };
        if (!opts) {
            opts = {
                DEFAULT_INCLUDE
            };
        }
        const promise = this.groupsApi.updateSecurityGroup(
            securityGroupId,
            payload,
            opts
        )
            .then((result) => {
                this.loadingSource.next(false);
                return result;
            })
            .catch((error) => {
                this.loadingSource.next(false);
                return error;
            });

        return promise;
    }

    /**
     * Updates Security Mark value
     *
     * @param securityGroupId The key for the security group id.
     * @param securityMarkId The key for the security mark is in use or not.
     * @param input securityMarkBody.
     * @return Promise<SecurityMarkEntry>
     */
    updateSecurityMark(
        securityGroupId: string,
        securityMarkId: string,
        input: SecurityMarkBody
    ): Promise<SecurityMarkEntry> {
        this.loadingSource.next(true);
        const payload: SecurityMarkBody = {
            ...input
        };
        const promise = this.marksApi.updateSecurityMark(
            securityGroupId,
            securityMarkId,
            payload
        )
            .then((result) => {
                this.loadingSource.next(false);
                return result;
            })
            .catch((error) => {
                this.loadingSource.next(false);
                return error;
            });

        return promise;
    }

    /**
     * Delete security group
     *
     * @param securityGroupId The key for the security group id.
     * @return Observable<SecurityGroupEntry>
     */
    deleteSecurityGroup(
        securityGroupId: string
    ): Observable<SecurityGroupEntry> {
        this.loadingSource.next(true);
        const promise = this.groupsApi.deleteSecurityGroup(securityGroupId);

        return from(promise).pipe(
            finalize(() => this.loadingSource.next(false))
        );
    }

    /**
     * Delete security mark
     *
     * @param securityGroupId The key for the security group id.
     * @param securityMarkId The key for the security mark id.
     * @return Promise<SecurityMarkEntry>
     */
    deleteSecurityMark(
        securityGroupId: string,
        securityMarkId: string
    ): Promise<SecurityMarkEntry> {
        this.loadingSource.next(true);
        const promise = this.marksApi.deleteSecurityMark(
            securityGroupId,
            securityMarkId
        )
            .then((result) => {
                this.loadingSource.next(false);
                return result;
            })
            .catch((error) => {
                this.loadingSource.next(false);
                return error;
            });

        return promise;
    }

    /**
     * Get the authority clearances for a single user/group
     *
     * @param authorityName The name for the authority for which the clearance is to be fetched. Can be left blank in which case it will fetch it for all users with pagination
     * @param skipCount The number of entities that exist in the collection before those included in this list.
     * @param maxItems The maximum number of items to return in the list. Default is specified by UserPreferencesService.
     * @return Observable<AuthorityClearanceGroupPaging>
     */
    getClearancesForAuthority(
        authorityName: string,
        skipCount = DEFAULT_SKIP_COUNT,
        maxItems = this.userPreferencesService.paginationSize
    ): Observable<AuthorityClearanceGroupPaging> {
        this.loadingSource.next(true);
        const opts = {
            skipCount, maxItems
        };
        const promise =
            this.authorityClearanceApi.getAuthorityClearanceForAuthority(authorityName, opts);

        return from(promise).pipe(
            finalize(() => this.loadingSource.next(false))
        );
    }

    /**
     * Updates the authority clearance.
     *
     * @param authorityName The name for the authority for which the clearance is to be updated
     * @param securityMarksList NodeSecurityMarkBody[]
     * @return Observable<SecurityMarkEntry | SecurityMarkPaging>
     */
    updateClearancesForAuthority(authorityName: string, securityMarksList: NodeSecurityMarkBody[]): Observable<SecurityMarkEntry | SecurityMarkPaging> {
        this.loadingSource.next(true);
        const promise = this.authorityClearanceApi.updateAuthorityClearance(authorityName, securityMarksList);

        return from(promise).pipe(
            finalize(() => {
                this.loadingSource.next(false);
                this._reloadAuthorityClearance.next();
            })
        );
    }

    reloadSecurityGroups() {
        this.reloadSecurityControls.next();
    }
}
