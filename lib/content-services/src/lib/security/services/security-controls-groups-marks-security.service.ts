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
import { AlfrescoApiService } from '@alfresco/adf-core';
import { finalize } from 'rxjs/operators';

const DEFAULT_MAX_GROUPS = 10;
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
    constructor(private apiService: AlfrescoApiService) {}

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

    getSecurityGroup(
        skipCount = DEFAULT_SKIP_COUNT,
        maxItems = DEFAULT_MAX_GROUPS,
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

    createSecurityMarks(
        securityGroupId: string,
        input: SecurityMarkBody[]
    ): Promise<any> {
        this.loadingSource.next(true);
        const promise = this.marksApi.createSecurityMarks(
            securityGroupId,
            input
        );

        return promise;
    }

    getSecurityMark(
        SecurityGroupId: string,
        skipCount = DEFAULT_SKIP_COUNT,
        include = DEFAULT_INCLUDE
    ): Promise<SecurityControlsMarkResponse> {
        let securityControlsMarkResponse: SecurityControlsMarkResponse;
        return new Promise((resolve, reject) => {
            this.marksApi
                .getSecurityMarks(SecurityGroupId, {
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
        );

        return promise;
    }

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
        );

        return promise;
    }

    deleteSecurityGroup(
        securityGroupId: string
    ): Observable<SecurityGroupEntry> {
        this.loadingSource.next(true);
        const promise = this.groupsApi.deleteSecurityGroup(securityGroupId);

        return from(promise).pipe(
            finalize(() => this.loadingSource.next(false))
        );
    }

    deleteSecurityMark(
        securityGroupId: string,
        securityMarkId: string
    ): Promise<SecurityMarkEntry> {
        this.loadingSource.next(true);
        const promise = this.marksApi.deleteSecurityMark(
            securityGroupId,
            securityMarkId
        );

        return promise;
    }

    getClearancesForAuthority(authorityName: string, skipCount = DEFAULT_SKIP_COUNT, maxItems = DEFAULT_MAX_GROUPS): Observable<AuthorityClearanceGroupPaging> {
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
