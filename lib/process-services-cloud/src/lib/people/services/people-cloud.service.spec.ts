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

import { async, TestBed } from '@angular/core/testing';
import { setupTestBed, IdentityUserService } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PeopleCloudService } from './people-cloud.service';
import { of, throwError } from 'rxjs';
import { mockUsers } from '../mock/user-cloud.mock';

describe('People Cloud Service', () => {

    let peopleCloudService: PeopleCloudService;
    let identityUserService: IdentityUserService;
    let findUsersByNameSpy: jasmine.Spy;
    let checkUserHasRoleSpy: jasmine.Spy;
    let getClientIdByApplicationNameSpy: jasmine.Spy;
    let checkUserHasAnyClientAppRoleSpy: jasmine.Spy;
    let checkUserHasClientAppSpy: jasmine.Spy;
    let findUserByIdSpy: jasmine.Spy;
    let findUserByUsernameSpy: jasmine.Spy;
    let findUserByEmailSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(async(() => {
        identityUserService = TestBed.inject(IdentityUserService);
        peopleCloudService = TestBed.inject(PeopleCloudService);
        findUsersByNameSpy = spyOn(identityUserService, 'findUsersByName').and.returnValue(of(mockUsers));
        checkUserHasRoleSpy = spyOn(identityUserService, 'checkUserHasRole').and.returnValue(of(true));
        getClientIdByApplicationNameSpy = spyOn(identityUserService, 'getClientIdByApplicationName').and.returnValue(of('mock-client-id'));
        checkUserHasAnyClientAppRoleSpy = spyOn(identityUserService, 'checkUserHasAnyClientAppRole').and.returnValue(of(true));
        checkUserHasClientAppSpy = spyOn(identityUserService, 'checkUserHasClientApp').and.returnValue(of(true));
        findUserByIdSpy = spyOn(identityUserService, 'findUserById').and.returnValue(of(mockUsers[0]));
        findUserByUsernameSpy = spyOn(identityUserService, 'findUserByUsername').and.returnValue(of([mockUsers[1]]));
        findUserByEmailSpy = spyOn(identityUserService, 'findUserByEmail').and.returnValue(of([mockUsers[2]]));
    }));

    it('Should be able to call an API to search users based on search term', (done) => {
        const searchTerm = 'searchTerm';
        peopleCloudService.findUsers(searchTerm).subscribe((response) => {
            expect(response.length).toBe(3);
            expect(findUsersByNameSpy).toHaveBeenCalledWith(searchTerm);
            done();
        });
    });

    it('Should be able to fetch clientId based on application name', (done) => {
        const mockAppName = 'mock-appname';
        const mockClientId = 'mock-client-id';
        peopleCloudService.getClientIdByApplicationName(mockAppName).subscribe((clientId) => {
            expect(clientId).toBe(mockClientId);
            expect(getClientIdByApplicationNameSpy).toHaveBeenCalledWith(mockAppName);
            done();
        });
    });

    it('Should thrown an error and not to call an API to fetch clientId if appName is not defined', (done) => {
        peopleCloudService.getClientIdByApplicationName(null).subscribe(() => {},
        (error) => {
            expect(error).toBe('appName is mandatory to fetch clientId based on the appname');
            expect(getClientIdByApplicationNameSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('Should be able to catch an error if API failes to fetch clientId based on appName', (done) => {
        getClientIdByApplicationNameSpy.and.returnValue(throwError('Failed to fetch clientId'));
        peopleCloudService.getClientIdByApplicationName('mock-appname').subscribe(() => {},
        (error) => {
            expect(error).toBe('Failed to fetch clientId');
            expect(getClientIdByApplicationNameSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should be able to call an API on search results to check whether user has access to the application or not', (done) => {
        const mockClientId = 'mock-client-id';
        const searchTerm = 'searchTerm';
        peopleCloudService.findUsersBasedOnApp(mockClientId, [], searchTerm).subscribe((response) => {
            expect(response.length).toBe(3);
            expect(checkUserHasClientAppSpy).toHaveBeenCalledTimes(3);
            done();
        });
    });

    it('Should be able to call an API on search results to check whether given roles mapped with client roles', (done) => {
        const mockClientId = 'mock-client-id';
        const mockRoles = ['MOCK_USER_ROLE'];
        peopleCloudService.findUsersBasedOnApp(mockClientId, mockRoles, 'searchTerm').subscribe((response) => {
            expect(response.length).toBe(3);
            expect(checkUserHasAnyClientAppRoleSpy).toHaveBeenCalledTimes(3);
            done();
        });
    });

    it('Should not list users who do not have access to the application', (done) => {
        checkUserHasClientAppSpy.and.returnValue(of(false));
        peopleCloudService.findUsersBasedOnApp('mock-client-id', [], 'searchTerm').subscribe((response) => {
            expect(response.length).toBe(0);
            expect(checkUserHasClientAppSpy).toHaveBeenCalledTimes(3);
            done();
        });
    });

    it('should thrown an error and not to call an API to check user application access if clientId is not defined', (done) => {
        peopleCloudService.findUsersBasedOnApp(null, [], 'searchTerm').subscribe(() => {},
        (error) => {
            expect(error).toBe('client is mandatory to search users based on the application');
            expect(checkUserHasClientAppSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('Should be able to catch an error if API failed to check user application access', (done) => {
        checkUserHasClientAppSpy.and.returnValue(throwError('Failed to check application access'));
        peopleCloudService.findUsersBasedOnApp('mock-client-id', [], 'searchTerm').subscribe(() => {},
        (error) => {
            expect(error).toBe('Failed to check application access');
            expect(checkUserHasClientAppSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should be able fetch users based on given roles', (done) => {
        const mockRoles = ['MOCK_USER_ROLE'];
        peopleCloudService.filterUsersBasedOnRoles(mockRoles, 'searchTerm').subscribe((response) => {
            expect(response.length).toBe(3);
            expect(checkUserHasRoleSpy).toHaveBeenCalledTimes(3);
            done();
        });
    });

    it('Should thrown an error and not to call the role mapping API if roles are not specified', (done) => {
        peopleCloudService.filterUsersBasedOnRoles([], 'searchTerm').subscribe(() => {},
        (error) => {
            expect(error).toBe('roles are mandatory to search users based on the roles');
            expect(checkUserHasRoleSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('Should be able to catch an error if roles mapping API failed', (done) => {
        const mockRoles = ['MOCK_USER_ROLE'];
        checkUserHasRoleSpy.and.returnValue(throwError('Failed to map give roles'));
        peopleCloudService.filterUsersBasedOnRoles(mockRoles, 'searchTerm').subscribe(() => {},
        (error) => {
            expect(error).toBe('Failed to map give roles');
            expect(checkUserHasRoleSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should be able to search/validate user by given userId', (done) => {
        peopleCloudService.validatePreselectedUser({ id: 'fake-id-1' }).subscribe((response) => {
            expect(response.id).toBe('fake-id-1');
            expect(findUserByIdSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should be able to search/validate user by given username', (done) => {
        peopleCloudService.validatePreselectedUser({ username: 'first-name-2 last-name-2' }).subscribe((response) => {
            expect(response.username).toBe('first-name-2 last-name-2');
            expect(findUserByUsernameSpy).toHaveBeenCalled();
            done();
        });
    });

    it('Should be able to search/validate user by given email', (done) => {
        peopleCloudService.validatePreselectedUser({ email: 'abcde@xyz.com' }).subscribe((response) => {
            expect(response.email).toBe('abcde@xyz.com');
            expect(findUserByEmailSpy).toHaveBeenCalled();
            done();
        });
    });
});
