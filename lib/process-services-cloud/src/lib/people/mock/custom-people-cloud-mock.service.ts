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
import { Observable, of } from 'rxjs';
import {

    IdentityUserModel,
    UserServiceInterface
} from '@alfresco/adf-core';

export const customServiceMockUsers = [
    { id: 'custom-fake-id-1', username: 'custom first-name-1 last-name-1', firstName: 'custom-first-name-1', lastName: 'custom-last-name-1', email: 'custom-abc@xyz.com' },
    { id: 'custom-fake-id-2', username: 'custom first-name-2 last-name-2', firstName: 'custom-first-name-2', lastName: 'custom-last-name-2', email: 'custom-abcd@xyz.com'}
];

@Injectable()
export class CustomMockPeopleCloudService implements UserServiceInterface {
    findUsersByName(_searchTerm: string): Observable<IdentityUserModel[]> {
        throw new Error('Method not implemented.');
    }
    findUsersByTaskId(_searchTerm: string, _taskId: string, _appName?: string): Observable<IdentityUserModel[]> {
        throw new Error('Method not implemented.');
    }
    findUsersByApp(_clientId: string, _roles: string[], _searchTerm: string): Observable<IdentityUserModel[]> {
        throw new Error('Method not implemented.');
    }
    findUsersByRoles(_roles: string[], _searchTerm: string): Observable<IdentityUserModel[]> {
        throw new Error('Method not implemented.');
    }
    validatePreselectedUser(_preselectedUser: IdentityUserModel): Observable<IdentityUserModel> {
        throw new Error('Method not implemented.');
    }
    getClientIdByApplicationName(_applicationName: string): Observable<string> {
        return of ('custom-service-mock-client-id');
    }

}
