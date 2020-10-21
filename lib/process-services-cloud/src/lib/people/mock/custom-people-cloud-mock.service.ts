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
import { PeopleCloudServiceInterface } from '../../services/people-cloud-service.interface';
import { Observable, of } from 'rxjs';
import { IdentityUserModel } from 'core';

export const customServiceMockUsers = [
    { id: 'custom-fake-id-1', username: 'custom first-name-1 last-name-1', firstName: 'custom-first-name-1', lastName: 'custom-last-name-1', email: 'custom-abc@xyz.com' },
    { id: 'custom-fake-id-2', username: 'custom first-name-2 last-name-2', firstName: 'custom-first-name-2', lastName: 'custom-last-name-2', email: 'custom-abcd@xyz.com'}
];

@Injectable()
export class CustomMockPeopleCloudService implements PeopleCloudServiceInterface {
    findUsers(_searchTerm: string): Observable<IdentityUserModel[]> {
        return of(customServiceMockUsers);
    }
    findUsersBasedOnApp(_clientId: string, _roles: string[], _searchTerm: string): Observable<IdentityUserModel[]> {
        return of(customServiceMockUsers);
    }
    filterUsersBasedOnRoles(_roles: string[], _searchTerm: string): Observable<IdentityUserModel[]> {
        return of(customServiceMockUsers);
    }
    validatePreselectedUser(_preselectedUser: IdentityUserModel): Observable<IdentityUserModel> {
        return of(customServiceMockUsers[0]);
    }
    getClientIdByApplicationName(_appName: string): Observable<string> {
        return of ('custom-service-mock-client-id');
    }
}
