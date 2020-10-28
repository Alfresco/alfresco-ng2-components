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
import { IdentityUserModel } from './../models/identity-user.model';
import { UserProcessModel } from './../models/user-process.model';

export interface UserServiceInterface {
    findUsersByName(searchTerm: string): Observable<IdentityUserModel[] | UserProcessModel[]>;
    findUsersByTaskId(searchTerm: string, taskId: string, appName?: string): Observable<IdentityUserModel[] | UserProcessModel[]>;
    findUsersByApp(clientId: string, roles: string[], searchTerm: string): Observable<IdentityUserModel[] | UserProcessModel[]>;
    findUsersByRoles(roles: string[], searchTerm: string): Observable<IdentityUserModel[] | UserProcessModel[]>;
    validatePreselectedUser(preselectedUser: IdentityUserModel| UserProcessModel): Observable<IdentityUserModel | UserProcessModel>;
    getClientIdByApplicationName(applicationName: string): Observable<string>;
}
