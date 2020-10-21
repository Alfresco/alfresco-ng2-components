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

import {
    mergeMap,
    map,
    toArray,
    concatMap,
    catchError
} from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { IdentityUserService, IdentityUserModel, LogService } from '@alfresco/adf-core';
import { PeopleCloudServiceInterface } from '../../services/people-cloud-service.interface';

@Injectable({
    providedIn: 'root'
})
export class PeopleCloudService implements PeopleCloudServiceInterface {
    constructor(private identityUserService: IdentityUserService, private logService: LogService) {}

    findUsers(searchTerm: string): Observable<IdentityUserModel[]> {
        return this.identityUserService.findUsersByName(searchTerm.trim()).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    findUsersBasedOnApp(clientId: string, roles: string[], searchTerm: string): Observable<IdentityUserModel[]> {
        if (clientId) {
            return this.findUsers(searchTerm.trim()).pipe(
                mergeMap(users => users),
                concatMap((user) => {
                    return this.checkUserHasAccess(user.id, clientId, roles).pipe(
                        mergeMap((hasRole) => hasRole ? of(user) : of())
                    );
                }),
                toArray(),
                map((filteredUsers) => filteredUsers.filter((filteredUser) => !!filteredUser)),
                catchError((error) => this.handleError(error))
            );
        } else {
            return this.handleError('client is mandatory to search users based on the application');
        }
    }

    filterUsersBasedOnRoles(roles: string[], searchTerm: string): Observable<IdentityUserModel[]> {
        if (roles?.length) {
            return this.findUsers(searchTerm.trim()).pipe(
                mergeMap(users => users),
                concatMap((user) => {
                    return this.identityUserService.checkUserHasRole(user.id, roles).pipe(
                        mergeMap((hasRole) => hasRole ? of(user) : of())
                    );
                }),
                toArray(),
                map((filteredUsers) => filteredUsers.filter((filteredUser) => !!filteredUser)),
                catchError((error) => this.handleError(error))
            );
        } else {
            return this.handleError('roles are mandatory to search users based on the roles');
        }
    }

    getClientIdByApplicationName(appName: string): Observable<string> {
        if (appName) {
            return this.identityUserService.getClientIdByApplicationName(appName).pipe(catchError((error) => this.handleError(error)));
        } else {
            return this.handleError('appName is mandatory to fetch clientId based on the appname');
        }
    }

    private checkUserHasAccess(userId: string, clientId: string, roles: string[]): Observable<boolean> {
        let hasAccess$: Observable<boolean>;
        if (roles?.length) {
            hasAccess$ = this.identityUserService.checkUserHasAnyClientAppRole(
                userId,
                clientId,
                roles
            );
        } else {
            hasAccess$ = this.identityUserService.checkUserHasClientApp(
                userId,
                clientId
            );
        }

        return hasAccess$.pipe(catchError((error) => this.handleError(error)));
    }

    validatePreselectedUser(preselectedUser: IdentityUserModel): Observable<IdentityUserModel> {
       const key = preselectedUser.id ? 'id' : preselectedUser.email ? 'email' : preselectedUser.username ? 'username' : null;
       let result$:  Observable<IdentityUserModel>;

       switch (key) {
            case 'id':
                result$ = this.identityUserService.findUserById(preselectedUser[key]);
                break;
            case 'username':
                result$ = this.identityUserService.findUserByUsername(preselectedUser[key]).pipe(map((users: IdentityUserModel[]) => users[0]));
                break;
            case 'email':
                result$ = this.identityUserService.findUserByEmail(preselectedUser[key]).pipe(map((users: IdentityUserModel[]) => users[0]));
                break;
            default:
                result$ = of();
        }

       return result$.pipe(catchError((error) => this.handleError(error)));
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error);
    }
}
