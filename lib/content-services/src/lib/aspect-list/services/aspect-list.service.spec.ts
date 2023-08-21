/*
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { TestBed } from '@angular/core/testing';
import { AlfrescoApiService, CoreTestingModule } from '@alfresco/adf-core';
import { AspectListService } from './aspect-list.service';
import { AspectPaging, AspectsApi, AspectEntry } from '@alfresco/js-api';

const stdAspect1: AspectEntry = { entry: { id: 'std:standardAspectOne', description: 'Standard Aspect One', title: 'StandardAspectOne' } };
const stdAspect2: AspectEntry = { entry: { id: 'std:standardAspectTwo', description: 'Standard Aspect Two', title: 'StandardAspectTwo' } };
const stdAspect3: AspectEntry = { entry: { id: 'std:standardAspectThree', description: 'Standard Aspect Three', title: 'StandardAspectThree' } };
const standardAspectPagingMock: AspectPaging = { list: { entries: [ stdAspect1, stdAspect2, stdAspect3 ] } };

const cstAspect1: AspectEntry = { entry: { id: 'cst:customAspectOne', description: 'Custom Aspect One', title: 'CustomAspectOne' } };
const cstAspect2: AspectEntry = { entry: { id: 'cst:customAspectTwo', description: 'Custom Aspect Two', title: 'CustomAspectTwo' } };
const cstAspect3: AspectEntry = { entry: { id: 'cst:customAspectThree', description: 'Custom Aspect Three', title: 'CustomAspectThree' } };
const customAspectPagingMock: AspectPaging = { list: { entries: [ cstAspect1, cstAspect2, cstAspect3 ] } };

describe('AspectListService', () => {

    let aspectListService: AspectListService;
    let apiService: AlfrescoApiService;
    let aspectsApi: AspectsApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule
            ]
        });

        aspectListService = TestBed.inject(AspectListService);
        apiService = TestBed.inject(AlfrescoApiService);
        aspectsApi = new AspectsApi(apiService.getInstance());
        spyOnProperty(aspectListService, 'aspectsApi', 'get').and.returnValue(aspectsApi);
    });

    it('should get one standard aspect', (done) => {
        const visibleAspects = ["std:standardAspectOne"];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(standardAspectPagingMock));
        aspectListService.getStandardAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([stdAspect1]);
            done();
        });
    });

    it('should get two standard aspects', (done) => {
        const visibleAspects = ["std:standardAspectTwo", "std:standardAspectThree"];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(standardAspectPagingMock));
        aspectListService.getStandardAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([stdAspect2, stdAspect3]);
            done();
        });
    });

    it('should get one custom aspect', (done) => {
        const visibleAspects = ["cst:customAspectTwo"];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([cstAspect2]);
            done();
        });
    });

    it('should get two custom aspects', (done) => {
        const visibleAspects = ["cst:customAspectOne", "cst:customAspectThree"];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([cstAspect1, cstAspect3]);
            done();
        });
    });

    it('should get all custom aspects', (done) => {
        const visibleAspects = [];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([cstAspect1, cstAspect2, cstAspect3]);
            done();
        });
    });
});