/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, JwtHelperService, setupTestBed } from '@alfresco/adf-core';
import { IdentityUserService } from './identity-user.service';
import { mockToken } from '../mock/jwt-helper.service.spec';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import {
    mockSearchUserByApp,
    mockSearchUserByAppAndGroups,
    mockSearchUserByGroups,
    mockSearchUserByGroupsAndRoles,
    mockSearchUserByGroupsAndRolesAndApp,
    mockSearchUserByRoles,
    mockSearchUserByRolesAndApp,
    oAuthMockApiWithError,
    oAuthMockApiWithIdentityUsers
} from '../mock/identity-user.service.mock';
import { mockFoodUsers } from '../mock/people-cloud.mock';

describe('IdentityUserService', () => {

    let service: IdentityUserService;
    let alfrescoApiService: AlfrescoApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(IdentityUserService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
    });

    describe('Current user info (JWT token)', () => {

        beforeEach(() => {
            const store = {};

            spyOn(localStorage, 'getItem').and.callFake((key: string): string => store[key] || null);
            spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => store[key] = value);
        });

        it('should fetch identity user info from Jwt id token', () => {
            localStorage.setItem(JwtHelperService.USER_ID_TOKEN, mockToken);
            const user = service.getCurrentUserInfo();
            expect(user).toBeDefined();
            expect(user.firstName).toEqual('John');
            expect(user.lastName).toEqual('Doe');
            expect(user.email).toEqual('johnDoe@gmail.com');
            expect(user.username).toEqual('johnDoe1');
        });

        it('should fallback on Jwt access token for identity user info', () => {
            localStorage.setItem(JwtHelperService.USER_ACCESS_TOKEN, mockToken);
            const user = service.getCurrentUserInfo();
            expect(user).toBeDefined();
            expect(user.firstName).toEqual('John');
            expect(user.lastName).toEqual('Doe');
            expect(user.email).toEqual('johnDoe@gmail.com');
            expect(user.username).toEqual('johnDoe1');
        });

    });

    describe('Search', () => {

        it('should fetch users', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake').subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(searchSpy).toHaveBeenCalled();
                    expect(service.queryParams).toEqual({
                        search: 'fake'
                    });
                    done();
                }
            );
        });

        it('should not fetch users if error occurred', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithError as any);

            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake')
                .subscribe(
                    () => {
                        fail('expected an error, not users');
                    },
                    (error) => {
                        expect(searchSpy).toHaveBeenCalled();
                        expect(error.status).toEqual(404);
                        expect(error.statusText).toEqual('Not Found');
                        expect(error.error).toEqual('Mock Error');
                        done();
                    }
                );
        });

        it('should fetch users by roles', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchUserByRoles).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(searchSpy).toHaveBeenCalled();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        role: 'fake-role-1,fake-role-2'
                    });
                    done();
                }
            );
        });

        it('should not fetch users by roles if error occurred', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithError);

            service.search('fake', mockSearchUserByRoles)
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

        it('should fetch users by groups', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchUserByGroups).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(searchSpy).toHaveBeenCalled();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        group: 'fake-group-1,fake-group-2'
                    });
                    done();
                }
            );
        });

        it('should fetch users by roles with groups', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchUserByGroupsAndRoles).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(searchSpy).toHaveBeenCalled();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        role: 'fake-role-1,fake-role-2',
                        group: 'fake-group-1,fake-group-2'
                    });
                    done();
                }
            );
        });

        it('should fetch users by roles with groups and appName', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchUserByGroupsAndRolesAndApp).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(searchSpy).toHaveBeenCalled();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        role: 'fake-role-1,fake-role-2',
                        application: 'fake-app-name',
                        group: 'fake-group-1,fake-group-2'
                    });
                    done();
                }
            );
        });

        it('should not fetch users by groups if error occurred', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithError);

            service.search('fake', mockSearchUserByGroups)
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

        it('should fetch users within app', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));

            service.search('fake', mockSearchUserByApp).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        application: 'fake-app-name'
                    });
                    done();
                }
            );
        });

        it('should fetch users within app with roles', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));

            service.search('fake', mockSearchUserByRolesAndApp).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        application: 'fake-app-name',
                        role: 'fake-role-1,fake-role-2'
                    });
                    done();
                }
            );
        });

        it('should fetch users within app with groups', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityUsers(mockFoodUsers));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchUserByAppAndGroups).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(searchSpy).toHaveBeenCalled();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        application: 'fake-app-name',
                        group: 'fake-group-1,fake-group-2'
                    });
                    done();
                }
            );
        });

        it('should not fetch users within app if error occurred', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithError);

            service.search('fake', mockSearchUserByApp)
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
    });
});
