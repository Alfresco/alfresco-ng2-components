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
import { AppConfigService, OAuth2Service } from '@alfresco/adf-core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdentityGroupServiceInterface } from './identity-group.service.interface';
import { IdentityGroupFilterInterface } from './identity-group-filter.interface';
import { IdentityGroupModel } from '../models/identity-group.model';

const IDENTITY_MICRO_SERVICE_INGRESS = 'identity-adapter-service';

@Injectable({ providedIn: 'root' })
export class IdentityGroupService implements IdentityGroupServiceInterface {

    queryParams: { search: string; application?: string; roles?: string [] };

    constructor(
        private oAuth2Service: OAuth2Service,
        private appConfigService: AppConfigService
    ) {}

    public search(name: string, filters?: IdentityGroupFilterInterface): Observable<IdentityGroupModel[]> {
        if (name.trim() === '') {
            return EMPTY;
        } else if (filters?.withinApplication) {
            return this.searchGroupsWithinApp(name, filters.withinApplication, filters?.roles);
        } else if (filters?.roles?.length > 0) {
            return this.searchGroupsWithGlobalRoles(name, filters.roles);
        } else {
            return this.searchGroupsByName(name);
        }
    }

    private searchGroupsByName(name: string): Observable<IdentityGroupModel[]> {
        this.buildQueryParam(name);

        return this.invokeIdentityGroupApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private searchGroupsWithGlobalRoles(name: string, roles: string []): Observable<IdentityGroupModel[]> {
        this.buildQueryParam(name, roles);

        return this.invokeIdentityGroupApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private searchGroupsWithinApp(name: string, applicationName: string, roles?: string []): Observable<IdentityGroupModel[]> {
        this.buildQueryParam(name, roles, applicationName);

        return this.invokeIdentityGroupApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private invokeIdentityGroupApi(): Observable<IdentityGroupModel[]> {
        const url = `${this.identityHost}/${IDENTITY_MICRO_SERVICE_INGRESS}/v1/groups`;
        return this.oAuth2Service.get({ url, queryParams: this.queryParams });
    }

    private buildQueryParam(name: string, roles?: string [], applicationName?: string) {
        this.queryParams = { search: name };
        this.addOptionalValueToQueryParam('application', applicationName);
        this.addOptionalCommaValueToQueryParam('role', roles);
    }

    private addOptionalCommaValueToQueryParam(key: string, values: string []) {
        if (values?.length > 0) {
            const valuesNotEmpty = this.filterOutEmptyValue(values);
            if (valuesNotEmpty?.length > 0) {
                this.queryParams[key] = valuesNotEmpty.join(',');
            }
        }
    }

    private addOptionalValueToQueryParam(key: string, value: string) {
        if (value?.trim()) {
            this.queryParams[key] = value;
        }
    }

    private filterOutEmptyValue(roles: string []): string [] {
        return roles.filter( role => role.trim() ? true : false);
    }

    private handleError(error: any) {
        return throwError(error || 'Server error');
    }

    private get identityHost(): string {
        return `${this.appConfigService.get('bpmHost')}`;
    }
}
