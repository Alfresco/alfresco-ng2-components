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
        const visibleAspects = ['std:standardAspectOne'];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(standardAspectPagingMock));
        aspectListService.getStandardAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([stdAspect1]);
            done();
        });
    });

    it('should get two standard aspects', (done) => {
        const visibleAspects = ['std:standardAspectTwo', 'std:standardAspectThree'];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(standardAspectPagingMock));
        aspectListService.getStandardAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([stdAspect2, stdAspect3]);
            done();
        });
    });

    it('should get one custom aspect', (done) => {
        const visibleAspects = ['cst:customAspectTwo'];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([cstAspect2]);
            done();
        });
    });

    it('should get two custom aspects', (done) => {
        const visibleAspects = ['cst:customAspectOne', 'cst:customAspectThree'];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([cstAspect1, cstAspect3]);
            done();
        });
    });

    it('should get all custom aspects (visible aspects as undefined)', (done) => {
        const visibleAspects = undefined;
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([cstAspect1, cstAspect2, cstAspect3]);
            done();
        });
    });

    it('should get all custom aspects (visible aspects as empty array)', (done) => {
        const visibleAspects = [];
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects(visibleAspects).subscribe((response) => {
            expect(response).toEqual([cstAspect1, cstAspect2, cstAspect3]);
            done();
        });
    });

    it('should get all custom aspects (visible aspects not supplied)', (done) => {
        spyOn(aspectsApi, 'listAspects').and.returnValue(Promise.resolve(customAspectPagingMock));
        aspectListService.getCustomAspects().subscribe((response) => {
            expect(response).toEqual([cstAspect1, cstAspect2, cstAspect3]);
            done();
        });
    });
});
