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
import { AspectListService } from './aspect-list.service';
import { AspectPaging, AspectsApi, AspectEntry } from '@alfresco/js-api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AlfrescoApiService } from '../../services';
import { provideHttpClient } from '@angular/common/http';

const stdAspect1: AspectEntry = { entry: { id: 'std:standardAspectOne', description: 'Standard Aspect One', title: 'StandardAspectOne' } };
const stdAspect2: AspectEntry = { entry: { id: 'std:standardAspectTwo', description: 'Standard Aspect Two', title: 'StandardAspectTwo' } };
const stdAspect3: AspectEntry = { entry: { id: 'std:standardAspectThree', description: 'Standard Aspect Three', title: 'StandardAspectThree' } };

const cstAspect1: AspectEntry = { entry: { id: 'cst:customAspectOne', description: 'Custom Aspect One', title: 'CustomAspectOne' } };
const cstAspect2: AspectEntry = { entry: { id: 'cst:customAspectTwo', description: 'Custom Aspect Two', title: 'CustomAspectTwo' } };
const cstAspect3: AspectEntry = { entry: { id: 'cst:customAspectThree', description: 'Custom Aspect Three', title: 'CustomAspectThree' } };

const standardAspectsWhere = `(modelId in ('cm:contentmodel', 'emailserver:emailserverModel', 'smf:smartFolder', 'app:applicationmodel' ))`;
const customAspectsWhere = `(not namespaceUri matches('http://www.alfresco.*'))`;

let standardAspectPagingMock: AspectPaging;
let customAspectPagingMock: AspectPaging;

describe('AspectListService', () => {
    let aspectListService: AspectListService;
    let apiService: AlfrescoApiService;
    let aspectsApi: AspectsApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        aspectListService = TestBed.inject(AspectListService);
        apiService = TestBed.inject(AlfrescoApiService);
        aspectsApi = new AspectsApi(apiService.getInstance());
        spyOnProperty(aspectListService, 'aspectsApi', 'get').and.returnValue(aspectsApi);
        standardAspectPagingMock = { list: { entries: [stdAspect1, stdAspect2, stdAspect3] } };
        customAspectPagingMock = { list: { entries: [cstAspect1, cstAspect2, cstAspect3] } };
    });

    describe('When API returns error', () => {
        const visibleAspects = [];

        beforeEach(() => {
            spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.reject(new Error('API error')));
        });

        it('should return empty paging list for standard aspects when api returns error', (done) => {
            aspectListService.getStandardAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([]);
                done();
            });
        });

        it('should return empty paging list for custom aspects when api returns error', (done) => {
            aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([]);
                done();
            });
        });
    });

    describe('Standard aspects', () => {
        beforeEach(() => {
            spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(standardAspectPagingMock));
        });

        it('should add default pagination for standard aspects list request', (done) => {
            const visibleAspects = [];
            aspectListService.getStandardAspects(visibleAspects).subscribe(() => {
                expect(aspectsApi.listAspects).toHaveBeenCalledWith({
                    where: standardAspectsWhere,
                    include: ['properties'],
                    skipCount: 0,
                    maxItems: 100
                });
                done();
            });
        });

        it('should add custom pagination for standard aspects list request when provided', (done) => {
            const visibleAspects = [];
            aspectListService.getStandardAspects(visibleAspects, { skipCount: 10, maxItems: 20 }).subscribe(() => {
                expect(aspectsApi.listAspects).toHaveBeenCalledWith({
                    where: standardAspectsWhere,
                    include: ['properties'],
                    skipCount: 10,
                    maxItems: 20
                });
                done();
            });
        });

        it('should get one standard aspect', (done) => {
            const visibleAspects = ['std:standardAspectOne'];
            aspectListService.getStandardAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([stdAspect1]);
                done();
            });
        });

        it('should get two standard aspects', (done) => {
            const visibleAspects = ['std:standardAspectTwo', 'std:standardAspectThree'];
            aspectListService.getStandardAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([stdAspect2, stdAspect3]);
                done();
            });
        });
    });

    describe('Custom aspects', () => {
        beforeEach(() => {
            spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        });

        it('should add default pagination for custom aspects list request', (done) => {
            const visibleAspects = [];
            aspectListService.getCustomAspects(visibleAspects).subscribe(() => {
                expect(aspectsApi.listAspects).toHaveBeenCalledWith({
                    where: customAspectsWhere,
                    include: ['properties'],
                    skipCount: 0,
                    maxItems: 100
                });
                done();
            });
        });

        it('should add custom pagination for custom aspects list request when provided', (done) => {
            const visibleAspects = [];
            aspectListService.getCustomAspects(visibleAspects, { skipCount: 15, maxItems: 30 }).subscribe(() => {
                expect(aspectsApi.listAspects).toHaveBeenCalledWith({
                    where: customAspectsWhere,
                    include: ['properties'],
                    skipCount: 15,
                    maxItems: 30
                });
                done();
            });
        });

        it('should get one custom aspect', (done) => {
            const visibleAspects = ['cst:customAspectTwo'];
            aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([cstAspect2]);
                done();
            });
        });

        it('should get two custom aspects', (done) => {
            const visibleAspects = ['cst:customAspectOne', 'cst:customAspectThree'];
            aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([cstAspect1, cstAspect3]);
                done();
            });
        });

        it('should get all custom aspects (visible aspects as undefined)', (done) => {
            const visibleAspects = undefined;
            aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([cstAspect1, cstAspect2, cstAspect3]);
                done();
            });
        });

        it('should get all custom aspects (visible aspects as empty array)', (done) => {
            const visibleAspects = [];
            aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
                expect(response.list.entries).toEqual([cstAspect1, cstAspect2, cstAspect3]);
                done();
            });
        });

        it('should get all custom aspects (visible aspects not supplied)', (done) => {
            aspectListService.getCustomAspects().subscribe((response) => {
                expect(response.list.entries).toEqual([cstAspect1, cstAspect2, cstAspect3]);
                done();
            });
        });
    });
});
