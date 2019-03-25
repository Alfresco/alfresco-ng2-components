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

import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { IdentityUserService } from '../services/identity-user.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { mockToken } from './../../mock/jwt-helper.service.spec';
import { IdentityUserModel } from '../models/identity-user.model';
import { IdentityRoleModel } from '../models/identity-role.model';

describe('IdentityUserService', () => {

    const mockUsers = [
        { id: 'fake-id-1', username: 'first-name-1 last-name-1', firstName: 'first-name-1', lastName: 'last-name-1', email: 'abc@xyz.com' },
        { id: 'fake-id-2', username: 'first-name-2 last-name-2', firstName: 'first-name-2', lastName: 'last-name-2', email: 'abcd@xyz.com'},
        { id: 'fake-id-3', username: 'first-name-3 last-name-3', firstName: 'first-name-3', lastName: 'last-name-3', email: 'abcde@xyz.com' }
    ];

    const mockRoles = [
        { id: 'id-1', name: 'MOCK-ADMIN-ROLE'},
        { id: 'id-2', name: 'MOCK-USER-ROLE'},
        { id: 'id-3', name: 'MOCK_MODELER-ROLE' },
        { id: 'id-4', name: 'MOCK-ROLE-1' },
        { id: 'id-5', name: 'MOCK-ROLE-2'}
    ];

    let service: IdentityUserService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        service = TestBed.get(IdentityUserService);
    });

    beforeEach(() => {
        const store = {};

        spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
         return store[key] || null;
        });
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string =>  {
          return store[key] = <string> value;
        });
    });

    it('should fetch identity user info from Jwt token', () => {
        localStorage.setItem('access_token', mockToken);
        const user = service.getCurrentUserInfo();
        expect(user).toBeDefined();
        expect(user.firstName).toEqual('John');
        expect(user.lastName).toEqual('Doe');
        expect(user.email).toEqual('johnDoe@gmail.com');
        expect(user.username).toEqual('johnDoe1');
    });

    it('should fetch users ', (done) => {
        spyOn(service, 'getUsers').and.returnValue(of(mockUsers));
        service.getUsers().subscribe(
            (res: IdentityUserModel[]) => {
                expect(res).toBeDefined();
                expect(res[0].id).toEqual('fake-id-1');
                expect(res[0].username).toEqual('first-name-1 last-name-1');
                expect(res[1].id).toEqual('fake-id-2');
                expect(res[1].username).toEqual('first-name-2 last-name-2');
                expect(res[2].id).toEqual('fake-id-3');
                expect(res[2].username).toEqual('first-name-3 last-name-3');
                done();
            }
        );
    });

    it('Should not fetch users if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getUsers').and.returnValue(throwError(errorResponse));
        service.getUsers()
            .subscribe(
                () => {
                    fail('expected an error, not users');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should fetch roles by userId', (done) => {
        spyOn(service, 'getUserRoles').and.returnValue(of(mockRoles));
        service.getUserRoles('mock-user-id').subscribe(
            (res: IdentityRoleModel[]) => {
                expect(res).toBeDefined();
                expect(res[0].name).toEqual('MOCK-ADMIN-ROLE');
                expect(res[1].name).toEqual('MOCK-USER-ROLE');
                expect(res[4].name).toEqual('MOCK-ROLE-2');
                done();
            }
        );
    });

    it('Should not fetch roles if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getUserRoles').and.returnValue(throwError(errorResponse));

        service.getUserRoles('mock-user-id')
            .subscribe(
                () => {
                    fail('expected an error, not users');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should fetch users by roles', (done) => {
        spyOn(service, 'getUsers').and.returnValue(of(mockUsers));
        spyOn(service, 'getUserRoles').and.returnValue(of(mockRoles));

        service.getUsersByRolesWithCurrentUser([mockRoles[0].name]).then(
            (res: IdentityUserModel[]) => {
                expect(res).toBeDefined();
                expect(res[0].id).toEqual('fake-id-1');
                expect(res[0].username).toEqual('first-name-1 last-name-1');
                expect(res[1].id).toEqual('fake-id-2');
                expect(res[1].username).toEqual('first-name-2 last-name-2');
                expect(res[2].id).toEqual('fake-id-3');
                expect(res[2].username).toEqual('first-name-3 last-name-3');
                done();
            }
        );
    });

    it('Should not fetch users by roles if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getUsers').and.returnValue(throwError(errorResponse));

        service.getUsersByRolesWithCurrentUser([mockRoles[0].name])
            .catch(
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should fetch users by roles without current user', (done) => {
        spyOn(service, 'getUsers').and.returnValue(of(mockUsers));
        spyOn(service, 'getUserRoles').and.returnValue(of(mockRoles));
        spyOn(service, 'getCurrentUserInfo').and.returnValue(mockUsers[0]);

        service.getUsersByRolesWithoutCurrentUser([mockRoles[0].name]).then(
            (res: IdentityUserModel[]) => {
                expect(res).toBeDefined();
                expect(res[0].id).toEqual('fake-id-2');
                expect(res[0].username).toEqual('first-name-2 last-name-2');
                expect(res[1].id).toEqual('fake-id-3');
                expect(res[1].username).toEqual('first-name-3 last-name-3');
                done();
            }
        );
    });

    it('should return true when user has access to an application', (done) => {
        spyOn(service, 'getClientIdByApplicationName').and.returnValue(of('mock-client'));
        spyOn(service, 'getClientRoles').and.returnValue(of(mockRoles));

        service.checkUserHasClientApp('user-id', 'app-name').subscribe(
            (res: boolean) => {
                expect(res).toBeTruthy();
                done();
            }
        );
    });

    it('should return false when user does not have access to an application', (done) => {
        spyOn(service, 'getClientIdByApplicationName').and.returnValue(of('mock-client'));
        spyOn(service, 'getClientRoles').and.returnValue(of([]));

        service.checkUserHasClientApp('user-id', 'app-name').subscribe(
            (res: boolean) => {
                expect(res).toBeFalsy();
                done();
            }
        );
    });

    it('should return true when user has any given application role', (done) => {
        spyOn(service, 'getClientIdByApplicationName').and.returnValue(of('mock-client'));
        spyOn(service, 'getClientRoles').and.returnValue(of(mockRoles));

        service.checkUserHasAnyClientAppRole('user-id', 'app-name', [mockRoles[1].name] ).subscribe(
            (res: boolean) => {
                expect(res).toBeTruthy();
                done();
            }
        );
    });

    it('should return false when user does not have any given application role', (done) => {
        spyOn(service, 'getClientIdByApplicationName').and.returnValue(of('mock-client'));
        spyOn(service, 'getClientRoles').and.returnValue(of([]));

        service.checkUserHasAnyClientAppRole('user-id', 'app-name', [mockRoles[1].name]).subscribe(
            (res: boolean) => {
                expect(res).toBeFalsy();
                done();
            }
        );
    });

    it('should return true if user has given role', (done) => {
        spyOn(service, 'getUserRoles').and.returnValue(of(mockRoles));
        service.checkUserHasRole('mock-user-id', ['MOCK-ROLE-1']).subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeTruthy();
                done();
            }
        );
    });

    it('should return false if user does not have given role', (done) => {
        spyOn(service, 'getUserRoles').and.returnValue(of(mockRoles));
        service.checkUserHasRole('mock-user-id', ['MOCK-ROLE-10']).subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeFalsy();
                done();
            }
        );
    });
});
