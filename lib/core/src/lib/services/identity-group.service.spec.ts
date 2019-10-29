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

import { async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import {
    IdentityGroupSearchParam,
    groupAPIMockError
} from '@alfresco/adf-core';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { LogService } from '../services/log.service';
import { IdentityGroupService } from '../services/identity-group.service';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';

import { HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import {
    noRoleMappingApi,
    mockIdentityRoles,
    groupsMockApi,
    roleMappingApi,
    clientRoles,
    returnCallQueryParameters,
    returnCallUrl,
    applicationDetailsMockApi,
    mockApiError,
    mockIdentityGroup1,
    createGroupMappingApi,
    updateGroupMappingApi,
    deleteGroupMappingApi,
    mockIdentityGroupsCount
} from '../mock/identity-group.service.mock';

describe('IdentityGroupService', () => {
    let service: IdentityGroupService;
    let apiService: AlfrescoApiService;
    let logService: LogService;

    setupTestBed({
        imports: [CoreModule.forRoot()],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(async(() => {
        service = TestBed.get(IdentityGroupService);
        apiService = TestBed.get(AlfrescoApiService);
        logService = TestBed.get(LogService);
    }));

    it('should be able to fetch groups based on group name', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(groupsMockApi);
        service.findGroupsByName(<IdentityGroupSearchParam> {name: 'mock'}).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(5);
            expect(res[0].id).toBe('mock-group-id-1');
            expect(res[0].name).toBe('Mock Group 1');
            expect(res[1].id).toBe('mock-group-id-2');
            expect(res[1].name).toBe('Mock Group 2');
            expect(res[2].id).toBe('mock-group-id-3');
            expect(res[2].name).toBe('Mock Group 3');
            done();
        });
    });

    it('should return true if group has client role mapping', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(roleMappingApi);
        service.checkGroupHasClientApp('mock-group-id', 'mock-app-id').subscribe((hasRole) => {
            expect(hasRole).toBeDefined();
            expect(hasRole).toBe(true);
            done();
        });
    });

    it('should return false if group does not have client role mapping', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(noRoleMappingApi);
        service.checkGroupHasClientApp('mock-group-id', 'mock-app-id').subscribe((hasRole) => {
            expect(hasRole).toBeDefined();
            expect(hasRole).toBe(false);
            done();
        });
    });

    it('should able to fetch group roles by groupId', (done) => {
        spyOn(service, 'getGroupRoles').and.returnValue(of(mockIdentityRoles));
        service.getGroupRoles('mock-group-id').subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(3);
                expect(res[0].name).toEqual('MOCK-ADMIN-ROLE');
                expect(res[1].name).toEqual('MOCK-USER-ROLE');
                expect(res[2].name).toEqual('MOCK-ROLE-1');
                done();
            }
        );
    });

    it('Should not able to fetch group roles if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getGroupRoles').and.returnValue(throwError(errorResponse));

        service.getGroupRoles('mock-group-id')
            .subscribe(
                () => {
                    fail('expected an error, not group roles');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should return true if group has given role', (done) => {
        spyOn(service, 'getGroupRoles').and.returnValue(of(mockIdentityRoles));
        service.checkGroupHasRole('mock-group-id', ['MOCK-ADMIN-ROLE']).subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeTruthy();
                done();
            }
        );
    });

    it('should return false if group does not have given role', (done) => {
        spyOn(service, 'getGroupRoles').and.returnValue(of(mockIdentityRoles));
        service.checkGroupHasRole('mock-group-id', ['MOCK-ADMIN-MODELER']).subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeFalsy();
                done();
            }
        );
    });

    it('should fetch client roles by groupId and clientId', (done) => {
        spyOn(service, 'getClientRoles').and.returnValue(of(clientRoles));
        service.getClientRoles('mock-group-id', 'mock-client-id').subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res).toEqual(clientRoles);
                done();
            }
        );
    });

    it('Should not fetch client roles if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getClientRoles').and.returnValue(throwError(errorResponse));

        service.getClientRoles('mock-group-id', 'mock-client-id')
            .subscribe(
                () => {
                    fail('expected an error, not client roles');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should return true if group has client access', (done) => {
        spyOn(service, 'getClientRoles').and.returnValue(of(clientRoles));
        service.checkGroupHasClientApp('mock-group-id', 'mock-client-id').subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeTruthy();
                done();
            }
        );
    });

    it('should return false if group does not have client access', (done) => {
        spyOn(service, 'getClientRoles').and.returnValue(of([]));
        service.checkGroupHasClientApp('mock-group-id', 'mock-client-id').subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeFalsy();
                done();
            }
        );
    });

    it('should return true if group has any client role', (done) => {
        spyOn(service, 'checkGroupHasAnyClientAppRole').and.returnValue(of(true));
        service.checkGroupHasAnyClientAppRole('mock-group-id', 'mock-client-id', ['MOCK-USER-ROLE']).subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeTruthy();
                done();
            }
        );
    });

    it('should return false if group does not have any client role', (done) => {
        spyOn(service, 'getClientRoles').and.returnValue(of([]));
        service.checkGroupHasAnyClientAppRole('mock-group-id', 'mock-client-id', ['MOCK-ADMIN-MODELER']).subscribe(
            (res: boolean) => {
                expect(res).toBeDefined();
                expect(res).toBeFalsy();
                done();
            }
        );
    });

    it('should append to the call all the parameters', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(returnCallQueryParameters);
        service.findGroupsByName(<IdentityGroupSearchParam> {name: 'mock'}).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.search).toBe('mock');
            done();
        });
    });

    it('should request groups api url', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(returnCallUrl);
        service.findGroupsByName(<IdentityGroupSearchParam> {name: 'mock'}).subscribe((requestUrl) => {
            expect(requestUrl).toBeDefined();
            expect(requestUrl).not.toBeNull();
            expect(requestUrl).toContain('/groups');
            done();
        });
    });

    it('should be able to fetch the client id', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(applicationDetailsMockApi);
        service.getClientIdByApplicationName('mock-app-name').subscribe((clientId) => {
            expect(clientId).toBeDefined();
            expect(clientId).not.toBeNull();
            expect(clientId).toBe('mock-app-id');
            done();
        });
    });

    it('should notify errors returned from the API', (done) => {
        const logServiceSpy = spyOn(logService, 'error').and.callThrough();
        spyOn(apiService, 'getInstance').and.returnValue(mockApiError);
        service.findGroupsByName(<IdentityGroupSearchParam> {name: 'mock'}).subscribe(
            () => {},
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual(groupAPIMockError);
                expect(logServiceSpy).toHaveBeenCalled();
                done();
            }
        );
    });

    it('should be able to all fetch groups', (done) => {
        spyOn(apiService, 'getInstance').and.returnValue(groupsMockApi);
        service.getGroups().subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(5);
            expect(res[0].id).toBe('mock-group-id-1');
            expect(res[0].name).toBe('Mock Group 1');
            expect(res[1].id).toBe('mock-group-id-2');
            expect(res[1].name).toBe('Mock Group 2');
            expect(res[2].id).toBe('mock-group-id-3');
            expect(res[2].name).toBe('Mock Group 3');
            done();
        });
    });

    it('Should not able to fetch all group if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getGroups').and.returnValue(throwError(errorResponse));

        service.getGroups()
            .subscribe(
                () => {
                    fail('expected an error, not groups');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to query groups based on first & max params', (done) => {
        spyOn(service, 'getTotalGroupsCount').and.returnValue(of(mockIdentityGroupsCount));
        spyOn(apiService, 'getInstance').and.returnValue(groupsMockApi);
        service.queryGroups({first: 0, max: 5}).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.entries.length).toBe(5);
            expect(res.entries[0].id).toBe('mock-group-id-1');
            expect(res.entries[0].name).toBe('Mock Group 1');
            expect(res.entries[1].id).toBe('mock-group-id-2');
            expect(res.entries[1].name).toBe('Mock Group 2');
            expect(res.entries[2].id).toBe('mock-group-id-3');
            expect(res.entries[2].name).toBe('Mock Group 3');
            expect(res.pagination.totalItems).toBe(10);
            expect(res.pagination.skipCount).toBe(0);
            expect(res.pagination.maxItems).toBe(5);
            done();
        });
    });

    it('Should not able to query groups if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'queryGroups').and.returnValue(throwError(errorResponse));

        service.queryGroups({first: 0, max: 5})
            .subscribe(
                () => {
                    fail('expected an error, not query groups');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to create group', (done) => {
        const createCustomApiSpy = spyOn(apiService, 'getInstance').and.returnValue(createGroupMappingApi);
        service.createGroup(mockIdentityGroup1).subscribe(() => {
            expect(createCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to create group if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'createGroup').and.returnValue(throwError(errorResponse));

        service.createGroup(mockIdentityGroup1)
            .subscribe(
                () => {
                    fail('expected an error, not to create group');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                    done();
                }
            );
    });

    it('should be able to update group', (done) => {
        const updateCustomApiSpy = spyOn(apiService, 'getInstance').and.returnValue(updateGroupMappingApi);
        service.updateGroup('mock-group-id', mockIdentityGroup1).subscribe(() => {
            expect(updateCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to update group if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'updateGroup').and.returnValue(throwError(errorResponse));

        service.updateGroup('mock-group-id', mockIdentityGroup1)
            .subscribe(
                () => {
                    fail('expected an error, not to update group');
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
        const deleteCustomApiSpy = spyOn(apiService, 'getInstance').and.returnValue(deleteGroupMappingApi);
        service.deleteGroup('mock-group-id').subscribe(() => {
            expect(deleteCustomApiSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should not able to delete group if error occurred', (done) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'deleteGroup').and.returnValue(throwError(errorResponse));

        service.deleteGroup('mock-group-id')
            .subscribe(
                () => {
                    fail('expected an error, not to delete group');
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
