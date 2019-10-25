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
import {
    queryUsersMockApi,
    createUserMockApi,
    mockIdentityUser1,
    updateUserMockApi,
    mockIdentityUser2,
    deleteUserMockApi,
    getInvolvedGroupsMockApi,
    joinGroupMockApi,
    leaveGroupMockApi,
    getAvailableRolesMockApi,
    getAssignedRolesMockApi,
    getEffectiveRolesMockApi,
    assignRolesMockApi,
    mockIdentityRole,
    removeRolesMockApi,
    mockIdentityUsers,
    mockJoinGroupRequest
} from 'core/mock/identity-user.service.mock';
import { IdentityUserService } from '../services/identity-user.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AlfrescoApiService } from './alfresco-api.service';
import { mockToken } from '../mock/jwt-helper.service.spec';
import { IdentityRoleModel } from '../models/identity-role.model';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';

describe('IdentityUserService', () => {

    const mockRoles = [
        { id: 'id-1', name: 'MOCK-ADMIN-ROLE'},
        { id: 'id-2', name: 'MOCK-USER-ROLE'},
        { id: 'id-3', name: 'MOCK_MODELER-ROLE' },
        { id: 'id-4', name: 'MOCK-ROLE-1' },
        { id: 'id-5', name: 'MOCK-ROLE-2'}
    ];

    let service: IdentityUserService;
    let alfrescoApiService: AlfrescoApiService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(IdentityUserService);
        alfrescoApiService = TestBed.get(AlfrescoApiService);
    });

    beforeEach(() => {
        const store = {};

        spyOn(localStorage, 'getItem').and.callFake( (key: string): string => {
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
        spyOn(service, 'getUsers').and.returnValue(of(mockIdentityUsers));
        service.getUsers().subscribe(
            res => {
                expect(res).toBeDefined();
                expect(res[0].id).toEqual('mock-user-id-1');
                expect(res[0].username).toEqual('userName1');
                expect(res[1].id).toEqual('mock-user-id-2');
                expect(res[1].username).toEqual('userName2');
                expect(res[2].id).toEqual('mock-user-id-3');
                expect(res[2].username).toEqual('userName3');
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
        spyOn(service, 'getUsers').and.returnValue(of(mockIdentityUsers));
        spyOn(service, 'getUserRoles').and.returnValue(of(mockRoles));

        service.getUsersByRolesWithCurrentUser([mockRoles[0].name]).then(
            res => {
                expect(res).toBeDefined();
                expect(res[0].id).toEqual('mock-user-id-1');
                expect(res[0].username).toEqual('userName1');
                expect(res[1].id).toEqual('mock-user-id-2');
                expect(res[1].username).toEqual('userName2');
                expect(res[2].id).toEqual('mock-user-id-3');
                expect(res[2].username).toEqual('userName3');
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
        spyOn(service, 'getUsers').and.returnValue(of(mockIdentityUsers));
        spyOn(service, 'getUserRoles').and.returnValue(of(mockRoles));
        spyOn(service, 'getCurrentUserInfo').and.returnValue(mockIdentityUsers[0]);

        service.getUsersByRolesWithoutCurrentUser([mockRoles[0].name]).then(
            res => {
                expect(res).toBeDefined();
                expect(res[0].id).toEqual('mock-user-id-2');
                expect(res[0].username).toEqual('userName2');
                expect(res[1].id).toEqual('mock-user-id-3');
                expect(res[1].username).toEqual('userName3');
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

    it('should be able to query users based on query params (first & max params)', (done) => {
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(queryUsersMockApi);
        service.queryUsers({first: 0, max: 5}).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.entries.length).toBe(5);
            expect(res.entries[0].id).toBe('mock-user-id-1');
            expect(res.entries[0].username).toBe('userName1');
            expect(res.entries[1].id).toBe('mock-user-id-2');
            expect(res.entries[1].username).toBe('userName2');
            expect(res.entries[2].id).toBe('mock-user-id-3');
            expect(res.entries[2].username).toBe('userName3');
            done();
        });
    });

    it('Should not be able to query users if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'queryUsers').and.returnValue(throwError(errorResponse));

        service.queryUsers({first: 0, max: 5})
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

    it('should be able to create user', (done) => {
        const createCustomApiSpy = spyOn(alfrescoApiService, 'getInstance').and.returnValue(createUserMockApi);
        service.createUser(mockIdentityUser1).subscribe(() => {
            expect(createCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to create user if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'createUser').and.returnValue(throwError(errorResponse));

        service.createUser(mockIdentityUser1)
            .subscribe(
                () => {
                    fail('expected an error, not to create user');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to update user', (done) => {
        const updateCustomApiSpy = spyOn(alfrescoApiService, 'getInstance').and.returnValue(updateUserMockApi);
        service.updateUser('mock-id-2', mockIdentityUser2).subscribe(() => {
            expect(updateCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to update user if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'updateUser').and.returnValue(throwError(errorResponse));

        service.updateUser('mock-id-2', mockIdentityUser2)
            .subscribe(
                () => {
                    fail('expected an error, not to update user');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to delete group', (done) => {
        const deleteCustomApiSpy = spyOn(alfrescoApiService, 'getInstance').and.returnValue(deleteUserMockApi);
        service.deleteUser('mock-user-id').subscribe(() => {
            expect(deleteCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to delete user if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'deleteUser').and.returnValue(throwError(errorResponse));

        service.deleteUser('mock-user-id')
            .subscribe(
                () => {
                    fail('expected an error, not to delete user');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to fetch involved groups based on user id', (done) => {
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(getInvolvedGroupsMockApi);
        service.getInvolvedGroups('mock-user-id').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(2);
            expect(res[0].id).toBe('mock-group-id-1');
            expect(res[0].name).toBe('Mock Group 1');
            expect(res[1].id).toBe('mock-group-id-2');
            expect(res[1].name).toBe('Mock Group 2');
            done();
        });
    });

    it('Should not be able to fetch involved groups if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getInvolvedGroups').and.returnValue(throwError(errorResponse));

        service.getInvolvedGroups('mock-user-id')
            .subscribe(
                () => {
                    fail('expected an error, not involved groups');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to join the group', (done) => {
        const joinGroupCustomApiSpy = spyOn(alfrescoApiService, 'getInstance').and.returnValue(joinGroupMockApi);
        service.joinGroup(mockJoinGroupRequest).subscribe(() => {
            expect(joinGroupCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to join group if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'joinGroup').and.returnValue(throwError(errorResponse));

        service.joinGroup(mockJoinGroupRequest)
            .subscribe(
                () => {
                    fail('expected an error, not to join group');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to leave the group', (done) => {
        const leaveGroupCustomApiSpy = spyOn(alfrescoApiService, 'getInstance').and.returnValue(leaveGroupMockApi);
        service.leaveGroup('mock-user-id', 'mock-group-id').subscribe(() => {
            expect(leaveGroupCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to leave group if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'leaveGroup').and.returnValue(throwError(errorResponse));

        service.leaveGroup('mock-user-id', 'mock-group-id')
            .subscribe(
                () => {
                    fail('expected an error, not to leave group');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to fetch available roles based on user id', (done) => {
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(getAvailableRolesMockApi);
        service.getAvailableRoles('mock-user-id').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(4);
            expect(res[0].id).toBe('mock-role-id-1');
            expect(res[0].name).toBe('MOCK-ADMIN-ROLE');
            expect(res[1].id).toBe('mock-role-id-2');
            expect(res[1].name).toBe('MOCK-USER-ROLE');
            expect(res[2].id).toBe('mock-role-id-3');
            expect(res[2].name).toBe('MOCK_MODELER-ROLE');
            done();
        });
    });

    it('Should not be able to fetch available roles based on user id if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getAvailableRoles').and.returnValue(throwError(errorResponse));

        service.getAvailableRoles('mock-user-id')
            .subscribe(
                () => {
                    fail('expected an error, not available roles');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to fetch assigned roles based on user id', (done) => {
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(getAssignedRolesMockApi);
        service.getAssignedRoles('mock-user-id').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].id).toBe('mock-role-id-1');
            expect(res[0].name).toBe('MOCK-ADMIN-ROLE');
            expect(res[1].id).toBe('mock-role-id-2');
            expect(res[1].name).toBe('MOCK_MODELER-ROLE');
            expect(res[2].id).toBe('mock-role-id-3');
            expect(res[2].name).toBe('MOCK-ROLE-1');
            done();
        });
    });

    it('Should not be able to fetch assigned roles based on user id if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getAssignedRoles').and.returnValue(throwError(errorResponse));

        service.getAssignedRoles('mock-user-id')
            .subscribe(
                () => {
                    fail('expected an error, not assigned roles');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to fetch effective roles based on user id', (done) => {
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(getEffectiveRolesMockApi);
        service.getEffectiveRoles('mock-user-id').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].id).toBe('mock-role-id-1');
            expect(res[0].name).toBe('MOCK-ACTIVE-ADMIN-ROLE');
            expect(res[1].id).toBe('mock-role-id-2');
            expect(res[1].name).toBe('MOCK-ACTIVE-USER-ROLE');
            expect(res[2].id).toBe('mock-role-id-3');
            expect(res[2].name).toBe('MOCK-ROLE-1');
            done();
        });
    });

    it('Should not be able to fetch effective roles based on user id if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getEffectiveRoles').and.returnValue(throwError(errorResponse));

        service.getEffectiveRoles('mock-user-id')
            .subscribe(
                () => {
                    fail('expected an error, not effective roles');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to assign roles to the user', (done) => {
        const assignRolesCustomApiSpy = spyOn(alfrescoApiService, 'getInstance').and.returnValue(assignRolesMockApi);
        service.assignRoles('mock-user-id', [mockIdentityRole]).subscribe(() => {
            expect(assignRolesCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to assign roles to the user if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'assignRoles').and.returnValue(throwError(errorResponse));

        service.assignRoles('mock-user-id', [mockIdentityRole])
            .subscribe(
                () => {
                    fail('expected an error, not to assigen roles to the user');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to remove roles', (done) => {
        const removeRolesCustomApiSpy = spyOn(alfrescoApiService, 'getInstance').and.returnValue(removeRolesMockApi);
        service.removeRoles('mock-user-id', [mockIdentityRole]).subscribe(() => {
            expect(removeRolesCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to remove roles if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'removeRoles').and.returnValue(throwError(errorResponse));

        service.removeRoles('mock-user-id', [mockIdentityRole])
            .subscribe(
                () => {
                    fail('expected an error, not to remove roles');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });
});
