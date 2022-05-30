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

import { Observable } from 'rxjs';
import { IdentityUserModel } from '../../models/identity-user.model';

export interface SearchUsersFilters {
    roles?: string[];
    withinApplication?: string;
    groups?: string[];
}

export interface IdentityProviderUserServiceInterface {
    getCurrentUserInfo(): IdentityUserModel;
    search(name: string, filters?: SearchUsersFilters): Observable<IdentityUserModel[]>;
    searchUsersByName(name: string, groups?: string[]): Observable<IdentityUserModel[]>;
    searchUsersWithGlobalRoles(name: string, roles: string [], groups?: string[]): Observable<IdentityUserModel[]>;
    searchUsersWithinApp(name: string, withinApplication: string, roles?: string [], groups?: string[]): Observable<IdentityUserModel[]>;
    searchUsersWithGroups(name: string, filters: SearchUsersFilters): Observable<IdentityUserModel[]>;
}
