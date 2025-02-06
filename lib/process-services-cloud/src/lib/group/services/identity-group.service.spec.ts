/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { IdentityGroupService } from './identity-group.service';
import { mockFoodGroups } from '../mock/group-cloud.mock';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

const mockHttpErrorResponse = new HttpErrorResponse({
    error: 'Mock Error',
    status: 404,
    statusText: 'Not Found'
});

describe('IdentityGroupService', () => {
    let service: IdentityGroupService;
    let adfHttpClient: AdfHttpClient;
    let requestSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), HttpClientTestingModule],
            providers: [IdentityGroupService]
        });
        service = TestBed.inject(IdentityGroupService);
        adfHttpClient = TestBed.inject(AdfHttpClient);
        requestSpy = spyOn(adfHttpClient, 'request');
    });

    describe('Search', () => {
        it('should fetch groups', (done) => {
            requestSpy.and.returnValue(Promise.resolve(mockFoodGroups));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake').subscribe((res) => {
                expect(res).toBeDefined();
                expect(searchSpy).toHaveBeenCalled();
                expect(service.queryParams).toEqual({
                    search: 'fake'
                });
                done();
            });
        });

        it('should not fetch groups if error occurred', (done) => {
            requestSpy.and.returnValue(Promise.reject(mockHttpErrorResponse));

            const searchSpy = spyOn(service, 'search').and.callThrough();

            service.search('fake').subscribe(
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
            requestSpy.and.returnValue(Promise.resolve(mockFoodGroups));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service
                .search('fake', {
                    roles: ['fake-role-1', 'fake-role-2'],
                    withinApplication: ''
                })
                .subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(searchSpy).toHaveBeenCalled();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        role: 'fake-role-1,fake-role-2'
                    });
                    done();
                });
        });

        it('should not fetch groups by roles if error occurred', (done) => {
            requestSpy.and.returnValue(Promise.reject(mockHttpErrorResponse));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service
                .search('fake', {
                    roles: ['fake-role-1', 'fake-role-2'],
                    withinApplication: ''
                })
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
            requestSpy.and.returnValue(Promise.resolve(mockFoodGroups));

            service
                .search('fake', {
                    roles: [],
                    withinApplication: 'fake-app-name'
                })
                .subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        application: 'fake-app-name'
                    });
                    done();
                });
        });

        it('should fetch groups within app with roles', (done) => {
            requestSpy.and.returnValue(Promise.resolve(mockFoodGroups));

            service
                .search('fake', {
                    roles: ['fake-role-1', 'fake-role-2'],
                    withinApplication: 'fake-app-name'
                })
                .subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(service.queryParams).toEqual({
                        search: 'fake',
                        application: 'fake-app-name',
                        role: 'fake-role-1,fake-role-2'
                    });
                    done();
                });
        });

        it('should not fetch groups within app if error occurred', (done) => {
            requestSpy.and.returnValue(Promise.reject(mockHttpErrorResponse));
            const searchSpy = spyOn(service, 'search').and.callThrough();

            service
                .search('fake', {
                    roles: [],
                    withinApplication: 'fake-app-name'
                })
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
