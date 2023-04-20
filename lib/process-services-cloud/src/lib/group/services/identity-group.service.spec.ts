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
import { AlfrescoApiService, setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { IdentityGroupService } from './identity-group.service';
import {
    mockSearchGroupByApp,
    mockSearchGroupByRoles,
    mockSearchGroupByRolesAndApp,
    oAuthMockApiWithError,
    oAuthMockApiWithIdentityGroups
} from '../mock/identity-group.service.mock';
import { mockFoodGroups } from '../mock/group-cloud.mock';

describe('IdentityGroupService', () => {

    let service: IdentityGroupService;
    let alfrescoApiService: AlfrescoApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(IdentityGroupService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
    });

    describe('Search', () => {

        it('should fetch groups', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityGroups(mockFoodGroups )as any);
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

        it('should not fetch groups if error occurred', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithError as any);

            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake')
                .subscribe(
                    () => {
                        fail('expected an error, not groups');
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

        it('should fetch groups by roles', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityGroups(mockFoodGroups)  as any);
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchGroupByRoles).subscribe(
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

        it('should not fetch groups by roles if error occurred', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithError as any);
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchGroupByRoles)
                .subscribe(
                    () => {
                        fail('expected an error, not groups');
                    },
                    (error) => {
                        expect(searchSpy).toHaveBeenCalled();
                        expect(service.queryParams).toEqual({
                            search: 'fake',
                            role: 'fake-role-1,fake-role-2'
                        });
                        expect(error.status).toEqual(404);
                        expect(error.statusText).toEqual('Not Found');
                        expect(error.error).toEqual('Mock Error');
                        done();
                    }
                );
        });

        it('should fetch groups within app', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityGroups(mockFoodGroups) as any);

            service.search('fake', mockSearchGroupByApp).subscribe(
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

        it('should fetch groups within app with roles', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithIdentityGroups(mockFoodGroups) as any);

            service.search('fake', mockSearchGroupByRolesAndApp).subscribe(
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

        it('should not fetch groups within app if error occurred', (done) => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(oAuthMockApiWithError as any);
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake', mockSearchGroupByApp)
                .subscribe(
                    () => {
                        fail('expected an error, not groups');
                    },
                    (error) => {
                        expect(searchSpy).toHaveBeenCalled();
                        expect(service.queryParams).toEqual({
                            search: 'fake',
                            application: 'fake-app-name'
                        });
                        expect(error.status).toEqual(404);
                        expect(error.statusText).toEqual('Not Found');
                        expect(error.error).toEqual('Mock Error');
                        done();
                    }
                );
        });
    });
});
