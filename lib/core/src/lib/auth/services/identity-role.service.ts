/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationModel } from '../../models/pagination.model';
import { IdentityRoleModel } from '../models/identity-role.model';
import { AppConfigService } from '../../app-config/app-config.service';

export interface IdentityRoleResponseModel {
    entries: IdentityRoleModel[];
    pagination: PaginationModel;
}

@Injectable({
    providedIn: 'root'
})
export class IdentityRoleService {
    contextRoot = '';
    identityHost = '';

    constructor(protected http: HttpClient, protected appConfig: AppConfigService) {
        this.contextRoot = this.appConfig.get('apiHost', '');
        this.identityHost = this.appConfig.get('identityHost');
    }

    /**
     * Ret all roles
     *
     * @param skipCount skip count
     * @param size page size
     * @returns List of roles
     */
    getRoles(skipCount: number = 0, size: number = 5): Observable<IdentityRoleResponseModel> {
        return this.http.get<any>(`${this.identityHost}/roles`).pipe(map((res) => this.preparePaginationWithRoles(res, skipCount, size)));
    }

    private preparePaginationWithRoles(roles: IdentityRoleModel[], skipCount: number = 0, size: number = 5): IdentityRoleResponseModel {
        return {
            entries: roles.slice(skipCount, skipCount + size),
            pagination: {
                skipCount,
                maxItems: size,
                count: roles.length,
                hasMoreItems: false,
                totalItems: roles.length
            }
        };
    }

    /**
     * Add new role
     *
     * @param newRole Role model
     * @returns Server result payload
     */
    addRole(newRole: IdentityRoleModel): Observable<any> {
        if (newRole) {
            return this.http.post(`${this.identityHost}/roles`, newRole);
        }
        return of();
    }

    /**
     * Delete existing role
     *
     * @param deletedRole Role model
     * @returns Server result payload
     */
    deleteRole(deletedRole: IdentityRoleModel): Observable<any> {
        return this.http.delete(`${this.identityHost}/roles-by-id/${deletedRole.id}`);
    }

    /**
     * Update existing role
     *
     * @param updatedRole Role model
     * @param roleId Role id
     * @returns Server result payload
     */
    updateRole(updatedRole: IdentityRoleModel, roleId: string): Observable<any> {
        if (updatedRole && roleId) {
            return this.http.put(`${this.identityHost}/roles-by-id/${roleId}`, updatedRole);
        }
        return of();
    }
}
