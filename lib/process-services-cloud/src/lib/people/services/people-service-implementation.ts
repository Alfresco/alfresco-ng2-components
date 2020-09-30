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

import { IdentityUserService, IdentityUserModel } from '@alfresco/adf-core';
import { PeopleServiceInterface } from './people-service.interface';
import { mergeMap, map, filter, switchMap, concatMap, withLatestFrom, toArray } from 'rxjs/operators';
import { Observable, of, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PeopleServiceImplementation implements PeopleServiceInterface {
    constructor(private identityUserService: IdentityUserService) {}

    findUsers(searchTerm: string): Observable<IdentityUserModel[]> {
        return this.identityUserService.findUsersByName(searchTerm.trim());
    }
    findUsersBasedAppName(
        clientId: string,
        roles: string[],
        searchTerm: string
    ): Observable<IdentityUserModel[]> {
        return withLatestFrom(this.findUsers(searchTerm.trim()).pipe(
            mergeMap(item => item )
            );
        // return combineLatest(this.identityUserService
        //     .getClientIdByApplicationName(appName)
        //     .pipe(
        //         switchMap(clientId => {
        //             return this.findUsers(searchTerm.trim()).pipe(
        //                 mergeMap(users => users),
        //                 switchMap(user => {
        //                     return this.checkUserHasAccess(
        //                         user.id,
        //                         clientId,
        //                         roles
        //                     ).pipe(
        //                         map(hasRole => (hasRole ? of(user) : of()))
        //                     );
        //                 })
        //             );
        //         }),
        //         withLatestFrom()
        //     ));
    }

    filterUsersBasedOnRoles(roles: string[], searchTerm: string): Observable<IdentityUserModel[]> {
        return combineLatest(this.findUsers(searchTerm.trim()).pipe(
            mergeMap(users => users),
            switchMap(user => {
                return this.identityUserService
                    .checkUserHasRole(user.id, roles)
                    .pipe(
                        map((hasRole: boolean) => ({
                            hasRole: hasRole,
                            user: user
                        })),
                        filter(
                            (filteredUser: {
                                hasRole: boolean;
                                user: IdentityUserModel;
                            }) => filteredUser.hasRole
                        ),
                        map(
                            (filteredUser: {
                                hasRole: boolean;
                                user: IdentityUserModel;
                            }) => filteredUser.user
                        )
                    );
            }),
            withLatestFrom()
        ));
    }

    getClientIdByApplicationName(appName: string) {
        return this.identityUserService.getClientIdByApplicationName(appName);
    }

    private checkUserHasAccess(
        userId: string,
        clientId: string,
        roles: string[]
    ): Observable<boolean> {
        if (roles) {
            return this.identityUserService.checkUserHasAnyClientAppRole(
                userId,
                clientId,
                roles
            );
        } else {
            return this.identityUserService.checkUserHasClientApp(
                userId,
                clientId
            );
        }
    }

    findUserById(id) {
        return this.identityUserService.findUserById(id);
    }

    findUserByUsername(name) {
        return this.identityUserService.findUserByUsername(name);
    }

    findUserByEmail(email) {
        return this.identityUserService.findUserByEmail(email);
    }
}
