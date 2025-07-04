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
import { AspectListService, CustomAspectsWhere, StandardAspectsWhere } from './aspect-list.service';
import { AspectPaging, AspectsApi, AspectEntry, ListAspectsOpts } from '@alfresco/js-api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AlfrescoApiService } from '../../services';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from '@alfresco/adf-core';

const stdAspect1: AspectEntry = { entry: { id: 'std:standardAspectOne', description: 'Standard Aspect One', title: 'StandardAspectOne' } };
const stdAspect2: AspectEntry = { entry: { id: 'std:standardAspectTwo', description: 'Standard Aspect Two', title: 'StandardAspectTwo' } };
const stdAspect3: AspectEntry = { entry: { id: 'std:standardAspectThree', description: 'Standard Aspect Three', title: 'StandardAspectThree' } };

const cstAspect1: AspectEntry = { entry: { id: 'cst:customAspectOne', description: 'Custom Aspect One', title: 'CustomAspectOne' } };
const cstAspect2: AspectEntry = { entry: { id: 'cst:customAspectTwo', description: 'Custom Aspect Two', title: 'CustomAspectTwo' } };
const cstAspect3: AspectEntry = { entry: { id: 'cst:customAspectThree', description: 'Custom Aspect Three', title: 'CustomAspectThree' } };

const aspectsOpts: ListAspectsOpts = {
    where: StandardAspectsWhere,
    include: ['properties'],
    skipCount: 0,
    maxItems: 100
};

const customAspectsOpts: ListAspectsOpts = {
    where: CustomAspectsWhere,
    include: ['properties'],
    skipCount: 0,
    maxItems: 100
};

let standardAspectPagingMock: AspectPaging;
let customAspectPagingMock: AspectPaging;

describe('AspectListService', () => {
    let aspectListService: AspectListService;
    let apiService: AlfrescoApiService;
    let aspectsApi: AspectsApi;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        aspectListService = TestBed.inject(AspectListService);
        appConfigService = TestBed.inject(AppConfigService);
        apiService = TestBed.inject(AlfrescoApiService);
        aspectsApi = new AspectsApi(apiService.getInstance());
        spyOnProperty(aspectListService, 'aspectsApi', 'get').and.returnValue(aspectsApi);
        standardAspectPagingMock = { list: { entries: [stdAspect1, stdAspect2, stdAspect3] } };
        customAspectPagingMock = { list: { entries: [cstAspect1, cstAspect2, cstAspect3] } };
    });

    describe('When API returns error', () => {
        const visibleAspects: string[] = [];

        beforeEach(() => {
            spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.reject(new Error('API error')));
        });

        it('should return empty paging list for standard aspects when api returns error', (done) => {
            aspectListService.getAspects(visibleAspects, aspectsOpts).subscribe((response) => {
                expect(response.list.entries).toEqual([]);
                done();
            });
        });

        it('should return empty paging list for custom aspects when api returns error', (done) => {
            aspectListService.getAspects(visibleAspects, aspectsOpts).subscribe((response) => {
                expect(response.list.entries).toEqual([]);
                done();
            });
        });
    });

    describe('When aspects are returned', () => {
        beforeEach(() => {
            spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(standardAspectPagingMock));
        });

        it('should add custom pagination for aspects list request when provided', (done) => {
            const visibleAspects: string[] = [];
            const customPagination: ListAspectsOpts = { skipCount: 10, maxItems: 20 };
            aspectListService.getAspects(visibleAspects, customPagination).subscribe(() => {
                expect(aspectsApi.listAspects).toHaveBeenCalledWith(customPagination);
                done();
            });
        });

        it('should get one aspect', (done) => {
            const visibleAspects = ['std:standardAspectOne'];
            aspectListService.getAspects(visibleAspects, aspectsOpts).subscribe((response) => {
                expect(response.list.entries).toEqual([stdAspect1]);
                done();
            });
        });

        it('should get two aspects', (done) => {
            const visibleAspects = ['std:standardAspectTwo', 'std:standardAspectThree'];
            aspectListService.getAspects(visibleAspects, aspectsOpts).subscribe((response) => {
                expect(response.list.entries).toEqual([stdAspect2, stdAspect3]);
                done();
            });
        });

        it('should get all aspects (visible aspects as undefined)', (done) => {
            const visibleAspects: string[] = undefined;
            aspectListService.getAspects(visibleAspects, aspectsOpts).subscribe((response) => {
                expect(response.list.entries).toEqual([stdAspect1, stdAspect2, stdAspect3]);
                done();
            });
        });

        it('should get all aspects (visible aspects as empty array)', (done) => {
            const visibleAspects: string[] = [];
            aspectListService.getAspects(visibleAspects, aspectsOpts).subscribe((response) => {
                expect(response.list.entries).toEqual([stdAspect1, stdAspect2, stdAspect3]);
                done();
            });
        });
    });

    describe('getAllAspects', () => {
        beforeEach(() => {
            spyOn(aspectsApi, 'listAspects').and.returnValues(Promise.resolve(standardAspectPagingMock), Promise.resolve(customAspectPagingMock));
        });

        it('should get all aspects (standard and custom) when visible aspects are empty', (done) => {
            spyOn(appConfigService, 'get').and.returnValue(undefined);
            aspectListService.getAllAspects(aspectsOpts, customAspectsOpts).subscribe((aspects) => {
                expect(aspects.standardAspectPaging.list.entries).toEqual([stdAspect1, stdAspect2, stdAspect3]);
                expect(aspects.customAspectPaging.list.entries).toEqual([cstAspect1, cstAspect2, cstAspect3]);
                expect(aspectsApi.listAspects).toHaveBeenCalledTimes(2);
                done();
            });
        });

        it('should get all aspects (standard and custom) filtered by visible aspects', (done) => {
            const visibleAspectConfig = {
                standard: ['std:standardAspectOne', 'std:standardAspectTwo'],
                custom: ['cst:customAspectOne']
            };
            spyOn(appConfigService, 'get').and.returnValue(visibleAspectConfig);
            aspectListService.getAllAspects(aspectsOpts, customAspectsOpts).subscribe((aspects) => {
                expect(aspects.standardAspectPaging.list.entries).toEqual([stdAspect1, stdAspect2]);
                expect(aspects.customAspectPaging.list.entries).toEqual([cstAspect1]);
                expect(aspectsApi.listAspects).toHaveBeenCalledTimes(2);
                done();
            });
        });
    });

    describe('getVisibleAspects', () => {
        it('should return empty array when visible aspects are not provided in the config', () => {
            spyOn(appConfigService, 'get').and.returnValue(undefined);
            const visibleAspects = aspectListService.getVisibleAspects();
            expect(visibleAspects).toEqual([]);
        });

        it('should return visible aspects from config when provided', () => {
            const visibleAspectConfig = {
                standard: ['std:standardAspectOne', 'std:standardAspectTwo'],
                custom: ['cst:customAspectOne']
            };
            spyOn(appConfigService, 'get').and.returnValue(visibleAspectConfig);
            const visibleAspects = aspectListService.getVisibleAspects();
            expect(visibleAspects).toEqual(['std:standardAspectOne', 'std:standardAspectTwo', 'cst:customAspectOne']);
        });
    });
});
